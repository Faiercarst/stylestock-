// ========================
// 🔒 LOGIN
// ========================


function shakeCard() {
  const card = document.getElementById("loginCard");
  card.classList.add("shake");
  card.addEventListener("animationend", () => card.classList.remove("shake"), { once: true });
}

function setLoading(isLoading) {
  const btn  = document.getElementById("loginBtn");
  const text = btn.querySelector(".btn-text");
  if (isLoading) {
    btn.classList.add("loading");
    btn.disabled = true;
    text.textContent = "Iniciando sesión...";
  } else {
    btn.classList.remove("loading");
    btn.disabled = false;
    text.textContent = "Iniciar sesión";
  }
}

function smoothRedirect(url) {
  const card = document.getElementById("loginCard");
  card.classList.add("fade-out-page");
  card.addEventListener("animationend", () => window.location.href = url, { once: true });
}

document.getElementById("loginForm")?.addEventListener("submit", async function(e) {
  e.preventDefault();

  const email    = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  setLoading(true);

  try {
    const res  = await fetch("http://localhost/stylestock/login.php", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password })
    });
    const data = await res.json();

    if (data.success) {
      localStorage.setItem("user_id", data.user_id);
      localStorage.setItem("user_nombre", data.nombre + " " + data.apellido);
      localStorage.setItem("user_email", data.email);
      smoothRedirect("inventario.html");
    } else {
      setLoading(false);
      shakeCard();
      showToast("Correo o contraseña incorrectos");
    }
  } catch (error) {
    setLoading(false);
    shakeCard();
    showToast("Error conectando con el servidor");
    console.log(error);
  }
});


// ======================
// IR A REGISTRO
// ======================
function goRegister(){
    window.location.href = "registro.html";
}


// ======================
// 📝 REGISTRO
// ======================
document.getElementById("registerForm")?.addEventListener("submit", async function(e){
    e.preventDefault();

    const nombre = document.getElementById("nombre").value;
    const apellido = document.getElementById("apellido").value;
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    try{
        const res = await fetch("http://localhost/stylestock/register.php", {
            method:"POST",
            headers:{ "Content-Type":"application/json" },
            body: JSON.stringify({nombre, apellido, email, password})
        });

        const data = await res.json();

        if(data.success){
            showToast("Cuenta creada correctamente");
            window.location.href = "login.html";
        }else{
            showToast("Error: " + (data.error ?? "Error al registrar"));
    }

    }catch(error){
       showToast("Error de conexión con el servidor");
    console.log(error);
    }
});

/* ver la contraseña */
const togglePassword = document.getElementById("togglePassword");
const passwordInput  = document.getElementById("password");

togglePassword?.addEventListener("mousedown", () => {
  passwordInput.type = "text";
});

togglePassword?.addEventListener("mouseup", () => {
  passwordInput.type = "password";
});

togglePassword?.addEventListener("mouseleave", () => {
  passwordInput.type = "password";
});




// ======================
// VOLVER AL LOGIN
// ======================
function goLogin(){
    window.location.href = "login.html";
}


