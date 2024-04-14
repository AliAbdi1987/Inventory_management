from fastapi import FastAPI, HTTPException, Depends, status, Body, File, UploadFile, Form, APIRouter
from app.db_setup import init_db, get_db
from contextlib import asynccontextmanager
from fastapi import Request, BackgroundTasks
from app.database.schemas import OwnerSchema, BusinessSchema, SupplierSchema, CustomerSchema, EmployeeSchema, \
    JobPositionSchema, ProductSchema, UnitSchema, InventorySchema, ProductInventorySchema, SalesSchema, PurchaseOrderSchema, NewPasswordSchema
from pydantic import ValidationError
from sqlalchemy.orm import Session, joinedload, selectinload, load_only, Mapped, relationship
from sqlalchemy import select, Table, Column, Integer, String, MetaData, ForeignKey, func, cast, Date, DateTime, Float
from app.database.models import Owner, Business, Supplier, Customer, Employee, JobPosition, Product, Unit, Inventory, \
    BusinessSupplier, BusinessCustomer, ProductInventory, Sale, PurchaseOrder
from sqlalchemy.exc import IntegrityError, NoResultFound, SQLAlchemyError
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from passlib.context import CryptContext
from app.database.security import verify_password
from typing import List
from app.auth.jwt_handler import sign_jwt
from app.auth.jwt_bearer import JWTBearer
from .email.email import get_owner_by_email, generate_password_reset_token, verify_password_reset_token, \
    send_password_reset_email, sign_jwt_reset_password, decode_jwt_reset_password
from .operations.sales import process_and_insert_sales_csv_data, update_inventory_after_sales
from .operations.orders import process_and_insert_orders_csv_data, update_inventory_after_orders
import shutil
from datetime import datetime, timedelta
import os
import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


@asynccontextmanager
async def lifespan(app: FastAPI):
    init_db()  # Vi ska skapa denna funktion
    units_names()
    job_positions()
    yield


app = FastAPI(lifespan=lifespan)
allowed_origins = [
    "http://localhost:5173"
            ]

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


@app.get("/owner", status_code=200)
def list_owners(db: Session = Depends(get_db)):
    """
    This lists all owners, but we only get the id for each owner
    Docstrings are included in the swagger docs!
    """
    query = select(Owner)
    owners = db.scalars(query).all()
    return owners


@app.get("/owner/{owner_id}", status_code=200)
def get_owner(owner_id: int, db: Session = Depends(get_db)):
    """
    This lists all owners, but we only get the id for each owner
    Docstrings are included in the swagger docs!
    """
    query = select(Owner).where(Owner.id == owner_id)
    owner = db.scalars(query).first()
    if not owner:
        raise HTTPException(status_code=404, detail="Owner not found")
    return owner


# Get all businesses
@app.get("/businesses", status_code=200)
def list_businesses(db: Session = Depends(get_db)):
    """
    This lists all businesses, but we only get the id for each business
    Docstrings are included in the swagger docs!
    """
    query = select(Business)
    businesses = db.scalars(query).all()
    return businesses


# @app.get("/product", status_code=200)
# def list_products(db: Session = Depends(get_db)):
#     """
#     This lists all products, but we only get the id for each product
#     \f
#     Docstrings are included in the swagger docs!
#     """
#     query = select(Product)
#     products = db.scalars(query).all()
#     return products


# @app.get("/inventory", status_code=200)
# def list_inventories(db: Session = Depends(get_db)):
#     """
#     This lists all inventories, but we only get the id for each inventory
#     \f
#     Docstrings are included in the swagger docs!
#     """
#     query = select(Inventory)
#     inventories = db.scalars(query).all()
#     return inventories


@app.post("/owner", status_code=201)
def add_owner(owner: OwnerSchema, db: Session = Depends(get_db)):
    """
    Create an owner, using a pydantic model for validation
    """
    try:
        hash_password = pwd_context.hash(owner.password)
        owner_data = owner.dict()
        owner_data["password"] = hash_password
        db_owner = Owner(**owner_data)
        db.add(db_owner)
        db.commit()
        db.refresh(db_owner)
        print(db_owner)
        return db_owner
    except IntegrityError as e:
        db.rollback()
        raise HTTPException(status_code=400, detail=f"Database error: {e}")


