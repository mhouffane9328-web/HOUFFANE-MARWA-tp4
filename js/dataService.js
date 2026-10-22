export async function loadAllData() {
  try {
    const [customersRes, productsRes, ordersRes] = await Promise.all([
      fetch("data/customers.json"),
      fetch("data/products.json"),
      fetch("data/orders.json")
    ]);

    if (!customersRes.ok || !productsRes.ok || !ordersRes.ok) {
      throw new Error("Erreur lors du chargement des fichiers JSON.");
    }

    const customers = await customersRes.json();
    const products = await productsRes.json();
    const orders = await ordersRes.json();

    return { customers, products, orders };
  } catch (error) {
    console.error("Erreur de chargement:", error);
    throw error;
  }
}
```[cite: 4, 7]