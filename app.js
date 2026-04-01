import {
  aboutStats,
  aboutValues,
  siteContent as defaultSiteContent,
  teamMembers
} from "/data.js";
import {
  ORDER_STATUSES,
  addToCart,
  clearCart,
  createOrder,
  deleteProductReviews,
  ensureInitialData,
  formatPrice,
  getAdminArtisans,
  getAdminCategories,
  getAdminDistricts,
  getAdminProducts,
  getAdminSettings,
  getArtisanById,
  getCartCount,
  getCartSummary,
  getCatalogProducts,
  getCategoryById,
  getCurrentUser,
  getDistrictById,
  getDynamicArtisans,
  getDynamicCategories,
  getDynamicDistricts,
  getLatestProductReviews,
  getOrderById,
  getOrders,
  getProductById,
  getProductRatingSummary,
  getProductReviews,
  getProductsByArtisan,
  getProductsByCategory,
  getProductsByDistrict,
  getRegisteredUsers,
  getSiteMetrics,
  getSiteContent,
  getUserOrders,
  isAdminUser,
  loginUser,
  logoutUser,
  makeId,
  registerUser,
  removeCartItem,
  saveAdminArtisans,
  saveAdminCategories,
  saveAdminDistricts,
  saveAdminProducts,
  saveAdminSettings,
  saveProductReview,
  saveSiteContent,
  slugify,
  updateCartQuantity,
  updateCurrentUser,
  updateOrderStatus
} from "/store.js";

const headerEl = document.getElementById("siteHeader");
const appEl = document.getElementById("app");
const footerEl = document.getElementById("siteFooter");
const toastEl = document.getElementById("toast");

let toastTimer = null;

function escapeHtml(value) {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function formatDate(value) {
  return new Date(value).toLocaleDateString();
}

function formatDateTime(value) {
  return new Date(value).toLocaleString();
}

function showToast(message) {
  toastEl.textContent = message;
  toastEl.classList.add("is-visible");

  if (toastTimer) {
    window.clearTimeout(toastTimer);
  }

  toastTimer = window.setTimeout(() => {
    toastEl.classList.remove("is-visible");
  }, 2600);
}

function updateTitle(title) {
  document.title = `${title} | Bangladesh Heritage Crafts`;
}

function getPath() {
  const pathname = window.location.pathname.replace(/\/+$/, "");
  return pathname || "/";
}

function navigate(url, replace = false) {
  const method = replace ? "replaceState" : "pushState";
  window.history[method]({}, "", url);
  renderApp(true);
}

function renderStarsLegacy(rating) {
  const count = Math.max(1, Math.min(5, Math.round(Number(rating) || 0)));
  return `${"★".repeat(count)}${"☆".repeat(5 - count)}`;
}

function statusBadge(status) {
  return `<span class="status-badge status-${escapeHtml(status)}">${escapeHtml(
    status.charAt(0).toUpperCase() + status.slice(1)
  )}</span>`;
}

function buttonLink(href, label, variant = "secondary", small = false) {
  return `<a class="button ${variant}${small ? " small" : ""}" href="${href}">${label}</a>`;
}

function renderStars(rating) {
  const count = Math.max(0, Math.min(5, Math.round(Number(rating) || 0)));
  return `${"&#9733;".repeat(count)}${"&#9734;".repeat(5 - count)}`;
}

function reviewCountLabel(reviewCount) {
  const count = Math.max(0, Number(reviewCount) || 0);
  return `${count} review${count === 1 ? "" : "s"}`;
}

function ratingSummaryMarkup(rating, reviewCount) {
  if (!reviewCount) {
    return `${renderStars(0)} <span>No reviews yet</span>`;
  }

  return `${renderStars(rating)} <span>${Number(rating).toFixed(1)} &middot; ${reviewCountLabel(
    reviewCount
  )}</span>`;
}

function getInitials(name) {
  const words = String(name || "")
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2);

  if (!words.length) {
    return "CU";
  }

  return words.map((word) => word.charAt(0).toUpperCase()).join("");
}

function renderShell(pathname) {
  const user = getCurrentUser();
  const cartCount = getCartCount();
  const settings = getAdminSettings();
  const siteContent = getSiteContent();
  const navigation = [
    { href: "/", label: "Home", active: pathname === "/" },
    {
      href: "/products",
      label: "Products",
      active: pathname === "/products" || pathname.startsWith("/products/")
    },
    {
      href: "/districts",
      label: "Districts",
      active: pathname === "/districts" || pathname.startsWith("/districts/")
    },
    {
      href: "/categories",
      label: "Categories",
      active: pathname === "/categories" || pathname.startsWith("/categories/")
    },
    {
      href: "/artisans",
      label: "Artisans",
      active: pathname === "/artisans" || pathname.startsWith("/artisans/")
    },
    {
      href: "/about",
      label: "About",
      active: pathname === "/about"
    }
  ];

  headerEl.innerHTML = `
    <header class="site-header">
      ${
        settings.maintenanceMode && !isAdminUser(user)
          ? `<div class="maintenance-banner">The store is in maintenance mode. Browsing still works, but settings may be updated by admin.</div>`
          : ""
      }
      <div class="container header-inner">
        <a class="brand" href="/">
          <strong>${escapeHtml(siteContent.brand.name)}</strong>
          <span>${escapeHtml(siteContent.brand.tagline)}</span>
        </a>

        <nav class="main-nav">
          ${navigation
            .map(
              (item) =>
                `<a class="nav-link${item.active ? " is-active" : ""}" href="${item.href}">${item.label}</a>`
            )
            .join("")}
        </nav>

        <div class="top-actions">
          <a class="cart-pill" href="/cart">
            Cart
            <span class="cart-count">${cartCount}</span>
          </a>

          ${
            user
              ? `
                <a class="button ghost small" href="/account">${escapeHtml(user.name)}</a>
                ${
                  isAdminUser(user)
                    ? `<a class="button secondary small" href="/admin">Admin</a>`
                    : ""
                }
                <button class="button secondary small" data-logout="true" type="button">Logout</button>
              `
              : `
                <a class="button ghost small" href="/auth/login">Sign In</a>
                <a class="button primary small" href="/auth/register">Register</a>
              `
          }
        </div>
      </div>
    </header>
  `;

  footerEl.innerHTML = `
    <footer class="site-footer">
      <div class="container footer-grid">
        <div>
          <p class="footer-brand">${escapeHtml(siteContent.brand.name)}</p>
          <p class="small-text">
            ${escapeHtml(siteContent.footer.description)}
          </p>
        </div>

        <div class="footer-links">
          <a href="/products">Products</a>
          <a href="/districts">Districts</a>
          <a href="/artisans">Artisans</a>
          <a href="/about">About</a>
          <a href="/cart">Cart</a>
          <a href="/admin">Admin</a>
        </div>
      </div>
    </footer>
  `;
}

function mountPage(title, html, setup, shouldScroll = true) {
  updateTitle(title);
  renderShell(getPath());
  appEl.innerHTML = html;

  if (shouldScroll) {
    window.scrollTo(0, 0);
  }

  if (typeof setup === "function") {
    setup();
  }
}

function renderAccessCard(title, description, actions = "") {
  return `
    <div class="page">
      <div class="container">
        <div class="center-card">
          <p class="eyebrow">Access</p>
          <h1 class="page-title">${title}</h1>
          <p class="page-intro">${description}</p>
          <div class="inline-actions">${actions}</div>
        </div>
      </div>
    </div>
  `;
}

function productCardLegacy(product) {
  return `
    <article class="card">
      <img class="card-media" src="${escapeHtml(product.image)}" alt="${escapeHtml(
        product.name
      )}" />
      <div class="card-body">
        <div class="card-meta">
          <span class="pill">${escapeHtml(product.category)}</span>
          <span class="pill">${escapeHtml(product.district)}</span>
        </div>
        <h3 class="card-title">${escapeHtml(product.name)}</h3>
        <p class="card-copy">${escapeHtml(product.description)}</p>
        <p class="small-text rating">${renderStars(product.rating)} • ${escapeHtml(
          product.reviewCount
        )} reviews</p>
        <div class="price-row">
          <span class="price">${formatPrice(product.price)}</span>
          ${
            product.originalPrice && product.originalPrice > product.price
              ? `<span class="old-price">${formatPrice(product.originalPrice)}</span>`
              : ""
          }
        </div>
        <div class="inline-actions">
          <a class="button secondary small" href="/products/${product.id}">View Details</a>
          <button class="button primary small" data-add-cart="${product.id}" type="button">Add to Cart</button>
        </div>
      </div>
    </article>
  `;
}

function districtCard(district) {
  return `
    <article class="card">
      <img class="card-media" src="${escapeHtml(district.image)}" alt="${escapeHtml(
        district.name
      )}" />
      <div class="card-body">
        <div class="card-meta">
          <span class="pill">${escapeHtml(district.division)}</span>
          <span class="pill">${escapeHtml(district.productCount)} products</span>
        </div>
        <h3 class="card-title">${escapeHtml(district.name)}</h3>
        <p class="card-copy">${escapeHtml(district.description)}</p>
        <div class="inline-actions">
          <a class="button secondary small" href="/districts/${district.id}">Explore District</a>
        </div>
      </div>
    </article>
  `;
}

function categoryCard(category) {
  return `
    <article class="card">
      <img class="card-media" src="${escapeHtml(category.image)}" alt="${escapeHtml(
        category.name
      )}" />
      <div class="card-body">
        <div class="card-meta">
          <span class="pill">${escapeHtml(category.productCount)} products</span>
        </div>
        <h3 class="card-title">${escapeHtml(category.name)}</h3>
        <p class="card-copy">${escapeHtml(category.description)}</p>
        <div class="inline-actions">
          <a class="button secondary small" href="/categories/${category.id}">Browse Category</a>
        </div>
      </div>
    </article>
  `;
}

function artisanCardLegacy(artisan) {
  return `
    <article class="card">
      <img class="card-media tall" src="${escapeHtml(artisan.image)}" alt="${escapeHtml(
        artisan.name
      )}" />
      <div class="card-body">
        <div class="card-meta">
          <span class="pill">${escapeHtml(artisan.specialty)}</span>
          <span class="pill">${escapeHtml(artisan.productCount)} products</span>
        </div>
        <h3 class="card-title">${escapeHtml(artisan.name)}</h3>
        <p class="card-copy">${escapeHtml(artisan.bio)}</p>
        <p class="small-text">${escapeHtml(artisan.district)} • ${escapeHtml(
          artisan.yearsOfExperience
        )} years experience</p>
        <div class="inline-actions">
          <a class="button secondary small" href="/artisans/${artisan.id}">View Artisan</a>
        </div>
      </div>
    </article>
  `;
}

function testimonialCardLegacy(item) {
  return `
    <article class="card quote-card">
      <div class="card-body">
        <div class="quote-mark">"</div>
        <p class="card-copy">${escapeHtml(item.text)}</p>
        <p class="small-text rating">${renderStars(item.rating)}</p>
        <div class="meta-row spacer-top">
          <img class="card-media small" src="${escapeHtml(item.avatar)}" alt="${escapeHtml(
            item.name
          )}" style="width:56px;height:56px;border-radius:999px;" />
          <div>
            <strong>${escapeHtml(item.name)}</strong>
            <div class="small-text">${escapeHtml(item.location)}</div>
          </div>
        </div>
      </div>
    </article>
  `;
}

function productCard(product) {
  return `
    <article class="card">
      <img class="card-media" src="${escapeHtml(product.image)}" alt="${escapeHtml(
        product.name
      )}" />
      <div class="card-body">
        <div class="card-meta">
          <span class="pill">${escapeHtml(product.category)}</span>
          <span class="pill">${escapeHtml(product.district)}</span>
        </div>
        <h3 class="card-title">${escapeHtml(product.name)}</h3>
        <p class="card-copy">${escapeHtml(product.description)}</p>
        <p class="small-text rating">${ratingSummaryMarkup(product.rating, product.reviewCount)}</p>
        <div class="price-row">
          <span class="price">${formatPrice(product.price)}</span>
          ${
            product.originalPrice && product.originalPrice > product.price
              ? `<span class="old-price">${formatPrice(product.originalPrice)}</span>`
              : ""
          }
        </div>
        <div class="inline-actions">
          <a class="button secondary small" href="/products/${product.id}">View Details</a>
          <button class="button primary small" data-add-cart="${product.id}" type="button">Add to Cart</button>
        </div>
      </div>
    </article>
  `;
}

function artisanCard(artisan) {
  return `
    <article class="card">
      <img class="card-media tall" src="${escapeHtml(artisan.image)}" alt="${escapeHtml(
        artisan.name
      )}" />
      <div class="card-body">
        <div class="card-meta">
          <span class="pill">${escapeHtml(artisan.specialty)}</span>
          <span class="pill">${escapeHtml(artisan.productCount)} products</span>
        </div>
        <h3 class="card-title">${escapeHtml(artisan.name)}</h3>
        <p class="card-copy">${escapeHtml(artisan.bio)}</p>
        <p class="small-text">${escapeHtml(artisan.district)} &middot; ${escapeHtml(
          artisan.yearsOfExperience
        )} years experience</p>
        <div class="inline-actions">
          <a class="button secondary small" href="/artisans/${artisan.id}">View Artisan</a>
        </div>
      </div>
    </article>
  `;
}

function homeReviewCard(item) {
  return `
    <article class="card quote-card review-card">
      <div class="card-body">
        <div class="quote-mark">"</div>
        <p class="card-copy">${escapeHtml(item.comment)}</p>
        <p class="small-text rating">${ratingSummaryMarkup(item.rating, 1)}</p>
        <div class="review-product-link">
          <a href="/products/${item.productId}">${escapeHtml(item.productName)}</a>
        </div>
        <div class="meta-row spacer-top review-author">
          <div class="avatar-badge">${escapeHtml(getInitials(item.name))}</div>
          <div>
            <strong>${escapeHtml(item.name)}</strong>
            <div class="small-text">${escapeHtml(item.location || "Bangladesh")}</div>
          </div>
        </div>
      </div>
    </article>
  `;
}

function productReviewCard(review) {
  return `
    <article class="summary-box review-item">
      <div class="review-item-header">
        <div>
          <p class="small-text rating">${ratingSummaryMarkup(review.rating, 1)}</p>
          <h3 class="summary-title review-title">${escapeHtml(review.title)}</h3>
        </div>
        ${
          review.verifiedPurchase
            ? '<span class="pill review-verified">Verified purchase</span>'
            : ""
        }
      </div>
      <p class="small-text">
        <strong>${escapeHtml(review.name)}</strong>
        ${review.location ? ` &middot; ${escapeHtml(review.location)}` : ""}
        &middot; ${escapeHtml(formatDate(review.createdAt))}
      </p>
      <p class="card-copy">${escapeHtml(review.comment)}</p>
    </article>
  `;
}

function ratingDistributionRow(item, reviewCount) {
  const percentage = reviewCount ? Math.round((item.count / reviewCount) * 100) : 0;

  return `
    <div class="rating-bar-row">
      <span>${item.stars} star</span>
      <div class="rating-bar-track">
        <span class="rating-bar-fill" style="width:${percentage}%"></span>
      </div>
      <strong>${item.count}</strong>
    </div>
  `;
}

