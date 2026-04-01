# Bangladesh Heritage Crafts

This project restores the richer demo shop experience from the old version in a much simpler structure.

## Features

- Home page with featured products, districts, artisans, and testimonials
- Product list with search, filters, sorting, and product detail pages
- District, category, and artisan listing/detail pages
- Cart and checkout flow using `localStorage`
- Order confirmation and user orders pages
- Login and registration pages
- Account page
- Admin dashboard
- Admin product management
- Admin order management
- Admin artisan, category, district, and settings pages

## Run The Project

```bash
npm start
```

Then open:

```text
http://localhost:3000
```

## If Someone Clones It From GitHub

After downloading or cloning the project from GitHub, run these commands:

```bash
git clone <your-github-repo-link>
cd Heritage
npm start
```

Then open:

```text
http://localhost:3000
```

Notes:

- This project does not need `npm install` because there are no package dependencies
- If the folder name is different after cloning, use that folder name instead of `Heritage`

## Demo Login

Customer:

```text
user@example.com
demo123
```

Admin:

```text
admin@example.com
demo123
```

## Main Files

- `index.html` - app shell
- `style.css` - full site styling
- `app.js` - routing and page rendering
- `data.js` - seed content
- `store.js` - dynamic browser data logic
- `server.js` - local server with route fallback
- `public/` - images

## Notes

- All data is stored in the browser with `localStorage`
- Orders, cart, account session, and admin changes stay on the same browser
- Direct URLs like `/products/item-id` and `/admin/products/new` work through the local server
