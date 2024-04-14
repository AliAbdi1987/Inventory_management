from pydantic import BaseModel, Field, EmailStr, ConfigDict
from typing import ClassVar
from datetime import datetime


# owner schema
class OwnerSchema(BaseModel):
    first_name: str = Field(..., min_length=1, max_length=50,
                            description="The first name of the owner, required.")
    last_name: str = Field(min_length=1, max_length=50,
                           description="The last name of the owner, required.")
    phone_number: str = Field(min_length=1, max_length=15,
                              description="The phone number of the owner, unique and required.")
    email: EmailStr = Field(description="The email of the owner, unique and required.")
    password: str = Field(min_length=1, max_length=255,
                          description="The password of the owner, required.")

    model_config = ConfigDict(
        from_attributes=True,
        json_schema_extra={
            "example": {
                "first_name": "John",
                "last_name": "Doe",
                "phone_number": "0123456789",
                "email": "johndoe@gmail.com",
                "password": "password"
            }
        })


# business schema
class BusinessSchema(BaseModel):
    name: str = Field(..., min_length=1, max_length=100,
                      description="The name of the business, unique and required.")
    phone_number: str = Field(min_length=1, max_length=15,
                              description="The phone number of the business, required.")
    address: str = Field(min_length=1, max_length=200,
                         description="The address of the business, required.")
    postal_code: str = Field(min_length=1, max_length=20,
                             description="The postal code of the business, optional.")
    email: EmailStr = Field(description="The email of the business, unique and required.")
    owner_id: int

    model_config = ConfigDict(
        from_attributes=True,
        json_schema_extra={
            "example": {
                "name": "Tehran Grill",
                "phone_number": "0123456789",
                "address": "123 malmvagen Street",
                "postal_code": "12345",
                "email": "tehrangrill@gmail.com",
                "owner_id": 1
            }
        })


# Customer schema
class CustomerSchema(BaseModel):
    first_name: str = Field(..., min_length=1, max_length=50,
                            description="The first name of the customer, required.")
    last_name: str = Field(min_length=1, max_length=50,
                           description="The last name of the customer, required.")
    phone_number: str = Field(min_length=1, max_length=15,
                              description="The phone number of the customer, unique and required.")
    email: EmailStr = Field(description="The email of the customer, unique and required.")

    model_config = ConfigDict(
        from_attributes=True,
        json_schema_extra={
            "example": {
                "first_name": "John",
                "last_name": "Doe",
                "phone_number": "0123456789",
                "email": "johndoe@gmail.com"
            }
        })


# Supplier schema
class SupplierSchema(BaseModel):
    name: str = Field(..., min_length=1, max_length=100,
                      description="The name of the supplier, required.")
    email: EmailStr = Field(description="The email of the supplier, unique and required.")
    phone_number: str = Field(min_length=1, max_length=15,
                              description="The phone number of the supplier, unique and required.")
    address: str = Field(min_length=1, max_length=200,
                         description="The address of the supplier, required.")
    description: str = Field(description="A description of the supplier, optional.")

    model_config = ConfigDict(
        from_attributes=True,
        json_schema_extra={
            "example": {
                "name": "ICA",
                "email": "info@ica.se",
                "phone_number": "0123456789",
                "address": "123 malmvagen Street",
                "description": "A leading grocery store in Sweden."
            }
        })


# Job position schema
class JobPositionSchema(BaseModel):
    title: str = Field(..., min_length=1, max_length=100,
                       description="The title of the job position, unique and required.")
    description: str = Field(description="A description of the job position, optional.")

    model_config = ConfigDict(
        from_attributes=True,
        json_schema_extra={
            "example": {
                "title": "Cashier",
                "description": "A cashier at the checkout counter."
            }
        })


# Employee schema
class EmployeeSchema(BaseModel):
    first_name: str = Field(..., min_length=1, max_length=50,
                            description="The first name of the employee, required.")
    last_name: str = Field(min_length=1, max_length=50,
                           description="The last name of the employee, required.")
    phone_number: str = Field(min_length=1, max_length=15,
                              description="The phone number of the employee, unique and required.")
    email: EmailStr = Field(description="The email of the employee, unique and required.")
    address: str = Field(min_length=1, max_length=200,
                         description="The address of the employee, required.")
    postal_code: str = Field(min_length=1, max_length=20,
                                description="The postal code of the employee, optional.")
    salary: float = Field(ge=0, description="The salary of the employee, required.")
    password: str = Field(min_length=1, max_length=255,
                          description="The password of the employee, required.")
    date_of_birth: datetime
    date_of_employment: datetime = Field(default=datetime.now())
    job_position_id: int
    business_id: int

    model_config: ClassVar = ConfigDict(
        from_attributes=True,
        json_schema_extra={
            "example": {
                "first_name": "John",
                "last_name": "Doe",
                "phone_number": "0123456789",
                "email": "johndoe@gmail.com",
                "address": "123 malmvagen Street",
                "salary": 50000,
                "date_of_birth": "1990-01-01",
                "date_of_employment": "2024-01-01",
                "job_position_id": 1,
                "business_id": 1
            }
        })


