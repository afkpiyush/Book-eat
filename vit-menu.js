const menuData = {
  snacks: [
    {
      name: "Mexican Appetizer",
      price: 15.00,
      image: "https://i.imgur.com/0umadnY.jpg",
    },
    {
      name: "Pork Skewer",
      price: 12.99,
      image: "https://i.imgur.com/5vG8Wya.jpg",
    }
  ],
  meal: [
    {
      name: "Veg Thali",
      price: 50.00,
      image: "https://i.imgur.com/Ida54uL.jpg",
    }
  ],
  chinese: [],
  egg: [],
  paratha: [],
};

let cart = {};
let currentCategory = "snacks";

function switchCategory(category) {
  currentCategory = category;
  document.querySelectorAll(".category").forEach(btn => btn.classList.remove("active"));
  event.target.classList.add("active");
  loadMenu(category);
}

function loadMenu(category) {
  const container = document.getElementById("menuList");
  container.innerHTML = "";
  const items = menuData[category];

  if (items.length === 0) {
    container.innerHTML = "<p>No items available.</p>";
    return;
  }

  items.forEach(item => {
    const qty = cart[item.name] || 0;
    container.innerHTML += `
      <div class="food-item">
        <img src="${item.image}" alt="${item.name}">
        <div class="food-info">
          <p>${item.name}</p>
          <span style="color: #f85f33; font-weight: bold;">$${item.price.toFixed(2)}</span>
        </div>
        <div class="price-cart">
          <span>•</span>
          <div class="cart-controls">
            <button onclick="removeFromCart('${item.name}')">-</button>
            <span>${qty}</span>
            <button onclick="addToCart('${item.name}', ${item.price})">+</button>
          </div>
        </div>
      </div>
    `;
  });
}

function addToCart(name, price) {
  cart[name] = (cart[name] || 0) + 1;
  updateCartCount();
  loadMenu(currentCategory);
}

function removeFromCart(name) {
  if (cart[name]) {
    cart[name]--;
    if (cart[name] <= 0) delete cart[name];
  }
  updateCartCount();
  loadMenu(currentCategory);
}

function updateCartCount() {
  const totalItems = Object.values(cart).reduce((sum, qty) => sum + qty, 0);
  document.getElementById("cartCount").innerText = totalItems;
}

function goHome() {
  window.location.href = "choose-canteen.html";
}

function goToCart() {
  // You can store cart data in localStorage and retrieve it in cart page
  localStorage.setItem("cart", JSON.stringify(cart));
  window.location.href = "cart.html";
}

// Initial load
loadMenu("snacks");