function renderHomePage(shouldScroll = true) {
  const products = getCatalogProducts().slice(0, 4);
  const districts = getDynamicDistricts().slice(0, 4);
  const categories = getDynamicCategories().slice(0, 3);
  const artisans = getDynamicArtisans().slice(0, 3);
  const stats = getSiteMetrics();
  const latestReviews = getLatestProductReviews(4)
    .map((review) => {
      const reviewedProduct = getProductById(review.productId);

      if (!reviewedProduct) {
        return null;
      }

      return {
        ...review,
        productName: reviewedProduct.name
      };
    })
    .filter(Boolean);
  const siteContent = getSiteContent();
  const homeContent = siteContent.home;

  mountPage(
    "Home",
    `
      <div class="page">
        <section class="hero">
          <div class="container hero-grid">
            <div class="hero-copy">
              <p class="eyebrow">${escapeHtml(homeContent.heroEyebrow)}</p>
              <h1>${escapeHtml(homeContent.heroTitle)}</h1>
              <p class="page-intro">${escapeHtml(homeContent.heroIntro)}</p>
              <form id="homeSearchForm" class="toolbar spacer-top">
                <div class="toolbar-grid three">
                  <div class="field">
                    <label for="homeSearchInput">${escapeHtml(homeContent.searchLabel)}</label>
                    <input id="homeSearchInput" name="search" type="search" placeholder="${escapeHtml(
                      homeContent.searchPlaceholder
                    )}" />
                  </div>
                  <div></div>
                  <div class="inline-actions" style="align-items:end;">
                    <button class="button primary" type="submit">${escapeHtml(
                      homeContent.searchButton
                    )}</button>
                    <a class="button secondary" href="/districts">${escapeHtml(
                      homeContent.browseButton
                    )}</a>
                  </div>
                </div>
              </form>
            </div>

            <div class="hero-panel">
              <img src="/images/hero-banner.jpg" alt="Bangladesh heritage crafts" />
              <div class="panel-body">
                <p class="eyebrow">${escapeHtml(homeContent.panelEyebrow)}</p>
                <h2 class="card-title">${escapeHtml(homeContent.panelTitle)}</h2>
                <p class="small-text">${escapeHtml(homeContent.panelText)}</p>
              </div>
            </div>
          </div>
        </section>

        <section class="section">
          <div class="container">
            <div class="stats-grid">
              ${stats
                .map(
                  (item) => `
                    <article class="stat-card">
                      <span>${escapeHtml(item.label)}</span>
                      <strong>${escapeHtml(item.value)}</strong>
                    </article>
                  `
                )
                .join("")}
            </div>
          </div>
        </section>

        <section class="section alt">
          <div class="container">
            <div class="section-heading">
              <p class="eyebrow">${escapeHtml(homeContent.districtsEyebrow)}</p>
              <h2>${escapeHtml(homeContent.districtsTitle)}</h2>
              <p>${escapeHtml(homeContent.districtsIntro)}</p>
            </div>
            <div class="grid four">
              ${districts.map(districtCard).join("")}
            </div>
          </div>
        </section>

        <section class="section">
          <div class="container">
            <div class="section-heading">
              <p class="eyebrow">${escapeHtml(homeContent.productsEyebrow)}</p>
              <h2>${escapeHtml(homeContent.productsTitle)}</h2>
              <p>${escapeHtml(homeContent.productsIntro)}</p>
            </div>
            <div class="grid four">
              ${products.map(productCard).join("")}
            </div>
          </div>
        </section>

        <section class="section alt">
          <div class="container">
            <div class="section-heading">
              <p class="eyebrow">${escapeHtml(homeContent.categoriesEyebrow)}</p>
              <h2>${escapeHtml(homeContent.categoriesTitle)}</h2>
              <p>${escapeHtml(homeContent.categoriesIntro)}</p>
            </div>
            <div class="grid three">
              ${categories.map(categoryCard).join("")}
            </div>
          </div>
        </section>

        <section class="section">
          <div class="container">
            <div class="section-heading">
              <p class="eyebrow">${escapeHtml(homeContent.artisansEyebrow)}</p>
              <h2>${escapeHtml(homeContent.artisansTitle)}</h2>
              <p>${escapeHtml(homeContent.artisansIntro)}</p>
            </div>
            <div class="grid three">
              ${artisans.map(artisanCard).join("")}
            </div>
          </div>
        </section>

        <section class="section alt">
          <div class="container">
            <div class="section-heading">
              <p class="eyebrow">${escapeHtml(homeContent.testimonialsEyebrow)}</p>
              <h2>${escapeHtml(homeContent.testimonialsTitle)}</h2>
              <p>${escapeHtml(homeContent.testimonialsIntro)}</p>
            </div>
            <div class="grid four">
              ${
                latestReviews.length
                  ? latestReviews.map(homeReviewCard).join("")
                  : "<p class='small-text'>No customer reviews yet. Sign in from a product page and leave the first review.</p>"
              }
            </div>
          </div>
        </section>
      </div>
    `,
    () => {
      const form = document.getElementById("homeSearchForm");
      form.addEventListener("submit", (event) => {
        event.preventDefault();
        const input = document.getElementById("homeSearchInput");
        const value = input.value.trim();
        navigate(`/products${value ? `?search=${encodeURIComponent(value)}` : ""}`);
      });
    },
    shouldScroll
  );
}

function renderProductsPage(shouldScroll = true) {
  const categories = getDynamicCategories();
  const districts = getDynamicDistricts();
  const searchParams = new URLSearchParams(window.location.search);

  mountPage(
    "Products",
    `
      <div class="page">
        <div class="container">
          <p class="eyebrow">Storefront</p>
          <h1 class="page-title">All Products</h1>
          <p class="page-intro">Browse, search, filter, and sort the full catalog.</p>

          <div class="toolbar spacer-top">
            <div class="toolbar-grid four">
              <div class="field">
                <label for="productsSearch">Search</label>
                <input id="productsSearch" type="search" value="${escapeHtml(
                  searchParams.get("search") || ""
                )}" placeholder="Search by name, district, or category" />
              </div>

              <div class="field">
                <label for="productsCategory">Category</label>
                <select id="productsCategory">
                  <option value="all">All categories</option>
                  ${categories
                    .map(
                      (category) =>
                        `<option value="${category.id}">${escapeHtml(category.name)}</option>`
                    )
                    .join("")}
                </select>
              </div>

              <div class="field">
                <label for="productsDistrict">District</label>
                <select id="productsDistrict">
                  <option value="all">All districts</option>
                  ${districts
                    .map(
                      (district) =>
                        `<option value="${district.id}">${escapeHtml(district.name)}</option>`
                    )
                    .join("")}
                </select>
              </div>

              <div class="field">
                <label for="productsSort">Sort</label>
                <select id="productsSort">
                  <option value="popular">Most popular</option>
                  <option value="name">Name A to Z</option>
                  <option value="price-low">Price low to high</option>
                  <option value="price-high">Price high to low</option>
                  <option value="rating">Highest rating</option>
                </select>
              </div>
            </div>

            <div class="inline-actions">
              <button class="button secondary small" id="productsClear" type="button">Clear Filters</button>
            </div>
          </div>

          <p id="productsCount" class="small-text spacer-top"></p>
          <div id="productsGrid" class="grid three spacer-top"></div>
        </div>
      </div>
    `,
    () => {
      const searchInput = document.getElementById("productsSearch");
      const categorySelect = document.getElementById("productsCategory");
      const districtSelect = document.getElementById("productsDistrict");
      const sortSelect = document.getElementById("productsSort");
      const clearButton = document.getElementById("productsClear");
      const grid = document.getElementById("productsGrid");
      const count = document.getElementById("productsCount");

      function draw() {
        const searchValue = searchInput.value.trim().toLowerCase();
        const categoryValue = categorySelect.value;
        const districtValue = districtSelect.value;
        const sortValue = sortSelect.value;

        const filtered = getCatalogProducts()
          .filter((product) => {
            const matchesSearch =
              !searchValue ||
              product.name.toLowerCase().includes(searchValue) ||
              product.district.toLowerCase().includes(searchValue) ||
              product.category.toLowerCase().includes(searchValue) ||
              product.description.toLowerCase().includes(searchValue);

            const matchesCategory =
              categoryValue === "all" || product.categoryId === categoryValue;

            const matchesDistrict =
              districtValue === "all" || product.districtId === districtValue;

            return matchesSearch && matchesCategory && matchesDistrict;
          })
          .sort((first, second) => {
            if (sortValue === "name") {
              return first.name.localeCompare(second.name);
            }

            if (sortValue === "price-low") {
              return first.price - second.price;
            }

            if (sortValue === "price-high") {
              return second.price - first.price;
            }

            if (sortValue === "rating") {
              return second.rating - first.rating;
            }

            return second.reviewCount - first.reviewCount;
          });

        count.textContent = `${filtered.length} product(s) found`;
        grid.innerHTML = filtered.length
          ? filtered.map(productCard).join("")
          : `
              <div class="empty-state card" style="grid-column:1/-1;">
                <h3 class="card-title">No products found</h3>
                <p class="card-copy">Try adjusting your search or filters.</p>
              </div>
            `;
      }

      [searchInput, categorySelect, districtSelect, sortSelect].forEach((element) => {
        element.addEventListener("input", draw);
        element.addEventListener("change", draw);
      });

      clearButton.addEventListener("click", () => {
        searchInput.value = "";
        categorySelect.value = "all";
        districtSelect.value = "all";
        sortSelect.value = "popular";
        draw();
      });

      draw();
    },
    shouldScroll
  );
}

function renderProductDetailPageLegacy(productId, shouldScroll = true) {
  const product = getProductById(productId);

  if (!product) {
    mountPage(
      "Product Not Found",
      renderAccessCard(
        "Product not found",
        "The product you are looking for does not exist in the current catalog.",
        `${buttonLink("/products", "Back to Products")}`
      ),
      null,
      shouldScroll
    );
    return;
  }

  const artisan = product.artisanId ? getArtisanById(product.artisanId) : null;
  const relatedProducts = getCatalogProducts()
    .filter((item) => item.id !== product.id && item.categoryId === product.categoryId)
    .slice(0, 3);

  mountPage(
    product.name,
    `
      <div class="page">
        <div class="container">
          <div class="inline-actions">
            <a class="button ghost small" href="/products">Back to Products</a>
            <a class="button ghost small" href="/categories/${product.categoryId}">${escapeHtml(
              product.category
            )}</a>
            <a class="button ghost small" href="/districts/${product.districtId}">${escapeHtml(
              product.district
            )}</a>
          </div>

          <div class="detail-grid spacer-top">
            <div>
              <img id="detailMainImage" class="gallery-main" src="${escapeHtml(
                product.images[0]
              )}" alt="${escapeHtml(product.name)}" />
              <div class="thumb-grid">
                ${product.images
                  .map(
                    (image, index) => `
                      <button type="button" data-thumb="${escapeHtml(image)}" ${
                        index === 0 ? 'data-selected="true"' : ""
                      }>
                        <img src="${escapeHtml(image)}" alt="${escapeHtml(product.name)}" />
                      </button>
                    `
                  )
                  .join("")}
              </div>
            </div>

            <div>
              <p class="eyebrow">${escapeHtml(product.category)}</p>
              <h1 class="detail-heading">${escapeHtml(product.name)}</h1>
              <p class="small-text rating">${renderStars(product.rating)} • ${escapeHtml(
                product.reviewCount
              )} reviews</p>
              <div class="price-row">
                <span class="price">${formatPrice(product.price)}</span>
                ${
                  product.originalPrice > product.price
                    ? `<span class="old-price">${formatPrice(product.originalPrice)}</span>`
                    : ""
                }
              </div>
              <p class="detail-copy">${escapeHtml(product.description)}</p>

              <div class="meta-row">
                <span class="pill">${escapeHtml(product.district)}</span>
                <span class="pill">${product.inStock ? "In Stock" : "Out of Stock"}</span>
              </div>

              <div class="field" style="max-width:160px;">
                <label for="detailQuantity">Quantity</label>
                <input id="detailQuantity" type="number" min="1" value="1" />
              </div>

              <div class="inline-actions">
                <button class="button primary" id="detailAddToCart" type="button"${
                  product.inStock ? "" : " disabled"
                }>Add to Cart</button>
                <a class="button secondary" href="/cart">View Cart</a>
              </div>

              ${
                artisan
                  ? `
                    <div class="summary-box spacer-top">
                      <h3 class="summary-title">Artisan</h3>
                      <p><strong>${escapeHtml(artisan.name)}</strong></p>
                      <p class="small-text">${escapeHtml(artisan.specialty)} • ${escapeHtml(
                        artisan.district
                      )}</p>
                      <p class="small-text">${escapeHtml(artisan.bio)}</p>
                      <div class="inline-actions">
                        <a class="button secondary small" href="/artisans/${artisan.id}">View Artisan</a>
                      </div>
                    </div>
                  `
                  : ""
              }
            </div>
          </div>

          <div class="grid two spacer-top">
            <article class="summary-box">
              <h3 class="summary-title">Craft Process</h3>
              <p class="small-text">${escapeHtml(product.craftProcess || "No craft process added yet.")}</p>
            </article>
            <article class="summary-box">
              <h3 class="summary-title">Cultural Significance</h3>
              <p class="small-text">${escapeHtml(
                product.culturalSignificance || "No cultural note added yet."
              )}</p>
            </article>
          </div>

          <section class="section">
            <div class="section-heading">
              <p class="eyebrow">Related products</p>
              <h2>More from this craft tradition</h2>
            </div>
            <div class="grid three">
              ${relatedProducts.length ? relatedProducts.map(productCard).join("") : "<p class='small-text'>No related products available.</p>"}
            </div>
          </section>
        </div>
      </div>
    `,
    () => {
      const mainImage = document.getElementById("detailMainImage");
      const quantityInput = document.getElementById("detailQuantity");
      const addButton = document.getElementById("detailAddToCart");

      document.querySelectorAll("[data-thumb]").forEach((button) => {
        button.addEventListener("click", () => {
          mainImage.src = button.dataset.thumb;
        });
      });

      addButton.addEventListener("click", () => {
        const quantity = Math.max(1, Number(quantityInput.value) || 1);
        addToCart(product.id, quantity);
        renderShell(getPath());
        showToast(`${product.name} added to cart.`);
      });
    },
    shouldScroll
  );
}

