import { createHash, timingSafeEqual } from "node:crypto";
import { getStore } from "@netlify/blobs";

export const SEED_MENU = [
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
  { id: "box-min", category: "Box & plateaux", name: "Box Al Amine - Min", description: "5 nems ou 6 fatayas ou 15 akaras.", price: 5, priceLabel: "5€", image: "/images/flyer-box-plateau.jpg", available: true },
  { id: "box-max", category: "Box & plateaux", name: "Box Al Amine - Max", description: "10 nems ou 12 fatayas ou 30 akaras.", price: 10, priceLabel: "10€", image: "/images/flyer-box-plateau.jpg", available: true },
  { id: "plateau-l", category: "Box & plateaux", name: "Plateau Al Amine L (16 pièces)", description: "4 fatayas + 4 nems + 8 akaras, ou 8 fatayas + 8 akaras.", price: 9, priceLabel: "9€", image: "/images/flyer-box-plateau.jpg", available: true },
  { id: "plateau-xl", category: "Box & plateaux", name: "Plateau Al Amine XL (22 pièces)", description: "6 fatayas + 6 nems + 10 akaras, ou 11 fatayas + 11 akaras.", price: 13.5, priceLabel: "13,5€", image: "/images/flyer-box-plateau.jpg", available: true },

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

// Sur Netlify, le format de fonction moderne (export default) reçoit automatiquement
// les accès Blobs. BLOBS_SITE_ID / BLOBS_TOKEN restent possibles pour forcer un accès manuel.
export function getBlobStore(name) {
  const siteID = process.env.BLOBS_SITE_ID;
  const token = process.env.BLOBS_TOKEN;
  if (siteID && token) {
    return getStore({ name, siteID, token });
  }
  return getStore(name);
}

// Par défaut une lecture peut renvoyer une valeur vieille de 60 s : relire juste après
// une écriture puis réécrire ferait perdre la modification. On lit donc en cohérence forte.
export async function readJSON(store, key) {
  try {
    return await store.get(key, { type: "json", consistency: "strong" });
  } catch (err) {
    if (err.name !== "BlobsConsistencyError") throw err;
    return store.get(key, { type: "json" });
  }
}

export async function loadMenu() {
  return (await readJSON(getBlobStore("menu"), "items")) || structuredClone(SEED_MENU);
}

export function isAuthorized(req) {
  const expected = process.env.ADMIN_PASSWORD;
  if (!expected) return false;
  const provided = req.headers.get("x-admin-password") || "";
  const hash = (s) => createHash("sha256").update(s).digest();
  return timingSafeEqual(hash(provided), hash(expected));
}

export async function readBody(req) {
  try {
    const data = await req.json();
    return data && typeof data === "object" ? data : null;
  } catch {
    return null;
  }
}

export function json(body, status = 200) {
  return Response.json(body, { status });
}

export function formatEuro(n) {
  return n.toLocaleString("fr-FR", { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + " €";
}
