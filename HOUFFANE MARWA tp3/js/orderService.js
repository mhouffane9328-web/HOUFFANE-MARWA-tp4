export const fetchOrders = async () => {
    const response = await fetch("data/orders.json");

    if (!response.ok) {
        throw new Error("Impossible de charger les commandes.");
    }

    const orders = await response.json();
    return orders;
};