function renderProductDetailPage(productId, shouldScroll = true) {
  const product = getProductById(productId);

  if (!product) {
    mountPage(
      "Product Not Found",
      renderAccessCard(
        "Product not found",
        "The product you are looking for does not exist in the current catalog.",
        `${buttonLink("/products", "Back to Products")}`
      ),
      null,
      shouldScroll
    );
    return;
  }

  const currentUser = getCurrentUser();
  const canReview = currentUser && !isAdminUser(currentUser);
  const artisan = product.artisanId ? getArtisanById(product.artisanId) : null;
  const reviewSummary = getProductRatingSummary(product.id);
  const reviews = getProductReviews(product.id);
  const existingReview = canReview
    ? reviews.find((review) => review.userId === currentUser.id)
    : null;
  const relatedProducts = getCatalogProducts()
    .filter((item) => item.id !== product.id && item.categoryId === product.categoryId)
    .slice(0, 3);

  mountPage(
    product.name,
    `
      <div class="page">
        <div class="container">
          <div class="inline-actions">
            <a class="button ghost small" href="/products">Back to Products</a>
            <a class="button ghost small" href="/categories/${product.categoryId}">${escapeHtml(
              product.category
            )}</a>
            <a class="button ghost small" href="/districts/${product.districtId}">${escapeHtml(
              product.district
            )}</a>
          </div>

          <div class="detail-grid spacer-top">
            <div>
              <img id="detailMainImage" class="gallery-main" src="${escapeHtml(
                product.images[0]
              )}" alt="${escapeHtml(product.name)}" />
              <div class="thumb-grid">
                ${product.images
                  .map(
                    (image, index) => `
                      <button type="button" data-thumb="${escapeHtml(image)}" ${
                        index === 0 ? 'data-selected="true"' : ""
                      }>
                        <img src="${escapeHtml(image)}" alt="${escapeHtml(product.name)}" />
                      </button>
                    `
                  )
                  .join("")}
              </div>
            </div>

            <div>
              <p class="eyebrow">${escapeHtml(product.category)}</p>
              <h1 class="detail-heading">${escapeHtml(product.name)}</h1>
              <p class="small-text rating">${ratingSummaryMarkup(
                reviewSummary.rating,
                reviewSummary.reviewCount
              )}</p>
              <div class="price-row">
                <span class="price">${formatPrice(product.price)}</span>
                ${
                  product.originalPrice > product.price
                    ? `<span class="old-price">${formatPrice(product.originalPrice)}</span>`
                    : ""
                }
              </div>
              <p class="detail-copy">${escapeHtml(product.description)}</p>

              <div class="meta-row">
                <span class="pill">${escapeHtml(product.district)}</span>
                <span class="pill">${product.inStock ? "In Stock" : "Out of Stock"}</span>
              </div>

              <div class="field" style="max-width:160px;">
                <label for="detailQuantity">Quantity</label>
                <input id="detailQuantity" type="number" min="1" value="1" />
              </div>

              <div class="inline-actions">
                <button class="button primary" id="detailAddToCart" type="button"${
                  product.inStock ? "" : " disabled"
                }>Add to Cart</button>
                <a class="button secondary" href="/cart">View Cart</a>
              </div>

              ${
                artisan
                  ? `
                    <div class="summary-box spacer-top">
                      <h3 class="summary-title">Artisan</h3>
                      <p><strong>${escapeHtml(artisan.name)}</strong></p>
                      <p class="small-text">${escapeHtml(artisan.specialty)} &middot; ${escapeHtml(
                        artisan.district
                      )}</p>
                      <p class="small-text">${escapeHtml(artisan.bio)}</p>
                      <div class="inline-actions">
                        <a class="button secondary small" href="/artisans/${artisan.id}">View Artisan</a>
                      </div>
                    </div>
                  `
                  : ""
              }
            </div>
          </div>

          <div class="grid two spacer-top">
            <article class="summary-box">
              <h3 class="summary-title">Craft Process</h3>
              <p class="small-text">${escapeHtml(product.craftProcess || "No craft process added yet.")}</p>
            </article>
            <article class="summary-box">
              <h3 class="summary-title">Cultural Significance</h3>
              <p class="small-text">${escapeHtml(
                product.culturalSignificance || "No cultural note added yet."
              )}</p>
            </article>
          </div>

          <section class="section">
            <div class="section-heading">
              <p class="eyebrow">Customer reviews</p>
              <h2>Ratings from recent buyers</h2>
              <p>Ratings update automatically whenever customers submit or edit a review.</p>
            </div>

            <div class="grid two">
              <article class="summary-box">
                <div class="review-overview">
                  <strong class="review-score">${
                    reviewSummary.reviewCount
                      ? Number(reviewSummary.rating).toFixed(1)
                      : "New"
                  }</strong>
                  <div>
                    <p class="small-text rating">${ratingSummaryMarkup(
                      reviewSummary.rating,
                      reviewSummary.reviewCount
                    )}</p>
                    <p class="small-text">${
                      reviewSummary.reviewCount
                        ? `Based on ${reviewCountLabel(reviewSummary.reviewCount)} for this product.`
                        : "No customer reviews yet. Be the first to share your experience."
                    }</p>
                  </div>
                </div>

                <div class="rating-bars spacer-top">
                  ${reviewSummary.distribution
                    .map((item) => ratingDistributionRow(item, reviewSummary.reviewCount))
                    .join("")}
                </div>
              </article>

              <article class="summary-box">
                <h3 class="summary-title">${
                  canReview
                    ? existingReview
                      ? "Update your review"
                      : "Write a review"
                    : "Write a review"
                }</h3>
                ${
                  canReview
                    ? `
                      <form id="productReviewForm">
                        <div id="productReviewNotice"></div>

                        <div class="form-grid two">
                          <div class="field">
                            <label for="reviewRating">Rating</label>
                            <select id="reviewRating" name="rating" required>
                              ${[5, 4, 3, 2, 1]
                                .map(
                                  (value) => `
                                    <option value="${value}" ${
                                      value === Number(existingReview?.rating || 5)
                                        ? "selected"
                                        : ""
                                    }>${value} star${value === 1 ? "" : "s"}</option>
                                  `
                                )
                                .join("")}
                            </select>
                          </div>
                          <div class="field">
                            <label for="reviewTitle">Title</label>
                            <input
                              id="reviewTitle"
                              name="title"
                              value="${escapeHtml(existingReview?.title || "")}"
                              placeholder="Short review title"
                            />
                          </div>
                        </div>

                        <div class="field spacer-top">
                          <label for="reviewComment">Review</label>
                          <textarea id="reviewComment" name="comment" required>${escapeHtml(
                            existingReview?.comment || ""
                          )}</textarea>
                        </div>

                        <div class="field spacer-top">
                          <label for="reviewLocation">Location</label>
                          <input
                            id="reviewLocation"
                            name="location"
                            value="${escapeHtml(existingReview?.location || currentUser?.address || "")}"
                            placeholder="City or country"
                          />
                        </div>

                        <div class="inline-actions spacer-top">
                          <button class="button primary" type="submit">${
                            existingReview ? "Update Review" : "Submit Review"
                          }</button>
                        </div>

                        <p class="small-text">${
                          existingReview
                            ? "Submitting again will update your current review from this account."
                            : "Your review will update the rating shown on product cards and the landing page."
                        }</p>
                      </form>
                    `
                    : `
                      <div class="notice warning">
                        ${
                          currentUser
                            ? "Admin accounts cannot submit reviews. Sign in with a customer account to leave feedback."
                            : "Sign in with a customer account to leave a rating and review for this product."
                        }
                      </div>
                      <div class="inline-actions spacer-top">
                        <a class="button primary" href="/auth/login?redirect=${encodeURIComponent(
                          `/products/${product.id}`
                        )}">Sign In to Review</a>
                        <a class="button secondary" href="/auth/register?redirect=${encodeURIComponent(
                          `/products/${product.id}`
                        )}">Create Account</a>
                      </div>
                    `
                }
              </article>
            </div>

            <div class="review-list spacer-top">
              ${
                reviews.length
                  ? reviews.map(productReviewCard).join("")
                  : "<div class='summary-box'><p class='small-text'>No reviews yet. The first review will appear here.</p></div>"
              }
            </div>
          </section>

          <section class="section">
            <div class="section-heading">
              <p class="eyebrow">Related products</p>
              <h2>More from this craft tradition</h2>
            </div>
            <div class="grid three">
              ${
                relatedProducts.length
                  ? relatedProducts.map(productCard).join("")
                  : "<p class='small-text'>No related products available.</p>"
              }
            </div>
          </section>
        </div>
      </div>
    `,
    () => {
      const mainImage = document.getElementById("detailMainImage");
      const quantityInput = document.getElementById("detailQuantity");
      const addButton = document.getElementById("detailAddToCart");
      const reviewForm = document.getElementById("productReviewForm");
      const reviewNotice = document.getElementById("productReviewNotice");

      document.querySelectorAll("[data-thumb]").forEach((button) => {
        button.addEventListener("click", () => {
          mainImage.src = button.dataset.thumb;
        });
      });

      if (addButton) {
        addButton.addEventListener("click", () => {
          const quantity = Math.max(1, Number(quantityInput.value) || 1);
          addToCart(product.id, quantity);
          renderShell(getPath());
          showToast(`${product.name} added to cart.`);
        });
      }

      if (reviewForm) {
        reviewForm.addEventListener("submit", (event) => {
          event.preventDefault();
          const formData = Object.fromEntries(new FormData(reviewForm).entries());
          const result = saveProductReview({
            productId: product.id,
            rating: formData.rating,
            title: formData.title,
            comment: formData.comment,
            location: formData.location
          });

          if (!result.ok) {
            if (reviewNotice) {
              reviewNotice.innerHTML = `<div class="notice error">${escapeHtml(
                result.message
              )}</div>`;
            }
            return;
          }

          showToast(result.updated ? "Review updated." : "Review submitted.");
          renderApp(false);
        });
      }
    },
    shouldScroll
  );
}

function renderDistrictsPage(shouldScroll = true) {
  const districts = getDynamicDistricts();

  mountPage(
    "Districts",
    `
      <div class="page">
        <div class="container">
          <p class="eyebrow">Browse by place</p>
          <h1 class="page-title">Districts</h1>
          <p class="page-intro">Explore traditional craft stories from districts across Bangladesh.</p>
          <div class="grid three spacer-top">
            ${districts.map(districtCard).join("")}
          </div>
        </div>
      </div>
    `,
    null,
    shouldScroll
  );
}

function renderDistrictDetailPage(districtId, shouldScroll = true) {
  const district = getDistrictById(districtId);

  if (!district) {
    mountPage(
      "District Not Found",
      renderAccessCard(
        "District not found",
        "The district you requested is not available.",
        buttonLink("/districts", "Back to Districts")
      ),
      null,
      shouldScroll
    );
    return;
  }

  const products = getProductsByDistrict(district.id);

  mountPage(
    district.name,
    `
      <div class="page">
        <div class="container">
          <div class="hero-grid">
            <div class="hero-copy">
              <p class="eyebrow">${escapeHtml(district.division)} division</p>
              <h1>${escapeHtml(district.name)}</h1>
              <p class="page-intro">${escapeHtml(district.description)}</p>
              <div class="inline-actions">
                <a class="button secondary" href="/districts">All Districts</a>
                <a class="button ghost" href="/products">All Products</a>
              </div>
            </div>
            <div class="hero-panel">
              <img src="${escapeHtml(district.image)}" alt="${escapeHtml(district.name)}" />
              <div class="panel-body">
                <p class="small-text">${escapeHtml(products.length)} catalog product(s) connected to this district.</p>
              </div>
            </div>
          </div>

          <section class="section">
            <div class="section-heading">
              <p class="eyebrow">Products</p>
              <h2>Crafts from ${escapeHtml(district.name)}</h2>
            </div>
            <div class="grid three">
              ${products.length ? products.map(productCard).join("") : "<p class='small-text'>No products available for this district yet.</p>"}
            </div>
          </section>
        </div>
      </div>
    `,
    null,
    shouldScroll
  );
}

function renderCategoriesPage(shouldScroll = true) {
  const categories = getDynamicCategories();

  mountPage(
    "Categories",
    `
      <div class="page">
        <div class="container">
          <p class="eyebrow">Browse by craft</p>
          <h1 class="page-title">Categories</h1>
          <p class="page-intro">Explore the catalog through weaving, pottery, embroidery, bamboo work, and more.</p>
          <div class="grid three spacer-top">
            ${categories.map(categoryCard).join("")}
          </div>
        </div>
      </div>
    `,
    null,
    shouldScroll
  );
}

function renderCategoryDetailPage(categoryId, shouldScroll = true) {
  const category = getCategoryById(categoryId);

  if (!category) {
    mountPage(
      "Category Not Found",
      renderAccessCard(
        "Category not found",
        "The category you requested is not available.",
        buttonLink("/categories", "Back to Categories")
      ),
      null,
      shouldScroll
    );
    return;
  }

  const products = getProductsByCategory(category.id);

  mountPage(
    category.name,
    `
      <div class="page">
        <div class="container">
          <div class="hero-grid">
            <div class="hero-copy">
              <p class="eyebrow">${escapeHtml(category.productCount)} products</p>
              <h1>${escapeHtml(category.name)}</h1>
              <p class="page-intro">${escapeHtml(category.description)}</p>
              <div class="inline-actions">
                <a class="button secondary" href="/categories">All Categories</a>
                <a class="button ghost" href="/products">All Products</a>
              </div>
            </div>
            <div class="hero-panel">
              <img src="${escapeHtml(category.image)}" alt="${escapeHtml(category.name)}" />
              <div class="panel-body">
                <p class="small-text">Traditional craft type highlighted in the original storefront demo.</p>
              </div>
            </div>
          </div>

          <section class="section">
            <div class="section-heading">
              <p class="eyebrow">Catalog</p>
              <h2>Products in ${escapeHtml(category.name)}</h2>
            </div>
            <div class="grid three">
              ${products.length ? products.map(productCard).join("") : "<p class='small-text'>No products available in this category yet.</p>"}
            </div>
          </section>
        </div>
      </div>
    `,
    null,
    shouldScroll
  );
}

function renderArtisansPage(shouldScroll = true) {
  const artisans = getDynamicArtisans();

  mountPage(
    "Artisans",
    `
      <div class="page">
        <div class="container">
          <p class="eyebrow">Meet the makers</p>
          <h1 class="page-title">Artisans</h1>
          <p class="page-intro">Read about the makers behind the products and traditions featured in the catalog.</p>
          <div class="grid three spacer-top">
            ${artisans.map(artisanCard).join("")}
          </div>
        </div>
      </div>
    `,
    null,
    shouldScroll
  );
}

function renderArtisanDetailPage(artisanId, shouldScroll = true) {
  const artisan = getArtisanById(artisanId);

  if (!artisan) {
    mountPage(
      "Artisan Not Found",
      renderAccessCard(
        "Artisan not found",
        "The artisan profile you requested is not available.",
        buttonLink("/artisans", "Back to Artisans")
      ),
      null,
      shouldScroll
    );
    return;
  }

  const products = getProductsByArtisan(artisan.id);

  mountPage(
    artisan.name,
    `
      <div class="page">
        <div class="container">
          <div class="detail-grid">
            <div>
              <img class="gallery-main" src="${escapeHtml(artisan.image)}" alt="${escapeHtml(
                artisan.name
              )}" />
            </div>
            <div>
              <p class="eyebrow">${escapeHtml(artisan.specialty)}</p>
              <h1 class="detail-heading">${escapeHtml(artisan.name)}</h1>
              <p class="page-intro">${escapeHtml(artisan.bio)}</p>
              <div class="meta-row">
                <span class="pill">${escapeHtml(artisan.district)}</span>
                <span class="pill">${escapeHtml(artisan.yearsOfExperience)} years</span>
                <span class="pill">${escapeHtml(artisan.productCount)} products</span>
              </div>
              <p class="detail-copy">${escapeHtml(artisan.story)}</p>
              <div class="inline-actions">
                <a class="button secondary" href="/artisans">All Artisans</a>
                <a class="button ghost" href="/districts/${artisan.districtId}">View District</a>
              </div>
            </div>
          </div>

          <section class="section">
            <div class="section-heading">
              <p class="eyebrow">Products</p>
              <h2>Work by ${escapeHtml(artisan.name)}</h2>
            </div>
            <div class="grid three">
              ${products.length ? products.map(productCard).join("") : "<p class='small-text'>No products are currently assigned to this artisan.</p>"}
            </div>
          </section>
        </div>
      </div>
    `,
    null,
    shouldScroll
  );
}