// ======================
// 👕 INVENTARIO
// ======================
if(window.location.pathname.includes("inventario")){

    const grid = document.getElementById("grid");
    const user_id = localStorage.getItem("user_id");

    let prendas = [];

    function render(lista){
        grid.innerHTML = "";

        lista.forEach((p) => {
            const card = document.createElement("div");
            card.classList.add("card");

            card.innerHTML = `
                <img src="${p.imagen || 'img/default.png'}">
                <h3>${p.nombre}</h3>
                <p>${p.categoria}</p>
                <p>${p.talla} • ${p.color}</p>
                <p>$${formatCOP(p.precio)}</p>
            `;

            card.onclick = () => {
                localStorage.setItem("detalle", JSON.stringify(p));
                window.location.href = "detalle.html";
            };

            grid.appendChild(card);
        });
    }

    function cargarPrendas(){
        fetch(`http://localhost/stylestock/get_prendas.php?usuario_id=${user_id}`)
        .then(res => res.json())
        .then(data => {
            prendas = data;
            render(prendas);
        
        })
            
        .catch(error => {
            console.error("Error al cargar las prendas:", error);
            grid.innerHTML = "<p>Error al cargar las prendas.</p>";
        });

    }

    cargarPrendas();

    function irAgregar(){
        localStorage.removeItem("editar");
        window.location.href = "reg_prenda.html";
    }
    


    function aplicarFiltros(){
        const c = document.getElementById("fCategoria").value;
        const t = document.getElementById("fTalla").value;
        const col = document.getElementById("fColor").value;

        const filtrado = prendas.filter(p =>
            (!c || p.categoria === c) &&
            (!t || p.talla === t) &&
            (!col || p.color === col)
        );

        render(filtrado);
    }





    // 🔍 BUSCAR
    document.getElementById("buscar").addEventListener("input", function(){
        const valor = this.value.toLowerCase();

        const filtrado = prendas.filter(p =>
            p.nombre.toLowerCase().includes(valor)
        );

        render(filtrado);
    });

    // 🎯 FILTROS
    document.querySelectorAll("select").forEach(select => {
        select.addEventListener("change", aplicarFiltros);
    });

    function aplicarFiltros(){
        const c = document.getElementById("fCategoria").value;
        const t = document.getElementById("fTalla").value;
        const col = document.getElementById("fColor").value;

        const filtrado = prendas.filter(p =>
            (!c || p.categoria === c) &&
            (!t || p.talla === t) &&
            (!col || p.color === col)
        );

        render(filtrado);
    }
}


// ======================
// 📄 DETALLE
// ======================
if(window.location.pathname.includes("detalle")){

    const data = JSON.parse(localStorage.getItem("detalle"));

    if(data){
        document.getElementById("nombre").innerText = data.nombre;
        document.getElementById("categoria").innerText = data.categoria;
        document.getElementById("talla").innerText = data.talla;
        document.getElementById("color").innerText = data.color;
        document.getElementById("precio").innerText = formatCOP(data.precio);
        document.getElementById("cantidad").innerText = data.cantidad;
        document.getElementById("imgDetalle").src = data.imagen || "img/default.png";
    }
}




function editarDetalle(){
    const data = JSON.parse(localStorage.getItem("detalle"));
    localStorage.setItem("editar", JSON.stringify(data));
    window.location.href = "reg_prenda.html";
}


if(window.location.pathname.includes("reg_prenda")){

    const tallaRopa = ["S", "M", "L", "XL"];
    const tallaPantalon =  ["28","30","32","34","36","38","40","42","44","46"];
    const tallaZapatos = ["35","36","37","38","39","40","41","42","43","44"];


    function renderTallas(tallas){
        const sizes = document.getElementById("sizes");
        sizes.innerHTML = "";
        tallas.forEach(t => {
            const btn = document.createElement("button");
            btn.type = "button";
            btn.innerText = t;
            btn.addEventListener("click", function(){
                      document.querySelectorAll(".sizes button").forEach(b => b.classList.remove("active"));
                      this.classList.add("active");
                  });
            sizes.appendChild(btn);
        });
    }
    
    document.getElementById("categoria").addEventListener("change", function(){
        if(this.value === "Pantalones"){
            renderTallas(tallaPantalon);

            
        } else if(this.value === "Zapatos"){
            renderTallas(tallaZapatos);
        } else {
            renderTallas(tallaRopa);
        }

        const prendaEditar = JSON.parse(localStorage.getItem("editar"));

        if(prendaEditar && prendaEditar.talla){
            document.querySelectorAll(".sizes button").forEach(btn => {
                if(btn.innerText === prendaEditar.talla){
                    btn.classList.add("active");
                }
            });
        }

    });


    renderTallas(tallaRopa);        


    const prendaEditar = JSON.parse(localStorage.getItem("editar"));

    if(prendaEditar){
        document.getElementById("nombre").value = prendaEditar.nombre;
        document.getElementById("categoria").value = prendaEditar.categoria;
        document.getElementById("color").value = prendaEditar.color;
        document.getElementById("precio").value = prendaEditar.precio;
        document.getElementById("cantidad").value = prendaEditar.cantidad;
        
        document.querySelectorAll(".sizes button").forEach(btn => {
            if(btn.innerText === prendaEditar.talla){
                btn.classList.add("active");
            }
        });
    }

}






