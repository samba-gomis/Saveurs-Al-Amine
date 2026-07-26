const { getStore } = require("@netlify/blobs");

function getBlobStore(name) {
  const siteID = process.env.BLOBS_SITE_ID;
  const token = process.env.BLOBS_TOKEN;
  if (siteID && token) {
    return getStore({ name, siteID, token });
  }
  return getStore(name);
}

const SEED_MENU = [
  // Plats traditionnels
  { id: "plat-diaga", category: "Plats traditionnels", name: "Thiébou Diaga", description: "Riz au poisson, sauce tomate, légumes.", price: 10, priceLabel: "10€ la barquette", image: "/images/flyer-diaga-national.jpg", available: true },
  { id: "plat-yassa", category: "Plats traditionnels", name: "Yassa Lakeu Dieun", description: "Riz blanc, poisson braisé, oignons, sauce yassa.", price: 10, priceLabel: "10€ la barquette", image: "/images/flyer-diaga-yassa.jpg", available: true },
  { id: "plat-thiou", category: "Plats traditionnels", name: "Thiou", description: "Riz, viande/poisson et légumes mijotés.", price: 10, priceLabel: "10€ la barquette", image: "/images/flyer-thiou.jpg", available: true },
  { id: "plat-kandia", category: "Plats traditionnels", name: "Soupou Kandia", description: "Riz blanc et sauce gombo (kandia).", price: 10, priceLabel: "10€ la barquette", image: "/images/flyer-sauce-kandia-niebe.jpg", available: true },
  { id: "plat-niebe", category: "Plats traditionnels", name: "Thiébou Niébé", description: "Riz aux haricots niébé, viande mijotée.", price: 10, priceLabel: "10€ la barquette", image: "/images/flyer-sauce-kandia-niebe.jpg", available: true },
  { id: "plat-vermicelle", category: "Plats traditionnels", name: "Vermicelle Royal", description: "Vermicelle sauté, poulet et sauce d'accompagnement.", price: 10, priceLabel: "10€ (1 barquette) / 18€ (2 barquettes)", image: "/images/flyer-vermicelle.jpg", available: true },
  { id: "plat-yapeu", category: "Plats traditionnels", name: "Thiébou Yapeu Royal", description: "Riz royal, poulet, légumes et condiments.", price: 8, priceLabel: "8€ la barquette / 15€ les 2", image: "/images/flyer-yapeu-royal.jpg", available: true },
  { id: "plat-sauce-seule", category: "Plats traditionnels", name: "Sauce seule (sans riz)", description: "Sur commande, à partir de.", price: 15, priceLabel: "à partir de 15€ (sur commande)", image: "/images/flyer-sauce-kandia-niebe.jpg", available: true },

  // Grillades & sandwichs
  { id: "grill-junior", category: "Grillades & sandwichs", name: "Sandwich Junior", description: "1 brochette veau/foie d'agneau + frites ou crudités.", price: 5, priceLabel: "5€", image: "/images/flyer-brochettes.jpg", available: true },
  { id: "grill-senior", category: "Grillades & sandwichs", name: "Sandwich Sénior", description: "2 brochettes veau/foie d'agneau + frites ou crudités.", price: 7, priceLabel: "7€", image: "/images/flyer-brochettes.jpg", available: true },
  { id: "grill-assiette", category: "Grillades & sandwichs", name: "Assiette Gourmande", description: "2 brochettes, crudités + frites ou riz cantonnais.", price: 10, priceLabel: "10€", image: "/images/flyer-brochettes.jpg", available: true },

  // Box & plateaux (événements / grosses envies)
  { id: "box-min", category: "Box & plateaux", name: "Box Alamine - Min", description: "5 nems ou 6 fatayas ou 15 akaras.", price: 5, priceLabel: "5€", image: "/images/flyer-box-plateau.jpg", available: true },
  { id: "box-max", category: "Box & plateaux", name: "Box Alamine - Max", description: "10 nems ou 12 fatayas ou 30 akaras.", price: 10, priceLabel: "10€", image: "/images/flyer-box-plateau.jpg", available: true },
  { id: "plateau-l", category: "Box & plateaux", name: "Plateau Alamine L (16 pièces)", description: "4 fatayas + 4 nems + 8 akaras, ou 8 fatayas + 8 akaras.", price: 9, priceLabel: "9€", image: "/images/flyer-box-plateau.jpg", available: true },
  { id: "plateau-xl", category: "Box & plateaux", name: "Plateau Alamine XL (22 pièces)", description: "6 fatayas + 6 nems + 10 akaras, ou 11 fatayas + 11 akaras.", price: 13.5, priceLabel: "13,5€", image: "/images/flyer-box-plateau.jpg", available: true },

  // Beignets
  { id: "beignet-dougoub-10", category: "Beignets", name: "Beignets Dougoub (10 pièces)", description: "", price: 5, priceLabel: "5€", image: "/images/flyer-beignets.jpg", available: true },
  { id: "beignet-dougoub-20", category: "Beignets", name: "Beignets Dougoub (20 pièces)", description: "", price: 10, priceLabel: "10€", image: "/images/flyer-beignets.jpg", available: true },
  { id: "beignet-coco-8", category: "Beignets", name: "Beignets Coco (8 pièces)", description: "", price: 5, priceLabel: "5€", image: "/images/flyer-beignets.jpg", available: true },
  { id: "beignet-coco-17", category: "Beignets", name: "Beignets Coco (17 pièces)", description: "", price: 10, priceLabel: "10€", image: "/images/flyer-beignets.jpg", available: true },
  { id: "beignet-deureum-10", category: "Beignets", name: "Beignets Deureum (10 pièces)", description: "", price: 5, priceLabel: "5€", image: "/images/flyer-beignets.jpg", available: true },
  { id: "beignet-deureum-20", category: "Beignets", name: "Beignets Deureum (20 pièces)", description: "", price: 10, priceLabel: "10€", image: "/images/flyer-beignets.jpg", available: true },
  { id: "beignet-mariage-8", category: "Beignets", name: "Beignets Mariage (8 pièces)", description: "", price: 5, priceLabel: "5€", image: "/images/flyer-beignets.jpg", available: true },
  { id: "beignet-mariage-17", category: "Beignets", name: "Beignets Mariage (17 pièces)", description: "", price: 10, priceLabel: "10€", image: "/images/flyer-beignets.jpg", available: true },

  // Boissons
  { id: "jus-bissap-50", category: "Boissons", name: "Jus Bissap (500ml)", description: "100% fait maison.", price: 2.5, priceLabel: "2,5€", image: "/images/flyer-jus.jpg", available: true },
  { id: "jus-bissap-150", category: "Boissons", name: "Jus Bissap (1,5L)", description: "100% fait maison.", price: 6.5, priceLabel: "6,5€", image: "/images/flyer-jus.jpg", available: true },
  { id: "jus-bouye-50", category: "Boissons", name: "Bouye Fraise (500ml)", description: "", price: 3, priceLabel: "3€", image: "/images/flyer-jus.jpg", available: true },
  { id: "jus-bouye-150", category: "Boissons", name: "Bouye Fraise (1,5L)", description: "", price: 7, priceLabel: "7€", image: "/images/flyer-jus.jpg", available: true },
  { id: "jus-gingembre-50", category: "Boissons", name: "Gingembre citron menthe (500ml)", description: "", price: 2, priceLabel: "2€", image: "/images/flyer-jus.jpg", available: true },
  { id: "jus-gingembre-150", category: "Boissons", name: "Gingembre citron menthe (1,5L)", description: "", price: 6, priceLabel: "6€", image: "/images/flyer-jus.jpg", available: true }
];