function renderAboutPage(shouldScroll = true) {
  const siteContent = getSiteContent();
  const aboutContent = siteContent.about;

  mountPage(
    "About",
    `
      <div class="page">
        <section class="hero">
          <div class="container hero-grid">
            <div class="hero-copy">
              <p class="eyebrow">${escapeHtml(aboutContent.heroEyebrow)}</p>
              <h1>${escapeHtml(aboutContent.heroTitle)}</h1>
              <p class="page-intro">${escapeHtml(aboutContent.heroIntro)}</p>
            </div>
            <div class="hero-panel">
              <img src="/images/hero-banner.jpg" alt="Handmade craft collection" />
              <div class="panel-body">
                <p class="small-text">${escapeHtml(aboutContent.panelText)}</p>
              </div>
            </div>
          </div>
        </section>

        <section class="section alt">
          <div class="container">
            <div class="section-heading">
              <p class="eyebrow">${escapeHtml(aboutContent.valuesEyebrow)}</p>
              <h2>${escapeHtml(aboutContent.valuesTitle)}</h2>
            </div>
            <div class="grid four">
              ${aboutValues
                .map(
                  (value) => `
                    <article class="card">
                      <div class="card-body">
                        <h3 class="card-title">${escapeHtml(value.title)}</h3>
                        <p class="card-copy">${escapeHtml(value.description)}</p>
                      </div>
                    </article>
                  `
                )
                .join("")}
            </div>
          </div>
        </section>

        <section class="section">
          <div class="container">
            <div class="stats-grid">
              ${aboutStats
                .map(
                  (item) => `
                    <article class="stat-card">
                      <span>${escapeHtml(item.label)}</span>
                      <strong>${escapeHtml(item.value)}</strong>
                    </article>
                  `
                )
                .join("")}
            </div>
          </div>
        </section>

        <section class="section alt">
          <div class="container">
            <div class="section-heading">
              <p class="eyebrow">${escapeHtml(aboutContent.teamEyebrow)}</p>
              <h2>${escapeHtml(aboutContent.teamTitle)}</h2>
            </div>
            <div class="grid three">
              ${teamMembers
                .map(
                  (member) => `
                    <article class="card">
                      <img class="card-media tall" src="${escapeHtml(member.image)}" alt="${escapeHtml(
                        member.name
                      )}" />
                      <div class="card-body">
                        <h3 class="card-title">${escapeHtml(member.name)}</h3>
                        <p class="small-text">${escapeHtml(member.role)}</p>
                        <p class="card-copy">${escapeHtml(member.bio)}</p>
                      </div>
                    </article>
                  `
                )
                .join("")}
            </div>
          </div>
        </section>
      </div>
    `,
    null,
    shouldScroll
  );
}

function renderCartPage(shouldScroll = true) {
  const summary = getCartSummary();

  if (summary.items.length === 0) {
    mountPage(
      "Cart",
      renderAccessCard(
        "Your cart is empty",
        "Add some handmade products to your cart to begin checkout.",
        `${buttonLink("/products", "Continue Shopping", "primary")}`
      ),
      null,
      shouldScroll
    );
    return;
  }

  mountPage(
    "Cart",
    `
      <div class="page">
        <div class="container">
          <p class="eyebrow">Shopping cart</p>
          <h1 class="page-title">Your Cart</h1>
          <p class="page-intro">${summary.itemCount} item(s) ready for checkout.</p>

          <div class="split-layout spacer-top">
            <div class="table-wrap">
              ${summary.items
                .map(
                  (item) => `
                    <article class="cart-item">
                      <img class="cart-thumb" src="${escapeHtml(item.product.image)}" alt="${escapeHtml(
                        item.product.name
                      )}" />
                      <div>
                        <h3 class="card-title">${escapeHtml(item.product.name)}</h3>
                        <p class="small-text">${escapeHtml(item.product.category)} • ${escapeHtml(
                        item.product.district
                      )}</p>
                        <p class="price">${formatPrice(item.lineTotal)}</p>
                        <div class="quantity-control">
                          <button type="button" data-cart-action="decrease" data-product-id="${item.productId}">-</button>
                          <span class="quantity-value">${item.quantity}</span>
                          <button type="button" data-cart-action="increase" data-product-id="${item.productId}">+</button>
                          <button class="button ghost small" type="button" data-cart-action="remove" data-product-id="${item.productId}">Remove</button>
                        </div>
                      </div>
                      <div class="inline-actions">
                        <a class="button secondary small" href="/products/${item.productId}">View</a>
                      </div>
                    </article>
                  `
                )
                .join("")}
            </div>

            <aside class="summary-box sticky">
              <h2 class="summary-title">Order Summary</h2>
              <div class="summary-row"><span>Subtotal</span><strong>${formatPrice(summary.subtotal)}</strong></div>
              <div class="summary-row"><span>Shipping</span><strong>${summary.shipping === 0 ? "Free" : formatPrice(summary.shipping)}</strong></div>
              <div class="summary-row total"><span>Total</span><strong>${formatPrice(summary.total)}</strong></div>

              <div class="inline-actions spacer-top">
                <a class="button primary full" href="/checkout">Proceed to Checkout</a>
                <button class="button ghost full" id="clearCartButton" type="button">Clear Cart</button>
              </div>
            </aside>
          </div>
        </div>
      </div>
    `,
    () => {
      document.querySelectorAll("[data-cart-action]").forEach((button) => {
        button.addEventListener("click", () => {
          const productId = button.dataset.productId;
          const action = button.dataset.cartAction;
          const current = summary.items.find((item) => item.productId === productId);

          if (!current) {
            return;
          }

          if (action === "increase") {
            updateCartQuantity(productId, current.quantity + 1);
          }

          if (action === "decrease") {
            updateCartQuantity(productId, current.quantity - 1);
          }

          if (action === "remove") {
            removeCartItem(productId);
          }

          renderApp(false);
        });
      });

      document.getElementById("clearCartButton").addEventListener("click", () => {
        clearCart();
        showToast("Cart cleared.");
        renderApp(false);
      });
    },
    shouldScroll
  );
}

function renderCheckoutPage(shouldScroll = true) {
  const user = getCurrentUser();
  const summary = getCartSummary();

  if (!user) {
    mountPage(
      "Checkout",
      renderAccessCard(
        "Sign in to continue",
        "You need an account before placing an order.",
        `
          ${buttonLink("/auth/login?redirect=/checkout", "Sign In", "primary")}
          ${buttonLink("/auth/register?redirect=/checkout", "Create Account")}
        `
      ),
      null,
      shouldScroll
    );
    return;
  }

  if (summary.items.length === 0) {
    mountPage(
      "Checkout",
      renderAccessCard(
        "Your cart is empty",
        "Add products to your cart before using checkout.",
        buttonLink("/products", "Back to Products", "primary")
      ),
      null,
      shouldScroll
    );
    return;
  }

  mountPage(
    "Checkout",
    `
      <div class="page">
        <div class="container">
          <p class="eyebrow">Checkout</p>
          <h1 class="page-title">Place Your Order</h1>
          <p class="page-intro">Complete shipping details, choose payment, and confirm your purchase.</p>

          <div class="step-row">
            <div class="step is-done"><span class="step-circle">1</span><span>Shipping</span></div>
            <div class="step-line"></div>
            <div class="step is-active"><span class="step-circle">2</span><span>Payment</span></div>
            <div class="step-line"></div>
            <div class="step"><span class="step-circle">3</span><span>Review</span></div>
          </div>

          <div class="split-layout">
            <form id="checkoutForm" class="summary-box">
              <div id="checkoutError"></div>
              <div class="form-grid two">
                <div class="field">
                  <label for="checkoutFullName">Full Name</label>
                  <input id="checkoutFullName" name="fullName" value="${escapeHtml(
                    user.name || ""
                  )}" required />
                </div>
                <div class="field">
                  <label for="checkoutEmail">Email</label>
                  <input id="checkoutEmail" name="email" type="email" value="${escapeHtml(
                    user.email || ""
                  )}" required />
                </div>
                <div class="field">
                  <label for="checkoutPhone">Phone</label>
                  <input id="checkoutPhone" name="phone" value="${escapeHtml(
                    user.phone || ""
                  )}" required />
                </div>
                <div class="field">
                  <label for="checkoutPostalCode">Postal Code</label>
                  <input id="checkoutPostalCode" name="postalCode" value="" />
                </div>
              </div>

              <div class="form-grid two spacer-top">
                <div class="field">
                  <label for="checkoutCity">City</label>
                  <input id="checkoutCity" name="city" value="Dhaka" required />
                </div>
                <div class="field">
                  <label for="checkoutDistrict">District</label>
                  <input id="checkoutDistrict" name="district" value="Dhaka" required />
                </div>
              </div>

              <div class="field spacer-top">
                <label for="checkoutAddress">Street Address</label>
                <textarea id="checkoutAddress" name="address" required>${escapeHtml(
                  user.address || ""
                )}</textarea>
              </div>

              <div class="spacer-top">
                <p class="field-title">Payment Method</p>
                <div class="grid">
                  ${[
                    ["card", "Credit or Debit Card"],
                    ["bkash", "bKash"],
                    ["nagad", "Nagad"],
                    ["rocket", "Rocket"],
                    ["cod", "Cash on Delivery"]
                  ]
                    .map(
                      ([value, label], index) => `
                        <label class="radio-row">
                          <input type="radio" name="paymentMethod" value="${value}" ${
                        index === 0 ? "checked" : ""
                      } />
                          <span>${label}</span>
                        </label>
                      `
                    )
                    .join("")}
                </div>
              </div>

              <div class="inline-actions spacer-top">
                <button class="button primary" type="submit">Place Order</button>
                <a class="button secondary" href="/cart">Back to Cart</a>
              </div>
            </form>

            <aside class="summary-box sticky">
              <h2 class="summary-title">Order Summary</h2>
              <div class="mini-list">
                ${summary.items
                  .map(
                    (item) => `
                      <div class="mini-list-item">
                        <span>${escapeHtml(item.product.name)} x ${item.quantity}</span>
                        <strong>${formatPrice(item.lineTotal)}</strong>
                      </div>
                    `
                  )
                  .join("")}
              </div>
              <div class="summary-row"><span>Subtotal</span><strong>${formatPrice(summary.subtotal)}</strong></div>
              <div class="summary-row"><span>Shipping</span><strong>${summary.shipping === 0 ? "Free" : formatPrice(summary.shipping)}</strong></div>
              <div class="summary-row total"><span>Total</span><strong>${formatPrice(summary.total)}</strong></div>
            </aside>
          </div>
        </div>
      </div>
    `,
    () => {
      const form = document.getElementById("checkoutForm");
      const errorBox = document.getElementById("checkoutError");

      form.addEventListener("submit", (event) => {
        event.preventDefault();
        const formData = Object.fromEntries(new FormData(form).entries());
        const requiredKeys = [
          "fullName",
          "email",
          "phone",
          "city",
          "district",
          "address",
          "paymentMethod"
        ];

        const missing = requiredKeys.find((key) => !String(formData[key] || "").trim());

        if (missing) {
          errorBox.innerHTML = `<div class="notice error">Please complete all required checkout fields.</div>`;
          return;
        }

        const result = createOrder(formData);
        if (!result.ok) {
          errorBox.innerHTML = `<div class="notice error">${escapeHtml(result.message)}</div>`;
          return;
        }

        showToast("Order placed successfully.");
        navigate(`/order-confirmation/${result.order.id}`);
      });
    },
    shouldScroll
  );
}

function renderOrderConfirmationPage(orderId, shouldScroll = true) {
  const order = getOrderById(orderId);

  if (!order) {
    mountPage(
      "Order Not Found",
      renderAccessCard(
        "Order not found",
        "The order you requested does not exist in local demo storage.",
        buttonLink("/orders", "View Orders")
      ),
      null,
      shouldScroll
    );
    return;
  }

  const orderItems = order.items
    .map((item) => ({
      ...item,
      product: getProductById(item.productId)
    }))
    .filter((item) => item.product);

  const timeline = [
    { label: "Order Placed", active: true },
    { label: "Processing", active: order.status !== "cancelled" },
    {
      label: "Shipped",
      active: order.status === "shipped" || order.status === "completed"
    },
    { label: "Delivered", active: order.status === "completed" }
  ];

  mountPage(
    `Order ${order.id}`,
    `
      <div class="page">
        <div class="container">
          <div class="notice success">
            <strong>Order confirmed.</strong>
            Your order <code>${escapeHtml(order.id)}</code> has been saved in this browser.
          </div>

          <div class="split-layout spacer-top">
            <div class="grid">
              <article class="summary-box">
                <h2 class="summary-title">Order Items</h2>
                ${orderItems
                  .map(
                    (item) => `
                      <div class="cart-item" style="grid-template-columns:96px 1fr auto;">
                        <img class="cart-thumb" style="width:96px;height:96px;" src="${escapeHtml(
                          item.product.image
                        )}" alt="${escapeHtml(item.product.name)}" />
                        <div>
                          <h3 class="card-title">${escapeHtml(item.product.name)}</h3>
                          <p class="small-text">Quantity: ${item.quantity}</p>
                          <p class="small-text">${escapeHtml(item.product.category)} • ${escapeHtml(
                          item.product.district
                        )}</p>
                        </div>
                        <strong>${formatPrice(item.product.price * item.quantity)}</strong>
                      </div>
                    `
                  )
                  .join("")}
              </article>

              <article class="summary-box">
                <h2 class="summary-title">Shipping Address</h2>
                <p><strong>${escapeHtml(order.shippingAddress.fullName)}</strong></p>
                <p class="small-text">${escapeHtml(order.shippingAddress.address)}</p>
                <p class="small-text">${escapeHtml(order.shippingAddress.city)}, ${escapeHtml(
      order.shippingAddress.district
    )} ${escapeHtml(order.shippingAddress.postalCode || "")}</p>
                <p class="small-text">${escapeHtml(order.shippingAddress.phone)} • ${escapeHtml(
      order.shippingAddress.email
    )}</p>
              </article>

              <article class="summary-box">
                <h2 class="summary-title">Order Timeline</h2>
                <div class="timeline">
                  ${timeline
                    .map(
                      (item, index) => `
                        <div class="timeline-item">
                          <div class="timeline-dot${item.active ? " is-current" : ""}">${
                        index + 1
                      }</div>
                          <div>
                            <strong>${escapeHtml(item.label)}</strong>
                            <div class="small-text">${
                              index === 0 ? escapeHtml(formatDateTime(order.createdAt)) : "Status updates appear here in this demo flow."
                            }</div>
                          </div>
                        </div>
                      `
                    )
                    .join("")}
                </div>
              </article>
            </div>

            <aside class="summary-box sticky">
              <h2 class="summary-title">Order Summary</h2>
              <div class="summary-row"><span>Status</span><strong>${statusBadge(order.status)}</strong></div>
              <div class="summary-row"><span>Payment</span><strong>${escapeHtml(order.paymentMethod.toUpperCase())}</strong></div>
              <div class="summary-row"><span>Placed</span><strong>${escapeHtml(
                formatDate(order.createdAt)
              )}</strong></div>
              <div class="summary-row"><span>Subtotal</span><strong>${formatPrice(order.subtotal)}</strong></div>
              <div class="summary-row"><span>Shipping</span><strong>${order.shipping === 0 ? "Free" : formatPrice(order.shipping)}</strong></div>
              <div class="summary-row total"><span>Total</span><strong>${formatPrice(order.total)}</strong></div>
              <div class="inline-actions spacer-top">
                <a class="button primary full" href="/orders">View All Orders</a>
                <a class="button secondary full" href="/products">Continue Shopping</a>
              </div>
            </aside>
          </div>
        </div>
      </div>
    `,
    null,
    shouldScroll
  );
}