// ======================
// 🗑 ELIMINAR
// ======================
function confirmarEliminar(){

    const data = JSON.parse(localStorage.getItem("detalle"));

    fetch(`http://localhost/stylestock/delete.php?id=${data.id}`)
    .then(res => res.json())
    .then(result => {
        if(result.success){
            localStorage.removeItem("detalle");
            showToast("Prenda eliminada");
            setTimeout(() => {
                window.location.href = "inventario.html";
            }, 1500);
        } else {
            showToast("Error al eliminar: " + (result.error ?? "Error al eliminar"));
        }
    })
    .catch(error => {
        showToast("Error de conexión con el servidor");
        console.log(error);



    });
}


// ======================
// 🔙 VOLVER
// ======================
function volver(){
    window.location.href = "inventario.html";
}


// ======================
// 🪟 MODAL
// ======================
function abrirModal(){
    document.getElementById("modal").style.display = "flex";
}

function cerrarModal(){
    document.getElementById("modal").style.display = "none";
}


// ======================
// ➕ REGISTRAR PRENDA
// ======================
if(document.querySelector(".sizes")){
    document.querySelectorAll(".sizes button").forEach(btn => {
        btn.addEventListener("click", function(){
            document.querySelectorAll(".sizes button").forEach(b => b.classList.remove("active"));
            this.classList.add("active");
        });
    });
}

// PREVIEW IMAGEN
const inputImagen = document.getElementById("imagen");
const preview = document.getElementById("preview");

inputImagen?.addEventListener("change", function(){

    const file = this.files[0];

    if(file){
        const reader = new FileReader();

        reader.onload = function(e){
            preview.src = e.target.result;
            preview.style.display = "block";
        };

        reader.readAsDataURL(file);
    }
});

// CANTIDAD
const cantidadInput = document.getElementById("cantidad");

document.getElementById("mas")?.addEventListener("click", ()=>{
    cantidadInput.value = Number(cantidadInput.value) + 1;
});

document.getElementById("menos")?.addEventListener("click", ()=>{
    if(cantidadInput.value > 1) cantidadInput.value--;
});

// GUARDAR PRENDA
document.getElementById("formPrenda")?.addEventListener("submit", async function(e){

    e.preventDefault();

    const user_id = localStorage.getItem("user_id");

    const nombre = document.getElementById("nombre").value;
    const categoria = document.getElementById("categoria").value;
    const color = document.getElementById("color").value;
    const precio = document.getElementById("precio").value;
    const cantidad = document.getElementById("cantidad").value;
    const talla = document.querySelector(".sizes .active")?.innerText;
    const imagen = preview?.src || "";

    if(!nombre || !categoria || !precio || !cantidad || !talla){
        showToast("Completa todos los campos");
        return;
    }
    
    const prendasEditar = JSON.parse(localStorage.getItem("editar"));
    const esEdicion = prendasEditar !== null;



    try{

        const url = esEdicion 
            ? "http://localhost/stylestock/actualizar_prenda.php"
            : "http://localhost/stylestock/crear_prenda.php";

        const body = esEdicion
            ? { id: prendasEditar.id, user_id, nombre, categoria, color, precio, cantidad, talla, imagen }
            : { usuario_id: user_id, nombre, categoria, color, precio, cantidad, talla, imagen };


        const res = await fetch(url, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(body)
        });

        const data = await res.json();

    if(data.success){
        localStorage.removeItem("editar");
        showToast(esEdicion ? " ¡ Prenda actualizada !" : "Prenda guardada");
       
       setTimeout(() => {
        window.location.href = "inventario.html";
       }, 1500);




    } else {
        showToast("Error: " + (data.error ?? "Error al guardar"));
    }
    
     } catch(error){

    showToast("Error de conexion con el servidor");
    console.log(error);
    }


     });


     

