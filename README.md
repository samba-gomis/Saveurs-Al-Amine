# Site Saveurs Alamiines

Site vitrine + commande en ligne pour Saveurs Alamiines (spécialités africaines, Marseille).

## Ce que fait le site

- Pages : Accueil, Menu, Commander, Événements (traiteur mariages/cérémonies), Galerie, Contact.
- Le **menu est dynamique** : il est géré depuis une page d'administration (`/admin`), pas besoin de toucher au code pour ajouter, modifier, mettre en rupture ou supprimer un plat.
- Les clients peuvent **composer leur commande** sur `/menu`, choisir **livraison à domicile ou retrait sur place**, et laisser leurs coordonnées (nom, prénom, téléphone).
- Toutes les commandes (et les demandes de devis événements) arrivent dans l'espace gérant `/admin`, avec le nombre de commandes, le mode choisi, les coordonnées client, et un export CSV.
- Aucune base de données externe à gérer : tout est stocké automatiquement par Netlify (Netlify Blobs), inclus gratuitement.

## Déployer sur Netlify (méthode recommandée)

Le site utilise des fonctions serveur (pour le menu et les commandes), donc il faut le déployer via **GitHub + Netlify**, pas par simple glisser-déposer du dossier.

### 1. Mettre le projet sur GitHub

1. Crée un compte sur [github.com](https://github.com) si tu n'en as pas.
2. Crée un nouveau dépôt (bouton "New repository"), par exemple `saveurs-alamiines`.
3. Depuis ce dossier, dans un terminal :
   ```
   git init
   git add .
   git commit -m "Site Saveurs Alamiines"
   git branch -M main
   git remote add origin https://github.com/TON-COMPTE/saveurs-alamiines.git
   git push -u origin main
   ```

### 2. Connecter le dépôt à Netlify

1. Va sur [app.netlify.com](https://app.netlify.com) et crée un compte (gratuit).
2. Clique sur **"Add new site" → "Import an existing project"**.
3. Choisis GitHub, autorise l'accès, puis sélectionne le dépôt `saveurs-alamiines`.
4. Les réglages de build sont déjà dans `netlify.toml` (rien à changer). Clique sur **"Deploy site"**.
5. Après quelques minutes, ton site est en ligne sur une adresse `https://un-nom-au-hasard.netlify.app`. Tu peux la personnaliser dans **Site configuration → Domain management** (et brancher un vrai nom de domaine si tu en achètes un).

### 3. Définir le mot de passe de l'espace gérant

1. Dans Netlify : **Site configuration → Environment variables → Add a variable**.
2. Nom : `ADMIN_PASSWORD`, valeur : le mot de passe de ton choix (garde-le secret).
3. Redéploie le site (**Deploys → Trigger deploy → Deploy site**) pour que le mot de passe soit pris en compte.
4. Va sur `https://ton-site.netlify.app/admin` et connecte-toi avec ce mot de passe.

C'est le seul réglage obligatoire. Netlify Blobs (le stockage du menu et des commandes) fonctionne automatiquement, sans rien configurer de plus.

## Utiliser l'espace gérant (`/admin`)

- **Onglet Commandes** : liste de toutes les commandes et demandes d'événements reçues, avec nom, téléphone, mode (livraison/retrait ou date d'événement), détail, statut modifiable, et bouton pour exporter en CSV (ouvrable dans Excel).
- **Onglet Gestion du menu** : formulaire pour ajouter un plat (nom, catégorie, description, prix, photo, disponibilité). La liste en dessous permet de modifier, marquer "indisponible" ou supprimer un plat existant. Les catégories se créent automatiquement en tapant un nouveau nom de catégorie.

## Personnalisation à prévoir

- **Adresse précise / zone de livraison** : le site affiche "Marseille" de façon générale. Si tu veux préciser une adresse de retrait ou une zone de livraison, dis-le-moi ou modifie directement `contact.html`.
- **Réseaux sociaux** : ajoute tes liens Instagram/Snapchat dans le pied de page si tu veux (fichier `index.html`, `menu.html`, etc., section `footer`).
- **Paiement en ligne** : non inclus pour l'instant (paiement à la livraison / au retrait). Ça peut être ajouté plus tard (ex. Stripe) si besoin.
- **Notification par email/SMS à chaque commande** : pour l'instant, il faut consulter `/admin` régulièrement pour voir les nouvelles commandes. On peut ajouter une notification automatique (email ou SMS) dans une prochaine étape si tu veux.

## Développement local (optionnel, pour toi ou un développeur)

```
npm install
npx netlify-cli dev
```

Cela lance le site en local avec les fonctions actives (nécessite un compte Netlify CLI relié au site pour que Netlify Blobs fonctionne).
