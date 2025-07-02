const productos = document.querySelectorAll(".producto");
const modal = document.getElementById("formulario-compra");
const formCompra = document.getElementById("form-compra");
const productoNombre = document.getElementById("producto-nombre");
const productoPrecio = document.getElementById("producto-precio");
const btnCancelar = document.getElementById("btn-cancelar");

let productoSeleccionado = null;
let telefonoProveedor = "";

productos.forEach(prod => {
  prod.querySelector(".btn-comprar").addEventListener("click", () => {
    productoSeleccionado = prod;
    productoNombre.textContent = prod.dataset.nombre;
    productoPrecio.textContent = prod.dataset.precio;
    telefonoProveedor = prod.dataset.telefono;
    modal.style.display = "flex";

    // Render PayPal button
    renderPaypalButton(prod.dataset.precio);
  });
});

btnCancelar.addEventListener("click", () => {
  modal.style.display = "none";
  formCompra.reset();
  limpiarPaypalButton();
});

function limpiarPaypalButton() {
  const container = document.getElementById("paypal-button-container");
  container.innerHTML = "";
}

// Render PayPal con pago amigos/familia (tipo "PERSONAL_PAYMENT")
function renderPaypalButton(precio) {
  limpiarPaypalButton();

  paypal.Buttons({
    style: { layout: 'vertical', color: 'blue', shape: 'rect', label: 'paypal' },

    createOrder: (data, actions) => {
      return actions.order.create({
        purchase_units: [{
          amount: {
            value: precio
          }
        }],
        application_context: {
          shipping_preference: "NO_SHIPPING"
        }
      });
    },

    onApprove: (data, actions) => {
      return actions.order.capture().then(() => {
        // Guardamos datos cliente
        const nombre = document.getElementById("cliente-nombre").value.trim();
        const email = document.getElementById("cliente-email").value.trim();
        const telCliente = document.getElementById("cliente-tel").value.trim();

        if (!nombre || !email || !telCliente) {
          alert("Por favor completa todos los campos antes de pagar.");
          return;
        }

        // Ocultamos modal
        modal.style.display = "none";
        formCompra.reset();

        // Redirigir a página gracias pasando teléfono por query string (URL)
        const telEncriptado = encodeURIComponent(telefonoProveedor);
        window.location.href = `gracias.html?tel=${telEncriptado}`;
      });
    },

    onError: err => {
      alert("Error al procesar el pago: " + err);
    }
  }).render("#paypal-button-container");
}