//  DASHBOARD
function colorAleatorio(){
    const colores = [
        "#7c5af0","#5b8af7","#38d9a9","#f05a7c",
        "#f0c05a","#a78bfa","#34d399","#f87171",
        "#60a5fa","#fb923c","#e879f9","#4ade80"
    ];
    return colores[Math.floor(Math.random() * colores.length)];
}

function colorAleatorios(cantidad){
    return Array.from({length: cantidad}, () => colorAleatorio());
}   

if(window.location.pathname.includes("dashboard")){

    const user_id = localStorage.getItem("user_id");

    fetch(`http://localhost/stylestock/get_dashboard.php?usuario_id=${user_id}`)
    .then(res => res.json())
    .then(data => {

        if(!data.success) return;

        // Llenar KPIs
        document.getElementById("totalPrendas").innerText = data.totalPrendas;
        document.getElementById("totalStock").innerText = data.totalStock;
        document.getElementById("totalValor").innerText = "$" + formatCOP(data.totalValor);

        // Gráfica de categorías
        new Chart(document.getElementById("chartCategorias"), {
            type: "doughnut",
            data: {
                labels: data.categorias.map(c => c.categoria),
                datasets: [{
                    data: data.categorias.map(c => c.total),
                    backgroundColor: colorAleatorios(5)
                }]
            }
        });

        // Gráfica de stock por prenda
        new Chart(document.getElementById("chartStock"), {
            type: "bar",
            data: {
                labels: data.stockPrendas.map(p => p.nombre),
                datasets: [{
                    label: "Stock",
                    data: data.stockPrendas.map(p => p.cantidad),
                    backgroundColor: colorAleatorios(data.stockPrendas.length)
                }]
            }
        });

    })
    .catch(error => {
        console.log("Error dashboard:", error);
    });
}



function formatCOP(num){
    return Number(num ||0).toLocaleString("es-CO" );

}


function showToast(msg, type = "info"){
    const toast = document.getElementById("toast");
    if(!toast) return;
    toast.innerText = msg;
    toast.className = `toast ${type}`;
    toast.classList.add("show");
    clearTimeout(window._toastTimer);
    window._toastTimer = setTimeout(() => {
        toast.classList.remove("show");
    }, 3000);
}





// ======================
// 💰 VENTA
// ======================
if (window.location.pathname.includes("venta.html")) {

    const prenda = JSON.parse(localStorage.getItem("detalle"));

    if (prenda) {
        document.getElementById("ventaImg").src = prenda.imagen || "logo.png";
        document.getElementById("ventaNombre").innerText = prenda.nombre;
        document.getElementById("ventaSub").innerText    = prenda.categoria + " · " + prenda.talla + " · " + prenda.color;
        document.getElementById("ventaStock").innerText  = prenda.cantidad;
    }

    // Calcular total en tiempo real
    document.getElementById("cantidadVenta").addEventListener("input", function () {
        const cantidad = Number(this.value) || 0;
        const total    = cantidad * Number(prenda.precio);
        document.getElementById("totalVenta").innerText = "$" + formatCOP(total);
    });

    // Inicializar total
    document.getElementById("totalVenta").innerText = "$" + formatCOP(prenda.precio);
}

