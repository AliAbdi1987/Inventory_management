import csv
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session
from app.database.models import Sale, Product, ProductInventory, Inventory



def process_and_insert_sales_csv_data(db: Session, csv_file_name: str, business_id: int):
    products = db.query(Product).filter(Product.business_id == business_id).all()
    product_name_business_id_set = {(product.name, product.business_id) for product in products}
    
    error_items = []
    valid_sales = []  # Collect valid sales information for inventory update

    with open(csv_file_name, newline='') as csvfile:
        reader = csv.DictReader(csvfile)
        for row in reader:
            row = {k: v for k, v in row.items() if k != ''}
            item_name = row.get('item')
            
            product_check = (item_name, business_id)

            if product_check not in product_name_business_id_set:
                error_items.append(item_name)
                continue
            
            try:
                row['business_id'] = business_id
                sales = Sale(**row)
                db.add(sales)
                db.commit()
                valid_sales.append(row)  # Add this row to valid sales
            except IntegrityError as e:
                db.rollback()
            except Exception as e:
                db.rollback()

    return valid_sales, error_items  # Return valid sales for inventory update and error items


def update_inventory_after_sales(valid_sales: list, db: Session):
    inventory_usage = {}
    for sale in valid_sales:
        product = db.query(Product).filter(Product.name == sale['item'], Product.business_id == sale['business_id']).first()
        if not product:
            continue
        product_inventories = db.query(ProductInventory).filter(ProductInventory.product_id == product.id).all()

        for product_inventory in product_inventories:
            # Ensure 'quantity' is correctly keyed in valid_sales
            # Convert to float (or int) before multiplication
            try:
                quantity = float(sale['quantity'])  # Assuming quantity can be a decimal
                usage_amount = float(product_inventory.usage_amount)
                total_usage = quantity * usage_amount
            except ValueError:
                # Handle the case where conversion is not possible
                # This could log an error or handle it as needed for your application
                continue

            if product_inventory.inventory_id not in inventory_usage:
                inventory_usage[product_inventory.inventory_id] = total_usage
            else:
                inventory_usage[product_inventory.inventory_id] += total_usage

    # Update inventory
    for inventory_id, usage_amount in inventory_usage.items():
        inventory = db.query(Inventory).filter(Inventory.id == inventory_id).first()
        if inventory:
            inventory.total_amount -= usage_amount
            db.commit()

    return "Inventory updated successfully"