function renderOrdersPage(shouldScroll = true) {
  const user = getCurrentUser();

  if (!user) {
    mountPage(
      "Orders",
      renderAccessCard(
        "Sign in to see your orders",
        "Orders are saved per user in local browser storage.",
        `
          ${buttonLink("/auth/login?redirect=/orders", "Sign In", "primary")}
          ${buttonLink("/auth/register?redirect=/orders", "Create Account")}
        `
      ),
      null,
      shouldScroll
    );
    return;
  }

  const orders = getUserOrders(user.id);

  mountPage(
    "Orders",
    `
      <div class="page">
        <div class="container">
          <p class="eyebrow">Account</p>
          <h1 class="page-title">Your Orders</h1>
          <p class="page-intro">Track and review purchases placed from this browser profile.</p>

          ${
            orders.length === 0
              ? `
                <div class="center-card">
                  <h3 class="card-title">No orders yet</h3>
                  <p class="card-copy">Once you complete checkout, your orders will appear here.</p>
                  <div class="inline-actions">${buttonLink("/products", "Start Shopping", "primary")}</div>
                </div>
              `
              : `
                <div class="grid">
                  ${orders
                    .map(
                      (order) => `
                        <article class="summary-box">
                          <div class="meta-row">
                            <span class="pill">${escapeHtml(order.id)}</span>
                            <span class="pill">${escapeHtml(formatDate(order.createdAt))}</span>
                            ${statusBadge(order.status)}
                          </div>
                          <div class="summary-row"><span>Total</span><strong>${formatPrice(order.total)}</strong></div>
                          <div class="summary-row"><span>Payment</span><strong>${escapeHtml(order.paymentMethod.toUpperCase())}</strong></div>
                          <div class="summary-row"><span>Ship to</span><strong>${escapeHtml(
                            order.shippingAddress.fullName
                          )}</strong></div>
                          <div class="summary-row"><span>Address</span><strong>${escapeHtml(
                            `${order.shippingAddress.address}, ${order.shippingAddress.city}`
                          )}</strong></div>
                          <div class="inline-actions spacer-top">
                            <a class="button secondary small" href="/order-confirmation/${order.id}">View Details</a>
                          </div>
                        </article>
                      `
                    )
                    .join("")}
                </div>
              `
          }
        </div>
      </div>
    `,
    null,
    shouldScroll
  );
}

function renderAccountPage(shouldScroll = true) {
  const user = getCurrentUser();

  if (!user) {
    mountPage(
      "Account",
      renderAccessCard(
        "Sign in to manage your account",
        "Account details are stored locally for this demo.",
        `
          ${buttonLink("/auth/login?redirect=/account", "Sign In", "primary")}
          ${buttonLink("/auth/register?redirect=/account", "Create Account")}
        `
      ),
      null,
      shouldScroll
    );
    return;
  }

  mountPage(
    "Account",
    `
      <div class="page">
        <div class="container">
          <p class="eyebrow">Account</p>
          <h1 class="page-title">My Account</h1>
          <p class="page-intro">Edit your profile, review your orders, and access the admin area if available.</p>

          <div class="grid two spacer-top">
            <form id="accountForm" class="profile-box">
              <h2 class="summary-title">Profile Information</h2>
              <div class="profile-grid">
                <div class="field">
                  <label for="accountName">Full Name</label>
                  <input id="accountName" name="name" value="${escapeHtml(user.name || "")}" />
                </div>
                <div class="field">
                  <label for="accountEmail">Email</label>
                  <input id="accountEmail" name="email" type="email" value="${escapeHtml(
                    user.email || ""
                  )}" />
                </div>
                <div class="field">
                  <label for="accountPhone">Phone</label>
                  <input id="accountPhone" name="phone" value="${escapeHtml(user.phone || "")}" />
                </div>
                <div class="field">
                  <label for="accountRole">Role</label>
                  <input id="accountRole" value="${escapeHtml(user.role || "")}" disabled />
                </div>
              </div>
              <div class="field spacer-top">
                <label for="accountAddress">Address</label>
                <textarea id="accountAddress" name="address">${escapeHtml(
                  user.address || ""
                )}</textarea>
              </div>
              <div class="inline-actions spacer-top">
                <button class="button primary" type="submit">Save Changes</button>
              </div>
            </form>

            <div class="profile-box">
              <h2 class="summary-title">Quick Actions</h2>
              <div class="grid">
                <a class="button secondary full" href="/orders">View My Orders</a>
                <a class="button secondary full" href="/cart">View Cart</a>
                ${
                  isAdminUser(user)
                    ? `<a class="button primary full" href="/admin">Open Admin Dashboard</a>`
                    : ""
                }
                <button class="button ghost full" type="button" data-logout="true">Logout</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    `,
    () => {
      const form = document.getElementById("accountForm");
      form.addEventListener("submit", (event) => {
        event.preventDefault();
        const formData = Object.fromEntries(new FormData(form).entries());
        updateCurrentUser(formData);
        showToast("Account updated.");
        renderApp(false);
      });
    },
    shouldScroll
  );
}

function renderLoginPage(shouldScroll = true) {
  const searchParams = new URLSearchParams(window.location.search);
  const redirectTo = searchParams.get("redirect");
  const siteContent = getSiteContent();
  const authContent = siteContent.auth;

  mountPage(
    "Sign In",
    `
      <div class="page">
        <div class="container">
          <div class="center-card">
            <p class="eyebrow">${escapeHtml(authContent.loginEyebrow)}</p>
            <h1 class="page-title">${escapeHtml(authContent.loginTitle)}</h1>
            <p class="page-intro">${escapeHtml(authContent.loginIntro)}</p>

            <form id="loginForm" class="summary-box spacer-top" style="text-align:left;">
              <div id="loginError"></div>
              <div class="field">
                <label for="loginEmail">Email</label>
                <input id="loginEmail" name="email" type="email" placeholder="you@example.com" />
              </div>
              <div class="field spacer-top">
                <label for="loginPassword">Password</label>
                <input id="loginPassword" name="password" type="password" placeholder="demo123" />
              </div>
              <div class="inline-actions spacer-top">
                <button class="button primary" type="submit">Sign In</button>
                <a class="button secondary" href="/auth/register${redirectTo ? `?redirect=${encodeURIComponent(redirectTo)}` : ""}">Create Account</a>
              </div>
            </form>

            <div class="notice warning spacer-top" style="text-align:left;">
              <strong>${escapeHtml(authContent.demoTitle)}</strong><br />
              ${escapeHtml(authContent.demoCustomer)}<br />
              ${escapeHtml(authContent.demoAdmin)}
            </div>
          </div>
        </div>
      </div>
    `,
    () => {
      const form = document.getElementById("loginForm");
      const errorBox = document.getElementById("loginError");

      form.addEventListener("submit", (event) => {
        event.preventDefault();
        const formData = Object.fromEntries(new FormData(form).entries());
        const result = loginUser(formData.email || "", formData.password || "");

        if (!result.ok) {
          errorBox.innerHTML = `<div class="notice error">${escapeHtml(result.message)}</div>`;
          return;
        }

        showToast("Signed in successfully.");
        navigate(
          redirectTo ||
            (result.user.role === "admin" ? "/admin" : "/account")
        );
      });
    },
    shouldScroll
  );
}

function renderRegisterPage(shouldScroll = true) {
  const searchParams = new URLSearchParams(window.location.search);
  const redirectTo = searchParams.get("redirect");
  const siteContent = getSiteContent();
  const authContent = siteContent.auth;

  mountPage(
    "Register",
    `
      <div class="page">
        <div class="container">
          <div class="center-card">
            <p class="eyebrow">${escapeHtml(authContent.registerEyebrow)}</p>
            <h1 class="page-title">${escapeHtml(authContent.registerTitle)}</h1>
            <p class="page-intro">${escapeHtml(authContent.registerIntro)}</p>

            <form id="registerForm" class="summary-box spacer-top" style="text-align:left;">
              <div id="registerError"></div>
              <div class="field">
                <label for="registerName">Full Name</label>
                <input id="registerName" name="fullName" required />
              </div>
              <div class="field spacer-top">
                <label for="registerEmail">Email</label>
                <input id="registerEmail" name="email" type="email" required />
              </div>
              <div class="field spacer-top">
                <label for="registerPhone">Phone</label>
                <input id="registerPhone" name="phone" required />
              </div>
              <div class="field spacer-top">
                <label for="registerPassword">Password</label>
                <input id="registerPassword" name="password" type="password" minlength="6" required />
              </div>
              <div class="field spacer-top">
                <label for="registerConfirm">Confirm Password</label>
                <input id="registerConfirm" name="confirmPassword" type="password" minlength="6" required />
              </div>
              <div class="inline-actions spacer-top">
                <button class="button primary" type="submit">Create Account</button>
                <a class="button secondary" href="/auth/login${redirectTo ? `?redirect=${encodeURIComponent(redirectTo)}` : ""}">Already have an account</a>
              </div>
            </form>
          </div>
        </div>
      </div>
    `,
    () => {
      const form = document.getElementById("registerForm");
      const errorBox = document.getElementById("registerError");

      form.addEventListener("submit", (event) => {
        event.preventDefault();
        const formData = Object.fromEntries(new FormData(form).entries());

        if (formData.password !== formData.confirmPassword) {
          errorBox.innerHTML = `<div class="notice error">Passwords do not match.</div>`;
          return;
        }

        if (String(formData.password || "").length < 6) {
          errorBox.innerHTML = `<div class="notice error">Password must be at least 6 characters.</div>`;
          return;
        }

        const result = registerUser(formData);
        if (!result.ok) {
          errorBox.innerHTML = `<div class="notice error">${escapeHtml(result.message)}</div>`;
          return;
        }

        showToast("Account created successfully.");
        navigate(redirectTo || "/account");
      });
    },
    shouldScroll
  );
}

function adminTabs(pathname) {
  const tabs = [
    {
      href: "/admin",
      label: "Dashboard",
      active: pathname === "/admin"
    },
    {
      href: "/admin/products",
      label: "Products",
      active: pathname.startsWith("/admin/products")
    },
    {
      href: "/admin/orders",
      label: "Orders",
      active: pathname.startsWith("/admin/orders")
    },
    {
      href: "/admin/artisans",
      label: "Artisans",
      active: pathname.startsWith("/admin/artisans")
    },
    {
      href: "/admin/categories",
      label: "Categories",
      active: pathname.startsWith("/admin/categories")
    },
    {
      href: "/admin/districts",
      label: "Districts",
      active: pathname.startsWith("/admin/districts")
    },
    {
      href: "/admin/settings",
      label: "Settings",
      active: pathname.startsWith("/admin/settings")
    }
  ];

  return `
    <div class="admin-tabs">
      ${tabs
        .map(
          (tab) =>
            `<a class="admin-tab${tab.active ? " is-active" : ""}" href="${tab.href}">${tab.label}</a>`
        )
        .join("")}
    </div>
  `;
}

function adminShell(title, intro, body, shouldScroll = true) {
  const user = getCurrentUser();

  if (!isAdminUser(user)) {
    mountPage(
      "Admin Access",
      renderAccessCard(
        "Admin access required",
        "Sign in with the demo admin account to use the dashboard and management pages.",
        buttonLink("/auth/login?redirect=/admin", "Sign In as Admin", "primary")
      ),
      null,
      shouldScroll
    );
    return false;
  }

  mountPage(
    title,
    `
      <div class="page">
        <div class="container">
          <p class="eyebrow">Admin</p>
          <h1 class="admin-title">${title}</h1>
          <p class="page-intro">${intro}</p>
          ${adminTabs(getPath())}
          ${body}
        </div>
      </div>
    `,
    null,
    shouldScroll
  );

  return true;
}

function renderAdminDashboard(shouldScroll = true) {
  const products = getAdminProducts();
  const orders = getOrders();
  const artisans = getAdminArtisans();
  const categories = getAdminCategories();
  const totalRevenue = orders.reduce((sum, order) => sum + order.total, 0);

  const salesByProduct = {};
  orders.forEach((order) => {
    order.items.forEach((item) => {
      salesByProduct[item.productId] = (salesByProduct[item.productId] || 0) + item.quantity;
    });
  });

  const topProducts = [...getCatalogProducts()]
    .sort((first, second) => (salesByProduct[second.id] || 0) - (salesByProduct[first.id] || 0))
    .slice(0, 5);

  adminShell(
    "Admin Dashboard",
    "Review store performance, recent orders, and quick management links.",
    `
      <div class="stats-grid">
        <article class="stat-card">
          <span>Total Revenue</span>
          <strong>${formatPrice(totalRevenue)}</strong>
        </article>
        <article class="stat-card">
          <span>Total Orders</span>
          <strong>${orders.length}</strong>
        </article>
        <article class="stat-card">
          <span>Products</span>
          <strong>${products.length}</strong>
        </article>
        <article class="stat-card">
          <span>Active Artisans</span>
          <strong>${artisans.filter((item) => item.active !== false).length}</strong>
        </article>
      </div>

      <div class="grid two spacer-top">
        <article class="summary-box">
          <h2 class="summary-title">Quick Actions</h2>
          <div class="grid">
            <a class="button primary full" href="/admin/products/new">Add New Product</a>
            <a class="button secondary full" href="/admin/orders">Manage Orders</a>
            <a class="button secondary full" href="/admin/artisans">Manage Artisans</a>
            <a class="button secondary full" href="/admin/settings">Edit Settings</a>
          </div>
        </article>

        <article class="summary-box">
          <h2 class="summary-title">Catalog Overview</h2>
          <div class="summary-row"><span>Products</span><strong>${products.length}</strong></div>
          <div class="summary-row"><span>Categories</span><strong>${categories.length}</strong></div>
          <div class="summary-row"><span>Districts</span><strong>${getAdminDistricts().length}</strong></div>
          <div class="summary-row"><span>Customers</span><strong>${getRegisteredUsers().length + 1}</strong></div>
        </article>
      </div>

      <div class="grid two spacer-top">
        <article class="table-wrap">
          <div class="table-scroll">
            <table class="data-table">
              <thead>
                <tr>
                  <th colspan="4">Recent Orders</th>
                </tr>
                <tr>
                  <th>Order</th>
                  <th>Customer</th>
                  <th>Total</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                ${
                  orders.length
                    ? orders
                        .slice(0, 5)
                        .map(
                          (order) => `
                            <tr>
                              <td><a href="/order-confirmation/${order.id}">${escapeHtml(order.id)}</a></td>
                              <td>${escapeHtml(order.shippingAddress.fullName)}</td>
                              <td>${formatPrice(order.total)}</td>
                              <td>${statusBadge(order.status)}</td>
                            </tr>
                          `
                        )
                        .join("")
                    : `<tr><td colspan="4">No orders yet.</td></tr>`
                }
              </tbody>
            </table>
          </div>
        </article>

        <article class="table-wrap">
          <div class="table-scroll">
            <table class="data-table">
              <thead>
                <tr>
                  <th colspan="3">Top Products</th>
                </tr>
                <tr>
                  <th>Product</th>
                  <th>Sold</th>
                  <th>Price</th>
                </tr>
              </thead>
              <tbody>
                ${
                  topProducts.length
                    ? topProducts
                        .map(
                          (product) => `
                            <tr>
                              <td><a href="/products/${product.id}">${escapeHtml(product.name)}</a></td>
                              <td>${salesByProduct[product.id] || 0}</td>
                              <td>${formatPrice(product.price)}</td>
                            </tr>
                          `
                        )
                        .join("")
                    : `<tr><td colspan="3">No product data yet.</td></tr>`
                }
              </tbody>
            </table>
          </div>
        </article>
      </div>
    `,
    shouldScroll
  );
}