async function realizarVenta() {
    const prenda          = JSON.parse(localStorage.getItem("detalle"));
    const user_id         = localStorage.getItem("user_id");
    const nombre_cliente  = document.getElementById("clienteNombre").value.trim();
    const documento       = document.getElementById("clienteDoc").value.trim();
    const cantidad        = Number(document.getElementById("cantidadVenta").value);

    if (!nombre_cliente || !documento || !cantidad) {
        showToast("Completa todos los campos");
        return;
    }

    if (cantidad > prenda.cantidad) {
        showToast("No hay suficiente stock. Disponible: " + prenda.cantidad);
        return;
    }

    const total = cantidad * Number(prenda.precio);

    const ventaData = {
        usuario_id:      user_id,
        prenda_id:       prenda.id,
        nombre_cliente,
        documento_cliente: documento,
        cantidad_vendida: cantidad,
        precio_unitario:  prenda.precio,
        total
    };

    try {
        const res  = await fetch("http://localhost/stylestock/crear_venta.php", {
            method:  "POST",
            headers: { "Content-Type": "application/json" },
            body:    JSON.stringify(ventaData)
        });

        const data = await res.json();

        if (data.success) {
            // Actualizar stock en localStorage
            prenda.cantidad = prenda.cantidad - cantidad;
            localStorage.setItem("detalle", JSON.stringify(prenda));

            // Guardar datos de factura
            localStorage.setItem("factura", JSON.stringify({
                venta_id:      data.venta_id,
                nombre_cliente,
                documento,
                prenda,
                cantidad,
                precio_unitario: prenda.precio,
                total,
                fecha: new Date().toLocaleString("es-CO")
            }));

            showToast("¡Venta registrada!");
            setTimeout(() => {
                window.location.href = "factura.html";
            }, 1200);

        } else {
            showToast("Error: " + (data.error ?? "No se pudo registrar"));
        }

    } catch (error) {
        showToast("Error de conexión");
        console.log(error);
    }
}



// 🧾 FACTURA

if (window.location.pathname.includes("factura")) {

    const f = JSON.parse(localStorage.getItem("factura"));

    if (f) {
        document.getElementById("facturaNum").innerText          = "#" + String(f.venta_id).padStart(4, "0");
        document.getElementById("facturaFecha").innerText        = f.fecha;
        document.getElementById("facturaClienteNombre").innerText = f.nombre_cliente;
        document.getElementById("facturaClienteDoc").innerText   = "Doc: " + f.documento;
        document.getElementById("facturaTotal").innerText        = "$" + formatCOP(f.total);

        document.getElementById("facturaItems").innerHTML = `
            <tr>
                <td><strong>${f.prenda.nombre}</strong></td>
                <td>${f.prenda.talla}</td>
                <td>${f.prenda.color}</td>
                <td>${f.cantidad}</td>
                <td>$${formatCOP(f.precio_unitario)}</td>
                <td><strong>$${formatCOP(f.total)}</strong></td>
            </tr>
        `;
    }
}





function aceptarTerminos(){
    document.getElementById("modalTerminos").style.display = "none";
}


function cancelarTerminos(){
    window.location.href = "login.html";
}



function cerrarSesion(){
    localStorage.removeItem("user_id");
    window.location.href = "login.html";
}






// 🔐 SEGURIDAD CONTRASEÑA

document.getElementById("password")?.addEventListener("input", function () {
    const val = this.value;
    const fill = document.getElementById("strengthFill");
    const label = document.getElementById("strengthLabel");
    if (!fill) return;

    let score = 0;
    if (val.length >= 8) score++;
    if (/[A-Z]/.test(val)) score++;
    if (/[0-9]/.test(val)) score++;
    if (/[^A-Za-z0-9]/.test(val)) score++;

    if (val.length === 0) {
        fill.style.width = "0%";
        fill.style.background = "transparent";
        label.innerText = "";
    } else if (score <= 1) {
        fill.style.width = "25%";
        fill.style.background = "#f05a7c";
        label.innerText = "Débil";
        label.style.color = "#f05a7c";
    } else if (score === 2) {
        fill.style.width = "50%";
        fill.style.background = "#f0c05a";
        label.innerText = "Regular";
        label.style.color = "#f0c05a";
    } else if (score === 3) {
        fill.style.width = "75%";
        fill.style.background = "#5b8af7";
        label.innerText = "Buena";
        label.style.color = "#5b8af7";
    } else {
        fill.style.width = "100%";
        fill.style.background = "#38d9a9";
        label.innerText = "Segura";
        label.style.color = "#38d9a9";
    }
});







// 👤 PERFIL

