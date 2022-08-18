attributes = {
  auth: ['id', 'name', 'email'],
  inventory: ['id', 'sku', 'quantity', 'color', 'size', 'cost_cents', 'price_cents'],
  inventory_products: ['id', 'product_name'],
  orders: ['id', 'name', 'email', 'order_status', 'total_cents', 'transaction_id', 'shipper_name', 'tracking_number'],
  order_product_inventory: ['color', 'size'],
  order_products: ['id', 'product_name'],
}

module.exports = attributes
