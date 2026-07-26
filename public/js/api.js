const API = {
  menu: "/.netlify/functions/menu",
  orders: "/.netlify/functions/orders"
};

function adminHeaders() {
  const pwd = sessionStorage.getItem("sa_admin_pwd") || "";
  return { "Content-Type": "application/json", "x-admin-password": pwd };
}

async function fetchMenu() {
  const res = await fetch(API.menu);
  if (!res.ok) throw new Error("Impossible de charger le menu.");
  return res.json();
}

async function submitOrder(payload) {
  const res = await fetch(API.orders, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Erreur lors de l'envoi.");
  return data;
}