# Unit schema
class UnitSchema(BaseModel):
    name: str = Field(..., min_length=1, max_length=50,
                      description="The name of the unit, unique and required.")

    model_config = ConfigDict(
        from_attributes=True,
        json_schema_extra={
            "example": {
                "name": "Kilogram"
            }
        })


# Inventory schema
class InventorySchema(BaseModel):
    name: str = Field(..., min_length=1, max_length=100,
                      description="The name of the inventory, required.")
    number: int = Field(ge=0, description="The number of the inventory, required.")
    size: int = Field(ge=0, description="The size of the inventory, required.")
    item_type: str = Field(min_length=1, max_length=100, description="The item type of the inventory.")
    total_amount: float = Field(ge=0, description="The total amount of the inventory, required.")
    description: str = Field(description="A description of the inventory, optional.")
    maximum_amount: float = Field(ge=0, description="The maximum amount of the inventory, required.")
    threshold: float = Field(ge=0, lt=1, description="The threshold of the inventory, required.")
    price_per_unit: float = Field(ge=0, description="The price per unit of the inventory, required.")
    time_of_delivery_days: int = Field(gt=0, description="The time of delivery days of the inventory, required.")
    supplier_id: int
    unit_id: int
    business_id: int

    model_config = ConfigDict(
        from_attributes=True,
        json_schema_extra={
            "example": {
                "name": "Absolut Vodka",
                "number": 100,
                "size": 100,
                "item_type": 'bottle',
                "total_amount": 1000,
                "description": "A bottle of vodka.",
                "maximum_amount": 2000,
                "threshold": 0.2,
                "price_per_unit": 10.25,
                "time_of_delivery_days": 5,
                "supplier_id": 1,
                "unit_id": 1
            }
        })


# Product schema
class ProductSchema(BaseModel):
    name: str = Field(..., min_length=1, max_length=100,
                      description="The name of the product, required.")
    description: str = Field(description="A description of the product, optional.")
    price: float = Field(gt=0, description="The price of the product, required.")
    business_id: int

    model_config = ConfigDict(
        from_attributes=True,
        json_schema_extra={
            "example": {
                "name": "Grillad kyckling",
                "description": "A bag of rice.",
                "price": 13.25,
                "business_id": 1
            }
        })


# Product inventory schema
class ProductInventorySchema(BaseModel):
    product_id: int
    inventory_id: int
    usage_amount: float = Field(ge=0, description="The usage amount of the product inventory, required.")

    model_config = ConfigDict(
        from_attributes=True,
        json_schema_extra={
            "example": {
                "product_id": 1,
                "inventory_id": 1,
                "usage_amount": 100,
            }
        })


# business schema
class SalesSchema(BaseModel):
    business_id: int
    item: str = Field(min_length=1, max_length=50,
                      description="The name of the itme, required.")
    quantity: int
    price: float = Field(gt=0)

    model_config = ConfigDict(
        from_attributes=True,
        json_schema_extra={
            "example": {
                "business_id": 1,
                "item": "Grill",
                "quantity": 12,
                "price": 320,
            }
        })

#order schema
class PurchaseOrderSchema(BaseModel):
    name: str = Field(min_length=1, max_length=50,
                      description="The name of the itme, required.")
    number: int = Field(ge=0, description="The number of the inventory, required.")
    size: int = Field(ge=0, description="The size of the inventory, required.")
    total_amount: float = Field(ge=0, description="The total amount of the order, required.")
    date_created: datetime = Field(default=datetime.now())
    # status: str = Field(min_length=1, max_length=50,
                        # description="The status of the order, required.")
    time_of_delivery_days: int = Field(gt=0, description="The time of delivery days of the order, required.")
    price_per_unit: float = Field(ge=0, description="The price per unit of the order, required.")
    description: str = Field(description="A description of the order, optional.")
    threshold: float = Field(default=0.3, ge=0, lt=1, description="The threshold of the inventory, required.")
    delivery_status: bool 
    maximum_amount: float = Field(default=1000000, ge=0, description="The maximum amount of the inventory, required.")
    item_type: str = Field(min_length=1, max_length=100, description="The item type of the inventory.")
    business_id: int
    supplier_id: int
    unit_id: int

    model_config = ConfigDict(
        from_attributes=True,
        json_schema_extra={
            "example": {
                "name": "Absolut Vodka",
                "number": 100,
                "size": 100,
                "item_type": "bottle",
                "total_amount": 10000,
                "price_per_unit": 149.5,
                "time_of_delivery_days": 2,
                "description": "Bottle of vodka.",
                "date_created": "2024-01-01",
                # "status": "pending",
                "business_id": 1,
                "supplier_id": 1,
                "unit_id": 1
            }
        })


class NewPasswordSchema(BaseModel):
    token: str
    new_password: str