function isAuthorized(event) {
  const provided = event.headers["x-admin-password"] || event.headers["X-Admin-Password"];
  const expected = process.env.ADMIN_PASSWORD;
  return Boolean(expected) && provided === expected;
}

exports.handler = async (event) => {
  const store = getBlobStore("menu");
  const headers = { "Content-Type": "application/json" };

  if (event.httpMethod === "GET") {
    let items = await store.get("items", { type: "json" });
    if (!items) {
      items = SEED_MENU;
      await store.setJSON("items", items);
    }
    return { statusCode: 200, headers, body: JSON.stringify(items) };
  }

  if (!isAuthorized(event)) {
    return { statusCode: 401, headers, body: JSON.stringify({ error: "Mot de passe admin invalide." }) };
  }

  let items = (await store.get("items", { type: "json" })) || SEED_MENU;

  if (event.httpMethod === "POST") {
    const data = JSON.parse(event.body || "{}");
    if (!data.name || !data.price || !data.category) {
      return { statusCode: 400, headers, body: JSON.stringify({ error: "Nom, catégorie et prix requis." }) };
    }
    const newItem = {
      id: "item-" + Date.now() + "-" + Math.random().toString(36).slice(2, 8),
      category: data.category,
      name: data.name,
      description: data.description || "",
      price: data.price,
      image: data.image || "",
      available: data.available !== false
    };
    items.push(newItem);
    await store.setJSON("items", items);
    return { statusCode: 200, headers, body: JSON.stringify(newItem) };
  }

  if (event.httpMethod === "PUT") {
    const data = JSON.parse(event.body || "{}");
    const idx = items.findIndex((i) => i.id === data.id);
    if (idx === -1) return { statusCode: 404, headers, body: JSON.stringify({ error: "Article introuvable." }) };
    items[idx] = { ...items[idx], ...data };
    await store.setJSON("items", items);
    return { statusCode: 200, headers, body: JSON.stringify(items[idx]) };
  }

  if (event.httpMethod === "DELETE") {
    const id = event.queryStringParameters && event.queryStringParameters.id;
    items = items.filter((i) => i.id !== id);
    await store.setJSON("items", items);
    return { statusCode: 200, headers, body: JSON.stringify({ ok: true }) };
  }

  return { statusCode: 405, headers, body: JSON.stringify({ error: "Méthode non supportée." }) };
};