function renderAdminProductsPage(shouldScroll = true) {
  const rendered = adminShell(
    "Manage Products",
    "Create, edit, filter, and remove catalog products.",
    `
      <div class="toolbar">
        <div class="toolbar-grid four">
          <div class="field">
            <label for="adminProductSearch">Search</label>
            <input id="adminProductSearch" type="search" placeholder="Product name or id" />
          </div>
          <div class="field">
            <label for="adminProductCategory">Category</label>
            <select id="adminProductCategory">
              <option value="all">All categories</option>
              ${getAdminCategories()
                .map(
                  (category) => `<option value="${category.id}">${escapeHtml(category.name)}</option>`
                )
                .join("")}
            </select>
          </div>
          <div class="field">
            <label for="adminProductDistrict">District</label>
            <select id="adminProductDistrict">
              <option value="all">All districts</option>
              ${getAdminDistricts()
                .map(
                  (district) => `<option value="${district.id}">${escapeHtml(district.name)}</option>`
                )
                .join("")}
            </select>
          </div>
          <div class="inline-actions" style="align-items:end;">
            <a class="button primary" href="/admin/products/new">Add Product</a>
          </div>
        </div>
      </div>

      <div class="table-wrap spacer-top">
        <div class="table-scroll">
          <table class="data-table">
            <thead>
              <tr>
                <th>Product</th>
                <th>Category</th>
                <th>District</th>
                <th>Price</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody id="adminProductsBody"></tbody>
          </table>
        </div>
      </div>
    `,
    shouldScroll
  );

  if (!rendered) {
    return;
  }

  const searchInput = document.getElementById("adminProductSearch");
  const categorySelect = document.getElementById("adminProductCategory");
  const districtSelect = document.getElementById("adminProductDistrict");
  const body = document.getElementById("adminProductsBody");

  function draw() {
    const searchValue = searchInput.value.trim().toLowerCase();
    const categoryValue = categorySelect.value;
    const districtValue = districtSelect.value;

    const products = getAdminProducts().filter((product) => {
      const matchesSearch =
        !searchValue ||
        product.name.toLowerCase().includes(searchValue) ||
        product.id.toLowerCase().includes(searchValue);

      const matchesCategory =
        categoryValue === "all" || product.category === categoryValue;

      const matchesDistrict =
        districtValue === "all" || product.district === districtValue;

      return matchesSearch && matchesCategory && matchesDistrict;
    });

    body.innerHTML = products.length
      ? products
          .map(
            (product) => `
              <tr>
                <td>
                  <strong>${escapeHtml(product.name)}</strong><br />
                  <span class="small-text">${escapeHtml(product.id)}</span>
                </td>
                <td>${escapeHtml(
                  getAdminCategories().find((item) => item.id === product.category)?.name || product.category
                )}</td>
                <td>${escapeHtml(
                  getAdminDistricts().find((item) => item.id === product.district)?.name || product.district
                )}</td>
                <td>${formatPrice(product.price)}</td>
                <td>${product.inStock ? "In Stock" : "Out of Stock"}</td>
                <td>
                  <div class="inline-actions">
                    <a class="button secondary small" href="/admin/products/${product.id}/edit">Edit</a>
                    <button class="button ghost small" type="button" data-delete-product="${product.id}">Delete</button>
                  </div>
                </td>
              </tr>
            `
          )
          .join("")
      : `<tr><td colspan="6">No products match the current filters.</td></tr>`;

    document.querySelectorAll("[data-delete-product]").forEach((button) => {
      button.addEventListener("click", () => {
        const productId = button.dataset.deleteProduct;
        const currentProducts = getAdminProducts();
        const target = currentProducts.find((item) => item.id === productId);
        if (!target) {
          return;
        }

        if (!window.confirm(`Delete "${target.name}"?`)) {
          return;
        }

        saveAdminProducts(currentProducts.filter((item) => item.id !== productId));
        deleteProductReviews(productId);
        showToast("Product deleted.");
        draw();
        renderShell(getPath());
      });
    });
  }

  [searchInput, categorySelect, districtSelect].forEach((element) => {
    element.addEventListener("input", draw);
    element.addEventListener("change", draw);
  });

  draw();
}

function renderAdminProductFormPage(productId, shouldScroll = true) {
  const isEdit = Boolean(productId);
  const products = getAdminProducts();
  const product = isEdit ? products.find((item) => item.id === productId) : null;

  if (isEdit && !product) {
    mountPage(
      "Product Not Found",
      renderAccessCard(
        "Product not found",
        "The admin product you are trying to edit does not exist.",
        buttonLink("/admin/products", "Back to Products")
      ),
      null,
      shouldScroll
    );
    return;
  }

  const rendered = adminShell(
    isEdit ? "Edit Product" : "Add Product",
    isEdit
      ? "Update catalog information for an existing product."
      : "Create a new product and publish it into the public catalog.",
    `
      <form id="adminProductForm" class="summary-box">
        <div class="form-grid two">
          <div class="field">
            <label for="formProductName">Product Name</label>
            <input id="formProductName" name="name" value="${escapeHtml(product?.name || "")}" required />
          </div>
          <div class="field">
            <label for="formProductImage">Primary Image URL or /images path</label>
            <input id="formProductImage" name="image" value="${escapeHtml(product?.image || "/images/products/jamdani-saree.jpg")}" required />
          </div>
          <div class="field">
            <label for="formProductPrice">Price</label>
            <input id="formProductPrice" name="price" type="number" min="0" value="${escapeHtml(
              product?.price || 0
            )}" required />
          </div>
          <div class="field">
            <label for="formProductOriginalPrice">Original Price</label>
            <input id="formProductOriginalPrice" name="originalPrice" type="number" min="0" value="${escapeHtml(
              product?.originalPrice || product?.price || 0
            )}" />
          </div>
          <div class="field">
            <label for="formProductCategory">Category</label>
            <select id="formProductCategory" name="category" required>
              ${getAdminCategories()
                .map(
                  (category) => `
                    <option value="${category.id}" ${
                    category.id === product?.category ? "selected" : ""
                  }>${escapeHtml(category.name)}</option>
                  `
                )
                .join("")}
            </select>
          </div>
          <div class="field">
            <label for="formProductDistrict">District</label>
            <select id="formProductDistrict" name="district" required>
              ${getAdminDistricts()
                .map(
                  (district) => `
                    <option value="${district.id}" ${
                    district.id === product?.district ? "selected" : ""
                  }>${escapeHtml(district.name)}</option>
                  `
                )
                .join("")}
            </select>
          </div>
          <div class="field">
            <label for="formProductArtisan">Artisan</label>
            <select id="formProductArtisan" name="artisan">
              <option value="">No artisan selected</option>
              ${getAdminArtisans()
                .map(
                  (artisan) => `
                    <option value="${artisan.id}" ${
                    artisan.id === product?.artisan ? "selected" : ""
                  }>${escapeHtml(artisan.name)}</option>
                  `
                )
                .join("")}
            </select>
          </div>
          <div class="field">
            <label for="formProductImages">Gallery Images (comma separated)</label>
            <input id="formProductImages" name="images" value="${escapeHtml(
              (product?.images || [product?.image || "/images/products/jamdani-saree.jpg"]).join(", ")
            )}" />
          </div>
        </div>

        <div class="field spacer-top">
          <label for="formProductDescription">Description</label>
          <textarea id="formProductDescription" name="description" required>${escapeHtml(
            product?.description || ""
          )}</textarea>
        </div>

        <div class="grid two spacer-top">
          <div class="field">
            <label for="formProductProcess">Craft Process</label>
            <textarea id="formProductProcess" name="craftProcess">${escapeHtml(
              product?.craftProcess || ""
            )}</textarea>
          </div>
          <div class="field">
            <label for="formProductCulture">Cultural Significance</label>
            <textarea id="formProductCulture" name="culturalSignificance">${escapeHtml(
              product?.culturalSignificance || ""
            )}</textarea>
          </div>
        </div>

        <label class="checkbox-row spacer-top">
          <input id="formProductStock" name="inStock" type="checkbox" ${
            product?.inStock !== false ? "checked" : ""
          } />
          <span>Product is in stock</span>
        </label>

        <div class="notice warning spacer-top">
          Product ratings and review counts now update automatically from customer reviews.
        </div>

        <div class="inline-actions spacer-top">
          <button class="button primary" type="submit">${isEdit ? "Save Product" : "Create Product"}</button>
          <a class="button secondary" href="/admin/products">Cancel</a>
        </div>
      </form>
    `,
    shouldScroll
  );

  if (!rendered) {
    return;
  }

  const form = document.getElementById("adminProductForm");
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const formData = new FormData(form);
    const currentProducts = getAdminProducts();
    const name = String(formData.get("name") || "").trim();
    const productRecord = {
      id:
        product?.id ||
        `${slugify(name || "product")}-${String(Date.now()).slice(-6)}`,
      name,
      price: Number(formData.get("price") || 0),
      originalPrice: Number(formData.get("originalPrice") || 0),
      category: String(formData.get("category") || ""),
      district: String(formData.get("district") || ""),
      artisan: String(formData.get("artisan") || ""),
      description: String(formData.get("description") || ""),
      craftProcess: String(formData.get("craftProcess") || ""),
      culturalSignificance: String(formData.get("culturalSignificance") || ""),
      image: String(formData.get("image") || "/images/products/jamdani-saree.jpg").trim(),
      images: String(formData.get("images") || "")
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean),
      inStock: formData.get("inStock") === "on",
      createdAt: product?.createdAt || new Date().toISOString()
    };

    if (isEdit) {
      saveAdminProducts(
        currentProducts.map((item) => (item.id === product.id ? productRecord : item))
      );
      showToast("Product updated.");
    } else {
      saveAdminProducts([productRecord, ...currentProducts]);
      showToast("Product created.");
    }

    navigate("/admin/products");
  });
}

function renderAdminOrdersPage(shouldScroll = true) {
  const rendered = adminShell(
    "Manage Orders",
    "Filter orders and update their fulfillment status.",
    `
      <div class="toolbar">
        <div class="toolbar-grid two">
          <div class="field">
            <label for="adminOrderSearch">Search orders</label>
            <input id="adminOrderSearch" type="search" placeholder="Order id, customer, or email" />
          </div>
          <div class="field">
            <label for="adminOrderStatus">Status</label>
            <select id="adminOrderStatus">
              <option value="all">All statuses</option>
              ${ORDER_STATUSES.map((status) => `<option value="${status}">${escapeHtml(status)}</option>`).join("")}
            </select>
          </div>
        </div>
      </div>

      <div class="table-wrap spacer-top">
        <div class="table-scroll">
          <table class="data-table">
            <thead>
              <tr>
                <th>Order</th>
                <th>Customer</th>
                <th>Total</th>
                <th>Placed</th>
                <th>Status</th>
                <th>View</th>
              </tr>
            </thead>
            <tbody id="adminOrdersBody"></tbody>
          </table>
        </div>
      </div>
    `,
    shouldScroll
  );

  if (!rendered) {
    return;
  }

  const searchInput = document.getElementById("adminOrderSearch");
  const statusSelect = document.getElementById("adminOrderStatus");
  const body = document.getElementById("adminOrdersBody");

  function draw() {
    const searchValue = searchInput.value.trim().toLowerCase();
    const statusValue = statusSelect.value;

    const orders = getOrders().filter((order) => {
      const matchesSearch =
        !searchValue ||
        order.id.toLowerCase().includes(searchValue) ||
        order.shippingAddress.fullName.toLowerCase().includes(searchValue) ||
        order.shippingAddress.email.toLowerCase().includes(searchValue);

      const matchesStatus =
        statusValue === "all" || order.status === statusValue;

      return matchesSearch && matchesStatus;
    });

    body.innerHTML = orders.length
      ? orders
          .map(
            (order) => `
              <tr>
                <td>${escapeHtml(order.id)}</td>
                <td>${escapeHtml(order.shippingAddress.fullName)}<br /><span class="small-text">${escapeHtml(
              order.shippingAddress.email
            )}</span></td>
                <td>${formatPrice(order.total)}</td>
                <td>${escapeHtml(formatDate(order.createdAt))}</td>
                <td>
                  <select data-order-status="${order.id}">
                    ${ORDER_STATUSES.map(
                      (status) =>
                        `<option value="${status}" ${status === order.status ? "selected" : ""}>${escapeHtml(
                          status
                        )}</option>`
                    ).join("")}
                  </select>
                </td>
                <td><a class="button secondary small" href="/order-confirmation/${order.id}">View</a></td>
              </tr>
            `
          )
          .join("")
      : `<tr><td colspan="6">No orders match the current filters.</td></tr>`;

    document.querySelectorAll("[data-order-status]").forEach((select) => {
      select.addEventListener("change", () => {
        updateOrderStatus(select.dataset.orderStatus, select.value);
        showToast("Order status updated.");
        draw();
      });
    });
  }

  [searchInput, statusSelect].forEach((element) => {
    element.addEventListener("input", draw);
    element.addEventListener("change", draw);
  });

  draw();
}

function renderAdminArtisansPage(shouldScroll = true) {
  const rendered = adminShell(
    "Manage Artisans",
    "Add artisan profiles and control whether they are visible in the storefront.",
    `
      <div class="summary-box">
        <form id="adminArtisanForm">
          <div class="form-grid three">
            <div class="field">
              <label for="artisanName">Name</label>
              <input id="artisanName" name="name" required />
            </div>
            <div class="field">
              <label for="artisanDistrict">District</label>
              <select id="artisanDistrict" name="districtId" required>
                ${getAdminDistricts()
                  .map(
                    (district) =>
                      `<option value="${district.id}">${escapeHtml(district.name)}</option>`
                  )
                  .join("")}
              </select>
            </div>
            <div class="field">
              <label for="artisanSpecialty">Specialty</label>
              <input id="artisanSpecialty" name="specialty" required />
            </div>
          </div>
          <div class="form-grid two spacer-top">
            <div class="field">
              <label for="artisanImage">Image URL or /images path</label>
              <input id="artisanImage" name="image" value="/images/artisans/fatima-begum.jpg" required />
            </div>
            <div class="field">
              <label for="artisanYears">Years of Experience</label>
              <input id="artisanYears" name="yearsOfExperience" type="number" min="0" value="10" required />
            </div>
          </div>
          <div class="field spacer-top">
            <label for="artisanBio">Bio</label>
            <textarea id="artisanBio" name="bio" required></textarea>
          </div>
          <div class="inline-actions spacer-top">
            <button class="button primary" type="submit">Add Artisan</button>
          </div>
        </form>
      </div>

      <div class="table-wrap spacer-top">
        <div class="table-scroll">
          <table class="data-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>District</th>
                <th>Specialty</th>
                <th>Active</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody id="adminArtisansBody"></tbody>
          </table>
        </div>
      </div>
    `,
    shouldScroll
  );

  if (!rendered) {
    return;
  }

  const form = document.getElementById("adminArtisanForm");
  const body = document.getElementById("adminArtisansBody");

  function draw() {
    const artisans = getAdminArtisans();
    body.innerHTML = artisans
      .map(
        (artisan) => `
          <tr>
            <td>${escapeHtml(artisan.name)}</td>
            <td>${escapeHtml(artisan.district)}</td>
            <td>${escapeHtml(artisan.specialty)}</td>
            <td><input type="checkbox" data-artisan-active="${artisan.id}" ${
          artisan.active !== false ? "checked" : ""
        } /></td>
            <td>
              <button class="button ghost small" type="button" data-artisan-delete="${artisan.id}">Delete</button>
            </td>
          </tr>
        `
      )
      .join("");

    document.querySelectorAll("[data-artisan-active]").forEach((checkbox) => {
      checkbox.addEventListener("change", () => {
        const updated = getAdminArtisans().map((artisan) =>
          artisan.id === checkbox.dataset.artisanActive
            ? { ...artisan, active: checkbox.checked }
            : artisan
        );
        saveAdminArtisans(updated);
        showToast("Artisan visibility updated.");
      });
    });

    document.querySelectorAll("[data-artisan-delete]").forEach((button) => {
      button.addEventListener("click", () => {
        if (!window.confirm("Delete this artisan?")) {
          return;
        }

        saveAdminArtisans(
          getAdminArtisans().filter((artisan) => artisan.id !== button.dataset.artisanDelete)
        );
        draw();
        showToast("Artisan deleted.");
      });
    });
  }

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const formData = Object.fromEntries(new FormData(form).entries());
    const district = getAdminDistricts().find((item) => item.id === formData.districtId);
    const artisans = getAdminArtisans();

    artisans.unshift({
      id: makeId("artisan"),
      name: String(formData.name || "").trim(),
      image: String(formData.image || "").trim(),
      district: district?.name || "Unknown",
      districtId: district?.id || "",
      specialty: String(formData.specialty || "").trim(),
      bio: String(formData.bio || "").trim(),
      story: String(formData.bio || "").trim(),
      yearsOfExperience: Number(formData.yearsOfExperience || 0),
      productCount: 0,
      active: true,
      createdAt: new Date().toISOString()
    });

    saveAdminArtisans(artisans);
    form.reset();
    showToast("Artisan added.");
    draw();
  });

  draw();
}

