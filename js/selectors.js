export function getCustomerById(customers, customerId) {
  return customers ? customers.find(c => c.id === customerId) : null;
}

export function getProductById(products, productId) {
  return products ? products.find(p => p.id === productId) : null;
}

export function calculateOrderDetails(order, customers, products) {
  const customer = getCustomerById(customers, order.customerId);
  
  let total = 0;
  const items = order.items || [];
  const itemsWithDetails = items.map(item => {
    const product = getProductById(products, item.productId);
    const price = product ? product.price : 0;
    const lineTotal = price * item.quantity;
    total += lineTotal;
    
    return {
      ...item,
      productName: product ? product.name : "Produit inconnu",
      category: product ? product.category : "N/A",
      price,
      lineTotal
    };
  });

  return {
    ...order,
    customerName: customer ? customer.name : "Client inconnu",
    customerCity: customer ? customer.city : "N/A",
    itemsWithDetails,
    total
  };
}

export function getFilteredOrders(state) {
  if (!state || !state.orders) return [];

  const searchQuery = (state.searchQuery || "").toLowerCase();
  const selectedStatus = state.selectedStatus || "All";
  const selectedCategory = state.selectedCategory || "All";

  return state.orders
    .map(order => calculateOrderDetails(order, state.customers, state.products))
    .filter(order => {
      const matchesSearch = order.customerName.toLowerCase().includes(searchQuery);
      const matchesStatus = selectedStatus === "All" || order.status === selectedStatus;
      const matchesCategory = selectedCategory === "All" || order.itemsWithDetails.some(item => item.category === selectedCategory);

      return matchesSearch && matchesStatus && matchesCategory;
    });
}

export function calculateTotalRevenue(orders, customers, products) {
  if (!orders) return 0;
  let grandTotal = 0;
  orders.forEach(order => {
    const details = calculateOrderDetails(order, customers, products);
    grandTotal += details.total;
  });
  return grandTotal;
}