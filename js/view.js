import { getFilteredOrders, calculateTotalRevenue } from "./selectors.js";

// Rendu principal de l'application
export function render(state) {
  renderIndicators(state);
  renderOrdersTable(state);
}

// Affichage des indicateurs dynamiques (clients, produits, commandes, chiffre d'affaires)
function renderIndicators(state) {
  document.getElementById("total-customers").textContent = state.customers.length;
  document.getElementById("total-products").textContent = state.products.length;
  document.getElementById("total-orders").textContent = state.orders.length;
  
  const totalRevenue = calculateTotalRevenue(state.orders, state.customers, state.products);
  document.getElementById("total-revenue").textContent = `${totalRevenue} MAD`;
}

// Affichage du tableau des commandes dans le DOM
function renderOrdersTable(state) {
  const tbody = document.getElementById("orders-table-body");
  const filteredOrders = getFilteredOrders(state);
  
  tbody.innerHTML = "";

  if (filteredOrders.length === 0) {
    tbody.innerHTML = `<tr><td colspan="6" class="text-center py-3">Aucune commande trouvée.</td></tr>`;
    return;
  }

  filteredOrders.forEach(order => {
    const tr = document.createElement("tr");
    
    let badgeClass = "bg-secondary";
    if (order.status === "Livree") badgeClass = "bg-success";
    if (order.status === "En attente") badgeClass = "bg-warning text-dark";
    if (order.status === "Annulee") badgeClass = "bg-danger";

    tr.innerHTML = `
      <td>#${order.id}</td>
      <td>${order.customerName}</td>
      <td>${order.date}</td>
      <td><span class="badge ${badgeClass}">${order.status}</span></td>
      <td><strong>${order.total} MAD</strong></td>
      <td>
        <button class="btn btn-sm btn-info text-white view-details-btn" data-id="${order.id}">
          <i class="bi bi-eye"></i> Détail
        </button>
      </td>
    `;
    tbody.appendChild(tr);
  });
}

// Affichage du modal Bootstrap contenant les détails complets d'une commande
export function showOrderModal(order) {
  document.getElementById("modal-order-id").textContent = order.id;
  document.getElementById("modal-customer-name").textContent = order.customerName;
  document.getElementById("modal-customer-city").textContent = order.customerCity;
  document.getElementById("modal-order-date").textContent = order.date;
  document.getElementById("modal-order-status").textContent = order.status;
  document.getElementById("modal-order-total").textContent = `${order.total} MAD`;

  const itemsTbody = document.getElementById("modal-order-items");
  itemsTbody.innerHTML = "";

  order.itemsWithDetails.forEach(item => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${item.productName} (${item.category})</td>
      <td>${item.price} MAD</td>
      <td>${item.quantity}</td>
      <td><strong>${item.lineTotal} MAD</strong></td>
    `;
    itemsTbody.appendChild(tr);
  });

  const modalElement = document.getElementById("orderDetailModal");
  const modal = new bootstrap.Modal(modalElement);
  modal.show();
}

// Affichage des erreurs de chargement dans l'interface
export function renderError(message) {
  const errorContainer = document.getElementById("error-container");
  errorContainer.classList.remove("d-none");
  errorContainer.textContent = message;
}
```[cite: 3, 4, 6]