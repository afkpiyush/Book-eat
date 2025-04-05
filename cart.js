const cartContainer = document.getElementById("cart-container");
const summary = document.getElementById("summary");

const cart = JSON.parse(localStorage.getItem("cart")) || [];

let total = 0;
cart.forEach(item => {
  const div = document.createElement("div");
  div.className = "cart-item";
  div.innerHTML = `
    <img src="${item.image}" alt="${item.name}" />
    <div class="details">
      <div>${item.name}</div>
      <div>Qty: ${item.quantity}</div>
    </div>
    <div class="price">$${(item.price * item.quantity).toFixed(2)}</div>
  `;
  cartContainer.appendChild(div);
  total += item.price * item.quantity;
});

const tax = 5.00;
summary.innerHTML = `
  Subtotal: $${total.toFixed(2)}<br>
  Tax & Fees: $${tax.toFixed(2)}<br>
  <strong>Total: $${(total + tax).toFixed(2)}</strong>
`;

function checkout() {
  alert("Redirecting to payment...");
  window.location.href = "checkout.html";
}