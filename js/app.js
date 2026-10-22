import { state } from "./state.js";
import { loadAllData } from "./dataService.js";
import { calculateOrderDetails } from "./selectors.js";
import { render, showOrderModal, renderError } from "./view.js";

// Fonction d'initialisation de l'application
async function init() {
  try {
    // 1. Chargement des données et mise à jour de l'état (state)
    const data = await loadAllData();
    state.customers = data.customers;
    state.products = data.products;
    state.orders = data.orders;

    // 2. Remplir dynamiquement le filtre des catégories de produits
    populateCategoryFilter();

    // 3. Attacher les écouteurs d'événements pour les interactions utilisateur
    attachEventListeners();

    // 4. Premier rendu complet de l'interface après le chargement
    render(state);
  } catch (error) {
    renderError("Erreur de chargement des données. Veuillez vérifier la console et les chemins des fichiers JSON.");
  }
}

// Remplir la liste déroulante des catégories à partir des produits
function populateCategoryFilter() {
  const categorySelect = document.getElementById("category-filter");
  const categories = [...new Set(state.products.map(p => p.category))];
  
  categories.forEach(cat => {
    const option = document.createElement("option");
    option.value = cat;
    option.textContent = cat;
    categorySelect.appendChild(option);
  });
}

// Gestion des écouteurs d'événements (Recherche, Filtres, Boutons de détail)
function attachEventListeners() {
  // Recherche par nom de client
  document.getElementById("search-input").addEventListener("input", (e) => {
    state.searchQuery = e.target.value;
    render(state);
  });

  // Filtre par statut de commande
  document.getElementById("status-filter").addEventListener("change", (e) => {
    state.selectedStatus = e.target.value;
    render(state);
  });

  // Filtre par catégorie de produit
  document.getElementById("category-filter").addEventListener("change", (e) => {
    state.selectedCategory = e.target.value;
    render(state);
  });

  // Écouteur pour afficher les détails d'une commande via le bouton du tableau
  document.getElementById("orders-table-body").addEventListener("click", (e) => {
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

// Lancement de l'application au chargement complet du DOM
document.addEventListener("DOMContentLoaded", init);
```[cite: 3, 4, 6]