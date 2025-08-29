import { $, $$, money, toast, confirm, card } from "./ui.js";

// ---- Estado ----
let state = {
  products: [],
  cart: JSON.parse(localStorage.getItem("pf_cart") || "[]"),
  user: JSON.parse(
    localStorage.getItem("pf_user") || '{"nombre":"","email":"","direccion":""}'
  ),
};

const save = () => {
  localStorage.setItem("pf_cart", JSON.stringify(state.cart));
  localStorage.setItem("pf_user", JSON.stringify(state.user));
  updateCartCount();
};

const loadProducts = async () => {
  const res = await fetch("data/products.json");
  const data = await res.json();
  state.products = data;
};

// ---- Render ----
const app = $("#app");

const View = {
  catalogo() {
    app.innerHTML = `<h2>Catálogo</h2><div class="grid" id="grid"></div>`;
    const grid = $("#grid");
    state.products.forEach((p) => {
      const c = card(`
        <img src="${p.image}" alt="${p.name}"/>
        <div class="card-body">
          <div class="card-title">${p.name}</div>
          <div class="small">${p.category} • Stock: ${p.stock}</div>
          <div class="card-price">${money(p.price)}</div>
          <div class="row">
            <input type="number" min="1" max="${
              p.stock
            }" value="1" class="input" style="width:80px" id="qty-${p.id}"/>
            <button class="btn-primary" data-add="${p.id}">Agregar</button>
          </div>
        </div>
      `);
      grid.appendChild(c);
    });
  },
  carrito() {
    app.innerHTML = `<h2>Carrito</h2>`;
    if (state.cart.length === 0) {
      app.appendChild(empty("Tu carrito está vacío"));
      return;
    }
    const table = document.createElement("table");
    table.className = "table";
    table.innerHTML = `
      <thead>
        <tr><th>Producto</th><th>Precio</th><th>Cant.</th><th>Subtotal</th><th></th></tr>
      </thead>
      <tbody id="tbody"></tbody>
      <tfoot>
        <tr>
          <td colspan="3" class="total">Total</td>
          <td class="total" id="grand"></td>
          <td></td>
        </tr>
      </tfoot>`;
    app.appendChild(table);
    const tbody = $("#tbody");
    let total = 0;
    state.cart.forEach((item) => {
      const prod = state.products.find((p) => p.id === item.id);
      const subtotal = prod.price * item.qty;
      total += subtotal;
      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td>${prod.name}</td>
        <td>${money(prod.price)}</td>
        <td>
          <input data-qty="${prod.id}" type="number" min="1" max="${
        prod.stock
      }" value="${item.qty}" class="input" style="width:80px"/>
        </td>
        <td>${money(subtotal)}</td>
        <td><button class="btn-danger" data-del="${
          prod.id
        }">Quitar</button></td>`;
      tbody.appendChild(tr);
    });
    $("#grand").textContent = money(total);
    const actions = document.createElement("div");
    actions.className = "row";
    actions.style.marginTop = "12px";
    actions.innerHTML = `<button id="vaciar" class="btn-ghost">Vaciar carrito</button><button id="irCheckout" class="btn-primary">Ir a Checkout</button>`;
    app.appendChild(actions);
  },
  checkout() {
    app.innerHTML = `<h2>Checkout</h2>`;
    if (state.cart.length === 0) {
      app.appendChild(
        empty("No hay productos en el carrito. Volvé al catálogo.")
      );
      return;
    }
    const total = state.cart.reduce((acc, it) => {
      const prod = state.products.find((p) => p.id === it.id);
      return acc + prod.price * it.qty;
    }, 0);
    const form = document.createElement("div");
    form.className = "card";
    form.innerHTML = `
      <div class="card-body">
        <div class="row-between"><h3>Datos de envío</h3><span class="small"></span></div>
        <label>Nombre</label>
        <input id="f-nombre" class="input" value="${
          state.user.nombre
        }" placeholder="Nombre y apellido"/>
        <label>Email</label>
        <input id="f-email" class="input" value="${
          state.user.email
        }" placeholder="tu@email.com"/>
        <label>Dirección</label>
        <input id="f-direccion" class="input" value="${
          state.user.direccion
        }" placeholder="Calle 123, Ciudad"/>
        <div class="row-between" style="margin-top:12px">
          <div class="total">Total a pagar: ${money(total)}</div>
          <button id="btnPagar" class="btn-primary">Pagar</button>
        </div>
      </div>`;
    app.appendChild(form);
  },
};