function renderAdminCategoriesPage(shouldScroll = true) {
  const rendered = adminShell(
    "Manage Categories",
    "Create category records used by the public catalog and product forms.",
    `
      <div class="summary-box">
        <form id="adminCategoryForm">
          <div class="form-grid two">
            <div class="field">
              <label for="categoryName">Name</label>
              <input id="categoryName" name="name" required />
            </div>
            <div class="field">
              <label for="categoryImage">Image URL or /images path</label>
              <input id="categoryImage" name="image" value="/images/products/jamdani-saree.jpg" required />
            </div>
          </div>
          <div class="field spacer-top">
            <label for="categoryDescription">Description</label>
            <textarea id="categoryDescription" name="description" required></textarea>
          </div>
          <div class="inline-actions spacer-top">
            <button class="button primary" type="submit">Add Category</button>
          </div>
        </form>
      </div>

      <div class="table-wrap spacer-top">
        <div class="table-scroll">
          <table class="data-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Products</th>
                <th>Active</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody id="adminCategoriesBody"></tbody>
          </table>
        </div>
      </div>
    `,
    shouldScroll
  );

  if (!rendered) {
    return;
  }

  const form = document.getElementById("adminCategoryForm");
  const body = document.getElementById("adminCategoriesBody");

  function draw() {
    const categories = getAdminCategories();
    body.innerHTML = categories
      .map(
        (category) => `
          <tr>
            <td>${escapeHtml(category.name)}</td>
            <td>${escapeHtml(category.productCount || 0)}</td>
            <td><input type="checkbox" data-category-active="${category.id}" ${
          category.active !== false ? "checked" : ""
        } /></td>
            <td><button class="button ghost small" type="button" data-category-delete="${category.id}">Delete</button></td>
          </tr>
        `
      )
      .join("");

    document.querySelectorAll("[data-category-active]").forEach((checkbox) => {
      checkbox.addEventListener("change", () => {
        const updated = getAdminCategories().map((category) =>
          category.id === checkbox.dataset.categoryActive
            ? { ...category, active: checkbox.checked }
            : category
        );
        saveAdminCategories(updated);
        showToast("Category visibility updated.");
      });
    });

    document.querySelectorAll("[data-category-delete]").forEach((button) => {
      button.addEventListener("click", () => {
        if (!window.confirm("Delete this category?")) {
          return;
        }

        saveAdminCategories(
          getAdminCategories().filter((category) => category.id !== button.dataset.categoryDelete)
        );
        draw();
        showToast("Category deleted.");
      });
    });
  }

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const formData = Object.fromEntries(new FormData(form).entries());
    const categories = getAdminCategories();

    categories.unshift({
      id: slugify(String(formData.name || "")) || makeId("category"),
      name: String(formData.name || "").trim(),
      image: String(formData.image || "").trim(),
      description: String(formData.description || "").trim(),
      productCount: 0,
      active: true,
      createdAt: new Date().toISOString()
    });

    saveAdminCategories(categories);
    form.reset();
    showToast("Category added.");
    draw();
  });

  draw();
}

function renderAdminDistrictsPage(shouldScroll = true) {
  const rendered = adminShell(
    "Manage Districts",
    "Control the district list used for filtering, artisan profiles, and product details.",
    `
      <div class="summary-box">
        <form id="adminDistrictForm">
          <div class="form-grid three">
            <div class="field">
              <label for="districtName">Name</label>
              <input id="districtName" name="name" required />
            </div>
            <div class="field">
              <label for="districtDivision">Division</label>
              <input id="districtDivision" name="division" required />
            </div>
            <div class="field">
              <label for="districtImage">Image URL or /images path</label>
              <input id="districtImage" name="image" value="/images/districts/dhaka.jpg" required />
            </div>
          </div>
          <div class="field spacer-top">
            <label for="districtDescription">Description</label>
            <textarea id="districtDescription" name="description" required></textarea>
          </div>
          <div class="inline-actions spacer-top">
            <button class="button primary" type="submit">Add District</button>
          </div>
        </form>
      </div>

      <div class="table-wrap spacer-top">
        <div class="table-scroll">
          <table class="data-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Division</th>
                <th>Active</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody id="adminDistrictsBody"></tbody>
          </table>
        </div>
      </div>
    `,
    shouldScroll
  );

  if (!rendered) {
    return;
  }

  const form = document.getElementById("adminDistrictForm");
  const body = document.getElementById("adminDistrictsBody");

  function draw() {
    const districts = getAdminDistricts();
    body.innerHTML = districts
      .map(
        (district) => `
          <tr>
            <td>${escapeHtml(district.name)}</td>
            <td>${escapeHtml(district.division)}</td>
            <td><input type="checkbox" data-district-active="${district.id}" ${
          district.active !== false ? "checked" : ""
        } /></td>
            <td><button class="button ghost small" type="button" data-district-delete="${district.id}">Delete</button></td>
          </tr>
        `
      )
      .join("");

    document.querySelectorAll("[data-district-active]").forEach((checkbox) => {
      checkbox.addEventListener("change", () => {
        const updated = getAdminDistricts().map((district) =>
          district.id === checkbox.dataset.districtActive
            ? { ...district, active: checkbox.checked }
            : district
        );
        saveAdminDistricts(updated);
        showToast("District visibility updated.");
      });
    });

    document.querySelectorAll("[data-district-delete]").forEach((button) => {
      button.addEventListener("click", () => {
        if (!window.confirm("Delete this district?")) {
          return;
        }

        saveAdminDistricts(
          getAdminDistricts().filter((district) => district.id !== button.dataset.districtDelete)
        );
        draw();
        showToast("District deleted.");
      });
    });
  }

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const formData = Object.fromEntries(new FormData(form).entries());
    const districts = getAdminDistricts();

    districts.unshift({
      id: slugify(String(formData.name || "")) || makeId("district"),
      name: String(formData.name || "").trim(),
      division: String(formData.division || "").trim(),
      image: String(formData.image || "").trim(),
      description: String(formData.description || "").trim(),
      productCount: 0,
      active: true,
      createdAt: new Date().toISOString()
    });

    saveAdminDistricts(districts);
    form.reset();
    showToast("District added.");
    draw();
  });

  draw();
}

function renderAdminSettingsPageLegacy(shouldScroll = true) {
  const settings = getAdminSettings();
  const rendered = adminShell(
    "Store Settings",
    "Update shipping rules, contact details, currency display, and maintenance mode.",
    `
      <form id="adminSettingsForm" class="summary-box">
        <div class="form-grid two">
          <div class="field">
            <label for="settingStoreName">Store Name</label>
            <input id="settingStoreName" name="storeName" value="${escapeHtml(settings.storeName)}" />
          </div>
          <div class="field">
            <label for="settingStoreEmail">Store Email</label>
            <input id="settingStoreEmail" name="storeEmail" value="${escapeHtml(settings.storeEmail)}" />
          </div>
          <div class="field">
            <label for="settingStorePhone">Store Phone</label>
            <input id="settingStorePhone" name="storePhone" value="${escapeHtml(settings.storePhone)}" />
          </div>
          <div class="field">
            <label for="settingCurrency">Currency Symbol</label>
            <input id="settingCurrency" name="currencySymbol" value="${escapeHtml(settings.currencySymbol)}" />
          </div>
          <div class="field">
            <label for="settingShippingFee">Shipping Fee</label>
            <input id="settingShippingFee" name="shippingFee" type="number" min="0" value="${escapeHtml(
              settings.shippingFee
            )}" />
          </div>
          <div class="field">
            <label for="settingFreeShipping">Free Shipping Threshold</label>
            <input id="settingFreeShipping" name="freeShippingThreshold" type="number" min="0" value="${escapeHtml(
              settings.freeShippingThreshold
            )}" />
          </div>
        </div>

        <div class="field spacer-top">
          <label for="settingStoreAddress">Store Address</label>
          <textarea id="settingStoreAddress" name="storeAddress">${escapeHtml(
            settings.storeAddress
          )}</textarea>
        </div>

        <label class="checkbox-row spacer-top">
          <input id="settingMaintenance" name="maintenanceMode" type="checkbox" ${
            settings.maintenanceMode ? "checked" : ""
          } />
          <span>Maintenance mode</span>
        </label>

        <div class="inline-actions spacer-top">
          <button class="button primary" type="submit">Save Settings</button>
          <button class="button secondary" id="settingsReset" type="button">Reset</button>
        </div>
      </form>
    `,
    shouldScroll
  );

  if (!rendered) {
    return;
  }

  const form = document.getElementById("adminSettingsForm");
  const resetButton = document.getElementById("settingsReset");

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const formData = Object.fromEntries(new FormData(form).entries());
    saveAdminSettings({
      ...settings,
      storeName: String(formData.storeName || "").trim(),
      storeEmail: String(formData.storeEmail || "").trim(),
      storePhone: String(formData.storePhone || "").trim(),
      storeAddress: String(formData.storeAddress || "").trim(),
      currencySymbol: String(formData.currencySymbol || "BDT").trim(),
      shippingFee: Number(formData.shippingFee || 0),
      freeShippingThreshold: Number(formData.freeShippingThreshold || 0),
      lowStockThreshold: settings.lowStockThreshold,
      maintenanceMode: formData.maintenanceMode === "on"
    });
    showToast("Settings saved.");
    renderApp(false);
  });

  resetButton.addEventListener("click", () => {
    saveAdminSettings({
      storeName: "Bangladesh Heritage",
      storeEmail: "admin@heritage.com",
      storePhone: "+880 1700 000000",
      storeAddress: "Dhaka, Bangladesh",
      currencySymbol: "BDT",
      shippingFee: 200,
      freeShippingThreshold: 5000,
      lowStockThreshold: 5,
      maintenanceMode: false
    });
    showToast("Settings reset.");
    renderApp(false);
  });
}

