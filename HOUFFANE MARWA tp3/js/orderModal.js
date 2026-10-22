const modalElement = document.querySelector("#orderModal");
const modalTitle = document.querySelector("#modalTitle");
const modalClient = document.querySelector("#modalClient");
const modalAmount = document.querySelector("#modalAmount");
const modalStatus = document.querySelector("#modalStatus");
const modalPayment = document.querySelector("#modalPayment");
const modalDate = document.querySelector("#modalDate");
const modalDescription = document.querySelector("#modalDescription");

const orderModal = new bootstrap.Modal(modalElement);

export const openOrderModal = (order) => {
    if (!modalElement) return;

    modalTitle.textContent = `Commande #${order.id}`;
    modalClient.textContent = order.client;
    modalAmount.textContent = `${order.amount} DH`;
    modalStatus.textContent = order.status;
    modalPayment.textContent = order.paid ? "Payée" : "Non payée";
    modalDate.textContent = order.date;
    modalDescription.textContent = order.description;

    orderModal.show();
};