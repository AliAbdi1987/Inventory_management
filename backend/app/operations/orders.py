import csv
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session
from app.database.models import PurchaseOrder, Product, Inventory

# from app.db_setup import get_db


def process_and_insert_orders_csv_data(db: Session, csv_file_name: str, business_id: int):
    """
    This Function takes a csv file and inserts it into the sale table!
    """
    with open(csv_file_name, newline='') as csvfile:
        reader = csv.DictReader(csvfile)
        for row in reader:
            # Remove keys with empty names
            row = {k: v for k, v in row.items() if k != ''}
            try:
                size = int(row['size'])
                number = int(row['number'])
                total_amount = size * number
                row['total_amount'] = total_amount
                row['business_id'] = business_id

                orders = PurchaseOrder(**row)
                db.add(orders)
                db.commit()
            except IntegrityError as e:
                db.rollback()
                return False, "IntegrityError: Failed to insert data into database"
            except Exception as e:
                db.rollback()
                return False, f"Exception: {e} - Failed to insert data into database"
    return True, "Data inserted successfully"


def update_inventory_after_orders(business_id: int, db: Session):
    """
    This Function updates the inventory after orders has been added to the purchased_orders table!
    """
    try:
        orders = db.query(PurchaseOrder).filter(PurchaseOrder.business_id == business_id).all()

        inventory_updates = {}
        for order in orders:
            inventory_item = db.query(Inventory).filter(Inventory.name == order.name, Inventory.business_id == business_id).first()
            if inventory_item:
                inventory_item.total_amount += order.total_amount

        db.commit()
        return "Inventory updated successfully"
    except Exception as e:
        db.rollback()
        return False, f"Exception: {e} - Failed to update inventory"


# db = next(get_db())
# business_id = 1
#
# try:
#     update_inventory_after_orders(business_id=business_id, db=db)
# finally:
#     db.close()