const empty = (text) => {
  const div = document.createElement("div");
  div.className = "empty";
  div.innerHTML = `<p>${text}</p>`;
  return div;
};

// ---- Navegación simple ----
const go = (view) => {
  View[view]();
  window.scrollTo({ top: 0, behavior: "smooth" });
};

// ---- Eventos globales (delegación) ----
document.addEventListener("click", async (e) => {
  const t = e.target;
  if (t.matches("#nav-catalogo")) go("catalogo");
  if (t.matches("#nav-carrito")) go("carrito");
  if (t.matches("#nav-checkout")) go("checkout");

  if (t.dataset.add) {
    const id = Number(t.dataset.add);
    const qty = Number($(`#qty-${id}`)?.value || 1);
    addToCart(id, qty);
    toast("Producto agregado");
  }
  if (t.dataset.del) {
    const id = Number(t.dataset.del);
    const ok = await confirm("¿Quitar producto?", "Se eliminará del carrito");
    if (ok) {
      state.cart = state.cart.filter((it) => it.id !== id);
      save();
      go("carrito");
      toast("Producto eliminado", "info");
    }
  }
  if (t.matches("#vaciar")) {
    const ok = await confirm(
      "¿Vaciar carrito?",
      "Esta acción no se puede deshacer"
    );
    if (ok) {
      state.cart = [];
      save();
      go("carrito");
      toast("Carrito vacío");
    }
  }
  if (t.matches("#irCheckout")) go("checkout");

  if (t.matches("#btnPagar")) {
    const nombre = $("#f-nombre").value.trim();
    const email = $("#f-email").value.trim();
    const direccion = $("#f-direccion").value.trim();
    if (!nombre || !email || !direccion) {
      toast("Completá todos los campos", "warning");
      return;
    }
    state.user = { nombre, email, direccion };
    // Simulamos pago exitoso
    const ok = await confirm(
      "¿Confirmar pago?",
      `Total: ${$("#app .total").textContent}`
    );
    if (ok) {
      state.cart = [];
      save();
      go("catalogo");
      toast("¡Compra realizada con éxito!");
    }
  }
});

document.addEventListener("input", (e) => {
  const t = e.target;
  if (t.dataset.qty) {
    const id = Number(t.dataset.qty);
    const item = state.cart.find((it) => it.id === id);
    if (!item) return;
    const qty = Math.max(1, Math.min(Number(t.value || 1), getStock(id)));
    item.qty = qty;
    save();
    View.carrito();
  }
});

// ---- Lógica ----
const getStock = (id) => state.products.find((p) => p.id === id)?.stock ?? 0;

const addToCart = (id, qty = 1) => {
  const stock = getStock(id);
  const inCart = state.cart.find((it) => it.id === id);
  const desired = (inCart?.qty || 0) + qty;
  const finalQty = Math.min(desired, stock);
  if (inCart) inCart.qty = finalQty;
  else state.cart.push({ id, qty: finalQty });
  save();
};

const updateCartCount = () => {
  const n = state.cart.reduce((acc, it) => acc + it.qty, 0);
  $("#cart-count").textContent = n;
};

// ---- Inicio ----
(async function init() {
  await loadProducts(); // carga asíncrona de JSON
  updateCartCount();
  View.catalogo(); // vista inicial
})();
