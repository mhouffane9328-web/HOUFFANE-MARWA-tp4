// Retrouver un client grâce à son identifiant (find)
export function getCustomerById(customers, customerId) {
  return customers.find(c => c.id === customerId);
}

// Retrouver un produit grâce à son identifiant (find)
export function getProductById(products, productId) {
  return products.find(p => p.id === productId);
}

// Calculer les détails d'une commande (prix de ligne, total...) en reliant les entités (map)
export function calculateOrderDetails(order, customers, products) {
  const customer = getCustomerById(customers, order.customerId);
  
  let total = 0;
  const itemsWithDetails = order.items.map(item => {
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

// Filtrer et rechercher les commandes selon les critères (filter, map)
export function getFilteredOrders(state) {
  return state.orders
    .map(order => calculateOrderDetails(order, state.customers, state.products))
    .filter(order => {
      // 1. Recherche par nom de client
      const matchesSearch = order.customerName.toLowerCase().includes(state.searchQuery.toLowerCase());
      
      // 2. Filtre par statut
      const matchesStatus = state.selectedStatus === "All" || order.status === state.selectedStatus;
      
      // 3. Filtre par catégorie de produit
      const matchesCategory = state.selectedCategory === "All" || order.itemsWithDetails.some(item => item.category === state.selectedCategory);

      return matchesSearch && matchesStatus && matchesCategory;
    });
}

// Calculer le montant cumulé total de toutes les commandes (forEach)
export function calculateTotalRevenue(orders, customers, products) {
  let grandTotal = 0;
  orders.forEach(order => {
    const details = calculateOrderDetails(order, customers, products);
    grandTotal += details.total;
  });
  return grandTotal;
}
```[cite: 3, 4, 5]