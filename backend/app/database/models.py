from sqlalchemy.orm import DeclarativeBase, Mapped, mapped_column, relationship
from sqlalchemy import Integer, String, Text, Boolean, ForeignKey, Column, Table, DateTime, func, Float, Date
from datetime import datetime
from sqlalchemy import UniqueConstraint


class Base(DeclarativeBase):
    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)


class Owner(Base):
    __tablename__ = "owners"
    first_name: Mapped[str] = mapped_column(String(50), nullable=False, unique=False)
    last_name: Mapped[str] = mapped_column(String(50), nullable=False, unique=False)
    phone_number: Mapped[str] = mapped_column(String(15), nullable=False, unique=True)
    email: Mapped[str] = mapped_column(String(100), nullable=False, unique=True)
    password: Mapped[str] = mapped_column(String(255), nullable=False)
    businesses: Mapped[list["Business"]] = relationship("Business", back_populates="owner")

    def __repr__(self):
        return f"<Owner={self.first_name}>"


class Business(Base):
    __tablename__ = "businesses"
    name: Mapped[str] = mapped_column(String(100), nullable=False, unique=True)
    phone_number: Mapped[str] = mapped_column(String(15), nullable=False, unique=False)
    address: Mapped[str] = mapped_column(String(200), nullable=False, unique=False)
    postal_code: Mapped[str] = mapped_column(String(20), nullable=True, unique=False)
    email: Mapped[str] = mapped_column(String(100), nullable=False, unique=True)
    # One to many relationship with the owner, many businesses can be owned by one owner
    owner_id: Mapped[int] = mapped_column(Integer, ForeignKey("owners.id"), nullable=False)
    owner: Mapped[Owner] = relationship("Owner", back_populates="businesses")
    employees: Mapped[list["Employee"]] = relationship("Employee", back_populates="business")
    inventories: Mapped[list["Inventory"]] = relationship("Inventory", back_populates="business")
    products: Mapped[list["Product"]] = relationship("Product", back_populates="business")
    sales: Mapped[list["Sale"]] = relationship("Sale", back_populates="business")
    purchase_orders: Mapped[list["purchase_orders"]] = relationship("PurchaseOrder", back_populates="business")
    # Many to many relationship
    suppliers: Mapped[list["BusinessSupplier"]] = relationship(back_populates="business")
    customers: Mapped[list["BusinessCustomer"]] = relationship(back_populates="business")

    def __repr__(self):
        return f"<Business={self.name}>"


class Supplier(Base):
    __tablename__ = "suppliers"
    name: Mapped[str] = mapped_column(String(100), nullable=False, unique=False)
    email: Mapped[str] = mapped_column(String(100), nullable=False, unique=False)
    phone_number: Mapped[str] = mapped_column(String(15), nullable=False, unique=False)
    address: Mapped[str] = mapped_column(String(200), nullable=False, unique=False)
    description: Mapped[str] = mapped_column(Text, nullable=True, unique=False)
    businesses: Mapped[list["BusinessSupplier"]] = relationship(back_populates="supplier")
    inventories: Mapped[list["Inventory"]] = relationship("Inventory", back_populates="supplier")
    purchase_orders: Mapped[list["purchase_orders"]] = relationship("PurchaseOrder", back_populates="supplier")


    def __repr__(self):
        return f"<Supplier={self.name}>"


class Customer(Base):
    __tablename__ = "customers"
    first_name: Mapped[str] = mapped_column(String(50), nullable=False, unique=False)
    last_name: Mapped[str] = mapped_column(String(50), nullable=False, unique=False)
    phone_number: Mapped[str] = mapped_column(String(15), nullable=False, unique=True)
    email: Mapped[str] = mapped_column(String(100), nullable=False, unique=True)
    businesses: Mapped[list["BusinessCustomer"]] = relationship(back_populates="customer")

    def __repr__(self):
        return f"<Customer={self.first_name}>"


class BusinessSupplier(Base):
    __tablename__ = "business_supplier"
    business_id: Mapped[int] = mapped_column(ForeignKey("businesses.id"))
    supplier_id: Mapped[int] = mapped_column(ForeignKey("suppliers.id"))
    business: Mapped["Business"] = relationship(back_populates="suppliers")
    supplier: Mapped["Supplier"] = relationship(back_populates="businesses")
    last_modified: Mapped[datetime] = mapped_column(
        DateTime, default=func.now(), onupdate=func.now())

    __table_args__ = (
        UniqueConstraint("business_id", "supplier_id"),
    )


