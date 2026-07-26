const { getStore } = require("@netlify/blobs");

function getBlobStore(name) {
  const siteID = process.env.BLOBS_SITE_ID;
  const token = process.env.BLOBS_TOKEN;
  if (siteID && token) {
    return getStore({ name, siteID, token });
  }
  return getStore(name);
}

function isAuthorized(event) {
  const provided = event.headers["x-admin-password"] || event.headers["X-Admin-Password"];
  const expected = process.env.ADMIN_PASSWORD;
  return Boolean(expected) && provided === expected;
}

exports.handler = async (event) => {
  const store = getBlobStore("orders");
  const headers = { "Content-Type": "application/json" };

  if (event.httpMethod === "POST") {
    const data = JSON.parse(event.body || "{}");

    if (!data.nom || !data.telephone) {
      return { statusCode: 400, headers, body: JSON.stringify({ error: "Nom et téléphone requis." }) };
    }
    if (data.type === "evenement") {
      if (!data.eventType || !data.eventDate) {
        return { statusCode: 400, headers, body: JSON.stringify({ error: "Type et date de l'événement requis." }) };
      }
    } else {
      if (!data.mode || (data.mode === "livraison" && !data.adresse)) {
        return { statusCode: 400, headers, body: JSON.stringify({ error: "Mode de récupération (et adresse si livraison) requis." }) };
      }
      if (!Array.isArray(data.items) || data.items.length === 0) {
        return { statusCode: 400, headers, body: JSON.stringify({ error: "La commande est vide." }) };
      }
    }

    const orders = (await store.get("all", { type: "json" })) || [];
    const order = {
      id: "cmd-" + Date.now() + "-" + Math.random().toString(36).slice(2, 8),
      createdAt: new Date().toISOString(),
      status: "nouvelle",
      type: data.type === "evenement" ? "evenement" : "commande",
      nom: data.nom,
      prenom: data.prenom || "",
      telephone: data.telephone,
      mode: data.mode || "",
      adresse: data.adresse || "",
      items: data.items || [],
      total: data.total || "",
      notes: data.notes || "",
      eventType: data.eventType || "",
      eventDate: data.eventDate || "",
      eventGuests: data.eventGuests || ""
    };
    orders.unshift(order);
    await store.setJSON("all", orders);
    return { statusCode: 200, headers, body: JSON.stringify({ ok: true, id: order.id }) };
  }

  if (!isAuthorized(event)) {
    return { statusCode: 401, headers, body: JSON.stringify({ error: "Mot de passe admin invalide." }) };
  }

  if (event.httpMethod === "GET") {
    const orders = (await store.get("all", { type: "json" })) || [];
    return { statusCode: 200, headers, body: JSON.stringify(orders) };
  }

  if (event.httpMethod === "PATCH") {
    const data = JSON.parse(event.body || "{}");
    const orders = (await store.get("all", { type: "json" })) || [];
    const idx = orders.findIndex((o) => o.id === data.id);
    if (idx === -1) return { statusCode: 404, headers, body: JSON.stringify({ error: "Commande introuvable." }) };
    orders[idx].status = data.status || orders[idx].status;
    await store.setJSON("all", orders);
    return { statusCode: 200, headers, body: JSON.stringify(orders[idx]) };
  }

  if (event.httpMethod === "DELETE") {
    const id = event.queryStringParameters && event.queryStringParameters.id;
    let orders = (await store.get("all", { type: "json" })) || [];
    orders = orders.filter((o) => o.id !== id);
    await store.setJSON("all", orders);
    return { statusCode: 200, headers, body: JSON.stringify({ ok: true }) };
  }

  return { statusCode: 405, headers, body: JSON.stringify({ error: "Méthode non supportée." }) };
};
