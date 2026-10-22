import { state } from "./state.js";
import { fetchOrders } from "./orderService.js";
import { renderOrders, renderStats } from "./orderView.js";
import { openOrderModal } from "./orderModal.js";

const searchInput = document.querySelector("#searchInput");
const btnAll = document.querySelector("#btnAll");
const statusButtons = document.querySelectorAll(".status-btn");
const paidOnly = document.querySelector("#paidOnly");
const ordersTableBody = document.querySelector("#ordersTableBody");
const errorMessage = document.querySelector("#errorMessage");

const getVisibleOrders = () => {
    return state.orders.filter(order => {
        const matchesSearch = order.client.toLowerCase().includes(state.search.toLowerCase());
        const matchesStatus = state.status === "all" || order.status === state.status;
        const matchesPayment = !state.paidOnly || order.paid;

        return matchesSearch && matchesStatus && matchesPayment;
    });
};

const render = () => {
    const visibleOrders = getVisibleOrders();
    renderOrders(visibleOrders);
    renderStats(state.orders);
};

if (searchInput) {
    searchInput.addEventListener("input", event => {
        state.search = event.target.value.trim();
        render();
    });
}

if (btnAll) {
    btnAll.addEventListener("click", () => {
        state.status = "all";
        render();
    });
}

if (statusButtons) {
    statusButtons.forEach(button => {
        button.addEventListener("click", () => {
            state.status = button.dataset.status;
            render();
        });
    });
}

if (paidOnly) {
    paidOnly.addEventListener("change", event => {
        state.paidOnly = event.target.checked;
        render();
    });
}

if (ordersTableBody) {
    ordersTableBody.addEventListener("click", event => {
        const button = event.target.closest(".details-btn");
        if (!button) return;

        const orderId = Number(button.dataset.id);
        const order = state.orders.find(item => item.id === orderId);
        if (!order) return;

        openOrderModal(order);
    });
}

const init = async () => {
    try {
        const orders = await fetchOrders();
        state.orders = orders;
        render();
    } catch (error) {
        console.error(error);
        if (errorMessage) {
            errorMessage.classList.remove("d-none");
        }
    }
};

init();