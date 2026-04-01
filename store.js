import {
  artisansSeed,
  categoriesSeed,
  districtsSeed,
  productReviewsSeed,
  productsSeed,
  siteContent
} from "/data.js";

const STORAGE_KEYS = {
  adminArtisans: "adminArtisans",
  adminCategories: "adminCategories",
  adminDistricts: "adminDistricts",
  adminProducts: "adminProducts",
  adminSettings: "adminSettings",
  cart: "cart",
  orders: "orders",
  productReviews: "productReviews",
  registeredUsers: "registeredUsers",
  siteContent: "siteContent",
  user: "user"
};

export const ORDER_STATUSES = [
  "pending",
  "processing",
  "shipped",
  "completed",
  "cancelled"
];

export const DEFAULT_ADMIN_SETTINGS = {
  storeName: "Bangladesh Heritage",
  storeEmail: "admin@heritage.com",
  storePhone: "+880 1700 000000",
  storeAddress: "Dhaka, Bangladesh",
  currencySymbol: "BDT",
  shippingFee: 200,
  freeShippingThreshold: 5000,
  lowStockThreshold: 5,
  maintenanceMode: false,
  updatedAt: new Date().toISOString()
};

function clone(value) {
  if (value === undefined) {
    return undefined;
  }
  return JSON.parse(JSON.stringify(value));
}