class BusinessCustomer(Base):
    __tablename__ = "business_customer"
    business_id: Mapped[int] = mapped_column(ForeignKey("businesses.id"))
    customer_id: Mapped[int] = mapped_column(ForeignKey("customers.id"))
    business: Mapped["Business"] = relationship(back_populates="customers")
    customer: Mapped["Customer"] = relationship(back_populates="businesses")
    last_modified: Mapped[datetime] = mapped_column(
        DateTime, default=func.now(), onupdate=func.now())

    __table_args__ = (
        UniqueConstraint("business_id", "customer_id"),
    )


class JobPosition(Base):
    __tablename__ = "job_positions"
    title: Mapped[str] = mapped_column(String(100), nullable=False, unique=True)
    description: Mapped[str] = mapped_column(Text, nullable=True, unique=False)
    employees: Mapped[list["Employee"]] = relationship("Employee", back_populates="job_position")

    def __repr__(self):
        return f"<JobPosition={self.title}>"


class Employee(Base):
    __tablename__ = "employees"
    first_name: Mapped[str] = mapped_column(String(50), nullable=False, unique=False)
    last_name: Mapped[str] = mapped_column(String(50), nullable=False, unique=False)
    phone_number: Mapped[str] = mapped_column(String(15), nullable=False, unique=True)
    email: Mapped[str] = mapped_column(String(100), nullable=False, unique=True)
    address: Mapped[str] = mapped_column(String(200), nullable=False, unique=False)
    postal_code: Mapped[str] = mapped_column(String(20), nullable=True, unique=False)
    salary: Mapped[float] = mapped_column(Float, nullable=False, unique=False)
    date_of_birth: Mapped[datetime] = mapped_column(Date, nullable=False)
    date_of_employment: Mapped[datetime] = mapped_column(Date, nullable=True, default=func.now())
    job_position_id: Mapped[int] = mapped_column(Integer, ForeignKey("job_positions.id"), nullable=False)
    job_position: Mapped[JobPosition] = relationship("JobPosition", back_populates="employees")
    business_id: Mapped[int] = mapped_column(Integer, ForeignKey("businesses.id"), nullable=False)
    business: Mapped[Business] = relationship("Business", back_populates="employees")
    password: Mapped[str] = mapped_column(String(255), nullable=False)

    def __repr__(self):
        return f"<Employee={self.first_name}>"


class Product(Base):
    __tablename__ = "products"
    name: Mapped[str] = mapped_column(String(100), nullable=False, unique=False)
    description: Mapped[str] = mapped_column(Text, nullable=True, unique=False)
    price: Mapped[float] = mapped_column(Float, nullable=False, unique=False)
    business_id: Mapped[int] = mapped_column(Integer, ForeignKey("businesses.id"), nullable=False)
    business: Mapped[Business] = relationship("Business", back_populates="products")
    inventories: Mapped[list["ProductInventory"]] = relationship(back_populates="product")
    
    def __repr__(self):
        return f"<Product={self.name}>"


class Unit(Base):
    __tablename__ = "units"
    name: Mapped[str] = mapped_column(String(100), nullable=False, unique=True)
    inventories: Mapped[list["Inventory"]] = relationship("Inventory", back_populates="unit")
    purchase_orders: Mapped[list["PurchaseOrder"]] = relationship("PurchaseOrder", back_populates="unit")
    
    def __repr__(self):
        return f"<Unit={self.name}>"


