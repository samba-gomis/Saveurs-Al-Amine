const API = {
  menu: "/.netlify/functions/menu",
  orders: "/.netlify/functions/orders"
};

function adminHeaders() {
  const pwd = sessionStorage.getItem("sa_admin_pwd") || "";
  return { "Content-Type": "application/json", "x-admin-password": pwd };
}

// À utiliser pour toute donnée insérée via innerHTML : les champs saisis par les
// clients (nom, notes, adresse...) ne doivent jamais être interprétés comme du HTML.
function escapeHtml(value) {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

async function readJsonResponse(res, fallbackError) {
  let data = null;
  try {
    data = await res.json();
  } catch (e) {
    // Réponse non JSON (page d'erreur Netlify, coupure réseau...)
  }
  if (!res.ok) throw new Error((data && data.error) || fallbackError);
  return data;
}

async function fetchMenu() {
  const res = await fetch(API.menu);
  return readJsonResponse(res, "Impossible de charger le menu.");
}

async function submitOrder(payload) {
  const res = await fetch(API.orders, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  });
  return readJsonResponse(res, "Erreur lors de l'envoi. Merci de réessayer ou de nous appeler.");
}