function renderAdminSettingsPage(shouldScroll = true) {
  const settings = getAdminSettings();
  const content = getSiteContent();
  const homeContent = content.home;
  const rendered = adminShell(
    "Store Settings",
    "Update shipping rules, contact details, currency display, and the landing page content.",
    `
      <form id="adminSettingsForm" class="summary-box">
        <h3 class="summary-title">Store settings</h3>
        <div class="form-grid two">
          <div class="field">
            <label for="settingStoreName">Store Name</label>
            <input id="settingStoreName" name="storeName" value="${escapeHtml(settings.storeName)}" />
          </div>
          <div class="field">
            <label for="settingStoreEmail">Store Email</label>
            <input id="settingStoreEmail" name="storeEmail" value="${escapeHtml(settings.storeEmail)}" />
          </div>
          <div class="field">
            <label for="settingStorePhone">Store Phone</label>
            <input id="settingStorePhone" name="storePhone" value="${escapeHtml(settings.storePhone)}" />
          </div>
          <div class="field">
            <label for="settingCurrency">Currency Symbol</label>
            <input id="settingCurrency" name="currencySymbol" value="${escapeHtml(settings.currencySymbol)}" />
          </div>
          <div class="field">
            <label for="settingShippingFee">Shipping Fee</label>
            <input id="settingShippingFee" name="shippingFee" type="number" min="0" value="${escapeHtml(
              settings.shippingFee
            )}" />
          </div>
          <div class="field">
            <label for="settingFreeShipping">Free Shipping Threshold</label>
            <input id="settingFreeShipping" name="freeShippingThreshold" type="number" min="0" value="${escapeHtml(
              settings.freeShippingThreshold
            )}" />
          </div>
        </div>

        <div class="field spacer-top">
          <label for="settingStoreAddress">Store Address</label>
          <textarea id="settingStoreAddress" name="storeAddress">${escapeHtml(
            settings.storeAddress
          )}</textarea>
        </div>

        <label class="checkbox-row spacer-top">
          <input id="settingMaintenance" name="maintenanceMode" type="checkbox" ${
            settings.maintenanceMode ? "checked" : ""
          } />
          <span>Maintenance mode</span>
        </label>

        <div class="inline-actions spacer-top">
          <button class="button primary" type="submit">Save Store Settings</button>
          <button class="button secondary" id="settingsReset" type="button">Reset Store Settings</button>
        </div>
      </form>

      <form id="landingContentForm" class="summary-box spacer-top">
        <h3 class="summary-title">Landing page content</h3>

        <div class="form-grid two">
          <div class="field">
            <label for="landingBrandName">Brand Name</label>
            <input id="landingBrandName" name="brandName" value="${escapeHtml(content.brand.name)}" />
          </div>
          <div class="field">
            <label for="landingBrandTagline">Brand Tagline</label>
            <input id="landingBrandTagline" name="brandTagline" value="${escapeHtml(
              content.brand.tagline
            )}" />
          </div>
          <div class="field">
            <label for="landingHeroEyebrow">Hero Eyebrow</label>
            <input id="landingHeroEyebrow" name="heroEyebrow" value="${escapeHtml(
              homeContent.heroEyebrow
            )}" />
          </div>
          <div class="field">
            <label for="landingHeroTitle">Hero Title</label>
            <input id="landingHeroTitle" name="heroTitle" value="${escapeHtml(
              homeContent.heroTitle
            )}" />
          </div>
          <div class="field">
            <label for="landingSearchLabel">Search Label</label>
            <input id="landingSearchLabel" name="searchLabel" value="${escapeHtml(
              homeContent.searchLabel
            )}" />
          </div>
          <div class="field">
            <label for="landingSearchPlaceholder">Search Placeholder</label>
            <input id="landingSearchPlaceholder" name="searchPlaceholder" value="${escapeHtml(
              homeContent.searchPlaceholder
            )}" />
          </div>
          <div class="field">
            <label for="landingSearchButton">Search Button</label>
            <input id="landingSearchButton" name="searchButton" value="${escapeHtml(
              homeContent.searchButton
            )}" />
          </div>
          <div class="field">
            <label for="landingBrowseButton">Browse Button</label>
            <input id="landingBrowseButton" name="browseButton" value="${escapeHtml(
              homeContent.browseButton
            )}" />
          </div>
          <div class="field">
            <label for="landingPanelEyebrow">Feature Panel Eyebrow</label>
            <input id="landingPanelEyebrow" name="panelEyebrow" value="${escapeHtml(
              homeContent.panelEyebrow
            )}" />
          </div>
          <div class="field">
            <label for="landingPanelTitle">Feature Panel Title</label>
            <input id="landingPanelTitle" name="panelTitle" value="${escapeHtml(
              homeContent.panelTitle
            )}" />
          </div>
          <div class="field">
            <label for="landingDistrictsEyebrow">District Section Eyebrow</label>
            <input id="landingDistrictsEyebrow" name="districtsEyebrow" value="${escapeHtml(
              homeContent.districtsEyebrow
            )}" />
          </div>
          <div class="field">
            <label for="landingDistrictsTitle">District Section Title</label>
            <input id="landingDistrictsTitle" name="districtsTitle" value="${escapeHtml(
              homeContent.districtsTitle
            )}" />
          </div>
          <div class="field">
            <label for="landingProductsEyebrow">Product Section Eyebrow</label>
            <input id="landingProductsEyebrow" name="productsEyebrow" value="${escapeHtml(
              homeContent.productsEyebrow
            )}" />
          </div>
          <div class="field">
            <label for="landingProductsTitle">Product Section Title</label>
            <input id="landingProductsTitle" name="productsTitle" value="${escapeHtml(
              homeContent.productsTitle
            )}" />
          </div>
          <div class="field">
            <label for="landingCategoriesEyebrow">Category Section Eyebrow</label>
            <input id="landingCategoriesEyebrow" name="categoriesEyebrow" value="${escapeHtml(
              homeContent.categoriesEyebrow
            )}" />
          </div>
          <div class="field">
            <label for="landingCategoriesTitle">Category Section Title</label>
            <input id="landingCategoriesTitle" name="categoriesTitle" value="${escapeHtml(
              homeContent.categoriesTitle
            )}" />
          </div>
          <div class="field">
            <label for="landingArtisansEyebrow">Artisan Section Eyebrow</label>
            <input id="landingArtisansEyebrow" name="artisansEyebrow" value="${escapeHtml(
              homeContent.artisansEyebrow
            )}" />
          </div>
          <div class="field">
            <label for="landingArtisansTitle">Artisan Section Title</label>
            <input id="landingArtisansTitle" name="artisansTitle" value="${escapeHtml(
              homeContent.artisansTitle
            )}" />
          </div>
          <div class="field">
            <label for="landingTestimonialsEyebrow">Review Section Eyebrow</label>
            <input id="landingTestimonialsEyebrow" name="testimonialsEyebrow" value="${escapeHtml(
              homeContent.testimonialsEyebrow
            )}" />
          </div>
          <div class="field">
            <label for="landingTestimonialsTitle">Review Section Title</label>
            <input id="landingTestimonialsTitle" name="testimonialsTitle" value="${escapeHtml(
              homeContent.testimonialsTitle
            )}" />
          </div>
        </div>

        <div class="field spacer-top">
          <label for="landingFooterDescription">Footer Description</label>
          <textarea id="landingFooterDescription" name="footerDescription">${escapeHtml(
            content.footer.description
          )}</textarea>
        </div>

        <div class="field spacer-top">
          <label for="landingHeroIntro">Hero Intro</label>
          <textarea id="landingHeroIntro" name="heroIntro">${escapeHtml(
            homeContent.heroIntro
          )}</textarea>
        </div>

        <div class="field spacer-top">
          <label for="landingPanelText">Feature Panel Text</label>
          <textarea id="landingPanelText" name="panelText">${escapeHtml(
            homeContent.panelText
          )}</textarea>
        </div>

        <div class="field spacer-top">
          <label for="landingDistrictsIntro">District Section Intro</label>
          <textarea id="landingDistrictsIntro" name="districtsIntro">${escapeHtml(
            homeContent.districtsIntro
          )}</textarea>
        </div>

        <div class="field spacer-top">
          <label for="landingProductsIntro">Product Section Intro</label>
          <textarea id="landingProductsIntro" name="productsIntro">${escapeHtml(
            homeContent.productsIntro
          )}</textarea>
        </div>

        <div class="field spacer-top">
          <label for="landingCategoriesIntro">Category Section Intro</label>
          <textarea id="landingCategoriesIntro" name="categoriesIntro">${escapeHtml(
            homeContent.categoriesIntro
          )}</textarea>
        </div>

        <div class="field spacer-top">
          <label for="landingArtisansIntro">Artisan Section Intro</label>
          <textarea id="landingArtisansIntro" name="artisansIntro">${escapeHtml(
            homeContent.artisansIntro
          )}</textarea>
        </div>

        <div class="field spacer-top">
          <label for="landingTestimonialsIntro">Review Section Intro</label>
          <textarea id="landingTestimonialsIntro" name="testimonialsIntro">${escapeHtml(
            homeContent.testimonialsIntro
          )}</textarea>
        </div>

        <div class="inline-actions spacer-top">
          <button class="button primary" type="submit">Save Landing Page</button>
          <button class="button secondary" id="landingReset" type="button">Reset Landing Page</button>
        </div>
      </form>
    `,
    shouldScroll
  );

  if (!rendered) {
    return;
  }

  const form = document.getElementById("adminSettingsForm");
  const resetButton = document.getElementById("settingsReset");
  const landingForm = document.getElementById("landingContentForm");
  const landingResetButton = document.getElementById("landingReset");

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const formData = Object.fromEntries(new FormData(form).entries());
    saveAdminSettings({
      ...settings,
      storeName: String(formData.storeName || "").trim(),
      storeEmail: String(formData.storeEmail || "").trim(),
      storePhone: String(formData.storePhone || "").trim(),
      storeAddress: String(formData.storeAddress || "").trim(),
      currencySymbol: String(formData.currencySymbol || "BDT").trim(),
      shippingFee: Number(formData.shippingFee || 0),
      freeShippingThreshold: Number(formData.freeShippingThreshold || 0),
      lowStockThreshold: settings.lowStockThreshold,
      maintenanceMode: formData.maintenanceMode === "on"
    });
    showToast("Store settings saved.");
    renderApp(false);
  });

  resetButton.addEventListener("click", () => {
    saveAdminSettings({
      storeName: "Bangladesh Heritage",
      storeEmail: "admin@heritage.com",
      storePhone: "+880 1700 000000",
      storeAddress: "Dhaka, Bangladesh",
      currencySymbol: "BDT",
      shippingFee: 200,
      freeShippingThreshold: 5000,
      lowStockThreshold: 5,
      maintenanceMode: false
    });
    showToast("Store settings reset.");
    renderApp(false);
  });

  landingForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const formData = Object.fromEntries(new FormData(landingForm).entries());

    saveSiteContent({
      ...content,
      brand: {
        ...content.brand,
        name: String(formData.brandName || "").trim(),
        tagline: String(formData.brandTagline || "").trim()
      },
      footer: {
        ...content.footer,
        description: String(formData.footerDescription || "").trim()
      },
      home: {
        ...content.home,
        heroEyebrow: String(formData.heroEyebrow || "").trim(),
        heroTitle: String(formData.heroTitle || "").trim(),
        heroIntro: String(formData.heroIntro || "").trim(),
        searchLabel: String(formData.searchLabel || "").trim(),
        searchPlaceholder: String(formData.searchPlaceholder || "").trim(),
        searchButton: String(formData.searchButton || "").trim(),
        browseButton: String(formData.browseButton || "").trim(),
        panelEyebrow: String(formData.panelEyebrow || "").trim(),
        panelTitle: String(formData.panelTitle || "").trim(),
        panelText: String(formData.panelText || "").trim(),
        districtsEyebrow: String(formData.districtsEyebrow || "").trim(),
        districtsTitle: String(formData.districtsTitle || "").trim(),
        districtsIntro: String(formData.districtsIntro || "").trim(),
        productsEyebrow: String(formData.productsEyebrow || "").trim(),
        productsTitle: String(formData.productsTitle || "").trim(),
        productsIntro: String(formData.productsIntro || "").trim(),
        categoriesEyebrow: String(formData.categoriesEyebrow || "").trim(),
        categoriesTitle: String(formData.categoriesTitle || "").trim(),
        categoriesIntro: String(formData.categoriesIntro || "").trim(),
        artisansEyebrow: String(formData.artisansEyebrow || "").trim(),
        artisansTitle: String(formData.artisansTitle || "").trim(),
        artisansIntro: String(formData.artisansIntro || "").trim(),
        testimonialsEyebrow: String(formData.testimonialsEyebrow || "").trim(),
        testimonialsTitle: String(formData.testimonialsTitle || "").trim(),
        testimonialsIntro: String(formData.testimonialsIntro || "").trim()
      }
    });

    showToast("Landing page content saved.");
    renderApp(false);
  });

  landingResetButton.addEventListener("click", () => {
    saveSiteContent(defaultSiteContent);
    showToast("Landing page content reset.");
    renderApp(false);
  });
}

function matchRoute(pathname) {
  const routes = [
    { pattern: /^\/$/, page: "home" },
    { pattern: /^\/products$/, page: "products" },
    { pattern: /^\/products\/([^/]+)$/, page: "product-detail" },
    { pattern: /^\/districts$/, page: "districts" },
    { pattern: /^\/districts\/([^/]+)$/, page: "district-detail" },
    { pattern: /^\/categories$/, page: "categories" },
    { pattern: /^\/categories\/([^/]+)$/, page: "category-detail" },
    { pattern: /^\/artisans$/, page: "artisans" },
    { pattern: /^\/artisans\/([^/]+)$/, page: "artisan-detail" },
    { pattern: /^\/about$/, page: "about" },
    { pattern: /^\/cart$/, page: "cart" },
    { pattern: /^\/checkout$/, page: "checkout" },
    { pattern: /^\/order-confirmation\/([^/]+)$/, page: "order-confirmation" },
    { pattern: /^\/orders$/, page: "orders" },
    { pattern: /^\/account$/, page: "account" },
    { pattern: /^\/auth\/login$/, page: "login" },
    { pattern: /^\/auth\/register$/, page: "register" },
    { pattern: /^\/admin$/, page: "admin" },
    { pattern: /^\/admin\/products$/, page: "admin-products" },
    { pattern: /^\/admin\/products\/new$/, page: "admin-product-new" },
    { pattern: /^\/admin\/products\/([^/]+)\/edit$/, page: "admin-product-edit" },
    { pattern: /^\/admin\/orders$/, page: "admin-orders" },
    { pattern: /^\/admin\/artisans$/, page: "admin-artisans" },
    { pattern: /^\/admin\/categories$/, page: "admin-categories" },
    { pattern: /^\/admin\/districts$/, page: "admin-districts" },
    { pattern: /^\/admin\/settings$/, page: "admin-settings" }
  ];

  for (const route of routes) {
    const match = pathname.match(route.pattern);
    if (match) {
      return {
        page: route.page,
        params: match.slice(1).map((item) => decodeURIComponent(item))
      };
    }
  }

  return { page: "not-found", params: [] };
}

function renderNotFoundPage(shouldScroll = true) {
  mountPage(
    "Page Not Found",
    renderAccessCard(
      "Page not found",
      "The route you requested does not exist in this project.",
      buttonLink("/", "Go Home", "primary")
    ),
    null,
    shouldScroll
  );
}

function renderApp(shouldScroll = true) {
  ensureInitialData();
  const pathname = getPath();
  const route = matchRoute(pathname);

  if (route.page === "home") {
    renderHomePage(shouldScroll);
    return;
  }

  if (route.page === "products") {
    renderProductsPage(shouldScroll);
    return;
  }

  if (route.page === "product-detail") {
    renderProductDetailPage(route.params[0], shouldScroll);
    return;
  }

  if (route.page === "districts") {
    renderDistrictsPage(shouldScroll);
    return;
  }

  if (route.page === "district-detail") {
    renderDistrictDetailPage(route.params[0], shouldScroll);
    return;
  }

  if (route.page === "categories") {
    renderCategoriesPage(shouldScroll);
    return;
  }

  if (route.page === "category-detail") {
    renderCategoryDetailPage(route.params[0], shouldScroll);
    return;
  }

  if (route.page === "artisans") {
    renderArtisansPage(shouldScroll);
    return;
  }

  if (route.page === "artisan-detail") {
    renderArtisanDetailPage(route.params[0], shouldScroll);
    return;
  }

  if (route.page === "about") {
    renderAboutPage(shouldScroll);
    return;
  }

  if (route.page === "cart") {
    renderCartPage(shouldScroll);
    return;
  }

  if (route.page === "checkout") {
    renderCheckoutPage(shouldScroll);
    return;
  }

  if (route.page === "order-confirmation") {
    renderOrderConfirmationPage(route.params[0], shouldScroll);
    return;
  }

  if (route.page === "orders") {
    renderOrdersPage(shouldScroll);
    return;
  }

  if (route.page === "account") {
    renderAccountPage(shouldScroll);
    return;
  }

  if (route.page === "login") {
    renderLoginPage(shouldScroll);
    return;
  }

  if (route.page === "register") {
    renderRegisterPage(shouldScroll);
    return;
  }

  if (route.page === "admin") {
    renderAdminDashboard(shouldScroll);
    return;
  }

  if (route.page === "admin-products") {
    renderAdminProductsPage(shouldScroll);
    return;
  }

  if (route.page === "admin-product-new") {
    renderAdminProductFormPage("", shouldScroll);
    return;
  }

  if (route.page === "admin-product-edit") {
    renderAdminProductFormPage(route.params[0], shouldScroll);
    return;
  }

  if (route.page === "admin-orders") {
    renderAdminOrdersPage(shouldScroll);
    return;
  }

  if (route.page === "admin-artisans") {
    renderAdminArtisansPage(shouldScroll);
    return;
  }

  if (route.page === "admin-categories") {
    renderAdminCategoriesPage(shouldScroll);
    return;
  }

  if (route.page === "admin-districts") {
    renderAdminDistrictsPage(shouldScroll);
    return;
  }

  if (route.page === "admin-settings") {
    renderAdminSettingsPage(shouldScroll);
    return;
  }

  renderNotFoundPage(shouldScroll);
}

document.addEventListener("click", (event) => {
  const logoutButton = event.target.closest("[data-logout]");
  if (logoutButton) {
    logoutUser();
    showToast("Signed out.");
    navigate("/");
    return;
  }

  const addButton = event.target.closest("[data-add-cart]");
  if (addButton) {
    event.preventDefault();
    const product = getProductById(addButton.dataset.addCart);
    if (!product) {
      return;
    }
    addToCart(product.id, 1);
    renderShell(getPath());
    showToast(`${product.name} added to cart.`);
    return;
  }

  const anchor = event.target.closest("a[href]");
  if (!anchor) {
    return;
  }

  const href = anchor.getAttribute("href");
  if (
    !href ||
    href.startsWith("http") ||
    href.startsWith("mailto:") ||
    href.startsWith("tel:") ||
    href.startsWith("#") ||
    anchor.target === "_blank" ||
    anchor.hasAttribute("download")
  ) {
    return;
  }

  if (href.startsWith("/")) {
    event.preventDefault();
    navigate(href);
  }
});

window.addEventListener("popstate", () => {
  renderApp(false);
});

ensureInitialData();
renderApp(false);