class Inventory(Base):
    __tablename__ = "inventories"
    name: Mapped[str] = mapped_column(String(100), nullable=False, unique=False)
    number: Mapped[int] = mapped_column(Integer, nullable=False, unique=False)
    size: Mapped[int] = mapped_column(Integer, nullable=False, unique=False)
    item_type: Mapped[str] = mapped_column(String(100), nullable=True, unique=False)
    total_amount: Mapped[float] = mapped_column(Float, nullable=False, unique=False)
    description: Mapped[str] = mapped_column(Text, nullable=True, unique=False) 
    maximum_amount: Mapped[float] = mapped_column(Float, nullable=False, unique=False)    
    threshold: Mapped[float] = mapped_column(Float, nullable=False, unique=False) 
    price_per_unit: Mapped[float] = mapped_column(Float, nullable=False, unique=False)    
    time_of_delivery_days: Mapped[int] = mapped_column(Integer, nullable=False, unique=False)   
    unit_id: Mapped[int] = mapped_column(Integer, ForeignKey("units.id"), nullable=False)
    unit: Mapped[Unit] = relationship("Unit", back_populates="inventories")
    supplier_id: Mapped[int] = mapped_column(Integer, ForeignKey("suppliers.id"), nullable=False)
    supplier: Mapped[Supplier] = relationship("Supplier", back_populates="inventories")
    business_id: Mapped[int] = mapped_column(Integer, ForeignKey("businesses.id"), nullable=False)
    business: Mapped[Business] = relationship("Business", back_populates="inventories")
    products: Mapped[list["ProductInventory"]] = relationship(back_populates="inventory")


class ProductInventory(Base):
    __tablename__ = "product_inventory"
    product_id: Mapped[int] = mapped_column(ForeignKey("products.id"))
    inventory_id: Mapped[int] = mapped_column(ForeignKey("inventories.id"))
    usage_amount: Mapped[float] = mapped_column(Float, nullable=False, unique=False)
    product: Mapped["Product"] = relationship(back_populates="inventories")
    inventory: Mapped["Inventory"] = relationship(back_populates="products")
    last_modified: Mapped[datetime] = mapped_column(
        DateTime, default=func.now(), onupdate=func.now())

    __table_args__ = (
        UniqueConstraint("product_id", "inventory_id"),
    )


class Sale(Base):
    __tablename__ = 'sales'
    item: Mapped[str] = mapped_column(String(50), nullable=False, unique=False)
    quantity: Mapped[int] = mapped_column(Integer, nullable=False, unique=False)
    price: Mapped[float] = mapped_column(Integer, nullable=False, unique=False)
    business_id: Mapped[int] = mapped_column(Integer, ForeignKey("businesses.id"), nullable=False)
    business: Mapped[Business] = relationship("Business", back_populates="sales")
    last_modified: Mapped[datetime] = mapped_column(Date, default=func.now(), onupdate=func.now())

    __table_args__ = (
        UniqueConstraint("item", "business_id", "last_modified", name="unique_sale"),
    )

    def __repr__(self):
        return f"<Unit={self.item}>"


class PurchaseOrder(Base):
    __tablename__ = "purchase_orders"
    name: Mapped[str] = mapped_column(String(50), nullable=False, unique=False)
    number: Mapped[int] = mapped_column(Integer, nullable=False, unique=False)
    size: Mapped[int] = mapped_column(Integer, nullable=False, unique=False)
    total_amount: Mapped[float] = mapped_column(Float, nullable=False)
    item_type: Mapped[str] = mapped_column(String(100), nullable=True, unique=False)
    price_per_unit: Mapped[float] = mapped_column(Float, nullable=False, unique=False)
    time_of_delivery_days: Mapped[int] = mapped_column(Integer, nullable=False, unique=False)
    business_id: Mapped[int] = mapped_column(Integer, ForeignKey("businesses.id"), nullable=False)
    supplier_id: Mapped[int] = mapped_column(Integer, ForeignKey("suppliers.id"), nullable=False)
    unit_id: Mapped[int] = mapped_column(Integer, ForeignKey("units.id"), nullable=False)
    date_created: Mapped[datetime] = mapped_column(Date, default=func.now())
    # status: Mapped[str] = mapped_column(String(50), nullable=False)
    business: Mapped[Business] = relationship("Business", back_populates="purchase_orders")
    supplier: Mapped[Supplier] = relationship("Supplier", back_populates="purchase_orders")
    unit: Mapped[Unit] = relationship("Unit", back_populates="purchase_orders")
    threshold: Mapped[float] = mapped_column(Float, default=0.3)
    maximum_amount: Mapped[float] = mapped_column(Float, default=1000000)
    description: Mapped[str] = mapped_column(Text, nullable=True, unique=False)
    delivery_status: Mapped[bool] = mapped_column(Boolean, nullable=False)

    def __repr__(self):
        return f"<Unit={self.name}>"