function isPlainObject(value) {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

function mergeDeep(baseValue, overrideValue) {
  if (overrideValue === undefined) {
    return clone(baseValue);
  }

  if (Array.isArray(baseValue)) {
    return Array.isArray(overrideValue) ? clone(overrideValue) : clone(baseValue);
  }

  if (isPlainObject(baseValue)) {
    const result = {};
    const source = isPlainObject(overrideValue) ? overrideValue : {};
    const keys = new Set([...Object.keys(baseValue), ...Object.keys(source)]);

    keys.forEach((key) => {
      const baseEntry = baseValue[key];
      const overrideEntry = source[key];

      if (baseEntry === undefined) {
        result[key] = clone(overrideEntry);
        return;
      }

      if (Array.isArray(baseEntry) || isPlainObject(baseEntry)) {
        result[key] = mergeDeep(baseEntry, overrideEntry);
        return;
      }

      result[key] = overrideEntry === undefined ? clone(baseEntry) : clone(overrideEntry);
    });

    return result;
  }

  return clone(overrideValue);
}

function readJson(key, fallback) {
  try {
    const raw = window.localStorage.getItem(key);
    if (!raw) {
      return clone(fallback);
    }
    return JSON.parse(raw);
  } catch {
    return clone(fallback);
  }
}

function writeJson(key, value) {
  window.localStorage.setItem(key, JSON.stringify(value));
}

export function slugify(value) {
  return String(value || "")
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function makeId(prefix) {
  return `${prefix}-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
}

function seedAdminProducts() {
  return productsSeed.map((product) => ({
    id: product.id,
    name: product.name,
    price: product.price,
    originalPrice: product.originalPrice || product.price,
    category: product.categoryId,
    district: product.districtId,
    artisan: product.artisanId,
    description: product.description,
    craftProcess: product.craftProcess || "",
    culturalSignificance: product.culturalSignificance || "",
    image: product.image,
    images: product.images || [product.image],
    rating: product.rating || 4.5,
    reviewCount: product.reviewCount || 0,
    inStock: product.inStock !== false,
    createdAt: new Date().toISOString()
  }));
}

function seedAdminArtisans() {
  return artisansSeed.map((artisan) => ({
    ...artisan,
    active: true,
    createdAt: new Date().toISOString()
  }));
}

function seedAdminCategories() {
  return categoriesSeed.map((category) => ({
    ...category,
    active: true,
    createdAt: new Date().toISOString()
  }));
}

function seedAdminDistricts() {
  return districtsSeed.map((district) => ({
    ...district,
    active: true,
    createdAt: new Date().toISOString()
  }));
}

function seedProductReviews() {
  return productReviewsSeed.map((review) => ({
    ...review
  }));
}

export function ensureInitialData() {
  if (!window.localStorage.getItem(STORAGE_KEYS.adminProducts)) {
    writeJson(STORAGE_KEYS.adminProducts, seedAdminProducts());
  }

  if (!window.localStorage.getItem(STORAGE_KEYS.adminArtisans)) {
    writeJson(STORAGE_KEYS.adminArtisans, seedAdminArtisans());
  }

  if (!window.localStorage.getItem(STORAGE_KEYS.adminCategories)) {
    writeJson(STORAGE_KEYS.adminCategories, seedAdminCategories());
  }

  if (!window.localStorage.getItem(STORAGE_KEYS.adminDistricts)) {
    writeJson(STORAGE_KEYS.adminDistricts, seedAdminDistricts());
  }

  if (!window.localStorage.getItem(STORAGE_KEYS.adminSettings)) {
    writeJson(STORAGE_KEYS.adminSettings, DEFAULT_ADMIN_SETTINGS);
  }

  if (!window.localStorage.getItem(STORAGE_KEYS.orders)) {
    writeJson(STORAGE_KEYS.orders, []);
  }

  if (!window.localStorage.getItem(STORAGE_KEYS.productReviews)) {
    writeJson(STORAGE_KEYS.productReviews, seedProductReviews());
  }

  if (!window.localStorage.getItem(STORAGE_KEYS.cart)) {
    writeJson(STORAGE_KEYS.cart, []);
  }

  if (!window.localStorage.getItem(STORAGE_KEYS.registeredUsers)) {
    writeJson(STORAGE_KEYS.registeredUsers, []);
  }

  if (!window.localStorage.getItem(STORAGE_KEYS.siteContent)) {
    writeJson(STORAGE_KEYS.siteContent, siteContent);
  }
}

export function getCurrentUser() {
  return readJson(STORAGE_KEYS.user, null);
}

export function getSiteContent() {
  ensureInitialData();
  return mergeDeep(siteContent, readJson(STORAGE_KEYS.siteContent, siteContent));
}

export function saveSiteContent(content) {
  writeJson(STORAGE_KEYS.siteContent, mergeDeep(siteContent, content));
}

export function saveCurrentUser(user) {
  writeJson(STORAGE_KEYS.user, user);
}

export function logoutUser() {
  window.localStorage.removeItem(STORAGE_KEYS.user);
}

export function isAdminUser(user) {
  return user && user.role === "admin";
}

export function getRegisteredUsers() {
  return readJson(STORAGE_KEYS.registeredUsers, []);
}

export function registerUser(formData) {
  const users = getRegisteredUsers();
  const normalizedEmail = formData.email.trim().toLowerCase();

  if (users.some((user) => user.email.toLowerCase() === normalizedEmail)) {
    return {
      ok: false,
      message: "An account with this email already exists."
    };
  }

  const newUser = {
    id: makeId("customer"),
    name: formData.fullName.trim(),
    email: normalizedEmail,
    phone: formData.phone.trim(),
    address: "",
    password: formData.password,
    role: "customer",
    createdAt: new Date().toISOString()
  };

  users.push(newUser);
  writeJson(STORAGE_KEYS.registeredUsers, users);
  saveCurrentUser({
    id: newUser.id,
    name: newUser.name,
    email: newUser.email,
    phone: newUser.phone,
    address: newUser.address,
    role: newUser.role,
    createdAt: newUser.createdAt
  });

  return { ok: true, user: getCurrentUser() };
}

export function loginUser(email, password) {
  const normalizedEmail = email.trim().toLowerCase();

  if (normalizedEmail === "admin@example.com" && password === "demo123") {
    const adminUser = {
      id: "demo-admin",
      name: "Admin User",
      email: "admin@example.com",
      phone: "+880 1700 000001",
      address: "Dhaka, Bangladesh",
      role: "admin",
      createdAt: "2026-01-01T00:00:00.000Z"
    };
    saveCurrentUser(adminUser);
    return { ok: true, user: adminUser };
  }

  if (normalizedEmail === "user@example.com" && password === "demo123") {
    const customerUser = {
      id: "demo-customer",
      name: "Demo Customer",
      email: "user@example.com",
      phone: "+880 1700 000002",
      address: "Dhaka, Bangladesh",
      role: "customer",
      createdAt: "2026-01-01T00:00:00.000Z"
    };
    saveCurrentUser(customerUser);
    return { ok: true, user: customerUser };
  }

  const users = getRegisteredUsers();
  const matchedUser = users.find(
    (user) =>
      user.email.toLowerCase() === normalizedEmail && user.password === password
  );

  if (!matchedUser) {
    return {
      ok: false,
      message: "Invalid email or password."
    };
  }

  const sessionUser = {
    id: matchedUser.id,
    name: matchedUser.name,
    email: matchedUser.email,
    phone: matchedUser.phone,
    address: matchedUser.address || "",
    role: matchedUser.role,
    createdAt: matchedUser.createdAt
  };

  saveCurrentUser(sessionUser);
  return { ok: true, user: sessionUser };
}

export function updateCurrentUser(profile) {
  const currentUser = getCurrentUser();
  if (!currentUser) {
    return null;
  }

  const updatedUser = {
    ...currentUser,
    ...profile
  };

  saveCurrentUser(updatedUser);

  const users = getRegisteredUsers();
  const index = users.findIndex((user) => user.id === updatedUser.id);
  if (index >= 0) {
    users[index] = {
      ...users[index],
      ...profile
    };
    writeJson(STORAGE_KEYS.registeredUsers, users);
  }

  return updatedUser;
}

export function getAdminProducts() {
  ensureInitialData();
  return readJson(STORAGE_KEYS.adminProducts, []);
}

export function saveAdminProducts(products) {
  writeJson(STORAGE_KEYS.adminProducts, products);
}

export function getAdminArtisans() {
  ensureInitialData();
  return readJson(STORAGE_KEYS.adminArtisans, []);
}

export function saveAdminArtisans(artisans) {
  writeJson(STORAGE_KEYS.adminArtisans, artisans);
}

export function getAdminCategories() {
  ensureInitialData();
  return readJson(STORAGE_KEYS.adminCategories, []);
}

export function saveAdminCategories(categories) {
  writeJson(STORAGE_KEYS.adminCategories, categories);
}

export function getAdminDistricts() {
  ensureInitialData();
  return readJson(STORAGE_KEYS.adminDistricts, []);
}

export function saveAdminDistricts(districts) {
  writeJson(STORAGE_KEYS.adminDistricts, districts);
}

export function getAdminSettings() {
  ensureInitialData();
  return readJson(STORAGE_KEYS.adminSettings, DEFAULT_ADMIN_SETTINGS);
}

export function saveAdminSettings(settings) {
  writeJson(STORAGE_KEYS.adminSettings, {
    ...settings,
    updatedAt: new Date().toISOString()
  });
}

export function formatPrice(value) {
  const settings = getAdminSettings();
  const safeValue = Number(value) || 0;
  return `${settings.currencySymbol} ${safeValue.toLocaleString("en-BD")}`;
}

function getNameMap(items) {
  const map = new Map();
  items.forEach((item) => {
    map.set(item.id, item.name);
  });
  return map;
}

function normalizeImages(product) {
  if (Array.isArray(product.images) && product.images.length > 0) {
    return product.images;
  }

  if (product.image) {
    return [product.image];
  }

  return ["/images/products/jamdani-saree.jpg"];
}

function readProductReviews() {
  ensureInitialData();
  const reviews = readJson(STORAGE_KEYS.productReviews, productReviewsSeed);

  if (!Array.isArray(reviews)) {
    return [];
  }

  return reviews
    .filter((review) => review && review.productId)
    .map((review) => ({
      id: String(review.id || makeId("review")),
      productId: String(review.productId || "").trim(),
      userId: String(review.userId || "").trim(),
      name: String(review.name || "Anonymous Customer").trim(),
      location: String(review.location || "").trim(),
      title: String(review.title || "Customer review").trim(),
      comment: String(review.comment || "").trim(),
      rating: Math.max(1, Math.min(5, Math.round(Number(review.rating) || 0))),
      verifiedPurchase: review.verifiedPurchase === true,
      createdAt: review.createdAt || new Date().toISOString()
    }))
    .filter((review) => review.comment);
}

function writeProductReviews(reviews) {
  writeJson(STORAGE_KEYS.productReviews, reviews);
}

export function getProductReviews(productId) {
  return readProductReviews()
    .filter((review) => review.productId === productId)
    .sort(
      (first, second) =>
        new Date(second.createdAt).getTime() - new Date(first.createdAt).getTime()
    );
}

export function getProductRatingSummary(productId) {
  const reviews = getProductReviews(productId);
  const reviewCount = reviews.length;
  const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
  const rating = reviewCount ? Number((totalRating / reviewCount).toFixed(1)) : 0;
  const distribution = [5, 4, 3, 2, 1].map((stars) => ({
    stars,
    count: reviews.filter((review) => review.rating === stars).length
  }));

  return {
    rating,
    reviewCount,
    distribution
  };
}

export function getLatestProductReviews(limit = 4) {
  const activeProductIds = new Set(getAdminProducts().map((product) => product.id));
  const safeLimit = Math.max(1, Math.floor(Number(limit) || 4));

  return readProductReviews()
    .filter((review) => activeProductIds.has(review.productId))
    .sort(
      (first, second) =>
        new Date(second.createdAt).getTime() - new Date(first.createdAt).getTime()
    )
    .slice(0, safeLimit);
}

export function saveProductReview(reviewData) {
  const currentUser = getCurrentUser();
  const product = getProductById(reviewData.productId);

  if (!currentUser || isAdminUser(currentUser)) {
    return {
      ok: false,
      message: "Please sign in with a customer account before leaving a review."
    };
  }

  if (!product) {
    return {
      ok: false,
      message: "The selected product could not be found."
    };
  }

  const comment = String(reviewData.comment || "").trim();
  if (!comment) {
    return {
      ok: false,
      message: "Please write a short review before submitting."
    };
  }

  const safeRating = Math.max(1, Math.min(5, Math.round(Number(reviewData.rating) || 0)));
  const title = String(reviewData.title || "").trim() || "Customer review";
  const location = String(
    reviewData.location || currentUser.address || currentUser.phone || "Bangladesh"
  ).trim();

  const orders = getUserOrders(currentUser.id);
  const verifiedPurchase = orders.some((order) =>
    Array.isArray(order.items) && order.items.some((item) => item.productId === product.id)
  );

  const reviews = readProductReviews();
  const existingIndex = reviews.findIndex(
    (review) => review.productId === product.id && review.userId === currentUser.id
  );
  const savedReview = {
    id: existingIndex >= 0 ? reviews[existingIndex].id : makeId("review"),
    productId: product.id,
    userId: currentUser.id,
    name: String(currentUser.name || currentUser.email || "Customer").trim(),
    location,
    title,
    comment,
    rating: safeRating,
    verifiedPurchase,
    createdAt: new Date().toISOString()
  };

  if (existingIndex >= 0) {
    reviews[existingIndex] = savedReview;
  } else {
    reviews.unshift(savedReview);
  }

  writeProductReviews(reviews);

  return {
    ok: true,
    review: savedReview,
    updated: existingIndex >= 0
  };
}

export function deleteProductReviews(productId) {
  writeProductReviews(readProductReviews().filter((review) => review.productId !== productId));
}

export function getSiteMetrics() {
  return [
    { value: String(getDynamicDistricts().length), label: "Active districts" },
    { value: String(getCatalogProducts().length), label: "Craft products live" },
    { value: String(getDynamicArtisans().length), label: "Featured artisans" },
    { value: String(getLatestProductReviews(9999).length), label: "Customer reviews" }
  ];
}

export function getCatalogProducts() {
  const products = getAdminProducts();
  const categories = getAdminCategories();
  const districts = getAdminDistricts();
  const artisans = getAdminArtisans();

  const categoryNames = getNameMap(categories);
  const districtNames = getNameMap(districts);
  const artisanIds = new Set(artisans.map((artisan) => artisan.id));

  return products.map((product) => {
    const ratingSummary = getProductRatingSummary(product.id);

    return {
      id: product.id,
      name: product.name,
      price: Number(product.price) || 0,
      originalPrice: Number(product.originalPrice) || Number(product.price) || 0,
      image: product.image || "/images/products/jamdani-saree.jpg",
      images: normalizeImages(product),
      districtId: product.district,
      district: districtNames.get(product.district) || product.district || "Unknown District",
      categoryId: product.category,
      category: categoryNames.get(product.category) || product.category || "Uncategorized",
      rating: ratingSummary.rating,
      reviewCount: ratingSummary.reviewCount,
      description: product.description || "Handmade product from our catalog.",
      artisanId: artisanIds.has(product.artisan) ? product.artisan : "",
      inStock: product.inStock !== false,
      craftProcess: product.craftProcess || "",
      culturalSignificance: product.culturalSignificance || ""
    };
  });
}

export function getProductById(productId) {
  return getCatalogProducts().find((product) => product.id === productId);
}

function buildCountMap(records, key) {
  const counts = new Map();

  records.forEach((record) => {
    const itemKey = record[key];
    if (!itemKey) {
      return;
    }
    counts.set(itemKey, (counts.get(itemKey) || 0) + 1);
  });

  return counts;
}

export function getDynamicCategories() {
  const categories = getAdminCategories().filter((category) => category.active !== false);
  const products = getCatalogProducts();
  const counts = buildCountMap(products, "categoryId");

  return categories.map((category) => ({
    id: category.id,
    name: category.name,
    image: category.image,
    description: category.description,
    productCount: counts.get(category.id) || 0
  }));
}

export function getDynamicDistricts() {
  const districts = getAdminDistricts().filter((district) => district.active !== false);
  const products = getCatalogProducts();
  const counts = buildCountMap(products, "districtId");

  return districts.map((district) => ({
    id: district.id,
    name: district.name,
    division: district.division,
    image: district.image,
    description: district.description,
    productCount: counts.get(district.id) || 0
  }));
}

export function getDynamicArtisans() {
  const artisans = getAdminArtisans().filter((artisan) => artisan.active !== false);
  const products = getCatalogProducts();
  const counts = buildCountMap(products, "artisanId");

  return artisans.map((artisan) => ({
    id: artisan.id,
    name: artisan.name,
    image: artisan.image,
    district: artisan.district,
    districtId: artisan.districtId,
    specialty: artisan.specialty,
    bio: artisan.bio,
    story: artisan.story,
    yearsOfExperience: artisan.yearsOfExperience,
    productCount: counts.get(artisan.id) || 0
  }));
}

export function getCategoryById(categoryId) {
  return getDynamicCategories().find((category) => category.id === categoryId);
}

export function getDistrictById(districtId) {
  return getDynamicDistricts().find((district) => district.id === districtId);
}

export function getArtisanById(artisanId) {
  return getDynamicArtisans().find((artisan) => artisan.id === artisanId);
}

export function getProductsByCategory(categoryId) {
  return getCatalogProducts().filter((product) => product.categoryId === categoryId);
}

export function getProductsByDistrict(districtId) {
  return getCatalogProducts().filter((product) => product.districtId === districtId);
}

export function getProductsByArtisan(artisanId) {
  return getCatalogProducts().filter((product) => product.artisanId === artisanId);
}

export function getCart() {
  const items = readJson(STORAGE_KEYS.cart, []);
  return Array.isArray(items)
    ? items
        .filter((item) => item && typeof item.productId === "string")
        .map((item) => ({
          productId: item.productId,
          quantity: Math.max(1, Math.floor(Number(item.quantity) || 1))
        }))
    : [];
}

export function saveCart(items) {
  writeJson(STORAGE_KEYS.cart, items);
}

export function getCartCount() {
  return getCart().reduce((sum, item) => sum + item.quantity, 0);
}

export function addToCart(productId, quantity = 1) {
  const cart = getCart();
  const safeQuantity = Math.max(1, Math.floor(Number(quantity) || 1));
  const existingItem = cart.find((item) => item.productId === productId);

  if (existingItem) {
    existingItem.quantity += safeQuantity;
  } else {
    cart.push({ productId, quantity: safeQuantity });
  }

  saveCart(cart);
}

export function updateCartQuantity(productId, quantity) {
  const cart = getCart();
  const safeQuantity = Math.floor(Number(quantity) || 0);

  if (safeQuantity < 1) {
    saveCart(cart.filter((item) => item.productId !== productId));
    return;
  }

  const updated = cart.map((item) =>
    item.productId === productId ? { ...item, quantity: safeQuantity } : item
  );
  saveCart(updated);
}

export function removeCartItem(productId) {
  saveCart(getCart().filter((item) => item.productId !== productId));
}

export function clearCart() {
  saveCart([]);
}

export function getCartItemsDetailed() {
  return getCart()
    .map((item) => {
      const product = getProductById(item.productId);
      if (!product) {
        return null;
      }
      return {
        ...item,
        product,
        lineTotal: product.price * item.quantity
      };
    })
    .filter(Boolean);
}

export function getCartSummary() {
  const items = getCartItemsDetailed();
  const subtotal = items.reduce((sum, item) => sum + item.lineTotal, 0);
  const settings = getAdminSettings();
  const shipping =
    subtotal >= settings.freeShippingThreshold || subtotal === 0
      ? 0
      : Number(settings.shippingFee) || 0;

  return {
    items,
    subtotal,
    shipping,
    total: subtotal + shipping,
    itemCount: items.reduce((sum, item) => sum + item.quantity, 0)
  };
}

export function getOrders() {
  const orders = readJson(STORAGE_KEYS.orders, []);
  return Array.isArray(orders)
    ? orders.sort(
        (first, second) =>
          new Date(second.createdAt).getTime() - new Date(first.createdAt).getTime()
      )
    : [];
}

export function saveOrders(orders) {
  writeJson(STORAGE_KEYS.orders, orders);
}

export function getUserOrders(userId) {
  return getOrders().filter((order) => order.userId === userId);
}

export function getOrderById(orderId) {
  return getOrders().find((order) => order.id === orderId);
}

export function createOrder(checkoutData) {
  const currentUser = getCurrentUser();
  const cartSummary = getCartSummary();

  if (!currentUser) {
    return {
      ok: false,
      message: "Please sign in before placing an order."
    };
  }

  if (cartSummary.items.length === 0) {
    return {
      ok: false,
      message: "Your cart is empty."
    };
  }

  const order = {
    id: makeId("order"),
    userId: currentUser.id,
    items: cartSummary.items.map((item) => ({
      productId: item.productId,
      quantity: item.quantity
    })),
    subtotal: cartSummary.subtotal,
    shipping: cartSummary.shipping,
    total: cartSummary.total,
    status: "pending",
    paymentMethod: checkoutData.paymentMethod,
    shippingAddress: {
      fullName: checkoutData.fullName,
      email: checkoutData.email,
      phone: checkoutData.phone,
      address: checkoutData.address,
      city: checkoutData.city,
      district: checkoutData.district,
      postalCode: checkoutData.postalCode
    },
    createdAt: new Date().toISOString()
  };

  const orders = getOrders();
  orders.unshift(order);
  saveOrders(orders);
  clearCart();

  return {
    ok: true,
    order
  };
}

export function updateOrderStatus(orderId, status) {
  const safeStatus = ORDER_STATUSES.includes(status) ? status : "pending";
  const updatedOrders = getOrders().map((order) =>
    order.id === orderId ? { ...order, status: safeStatus } : order
  );

  saveOrders(updatedOrders);
  return updatedOrders;
}
