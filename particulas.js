/* PARTICULAS FLOTANTES*/
const canvas = document.createElement("canvas");
canvas.id = "particulas";
canvas.style.cssText = `
  position:fixed;
  top:0; left:0;
  width:100%; height:100%;
  pointer-events:none;
  z-index:0;
`;
document.body.prepend(canvas);

const ctx = canvas.getContext("2d");
let particulas = [];

function resize() {
  canvas.width  = window.innerWidth;
  canvas.height = window.innerHeight;
}
resize();
window.addEventListener("resize", resize);

function crearParticula() {
  return {
    x: Math.random() * canvas.width,
    y: Math.random() * canvas.height,
    r: Math.random() * 3 + 1,
    dx: (Math.random() - 0.5) * 0.6,
    dy: (Math.random() - 0.5) * 0.6,
    alpha: Math.random() * 0.5 + 0.2
  };
}

for (let i = 0; i < 80; i++) {
  particulas.push(crearParticula());
}

function animar() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  particulas.forEach(p => {
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(255,255,255,${p.alpha})`;
    ctx.fill();

    p.x += p.dx;
    p.y += p.dy;

    if (p.x < 0 || p.x > canvas.width)  p.dx *= -1;
    if (p.y < 0 || p.y > canvas.height) p.dy *= -1;
  });

  requestAnimationFrame(animar);
}

animar();


/* MODO OSCURO */

const btnDark = document.createElement("button");
btnDark.classList.add("btn-dark-mode");
btnDark.textContent = "🌙";
document.body.appendChild(btnDark);

// Recordar preferencia
if (localStorage.getItem("darkMode") === "true") {
  document.body.classList.add("dark");
  btnDark.textContent = "☀️";
}

btnDark.addEventListener("click", () => {
  document.body.classList.toggle("dark");
  const isDark = document.body.classList.contains("dark");
  localStorage.setItem("darkMode", isDark);
  btnDark.textContent = isDark ? "☀️" : "🌙";
});