function abrirPerfil() {
    const nombre = localStorage.getItem("user_nombre");
    const email  = localStorage.getItem("user_email");

    document.getElementById("perfilNombre").innerText    = nombre || "Usuario";
    document.getElementById("perfilNombreVal").innerText = nombre || "Nombre no disponible";
    document.getElementById("perfilEmailVal").innerText  = email  || "Email no disponible";

    document.getElementById("modalPerfil").style.display = "flex";
}

function cerrarPerfil() {
    document.getElementById("modalPerfil").style.display = "none";
}

async function cambiarPassword() {
    const nueva     = document.getElementById("nuevaPassword").value;
    const confirmar = document.getElementById("confirmarPassword").value;
    const user_id   = localStorage.getItem("user_id");

    if (!nueva || !confirmar) {
        showToast("Completa ambos campos");
        return;
    }

    if (nueva !== confirmar) {
        showToast("Las contraseñas no coinciden");
        return;
    }

    if (nueva.length < 6) {
        showToast("La contraseña debe tener al menos 6 caracteres");
        return;
    }

    try {
        const res  = await fetch("http://localhost/stylestock/cambiar_password.php", {
            method:  "POST",
            headers: { "Content-Type": "application/json" },
            body:    JSON.stringify({ user_id, password: nueva })
        });

        const data = await res.json();

        if (data.success) {
            showToast("¡Contraseña actualizada!");
            document.getElementById("nuevaPassword").value    = "";
            document.getElementById("confirmarPassword").value = "";
            cerrarPerfil();
        } else {
            showToast("Error: " + (data.error ?? "No se pudo actualizar"));
        }
    } catch (error) {
        showToast("Error de conexión");
        console.log(error);
    }
}
// ======================
// ♿ ACCESIBILIDAD
// ======================
function toggleAccesibilidad() {
    const panel = document.getElementById("panelAccesibilidad");
    panel.style.display = panel.style.display === "none" ? "block" : "none";
}

// TEXTO
let tamanoTexto = 100;
function cambiarTexto(dir) {
    if (dir === 0) {
        tamanoTexto = 100;
    } else {
        tamanoTexto += dir * 5;
        if (tamanoTexto < 70)  tamanoTexto = 70;
        if (tamanoTexto > 150) tamanoTexto = 150;
    }
    document.documentElement.style.setProperty("--text-scale",tamanoTexto / 100);
}

// DALTONISMO
function aplicarFiltro(tipo) {
    document.body.classList.remove("protanopia", "deuteranopia", "tritanopia");
    if (tipo) document.body.classList.add(tipo);
}

// ALTO CONTRASTE
function toggleContraste() {
    document.body.classList.add("alto-contraste");
}
function quitarContraste() {
    document.body.classList.remove("alto-contraste");
}

// CALCULADORA
let calcValor = "";

function calcInput(val) {
    calcValor += val;
    document.getElementById("calcDisplay").value = calcValor;
}

function calcResult() {
    try {
        calcValor = String(eval(calcValor));
        document.getElementById("calcDisplay").value = calcValor;
    } catch {
        document.getElementById("calcDisplay").value = "Error";
        calcValor = "";
    }
}

function calcClear() {
    calcValor = "";
    document.getElementById("calcDisplay").value = "";
}


// 🎛 CUSTOM SELECT

function toggleSelect(el) {
    const container = el.parentElement;
    const abiertos = document.querySelectorAll(".custom-select.abierto");
    
    
    abiertos.forEach(s => {
        if (s !== container) s.classList.remove("abierto");
    });

    container.classList.toggle("abierto");
}

function seleccionar(el, containerId, inputId, valor) {
    const container = document.getElementById(containerId);
    const input     = document.getElementById(inputId);
    const span      = container.querySelector(".select-selected span");

    
    span.innerText = el.innerText;

    
    input.value = valor;

    
    container.querySelectorAll(".select-option").forEach(o => o.classList.remove("activo"));
    el.classList.add("activo");

    
    container.classList.remove("abierto");

    
    aplicarFiltros();
}


document.addEventListener("click", function(e) {
    if (!e.target.closest(".custom-select")) {
        document.querySelectorAll(".custom-select.abierto").forEach(s => {
            s.classList.remove("abierto");
        });
    }
});