@app.post("/login")
async def login(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    """
    Login a user
    """
    owner = db.query(Owner).filter(Owner.email == form_data.username).first()
    if not owner or not verify_password(form_data.password, owner.password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password")
    token = sign_jwt(owner.email)
    response_data = {
        "token": token,
        "message": "Login successful",
        "owner_id": owner.id,
        "first_name": owner.first_name,
        "last_name": owner.last_name
    }
    return response_data


@app.post("/password-recovery/{email}", status_code=status.HTTP_200_OK)
def recover_password(email: str, background_tasks: BackgroundTasks, db : Session = Depends(get_db)):
    """
    Password Recovery
    Sends a password reset email
    """
    owner = get_owner_by_email(session=db, email=email)
    if not owner:
        raise HTTPException(
            status_code=404,
            detail="The user with this email does not exist in the system.",
        )
    password_reset_token = sign_jwt_reset_password(email=email)
    background_tasks.add_task(send_password_reset_email, email, password_reset_token)
    # send_password_reset_email(email=email, token=password_reset_token)
    return {"message": "Mail sent"}


@app.post("/reset-password/", status_code=status.HTTP_200_OK)
def reset_password(body: NewPasswordSchema, db: Session = Depends(get_db)):
    """
    Reset password using a token a user should have received through a PW reset email
    """
    logger.info(f"Received reset password request: {body.json()}")
    email = decode_jwt_reset_password(token=body.token)
    if not email:
        raise HTTPException(status_code=400, detail="Invalid token")
    owner = get_owner_by_email(session=db, email=email)
    if not owner:
        raise HTTPException(
            status_code=404,
            detail="The user with this email does not exist in the system.",
        )
    hash_password = pwd_context.hash(body.new_password)
    # password = password(password=body.new_password)
    owner.password = hash_password
    db.add(owner)
    db.commit()
    return {"message": "Password updated"}


@app.post("/business", dependencies=[Depends(JWTBearer())], status_code=201)
def add_business(business: BusinessSchema, db: Session = Depends(get_db)):
    """
    Create a business, using a pydantic model for validation
    """
    try:
        business_data = business.dict()
        db_business = Business(**business_data)
        db.add(db_business)
        db.commit()
        db.refresh(db_business)
        print(db_business)
        return db_business
    except IntegrityError as e:
        db.rollback()
        raise HTTPException(status_code=400, detail=f"Database error: {e}")
    except ValidationError as e:
        raise HTTPException(status_code=422, detail=f"Validation error: {e}")


@app.post("/supplier", dependencies=[Depends(JWTBearer())], status_code=201)
def add_supplier(supplier: SupplierSchema, db: Session = Depends(get_db)):
    """
    Create a supplier, using a pydantic model for validation.
    """
    try:
        db_supplier = Supplier(**supplier.model_dump())
        db.add(db_supplier)
        db.commit()
    except IntegrityError as e:
        raise HTTPException(status_code=400, detail="Database error")
    return db_supplier


@app.post("/customer", dependencies=[Depends(JWTBearer())], status_code=201)
def add_customer(customer: CustomerSchema, db: Session = Depends(get_db)):
    """
    Create a customer, using a pydantic model for validation
    """
    try:
        db_customer = Customer(**customer.model_dump())
        db.add(db_customer)
        db.commit()
    except IntegrityError as e:
        raise HTTPException(status_code=400, detail="Database error")
    return db_customer


@app.post("/employee", dependencies=[Depends(JWTBearer())], status_code=201)
def add_employee(employee: EmployeeSchema, db: Session = Depends(get_db)):
    """
    Create an employee, using a pydantic model for validation
    """
    try:
        db_employee = Employee(**employee.model_dump())
        db.add(db_employee)
        db.commit()
    except IntegrityError as e:
        raise HTTPException(status_code=400, detail="Database error")
    return db_employee


@app.post("/jobposition", dependencies=[Depends(JWTBearer())], status_code=201)
def add_jobposition(jobposition: JobPositionSchema, db: Session = Depends(get_db)):
    """
    Create a job position, using a pydantic model for validation
    """
    try:
        db_jobposition = JobPosition(**jobposition.model_dump())
        db.add(db_jobposition)
        db.commit()
    except IntegrityError as e:
        raise HTTPException(status_code=400, detail="Database error")
    return db_jobposition


# @app.post("/product", dependencies=[Depends(JWTBearer())], status_code=201)
# def add_product(product: ProductSchema, db: Session = Depends(get_db)):
#     """
#     Create a product, using a pydantic model for validation
#     """
#     try:
#         db_product = Product(**product.model_dump())
#         db.add(db_product)
#         db.commit()
#     except IntegrityError as e:
#         raise HTTPException(status_code=400, detail="Database error")
#     return db_product


@app.post("/products/{supplier_id}/inventory/{inventory_id}", status_code=201)
def add_inventory_to_product(product_id: int, inventory_id: int, db: Session = Depends(get_db)):
    """
    Add an inventory to a product
    """
    product = db.get(Product, product_id)
    inventory = db.get(Inventory, inventory_id)
    if not product or not inventory:
        raise HTTPException(
            status_code=404, detail="Product or inventory not found")
    product.inventories.append(inventory)
    db.commit()
    return {"detail": "Inventory added to product successfully"}


# @app.post("/business/{business_id}/supplier/{supplier_id}", status_code=201)
# def add_supplier_to_business(business_id: int, supplier_id: int, db: Session = Depends(get_db)):
#     """
#     Add a supplier to a business
#     """
#     business = db.get(Business, business_id)
#     supplier = db.get(Supplier, supplier_id)
#     if not business or not supplier:
#         raise HTTPException(
#             status_code=404, detail="Business or supplier not found")
#     business.suppliers.append(supplier)
#     db.commit()
#     return {"detail": "Supplier added to business successfully"}


# @app.post("/business/{business_id}/customer/{customer_id}", status_code=201)
# def add_customer_to_business(business_id: int, customer_id: int, db: Session = Depends(get_db)):
#     """
#     Add a customer to a business
#     """
#     business = db.get(Business, business_id)
#     customer = db.get(Customer, customer_id)
#     if not business or not customer:
#         raise HTTPException(
#             status_code=404, detail="Business or customer not found")
#     business.customers.append(customer)
#     db.commit()
#     return {"detail": "Customer added to business successfully"}


# Get all businesses for a specific owner
@app.get("/business/owner/{owner_id}", status_code=200)
def get_businesses_by_owner(owner_id: int, db: Session = Depends(get_db)):
    businesses = db.query(Business).filter(Business.owner_id == owner_id).all()
    if not businesses:
        raise HTTPException(status_code=404,
                            detail="No businesses found for the provided owner_id")

    return [{
        "id": business.id,
        "name": business.name,
        "address": business.address,
        "postal_code": business.postal_code,
        "phone_number": business.phone_number,
        "email": business.email
    }

        for business in businesses
    ]


# Get all products for a business
@app.get("/products/{business_id}", tags=["products"], status_code=200)
def get_products_by_business(business_id: int, db: Session = Depends(get_db)):
    products = db.query(Product).filter(Product.business_id == business_id).all()
    if not products:
        raise HTTPException(status_code=404, detail="No products found for the provided business_id")
    return products


# Get all suppliers for a business
@app.get("/business/{business_id}/suppliers", tags=["suppliers"], status_code=200)
def get_suppliers_by_business(business_id: int, db: Session = Depends(get_db)):
    business = db.query(Business).filter(Business.id == business_id).options(
        joinedload(Business.suppliers).joinedload(BusinessSupplier.supplier)).first()
    if not business:
        raise HTTPException(status_code=404, detail="Business not found")

    # Extract suppliers from the association objects
    suppliers = [assoc.supplier for assoc in business.suppliers]

    # Transform supplier instances into dict (or use a schema to serialize)
    suppliers_data = [{
        "id": supplier.id,
        "name": supplier.name,
        "email": supplier.email,
        "phone_number": supplier.phone_number,
        "address": supplier.address,
        "description": supplier.description,
    } for supplier in suppliers]

    return suppliers_data

# Get all customers for a business
@app.get("/business/{business_id}/customers", status_code=200)
def get_customers_by_business(business_id: int, db: Session = Depends(get_db)):
    business = db.query(Business).filter(Business.id == business_id).options(
        joinedload(Business.customers).joinedload(BusinessCustomer.customer)).first()
    if not business:
        raise HTTPException(status_code=404, detail="Business not found")
    
    # Extract customers from the association objects
    customers = [assoc.customer for assoc in business.customers]

    # Transform customer instances into dict (or use a schema to serialize)
    customers_data = [{
        "id": customer.id,
        "first_name": customer.first_name,
        "last_name": customer.last_name,
        "phone_number": customer.phone_number,
        "email": customer.email,
    } for customer in customers]

    return customers_data

# Get all units
@app.get("/units", status_code=200)
def list_units(db: Session = Depends(get_db)):
    """
    This lists all units, but we only get the id for each unit
    \f
    Docstrings are included in the swagger docs!
    """
    query = select(Unit)
    units = db.scalars(query).all()
    return units


# Get all inventories for a business
@app.get("/business/{business_id}/inventories", tags=["inventories"], status_code=200)
def get_inventories_by_business(business_id: int, db: Session = Depends(get_db)):
    business = db.query(Business).filter(Business.id == business_id).first()
    if not business:
        raise HTTPException(status_code=404, detail="Business not found")

    inventories = db.query(Inventory, Unit.name.label("unit_name"), Supplier.name.label("supplier_name")) \
        .join(Unit, Inventory.unit_id == Unit.id) \
        .join(Supplier, Inventory.supplier_id == Supplier.id) \
        .filter(Inventory.business_id == business_id) \
        .all()

    inventories_data = [{
        "id": inventory.id,
        "name": inventory.name,
        "number": inventory.number,
        "size": inventory.size,
        "item_type": inventory.item_type,
        "total_amount": inventory.total_amount,
        "description": inventory.description,
        "maximum_amount": inventory.maximum_amount,
        "threshold": inventory.threshold,
        "price_per_unit": inventory.price_per_unit,
        "time_of_delivery_days": inventory.time_of_delivery_days,
        "unit_name": unit_name,  # instead of unit_id
        "supplier_name": supplier_name,  # instead of supplier_id
        "business_id": inventory.business_id
    } for inventory, unit_name, supplier_name in inventories]

    return inventories_data


# Get all inventories for a product
@app.get("/product_inventory/{product_id}/product_inventories", tags=["product_inventory"], status_code=200)
def get_product_inventories(product_id: int, db: Session = Depends(get_db)):
    """
    Get all inventories related to a specific product_id, including inventory_name and unit_name.
    """
    results = db.query(
        ProductInventory.id.label("usage_amount_id"),
        ProductInventory.inventory_id,
        ProductInventory.usage_amount,
        Inventory.name.label("inventory_name"),
        Unit.name.label("unit_name")

    ).join(
        Inventory, ProductInventory.inventory_id == Inventory.id
    ).join(
        Unit, Inventory.unit_id == Unit.id
    ).filter(
        ProductInventory.product_id == product_id
    ).all()

    if not results:
        raise HTTPException(status_code=404, detail="No inventories found for the provided product_id")

    # Transform the results into a list of dictionaries
    inventories_data = [
        {
            "usage_amount_id": usage_amount_id,
            "inventory_id": inventory_id,
            "usage_amount": usage_amount,
            "inventory_name": inventory_name,
            "unit_name": unit_name
        }
        for usage_amount_id, inventory_id, usage_amount, inventory_name, unit_name in results
    ]

    return inventories_data


# # Get all employees for a business
@app.get("/business/{business_id}/employees", status_code=200)
def get_employees_by_business(business_id: int, db: Session = Depends(get_db)):
    business = db.query(Business).filter(Business.id == business_id).first()
    if not business:
        raise HTTPException(status_code=404, detail="Business not found")

    employees = db.query(Employee, JobPosition.title.label("job_title"), Business.name.label("business_name")) \
        .join(JobPosition, Employee.job_position_id == JobPosition.id) \
        .join(Business, Employee.business_id == Business.id) \
        .filter(Employee.business_id == business_id) \
        .all()

    employees_data = [
        {
            "id": employee.id,
            "first_name": employee.first_name,
            "last_name": employee.last_name,
            "phone_number": employee.phone_number,
            "email": employee.email,
            "address": employee.address,
            "salary": employee.salary,
            "date_of_birth": employee.date_of_birth.strftime("%Y-%m-%d"),  # Assuming date_of_birth is a datetime object
            "date_of_employment": employee.date_of_employment.strftime("%Y-%m-%d"),
            # Assuming date_of_employment is a datetime object
            "job_title": job_title,
            "business_name": business_name,
        } for employee, job_title, business_name in employees
    ]

    return employees_data


# Get all job positions
@app.get("/jobpositions", status_code=200)
def list_jobpositions(db: Session = Depends(get_db)):
    """
    This lists all job positions, but we only get the id for each job position
    \f
    Docstrings are included in the swagger docs!
    """
    query = select(JobPosition)
    jobpositions = db.scalars(query).all()
    return jobpositions


# Get daily sales for a business
@app.get("/business/{business_id}/daily-sales", status_code=200)
def get_daily_sales(business_id: int, db: Session = Depends(get_db)):
    """
    Endpoint to get daily sales for a given business.
    This aggregates sales by last_modified date, showing the total quantity and sales amount for each day.
    """
    daily_sales = db.query(
        func.date(Sale.last_modified).label('sale_date'),
        func.sum(Sale.quantity).label('total_quantity'),
        func.sum(Sale.price * Sale.quantity).label('total_sales')
    ).filter(Sale.business_id == business_id
             ).group_by(func.date(Sale.last_modified)
                        ).order_by('sale_date').all()

    return [{
        "sale_date": sale.sale_date.strftime("%Y-%m-%d"),
        "total_quantity": sale.total_quantity,
        "total_sales": sale.total_sales
    } for sale in daily_sales]

# Get all orders for a business
@app.get("/business/{business_id}/purchase_orders", status_code=200)
def get_purchase_orders(business_id: int, db: Session = Depends(get_db)):
    business = db.query(Business).filter(Business.id == business_id).first()
    if not business:
        raise HTTPException(status_code=404, detail="Business not found")
    orders= db.query(PurchaseOrder, Unit.name.label("unit_name"), Supplier.name.label("supplier_name")) \
        .join(Unit, PurchaseOrder.unit_id == Unit.id) \
        .join(Supplier, PurchaseOrder.supplier_id == Supplier.id) \
        .filter(PurchaseOrder.business_id == business_id) \
        .order_by(PurchaseOrder.date_created.desc()) \
        .all()
    
    orders_data = [{
        "id": order.id,
        "name": order.name, 
        "number": order.number,
        "size": order.size,
        "item_type": order.item_type,
        "total_amount": order.total_amount,
        "description": order.description,
        "maximum_amount": order.maximum_amount,
        "threshold": order.threshold,
        "price_per_unit": order.price_per_unit,
        "time_of_delivery_days": order.time_of_delivery_days,
        "unit_name": unit_name,
        "supplier_name": supplier_name,
        "business_id": order.business_id,
        "date_created": order.date_created.strftime("%Y-%m-%d"),
        "delivery_status": order.delivery_status
    } for order, unit_name, supplier_name in orders]

    return orders_data

# Get a order by id
@app.get("/purchase_order/{purchase_order_id}", status_code=200)
def get_purchase_order(purchase_order_id: int, db: Session = Depends(get_db)):
    order = db.query(PurchaseOrder).filter(PurchaseOrder.id == purchase_order_id).first()
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")
    order_data = {
        "name": order.name, 
        "number": order.number,
        "size": order.size,
        "item_type": order.item_type,
        "total_amount": order.total_amount,
        "description": order.description,
        "maximum_amount": order.maximum_amount,
        "threshold": order.threshold,
        "price_per_unit": order.price_per_unit,
        "time_of_delivery_days": order.time_of_delivery_days,
        "unit_id": order.unit_id,
        "supplier_id": order.supplier_id,
        "business_id": order.business_id,
    }
    return order_data

# Get employee count for a business
@app.get("/business/{business_id}/employee-count", status_code=200)
def get_employee_count_by_business(business_id: int, db: Session = Depends(get_db)):
    """
    Get the total number of employees for a given business
    """
    employee_count = db.query(Employee).filter(Employee.business_id == business_id).count()
    return {"employee_count": employee_count}

# Get customer count for a business
@app.get("/business/{business_id}/customer-count", status_code=200)
def get_customer_count_by_business(business_id: int, db: Session = Depends(get_db)):

    """
    Get the total number of customers for a given business
    """
    customer_count = db.query(func.count(Customer.id)).join(BusinessCustomer, Customer.id == BusinessCustomer.customer_id).filter(BusinessCustomer.business_id == business_id).scalar()

    if customer_count is None:
        raise HTTPException(status_code=404, detail="Business not found")

    return {"customer_count": customer_count}

# Get supplier count for a business
@app.get("/business/{business_id}/supplier-count", status_code=200)
def get_supplier_count_by_business(business_id: int, db: Session = Depends(get_db)):
    """
    Get the total number of suppliers for a given business
    """
    supplier_count = db.query(func.count(Supplier.id)).join(BusinessSupplier, Supplier.id == BusinessSupplier.supplier_id).filter(BusinessSupplier.business_id == business_id).scalar()

    if supplier_count is None:
        raise HTTPException(status_code=404, detail="Business not found")

    return {"supplier_count": supplier_count}

# Get inventory count for a business
@app.get("/business/{business_id}/inventory-count", status_code=200)
def get_inventory_count_by_business(business_id: int, db: Session = Depends(get_db)):
    """
    Get the total number of inventories for a given business
    """
    inventory_count = db.query(func.count(Inventory.id)).filter(Inventory.business_id == business_id).scalar()

    if inventory_count is None:
        raise HTTPException(status_code=404, detail="Business not found")

    return {"inventory_count": inventory_count}

# Get product count for a business
@app.get("/business/{business_id}/product-count", status_code=200)
def get_product_count_by_business(business_id: int, db: Session = Depends(get_db)):
    """
    Get the total number of products for a given business
    """
    product_count = db.query(func.count(Product.id)).filter(Product.business_id == business_id).scalar()

    if product_count is None:
        raise HTTPException(status_code=404, detail="Business not found")

    return {"product_count": product_count}

# Get  delivered orders count for a business
@app.get("/business/{business_id}/delivered-orders-count", status_code=200)
def get_delivered_orders_count_by_business(business_id: int, db: Session = Depends(get_db)):
    """
    Get the total number of delivered orders for a given business
    """
    delivered_orders_count = db.query(PurchaseOrder)\
        .filter(PurchaseOrder.business_id == business_id,
                PurchaseOrder.delivery_status == True).count()
    
    if delivered_orders_count is None:
        raise HTTPException(status_code=404, detail="Business not found")
    
    return {"delivered_orders_count": delivered_orders_count}

# Get undelivered orders count for a business
@app.get("/business/{business_id}/undelivered-orders-count", status_code=200)
def get_undelivered_orders_count_by_business(business_id: int, db: Session = Depends(get_db)):
    """
    Get the total number of undelivered orders for a given business
    """
    undelivered_orders_count = db.query(PurchaseOrder)\
        .filter(PurchaseOrder.business_id == business_id,
                PurchaseOrder.delivery_status == False).count()
    
    if undelivered_orders_count is None:
        raise HTTPException(status_code=404, detail="Business not found")
    
    return {"undelivered_orders_count": undelivered_orders_count}

# Get order count for a business
@app.get("/business/{business_id}/orders-count", status_code=200)
def get_order_count_by_business(business_id: int, db: Session = Depends(get_db)):
    """
    Get the total number of orders for a given business
    """
    orders_count = db.query(func.count(PurchaseOrder.id)).filter(PurchaseOrder.business_id == business_id).scalar()

    if orders_count is None:
        raise HTTPException(status_code=404, detail="Business not found")

    return {"orders_count": orders_count}

# Get total sales for a business
@app.get("/business/{business_id}/total-sales", status_code=200)
def get_total_sales_by_business(business_id: int, db: Session = Depends(get_db)):
    """
    Get the total sales amount for a given business
    """
    total_sales = db.query(func.sum(Sale.price * Sale.quantity)).filter(Sale.business_id == business_id).scalar()

    if total_sales is None:
        raise HTTPException(status_code=404, detail="Business not found")

    return {"total_sales": total_sales}

# Add a product to a business
@app.post("/business/{business_id}/product", status_code=201)
def add_product(business_id: int, product: ProductSchema, db: Session = Depends(get_db)):
    """
    Create a product, using a pydantic model for validation
    """
    # Check if product with the same name already exists
    existing_product = db.query(Product).filter(
        Product.name == product.name,
        Product.business_id == business_id
    ).first()
    if existing_product:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="A product with this name already exists."
        )

    # No existing product found, proceed to add new product
    db_product = Product(**product.dict())
    db.add(db_product)
    try:
        db.commit()
        return db_product
    except IntegrityError as e:
        db.rollback()
        raise HTTPException(status_code=400, detail=f"Database error: {e}")


# Add a supplier to a business
@app.post("/business/{business_id}/supplier", status_code=201)
def add_supplier_to_business(business_id: int, supplier: SupplierSchema, db: Session = Depends(get_db)):
    business = db.query(Business).filter(Business.id == business_id).first()
    if not business:
        raise HTTPException(status_code=404, detail="Business not found")

    # Create a new Supplier instance
    new_supplier = Supplier(**supplier.dict())
    db.add(new_supplier)
    db.commit()

    # Create a new association instance
    new_association = BusinessSupplier(business_id=business.id, supplier_id=new_supplier.id)
    db.add(new_association)
    db.commit()

    return new_supplier

# Add a customer to a business
@app.post("/business/{business_id}/customer", status_code=201)
def add_customer_to_business(business_id: int, customer: CustomerSchema, db: Session = Depends(get_db)):
    business = db.query(Business).filter(Business.id == business_id).first()
    if not business:
        raise HTTPException(status_code=404, detail="Business not found")

    # Create a new Customer instance
    new_customer = Customer(**customer.dict())
    db.add(new_customer)
    db.commit()

    # Create a new association instance
    new_association = BusinessCustomer(business_id=business.id, customer_id=new_customer.id)
    db.add(new_association) 
    db.commit()

    return new_customer


# Add a unit
@app.post("/unit", status_code=201)
def add_unit(unit: UnitSchema, db: Session = Depends(get_db)):
    """
    Create a unit, using a pydantic model for validation
    """
    try:
        db_unit = Unit(**unit.dict())
        db.add(db_unit)
        db.commit()
    except IntegrityError as e:
        raise HTTPException(status_code=400, detail="Database error")
    return db_unit


# Add an inventory to a business
@app.post("/business/{business_id}/inventory", status_code=201)
def add_inventory(business_id: int, inventory: InventorySchema, db: Session = Depends(get_db)):
    """
    Create an inventory, using a pydantic model for validation
    """
    # Check if inventory with the same name already exists
    existing_inventory = db.query(Inventory).filter(
        Inventory.name == inventory.name,
        Inventory.business_id == business_id
    ).first()
    if existing_inventory:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="An inventory with this name already exists."
        )

    # No existing inventory found, proceed to add new inventory
    db_inventory = Inventory(**inventory.dict())
    db.add(db_inventory)
    try:
        db.commit()
        return db_inventory
    except IntegrityError as e:
        db.rollback()
        raise HTTPException(status_code=400, detail=f"Database error: {e}")


