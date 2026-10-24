import { state } from "./state.js";
import { loadAllData } from "./dataService.js";
import { calculateOrderDetails } from "./selectors.js";
import { render, showOrderModal, renderError } from "./view.js";

async function init() {
  try {
    const data = await loadAllData();
    state.customers = data.customers;
    state.products = data.products;
    state.orders = data.orders;

    attachEventListeners();
    render(state);
  } catch (error) {
    console.error("Erreur lors de l'initialisation :", error);
    renderError("Erreur de chargement des données. Veuillez vérifier la console.");
  }
}

function attachEventListeners() {
  const searchInput = document.getElementById("searchInput");
  if (searchInput) {
    searchInput.addEventListener("input", (e) => {
      state.searchQuery = e.target.value;
      render(state);
    });
  }

  const tableBody = document.getElementById("ordersTableBody");
  if (tableBody) {
    tableBody.addEventListener("click", (e) => {
      const btn = e.target.closest(".view-details-btn");
      if (btn) {
        const orderId = parseInt(btn.getAttribute("data-id"));
        const order = state.orders.find(o => o.id === orderId);
        if (order) {
          const fullDetails = calculateOrderDetails(order, state.customers, state.products);
          showOrderModal(fullDetails);
        }
      }
    });
  }
}

init();