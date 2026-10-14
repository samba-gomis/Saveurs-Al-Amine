import { SEED_MENU, getBlobStore, readJSON, loadMenu, isAuthorized, readBody, json } from "../lib/shared.mjs";

const EDITABLE_FIELDS = ["category", "name", "description", "price", "priceLabel", "image", "available"];

function pickFields(data) {
  const fields = {};
  for (const key of EDITABLE_FIELDS) {
    if (data[key] !== undefined) fields[key] = data[key];
  }
  if ("price" in fields) fields.price = Number(fields.price);
  if ("available" in fields) fields.available = fields.available !== false;
  return fields;
}

function isValidPrice(price) {
  return Number.isFinite(price) && price >= 0;
}

export default async (req) => {
  const store = getBlobStore("menu");

  if (req.method === "GET") {
    let items = await readJSON(store, "items");
    if (!items) {
      items = SEED_MENU;
      await store.setJSON("items", items);
    }
    return json(items);
  }

  if (!isAuthorized(req)) {
    return json({ error: "Mot de passe admin invalide." }, 401);
  }

  let items = await loadMenu();

  if (req.method === "POST") {
    const data = await readBody(req);
    if (!data) return json({ error: "Requête invalide." }, 400);
    const fields = pickFields(data);
    if (!fields.name || !fields.category || !isValidPrice(fields.price)) {
      return json({ error: "Nom, catégorie et prix requis." }, 400);
    }
    const newItem = {
      id: "item-" + Date.now() + "-" + Math.random().toString(36).slice(2, 8),
      category: fields.category,
      name: fields.name,
      description: fields.description || "",
      price: fields.price,
      priceLabel: fields.priceLabel || "",
      image: fields.image || "",
      available: fields.available !== false
    };
    items.push(newItem);
    await store.setJSON("items", items);
    return json(newItem);
  }

  if (req.method === "PUT") {
    const data = await readBody(req);
    if (!data) return json({ error: "Requête invalide." }, 400);
    const idx = items.findIndex((i) => i.id === data.id);
    if (idx === -1) return json({ error: "Article introuvable." }, 404);
    const fields = pickFields(data);
    if ("price" in fields && !isValidPrice(fields.price)) {
      return json({ error: "Prix invalide." }, 400);
    }
    items[idx] = { ...items[idx], ...fields };
    await store.setJSON("items", items);
    return json(items[idx]);
  }

  if (req.method === "DELETE") {
    const id = new URL(req.url).searchParams.get("id");
    const remaining = items.filter((i) => i.id !== id);
    if (remaining.length === items.length) return json({ error: "Article introuvable." }, 404);
    await store.setJSON("items", remaining);
    return json({ ok: true });
  }

  return json({ error: "Méthode non supportée." }, 405);
};
