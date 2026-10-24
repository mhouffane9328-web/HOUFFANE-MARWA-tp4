import { getFilteredOrders, calculateTotalRevenue } from "./selectors.js";

export function render(state) {
  renderIndicators(state);
  renderOrdersTable(state);
}

function renderIndicators(state) {
  const setElText = (id, text) => {
    const el = document.getElementById(id);
    if (el) el.textContent = text;
  };

  const totalOrders = state.orders?.length || 0;
  setElText("totalOrders", totalOrders);
  
  const deliveredCount = state.orders?.filter(o => o.status === "Livrée" || o.status === "Livree").length || 0;
  setElText("deliveredOrders", deliveredCount);
  setElText("paidOrders", totalOrders);
  
  const totalRevenue = calculateTotalRevenue(state.orders || [], state.customers || [], state.products || []);
  setElText("totalAmount", `${totalRevenue} DH`);
}

function renderOrdersTable(state) {
  const tbody = document.getElementById("ordersTableBody");
  if (!tbody) return;

  const filteredOrders = getFilteredOrders(state) || [];
  tbody.innerHTML = "";

  if (filteredOrders.length === 0) {
    tbody.innerHTML = `<tr><td colspan="7" class="text-center py-3">Aucune commande trouvée.</td></tr>`;
    return;
  }

  filteredOrders.forEach(order => {
    const tr = document.createElement("tr");
    
    let badgeClass = "bg-secondary";
    if (order.status === "Livrée" || order.status === "Livree") badgeClass = "bg-success";
    if (order.status === "En attente") badgeClass = "bg-warning text-dark";
    if (order.status === "Annulee") badgeClass = "bg-danger";

    tr.innerHTML = `
      <td>#${order.id}</td>
      <td>${order.customerName}</td>
      <td><strong>${order.total} DH</strong></td>
      <td><span class="badge ${badgeClass}">${order.status}</span></td>
      <td>Payé</td>
      <td>${order.date}</td>
      <td>
        <button class="btn btn-sm btn-outline-primary view-details-btn" data-id="${order.id}">
          <i class="bi bi-eye"></i> Détail
        </button>
      </td>
    `;
    tbody.appendChild(tr);
  });
}

export function showOrderModal(order) {
  const setElText = (id, text) => {
    const el = document.getElementById(id);
    if (el) el.textContent = text;
  };

  setElText("modalClient", order.customerName);
  setElText("modalAmount", `${order.total} DH`);
  setElText("modalStatus", order.status);
  setElText("modalPayment", "Payé");
  setElText("modalDate", order.date);

  const descEl = document.getElementById("modalDescription");
  if (descEl && order.itemsWithDetails) {
    let descriptionHTML = "<ul class='mb-0'>";
    order.itemsWithDetails.forEach(item => {
      descriptionHTML += `<li>${item.quantity}x ${item.productName} (${item.category}) - ${item.lineTotal} DH</li>`;
    });
    descriptionHTML += "</ul>";
    descEl.innerHTML = descriptionHTML;
  }

  const modalElement = document.getElementById("orderModal");
  if (modalElement && typeof bootstrap !== 'undefined') {
    const modal = new bootstrap.Modal(modalElement);
    modal.show();
  }
}

export function renderError(message) {
  const errorContainer = document.getElementById("errorMessage");
  if (errorContainer) {
    errorContainer.classList.remove("d-none");
    errorContainer.textContent = message;
  }
}