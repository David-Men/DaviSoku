/* ===== MARKET CON FILTROS, BUSCADOR Y MODAL CON GALERÍA ===== */

const contenedor = document.getElementById("productos-container");
const filtrosContainer = document.getElementById("filtros-container");
const buscador = document.getElementById("buscador-productos");

const modal = document.getElementById("modal-producto");
const cerrarModal = document.getElementById("cerrar-modal");

const modalImg = document.getElementById("modal-img");
const modalCategoria = document.getElementById("modal-categoria");
const modalNombre = document.getElementById("modal-nombre");
const modalDescripcion = document.getElementById("modal-descripcion");
const modalEstado = document.getElementById("modal-estado");
const modalPrecio = document.getElementById("modal-precio");
const modalContacto = document.getElementById("modal-contacto");

const fotoAnterior = document.getElementById("foto-anterior");
const fotoSiguiente = document.getElementById("foto-siguiente");
const modalThumbs = document.getElementById("modal-thumbs");

let categoriaActual = "Todos";
let textoBusqueda = "";

let imagenesActuales = [];
let imagenActualIndex = 0;

function filtrarProductos() {
  let productosFiltrados = productos;

  if (categoriaActual !== "Todos") {
    productosFiltrados = productosFiltrados.filter(
      producto => producto.categoria === categoriaActual
    );
  }

  if (textoBusqueda !== "") {
    productosFiltrados = productosFiltrados.filter(producto =>
      producto.nombre.toLowerCase().includes(textoBusqueda) ||
      producto.descripcion.toLowerCase().includes(textoBusqueda) ||
      producto.categoria.toLowerCase().includes(textoBusqueda)
    );
  }

  mostrarProductos(productosFiltrados);
}

function mostrarProductos(listaProductos) {
  if (!contenedor) return;

  contenedor.innerHTML = "";

  if (listaProductos.length === 0) {
    contenedor.innerHTML = `
      <div class="empty-market">
        <h3>No se encontraron productos</h3>
        <p>Probá con otra búsqueda o categoría.</p>
      </div>
    `;
    return;
  }

  listaProductos.forEach((producto, index) => {
    const card = document.createElement("div");
    card.classList.add("product-card");

    card.innerHTML = `
      <div class="product-img-box">
        <img src="${producto.imagen}" alt="${producto.nombre}">
      </div>

      <div class="product-info">
        <span class="product-category">${producto.categoria}</span>
        <h3>${producto.nombre}</h3>
        <p class="product-desc">${producto.descripcion}</p>

        <div class="product-details">
          <span>${producto.estado}</span>
          <strong>${producto.precio}</strong>
        </div>

        <button class="details-btn" data-index="${index}">
          Ver detalles
        </button>

        <a class="contact-btn" href="${producto.contacto}" target="_blank">
          Consultar por WhatsApp
        </a>
      </div>
    `;

    contenedor.appendChild(card);
  });

  activarBotonesDetalle(listaProductos);
}

function activarBotonesDetalle(listaProductos) {
  const botones = document.querySelectorAll(".details-btn");

  botones.forEach((boton, index) => {
    boton.addEventListener("click", () => {
      const producto = listaProductos[index];

      imagenesActuales = producto.imagenes && producto.imagenes.length > 0
        ? producto.imagenes
        : [producto.imagen];

      imagenActualIndex = 0;

      modalImg.src = imagenesActuales[imagenActualIndex];
      modalCategoria.textContent = producto.categoria;
      modalNombre.textContent = producto.nombre;
      modalDescripcion.textContent = producto.descripcion;
      modalEstado.textContent = producto.estado;
      modalPrecio.textContent = producto.precio;
      modalContacto.href = producto.contacto;

      mostrarMiniaturas();
      if (imagenesActuales.length <= 1) {
  fotoAnterior.style.display = "none";
  fotoSiguiente.style.display = "none";
  modalThumbs.style.display = "none";
} else {
  fotoAnterior.style.display = "block";
  fotoSiguiente.style.display = "block";
  modalThumbs.style.display = "flex";
}

      modal.classList.add("active");
    });
  });
}

function mostrarMiniaturas() {
  if (!modalThumbs) return;

  modalThumbs.innerHTML = "";

  imagenesActuales.forEach((imagen, index) => {
    const thumb = document.createElement("img");
    thumb.src = imagen;

    if (index === imagenActualIndex) {
      thumb.classList.add("active");
    }

    thumb.addEventListener("click", () => {
      imagenActualIndex = index;
      modalImg.src = imagenesActuales[imagenActualIndex];
      mostrarMiniaturas();
    });

    modalThumbs.appendChild(thumb);
  });
}

function cambiarFoto(direccion) {
  if (imagenesActuales.length === 0) return;

  imagenActualIndex += direccion;

  if (imagenActualIndex < 0) {
    imagenActualIndex = imagenesActuales.length - 1;
  }

  if (imagenActualIndex >= imagenesActuales.length) {
    imagenActualIndex = 0;
  }

  modalImg.src = imagenesActuales[imagenActualIndex];
  mostrarMiniaturas();
}

function crearFiltros() {
  if (!filtrosContainer) return;

  const categorias = ["Todos", ...new Set(productos.map(producto => producto.categoria))];

  filtrosContainer.innerHTML = "";

  categorias.forEach(categoria => {
    const boton = document.createElement("button");
    boton.classList.add("filter-btn");
    boton.textContent = categoria;

    if (categoria === "Todos") {
      boton.classList.add("active");
    }

    boton.addEventListener("click", () => {
      categoriaActual = categoria;

      document.querySelectorAll(".filter-btn").forEach(btn => {
        btn.classList.remove("active");
      });

      boton.classList.add("active");

      filtrarProductos();
    });

    filtrosContainer.appendChild(boton);
  });
}

if (buscador) {
  buscador.addEventListener("input", function () {
    textoBusqueda = this.value.trim().toLowerCase();
    filtrarProductos();
  });

  buscador.addEventListener("keyup", function () {
    textoBusqueda = this.value.trim().toLowerCase();
    filtrarProductos();
  });
}

if (fotoAnterior) {
  fotoAnterior.addEventListener("click", () => cambiarFoto(-1));
}

if (fotoSiguiente) {
  fotoSiguiente.addEventListener("click", () => cambiarFoto(1));
}

if (cerrarModal) {
  cerrarModal.addEventListener("click", () => {
    modal.classList.remove("active");
  });
}

if (modal) {
  modal.addEventListener("click", (e) => {
    if (e.target === modal) {
      modal.classList.remove("active");
    }
  });
}

crearFiltros();
mostrarProductos(productos);


/* ===== NAVEGACIÓN INTERNA ===== */

const links = document.querySelectorAll(".nav-link, .page-btn");
const pages = document.querySelectorAll(".page");

links.forEach(link => {
  link.addEventListener("click", function (e) {
    e.preventDefault();

    const pageId = this.getAttribute("data-page");

    pages.forEach(page => {
      page.classList.remove("active");
    });

    document.getElementById(pageId).classList.add("active");

    document.querySelectorAll(".nav-link").forEach(nav => {
      nav.classList.remove("active");
    });

    const activeNav = document.querySelector(`.nav-link[data-page="${pageId}"]`);

    if (activeNav) {
      activeNav.classList.add("active");
    }

    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  });
});