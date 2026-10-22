const ordersTableBody = document.querySelector("#ordersTableBody");
const resultCount = document.querySelector("#resultCount");
const totalOrders = document.querySelector("#totalOrders");
const deliveredOrders = document.querySelector("#deliveredOrders");
const paidOrders = document.querySelector("#paidOrders");
const totalAmount = document.querySelector("#totalAmount");

const getStatusClass = (status) => {
    if (status === "Livrée") return "badge bg-success";
    if (status === "En attente") return "badge bg-warning text-dark";
    return "badge bg-danger";
};

const createOrderRow = (order) => {
    const paymentText = order.paid ? "Payée" : "Non payée";
    const paymentClass = order.paid ? "text-success fw-bold" : "text-danger";

    return `
        <tr>
            <td>#${order.id}</td>
            <td>${order.client}</td>
            <td>${order.amount} DH</td>
            <td><span class="${getStatusClass(order.status)}">${order.status}</span></td>
            <td class="${paymentClass}">${paymentText}</td>
            <td>${order.date}</td>
            <td>
                <button class="btn btn-sm btn-outline-dark details-btn" data-id="${order.id}">
                    Voir
                </button>
            </td>
        </tr>
    `;
};

export const renderOrders = (orders) => {
    if (resultCount) {
        resultCount.textContent = `${orders.length} commande(s) affichée(s)`;
    }

    if (!ordersTableBody) return;

    if (orders.length === 0) {
        ordersTableBody.innerHTML = `
            <tr>
                <td colspan="7" class="text-center text-muted py-4">
                    Aucune commande trouvée.
                </td>
            </tr>
        `;
        return;
    }

    ordersTableBody.innerHTML = orders.map(createOrderRow).join("");
};

export const renderStats = (orders) => {
    if (totalOrders) totalOrders.textContent = orders.length;

    const delivered = orders.filter(order => order.status === "Livrée");
    if (deliveredOrders) deliveredOrders.textContent = delivered.length;

    const paid = orders.filter(order => order.paid);
    if (paidOrders) paidOrders.textContent = paid.length;

    let amount = 0;
    orders.forEach(order => {
        amount += order.amount;
    });

    if (totalAmount) totalAmount.textContent = `${amount} DH`;
};