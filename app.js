// ========================
// 🔒 LOGIN
// ========================

function showToast(msg) {
  const toast = document.getElementById("toast");
  document.getElementById("toastMsg").textContent = msg;
  toast.classList.remove("hide");
  toast.classList.add("show");
  setTimeout(() => {
    toast.classList.add("hide");
    setTimeout(() => toast.classList.remove("show", "hide"), 300);
  }, 3000);
}

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
            alert("Cuenta creada correctamente");
            window.location.href = "login.html";
        }else{
            alert("Error: " + (data.error ?? "Error al registrar"));
    }

    }catch(error){
       alert("Error de conexión con el servidor");
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
                <p>$${p.precio}</p>
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
        document.getElementById("precio").innerText = data.precio;
        document.getElementById("cantidad").innerText = data.cantidad;
        document.getElementById("imgDetalle").src = data.imagen || "img/default.png";
    }
}

if(window.location.pathname.includes("detalle")){
    const data = JSON.parse(localStorage.getItem("detalle"));

    if(data){
        document.getElementById("nombre").innerText = data.nombre;
        document.getElementById("categoria").innerText = data.categoria;
        document.getElementById("talla").innerText = data.talla;
        document.getElementById("color").innerText = data.color;
        document.getElementById("precio").innerText = data.precio;
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
        } else {
            renderTallas(tallaRopa);
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
            alert("Prenda eliminada");
            window.location.href = "inventario.html";
        } else {
            alert("Error al eliminar: " + (result.error ?? "Error al eliminar"));
        }
    })
    .catch(error => {
        alert("Error de conexión con el servidor");
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
        alert("Completa todos los campos");
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
        alert(esEdicion ? "Prenda actualizada" : "Prenda guardada");
        window.location.href = "inventario.html";
    } else {
        alert("Error: " + (data.error ?? "Error al guardar"));
    }
    
     } catch(error){

    alert("Error de conexion con el servidor");
    console.log(error);
    }


     });


     

//  DASHBOARD

if(window.location.pathname.includes("dashboard")){

    const user_id = localStorage.getItem("user_id");

    fetch(`http://localhost/stylestock/get_dashboard.php?usuario_id=${user_id}`)
    .then(res => res.json())
    .then(data => {

        if(!data.success) return;

        // Llenar KPIs
        document.getElementById("totalPrendas").innerText = data.totalPrendas;
        document.getElementById("totalStock").innerText = data.totalStock;
        document.getElementById("totalValor").innerText = "$" + Number(data.totalValor).toLocaleString();

        // Gráfica de categorías
        new Chart(document.getElementById("chartCategorias"), {
            type: "doughnut",
            data: {
                labels: data.categorias.map(c => c.categoria),
                datasets: [{
                    data: data.categorias.map(c => c.total),
                    backgroundColor: ["#f7886c","#9deea4","#a0b4d6","#7e9cc0","#2d4f7a"]
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
                    backgroundColor: "#5c6f8f"
                }]
            }
        });

    })
    .catch(error => {
        console.log("Error dashboard:", error);
    });
}