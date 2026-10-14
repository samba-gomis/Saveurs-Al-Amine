import { getBlobStore, readJSON, loadMenu, isAuthorized, readBody, json, formatEuro } from "../lib/shared.mjs";

const STATUSES = ["nouvelle", "en cours", "traitee"];
const LEGACY_KEY = "all";
const ORDER_ID = /^cmd-[a-z0-9-]+$/;

function text(value, max) {
  return String(value ?? "").trim().slice(0, max);
}

function isValidPhone(tel) {
  const digits = tel.replace(/\D/g, "");
  return digits.length >= 9 && digits.length <= 15;
}

// Les prix viennent du menu enregistré, jamais du navigateur : un panier gardé depuis
// plusieurs jours (ou modifié à la main) ne peut pas imposer un prix ou un plat retiré.
async function priceItems(lines) {
  if (!Array.isArray(lines) || lines.length === 0) return { error: "La commande est vide." };
  if (lines.length > 50) return { error: "Trop d'articles dans la commande." };
  const menu = await loadMenu();
  const items = [];
  let total = 0;
  for (const line of lines) {
    const item = menu.find((i) => i.id === line.id);
    if (!item || !item.available) {
      const name = item ? item.name : text(line.name, 80) || "Un article";
      return { error: `« ${name} » n'est plus disponible. Retirez-le du panier puis réessayez.` };
    }
    const qty = Number(line.qty);
    if (!Number.isInteger(qty) || qty < 1 || qty > 99) return { error: "Quantité invalide." };
    items.push({ id: item.id, name: item.name, qty, price: item.price });
    total += item.price * qty;
  }
  return { items, total };
}

// Une commande = une clé. L'ancien tableau unique "all" était relu puis réécrit à chaque
// commande : deux envois simultanés s'écrasaient et l'une des commandes disparaissait.
async function migrateLegacyOrders(store) {
  const legacy = await readJSON(store, LEGACY_KEY);
  if (!Array.isArray(legacy)) return;
  await Promise.all(legacy.map((o) => store.setJSON(o.id, o)));
  await store.delete(LEGACY_KEY);
}

async function listOrders(store) {
  await migrateLegacyOrders(store);
  const { blobs } = await store.list();
  const orders = await Promise.all(
    blobs.filter((b) => b.key !== LEGACY_KEY).map((b) => readJSON(store, b.key))
  );
  return orders.filter(Boolean).sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

export default async (req) => {
  const store = getBlobStore("orders");

  if (req.method === "POST") {
    const data = await readBody(req);
    if (!data) return json({ error: "Requête invalide." }, 400);

    const order = {
      id: "cmd-" + Date.now() + "-" + Math.random().toString(36).slice(2, 8),
      createdAt: new Date().toISOString(),
      status: "nouvelle",
      type: data.type === "evenement" ? "evenement" : "commande",
      nom: text(data.nom, 80),
      prenom: text(data.prenom, 80),
      telephone: text(data.telephone, 30),
      mode: "",
      adresse: "",
      items: [],
      total: "",
      notes: text(data.notes, 1000),
      eventType: "",
      eventDate: "",
      eventGuests: ""
    };

    if (!order.nom || !isValidPhone(order.telephone)) {
      return json({ error: "Nom et numéro de téléphone valide requis." }, 400);
    }
    if (order.type === "evenement") {
      order.eventType = text(data.eventType, 50);
      order.eventDate = text(data.eventDate, 10);
      order.eventGuests = text(data.eventGuests, 6);
      if (!order.eventType || !/^\d{4}-\d{2}-\d{2}$/.test(order.eventDate)) {
        return json({ error: "Type et date de l'événement requis." }, 400);
      }
    } else {
      order.mode = ["retrait", "livraison"].includes(data.mode) ? data.mode : "";
      order.adresse = order.mode === "livraison" ? text(data.adresse, 300) : "";
      if (!order.mode || (order.mode === "livraison" && !order.adresse)) {
        return json({ error: "Mode de récupération (et adresse si livraison) requis." }, 400);
      }
      const priced = await priceItems(data.items);
      if (priced.error) return json({ error: priced.error }, 400);
      order.items = priced.items;
      order.total = formatEuro(priced.total);
    }

    await store.setJSON(order.id, order);
    return json({ ok: true, id: order.id, total: order.total });
  }

  if (!isAuthorized(req)) {
    return json({ error: "Mot de passe admin invalide." }, 401);
  }

  if (req.method === "GET") {
    return json(await listOrders(store));
  }

  if (req.method === "PATCH") {
    const data = await readBody(req);
    if (!data || !ORDER_ID.test(data.id || "") || !STATUSES.includes(data.status)) {
      return json({ error: "Requête invalide." }, 400);
    }
    const order = await readJSON(store, data.id);
    if (!order) return json({ error: "Commande introuvable." }, 404);
    order.status = data.status;
    await store.setJSON(order.id, order);
    return json(order);
  }

  if (req.method === "DELETE") {
    const id = new URL(req.url).searchParams.get("id") || "";
    if (!ORDER_ID.test(id)) return json({ error: "Requête invalide." }, 400);
    await store.delete(id);
    return json({ ok: true });
  }

  return json({ error: "Méthode non supportée." }, 405);
};