# Add an inventory to product_inventory
@app.post("/product_inventory", status_code=201)
def add_product_inventory(inventory_data: ProductInventorySchema, db: Session = Depends(get_db)):
    """
    Create a product-inventory association, using a pydantic model for validation
    """
    new_inventory_item = ProductInventory(
        product_id=inventory_data.product_id,
        inventory_id=inventory_data.inventory_id,
        usage_amount=inventory_data.usage_amount
    )
    db.add(new_inventory_item)
    try:
        db.commit()
        db.refresh(new_inventory_item)
        return new_inventory_item
    except IntegrityError as e:
        db.rollback()
        raise HTTPException(status_code=400, detail=f"Database error: {e}")


# Add an employee to a business
@app.post("/business/{business_id}/employee", status_code=201)
def add_employee_to_business(employee: EmployeeSchema, business_id: int, db: Session = Depends(get_db)):
    """
    Create an employee, using a pydantic model for validation
    """
    try:
        hashed_password = pwd_context.hash(employee.password)
        employee_data = employee.dict()
        # db_employee = Employee(**employee.dict())
        employee_data["password"] = hashed_password
        employee_data["business_id"] = business_id
        db_employee = Employee(**employee_data)
        db.add(db_employee)
        db.commit()
        db.refresh(db_employee)
        print(db_employee)
        return db_employee
    except IntegrityError as e:
        db.rollback()
        raise HTTPException(status_code=400, detail=f"Database error: {e}")
    except ValidationError as e:
        raise HTTPException(status_code=422, detail=f"Validation error: {e}")


