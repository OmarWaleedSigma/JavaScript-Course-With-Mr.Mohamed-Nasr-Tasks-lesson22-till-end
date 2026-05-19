const API_URL = "http://localhost:3000";

// DOM Elements
const productContainer = document.getElementById("product-container");
const cartItemsContainer = document.getElementById("cart-items-container");
const cartCount = document.getElementById("cart-count");
const cartTotal = document.getElementById("cart-total");

// Local state for product quantities before adding to cart
// Format: { productId: quantity }
const localQuantities = {};

// -------------------------------------------------------------------
// 1. Fetch & Render Products
// -------------------------------------------------------------------
const fetchProducts = async () => {
  try {
    const response = await fetch(`${API_URL}/products`);
    if (!response.ok) throw new Error("Failed to fetch products");
    const products = await response.json();

    // Initialize local quantities to 1
    products.forEach((p) => {
      if (!localQuantities[p.id]) localQuantities[p.id] = 1;
    });

    renderProducts(products);
  } catch (error) {
    console.error(error);
    productContainer.innerHTML = `<div class="loader" style="color:red;">Error loading products</div>`;
  }
};

const renderProducts = (products) => {
  productContainer.innerHTML = "";

  if (products.length === 0) {
    productContainer.innerHTML = `<p>No products available.</p>`;
    return;
  }

  products.forEach((product) => {
    const card = document.createElement("div");
    card.className = "card";

    // Get current local quantity for this product
    const currentQty = localQuantities[product.id] || 1;

    card.innerHTML = `
        <div class="card-image">
            <img src="${product.image}" alt="${product.title}" onerror="this.src='https://placehold.co/400x400?text=No+Image'">
        </div>
        <div class="card-content">
            <h3 class="card-title" title="${product.title}">${product.title}</h3>
            <span class="card-price">$${Number(product.price).toFixed(2)}</span>
            
            <div class="quantity-controls">
                <button class="qty-btn" onclick="updateLocalQty('${product.id}', -1)">-</button>
                <span class="qty-display" id="qty-${product.id}">${currentQty}</span>
                <button class="qty-btn" onclick="updateLocalQty('${product.id}', 1)">+</button>
            </div>
            
            <button class="btn btn-primary" onclick="addToCart('${product.id}')">Add to Cart</button>
        </div>
    `;
    productContainer.appendChild(card);
  });
};

// Update the local quantity before adding to cart
const updateLocalQty = (productId, change) => {
  if (!localQuantities[productId]) localQuantities[productId] = 1;

  let newQty = localQuantities[productId] + change;
  if (newQty < 1) newQty = 1; // Minimum quantity is 1

  localQuantities[productId] = newQty;

  // Update the DOM for this specific product
  const qtyDisplay = document.getElementById(`qty-${productId}`);
  if (qtyDisplay) qtyDisplay.textContent = newQty;
};

// -------------------------------------------------------------------
// 2. Cart Logic (PLACEHOLDERS for lesson)
// -------------------------------------------------------------------

const fetchCart = async () => {
  // ~~~ FETCH CART PLACEHOLDER ~~~
  const response = await fetch(`${API_URL}/cart`);
  if (!response.ok) {
    renderCart([]);
    return;
  }
  const cartItems = await response.json();
  console.log(cartItems);
  renderCart(cartItems);
}; //

const renderCart = (cartItems) => {
  // ~~~ RENDER CART PLACEHOLDER ~~~
  // Calculate total price and total items
  let totalItems = 0;
  let totalPrice = 0;

  cartItemsContainer.innerHTML = "";

  if (cartItems.length === 0) {
    cartItemsContainer.innerHTML = `<p class="empty-cart-msg">Your cart is empty.</p>`;
  } else {
    cartItems.forEach((item) => {
      totalItems += item.quantity;
      totalPrice += item.price * item.quantity;

      const itemEl = document.createElement("div");
      itemEl.className = "cart-item";
      itemEl.innerHTML = `
                <div class="cart-item-info">
                    <p class="cart-item-title" title="${item.title}">${item.title}</p>
                    <span class="cart-item-price">$${Number(item.price).toFixed(2)} x ${item.quantity}</span>
                </div>
                <div class="cart-item-actions">
                    <button class="qty-btn" onclick="updateCartItemQuantity('${item.id}', ${item.quantity - 1})">-</button>
                    <span class="qty-display">${item.quantity}</span>
                    <button class="qty-btn" onclick="updateCartItemQuantity('${item.id}', ${item.quantity + 1})">+</button>
                    <button class="btn btn-danger" style="padding: 4px 8px; font-size: 12px; width: auto;" onclick="removeFromCart('${item.id}')">X</button>
                </div>
            `;
      cartItemsContainer.appendChild(itemEl);
    });
  }

  // Update summaries
  cartCount.textContent = `${totalItems} items`;
  cartTotal.textContent = `$${totalPrice.toFixed(2)}`;
};

const addToCart = async (productId) => {
  const quantityToAdd = localQuantities[productId] || 1;
  // ~~~ ADD TO CART PLACEHOLDER ~~~
  //* console.log(`Adding product ${productId} to cart with quantity ${quantityToAdd}`);
  //fetch single product from jsonserver
  const prodres = await fetch(`${API_URL}/products/${productId}`);
  const response = await fetch(`${API_URL}/cart`);

  try {
    if (!response.ok) {
      throw new Error("Failed to fetch cart items");
    }
    if (!prodres.ok) {
      throw new Error("Failed To fetch this product");
    }

    const product = await prodres.json();
    const cartitems = await response.json();

    if (cartitems.length == 0) {
      await fetch(`${API_URL}/cart`, {
        method: "POST",
        headers: { "Content-type": "application/json" },
        body: JSON.stringify({ ...product, quantity: quantityToAdd }),
      });
    } else {
      //update cart item qty
      const cartItemExists = cartitems.find((el) => {
        el.name == product.name;
      });
      if (cartItemExists) {
        updateCartItemQuantity(cartItemExists, 1);
      } else {
        await fetch(`${API_URL}/cart`, {
          method: "POST",
          headers: { "Content-type": "application/json" },
          body: JSON.stringify({ ...product, quantity: quantityToAdd }),
        });
      }
    }
  } catch (error) {
    console.error("Error fetching product details:", error.message);
  }

  fetchCart();

  localQuantities[productId] = 1;
  const qtyDisplay = document.getElementById(`qty-${productId}`);
  if (qtyDisplay) qtyDisplay.textContent = 1;
};

const updateCartItemQuantity = (cartItemId, newQuantity) => {
  // ~~~ UPDATE CART ITEM PLACEHOLDER ~~~
  const response = fetch(`${API_URL}/cart/${cartItemId}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ quantity: newQuantity }),
  });
  if (newQuantity < 1) {
    removeFromCart(cartItemId);
    return;
  }
  fetchCart();
};

const removeFromCart = (cartItemId) => {
  // ~~~ REMOVE FROM CART PLACEHOLDER ~~~
  const response = fetch(`${API_URL}/cart/${cartItemId}`, {
    method: "DELETE",
  });
  fetchCart();
};

// Initial Fetch
fetchProducts();
fetchCart();

// functions ive made handmade: removeFromCart, updateCartItemQuantity, addToCart,fetchCart.