# Add sales csv to Sales
@app.post("/update_sales_table/{business_id}", status_code=200)
async def update_sales_table(business_id: int, file: UploadFile = File(...), db: Session = Depends(get_db)):
    # Save uploaded file temporarily
    temp_file_path = f"temp_{file.filename}"
    with open(temp_file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    try:
        # Process the CSV and get valid sales along with any errors
        valid_sales, error_items = process_and_insert_sales_csv_data(db, temp_file_path, business_id)

        # Always attempt to update the inventory with valid sales
        update_message = update_inventory_after_sales(valid_sales, db)

        if error_items:
            # Handle case where there are errors with some items
            error_message = "The following items do not exist in the products table for this business_id: " + ", ".join(
                error_items)
            return {"message": f"{update_message}. Errors encountered with some items: {error_message}"}
        else:
            # All items processed successfully
            return {"message": update_message}
    except Exception as e:
        # Handle generic exceptions and ensure DB rollback if necessary
        db.rollback()
        raise HTTPException(status_code=400, detail=str(e))
    finally:
        # Clean up temporary file
        if os.path.exists(temp_file_path):
            os.remove(temp_file_path)

# Add orders to PurchaseOrder
@app.post("/business/{business_id}/purchase_order", status_code=200)
def add_purchase_order(order: PurchaseOrderSchema, business_id: int, db: Session = Depends(get_db)):
    """
    Create a purchase order, using a pydantic model for validation
    """

    # Check if order with the same name already exists
    existing_order = db.query(PurchaseOrder).filter(
        PurchaseOrder.name == order.name,
        PurchaseOrder.business_id == business_id
    ).first()
    # if existing_order:
    #     raise HTTPException(
    #         status_code=status.HTTP_400_BAD_REQUEST,
    #         detail="An order with this name already exists."
    #     )

    # No existing order found, proceed to add new order
    db_order = PurchaseOrder(**order.dict())
    db.add(db_order) 
    try:
        db.commit()
        return db_order
    except IntegrityError as e:
        db.rollback()
        raise HTTPException(status_code=400, detail=f"Database error: {e}")
    
# Add order to inventories table
@app.post("/inventory/update_or_add/{business_id}", status_code=200)
def update_or_add_inventory(business_id: int, inventory_data: InventorySchema, db: Session = Depends(get_db)):
    existing_inventory = db.query(Inventory).filter(
        Inventory.name == inventory_data.name,
        Inventory.business_id == business_id
    ).first()

    if existing_inventory:
        # Update existing inventory
        existing_inventory.total_amount += inventory_data.total_amount
    else:
        # Add new inventory
        new_inventory = Inventory(**inventory_data.dict())
        db.add(new_inventory)
    db.commit()
    return {"Message": "Inventory updated or added successfully"}

# Edit a business
@app.put("/business/{business_id}", status_code=200)
def update_business(business_id: int, business_update: BusinessSchema, db: Session = Depends(get_db)):
    business = db.query(Business).filter(Business.id == business_id).first()
    if not business:
        raise HTTPException(status_code=404, detail="Business not found")
    for key, value in business_update.dict().items():
        setattr(business, key, value)
    db.commit()
    return {"detail": "Business updated successfully"}


# Edit a product
@app.put("/product/{product_id}", status_code=200)
def update_product(product_id: int, product: ProductSchema, db: Session = Depends(get_db)):
    db_product = db.query(Product).filter(Product.id == product_id).first()
    if not db_product:
        raise HTTPException(status_code=404, detail="Product not found")
    product_data = product.dict(exclude_unset=True)
    for key, value in product_data.items():
        setattr(db_product, key, value)
    db.commit()
    db.refresh(db_product)
    return db_product


# Edit a supplier
@app.put("/supplier/{supplier_id}", status_code=200)
def update_supplier(supplier_id: int, supplier: SupplierSchema, db: Session = Depends(get_db)):
    db_supplier = db.query(Supplier).filter(Supplier.id == supplier_id).first()
    if not db_supplier:
        raise HTTPException(status_code=404, detail="Supplier not found")
    supplier_data = supplier.dict(exclude_unset=True)
    for key, value in supplier_data.items():
        setattr(db_supplier, key, value)
    db.commit()
    db.refresh(db_supplier)
    return db_supplier

# Edit a customer
@app.put("/customer/{customer_id}", status_code=200)
def update_customer(customer_id: int, customer: CustomerSchema, db: Session = Depends(get_db)):
    db_customer = db.query(Customer).filter(Customer.id == customer_id).first()
    if not db_customer:
        raise HTTPException(status_code=404, detail="Customer not found")
    customer_data = customer.dict(exclude_unset=True)
    for key, value in customer_data.items():
        setattr(db_customer, key, value)
    db.commit()
    db.refresh(db_customer)
    return db_customer


# Edit a unit   
@app.put("/unit/{unit_id}", status_code=200)
def update_unit(unit_id: int, unit: UnitSchema, db: Session = Depends(get_db)):
    db_unit = db.query(Unit).filter(Unit.id == unit_id).first()
    if not db_unit:
        raise HTTPException(status_code=404, detail="Unit not found")
    unit_data = unit.dict(exclude_unset=True)
    for key, value in unit_data.items():
        setattr(db_unit, key, value)
    db.commit()
    db.refresh(db_unit)
    return db_unit


# Edit an inventory
@app.put("/inventory/{inventory_id}", status_code=200)
def update_inventory(inventory_id: int, inventory: InventorySchema, db: Session = Depends(get_db)):
    db_inventory = db.query(Inventory).filter(Inventory.id == inventory_id).first()
    if not db_inventory:
        raise HTTPException(status_code=404, detail="Inventory not found")
    inventory_data = inventory.dict(exclude_unset=True)
    for key, value in inventory_data.items():
        setattr(db_inventory, key, value)
    db.commit()
    db.refresh(db_inventory)
    return db_inventory


# Edit a product-inventory association
@app.put("/product_inventory/{product_inventory_id}", status_code=200)
def update_product_inventory(product_inventory_id: int, product_inventory: ProductInventorySchema,
                             db: Session = Depends(get_db)):
    db_product_inventory = db.query(ProductInventory).filter(ProductInventory.id == product_inventory_id).first()
    if not db_product_inventory:
        raise HTTPException(status_code=404, detail="Product-inventory association not found")
    product_inventory_data = product_inventory.dict(exclude_unset=True)
    for key, value in product_inventory_data.items():
        setattr(db_product_inventory, key, value)
    db.commit()
    db.refresh(db_product_inventory)
    return db_product_inventory


# Edit an employee
@app.put("/employees/{employee_id}", response_model=EmployeeSchema, status_code=200)
def update_employee(employee_id: int, employee: EmployeeSchema, db: Session = Depends(get_db)):
    db_employee = db.query(Employee).filter(Employee.id == employee_id).first()
    if not db_employee:
        raise HTTPException(status_code=404, detail="Employee not found")
    for key, value in employee.dict().items():
        setattr(db_employee, key, value)
    db.commit()
    return db_employee

# Edit a purchase order
@app.put("/purchase_order/{purchase_order_id}", status_code=200)
def update_purchase_order(purchase_order_id: int, order: PurchaseOrderSchema, db: Session = Depends(get_db)):
    db_order = db.query(PurchaseOrder).filter(PurchaseOrder.id == purchase_order_id).first()
    if not db_order:
        raise HTTPException(status_code=404, detail="Order not found")
    order_data = order.dict(exclude_unset=True)
    for key, value in order_data.items():
        setattr(db_order, key, value)
    db.commit()
    db.refresh(db_order)
    return db_order

# Delete a product
@app.delete("/product/{product_id}", status_code=204)
def delete_product(product_id: int, db: Session = Depends(get_db)):
    product = db.query(Product).filter(Product.id == product_id).first()
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    db.delete(product)
    db.commit()
    return {"detail": "Product successfully deleted"}


# Delete a business
@app.delete("/business/{business_id}", status_code=204)
def delete_business(business_id: int, db: Session = Depends(get_db)):
    business = db.query(Business).filter(Business.id == business_id).first()
    if not business:
        raise HTTPException(status_code=404, detail="Product not found")
    db.delete(business)
    db.commit()
    return {"detail": "Product successfully deleted"}


# Delete a unit
@app.delete("/unit/{unit_id}", status_code=204)
def delete_unit(unit_id: int, db: Session = Depends(get_db)):
    unit = db.query(Unit).filter(Unit.id == unit_id).first()
    if not unit:
        raise HTTPException(status_code=404, detail="Unit not found")
    db.delete(unit)
    db.commit()
    return {"detail": "Unit successfully deleted"}


# Delete an inventory
@app.delete("/inventory/{inventory_id}", status_code=204)
def delete_inventory(inventory_id: int, db: Session = Depends(get_db)):
    related_product_inventories = db.query(ProductInventory).filter(ProductInventory.inventory_id == inventory_id).all()
    for product_inventory in related_product_inventories:
        db.delete(product_inventory)
    db.commit()
    inventory_item = db.query(Inventory).get(inventory_id)
    if inventory_item:
        db.delete(inventory_item)
        db.commit()
        return {"detail": "Inventory and related associations successfully deleted"}
    else:
        raise HTTPException(status_code=404, detail="Inventory not found")


# Delete an employee
@app.delete("/employees/{employee_id}", status_code=204)
def delete_employee(employee_id: int, db: Session = Depends(get_db)):
    db_employee = db.query(Employee).filter(Employee.id == employee_id).first()
    if db_employee is None:
        raise HTTPException(status_code=404, detail="Employee not found")
    db.delete(db_employee)
    db.commit()
    return {"detail": "Employee successfully deleted"}


# delete a supplier
@app.delete("/supplier/{supplier_id}", status_code=204)
def delete_supplier(supplier_id: int, db: Session = Depends(get_db)):
    related_business_supplier = db.query(BusinessSupplier).filter(BusinessSupplier.supplier_id == supplier_id).all()
    for supplier in related_business_supplier:
        db.delete(supplier)
    db.commit()
    supplier_item = db.query(Supplier).get(supplier_id)
    if supplier_item:
        db.delete(supplier_item)
        db.commit()
        return {"detail": "Supplier and associations successfully deleted"}
    else:
        raise HTTPException(status_code=404, detail="Supplier not found")

# delete a customer
@app.delete("/customer/{customer_id}", status_code=204)
def delete_customer(customer_id: int, db: Session = Depends(get_db)):
    related_business_customer = db.query(BusinessCustomer).filter(BusinessCustomer.customer_id == customer_id).all()
    for customer in related_business_customer:
        db.delete(customer)
    db.commit()
    customer_item = db.query(Customer).get(customer_id)
    if customer_item:
        db.delete(customer_item)
        db.commit()
        return {"detail": "Customer and associations successfully deleted"}
    else:
        raise HTTPException(status_code=404, detail="Customer not found")

# delete a purchase order
@app.delete("/purchase_order/{purchase_order_id}", status_code=204)
def delete_purchase_order(purchase_order_id: int, db: Session = Depends(get_db)):
    db_order = db.query(PurchaseOrder).filter(PurchaseOrder.id == purchase_order_id).first()
    if db_order is None:
        raise HTTPException(status_code=404, detail="Order not found")
    db.delete(db_order)
    db.commit()
    return {"detail": "Order successfully deleted"}


# Unit table initial values
def units_names():
    """Populate the Unit table with initial values."""
    units_data = [
        {"name": "Piece"},
        {"name": "Box"},
        {"name": "Milligram"},
        {"name": "Gram"},
        {"name": "Kilogram"},
        {"name": "Pound"},
        {"name": "oz"},
        {"name": "Milliliter"},
        {"name": "Centiliter"},
        {"name": "Deciliter"},
        {"name": "Liter"},
        {"name": "Teaspoon"},
        {"name": "Tablespoon"},
        {"name": "Cup"},
    ]

    db = next(get_db())
    try:
        for unit_data in units_data:
            if not db.query(Unit).filter(Unit.name == unit_data["name"]).first():
                unit = Unit(**unit_data)
                db.add(unit)
        db.commit()
    except IntegrityError as e:
        db.rollback()
        raise HTTPException(status_code=400, detail=f"Database error: {e}")
    finally:
        db.close()


# JobPosition table initial values
def job_positions():
    """Populate the JobPosition table with initial values."""
    job_positions_data = [
        {"title": "Manager", "description": "Manages the business"},
        {"title": "Salesperson", "description": "Sells products"},
        {"title": "Cashier", "description": "Handles cash transactions"},
        {"title": "Stockkeeper", "description": "Manages inventory"},
        {"title": "Cleaner", "description": "Cleans the business premises"},
        {"title": "Security", "description": "Provides security"},
        {"title": "Accountant", "description": "Manages the business finances"},
        {"title": "Human Resources", "description": "Manages the business employees"},
        {"title": "Marketing", "description": "Manages the business marketing"},
        {"title": "IT", "description": "Manages the business IT infrastructure"},
        {"title": "Customer Service", "description": "Manages the business customer service"},
        {"title": "Waiter", "description": "Serves customers in a restaurant"},
        {"title": "Chef", "description": "Prepares food in a restaurant"},
        {"title": "Bartender", "description": "Prepares drinks in a restaurant"},
        {"title": "Host", "description": "Greets and seats customers in a restaurant"},
    ]

    db = next(get_db())
    try:
        for job_position_data in job_positions_data:
            if not db.query(JobPosition).filter(JobPosition.title == job_position_data["title"]).first():
                job_position = JobPosition(**job_position_data)
                db.add(job_position)
        db.commit()
    except IntegrityError as e:
        db.rollback()
        raise HTTPException(status_code=400, detail=f"Database error: {e}")
    finally:
        db.close()
