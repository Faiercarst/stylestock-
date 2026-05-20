{
const contenedor = document.createElement('div');
contenedor.innerHTML = `
  <div class="contenedor-flotante">
    <button class="dm-btn" id="toggleBtn">🎁</button>
    <div class="menu" id="menu">
      <a href="https://www.facebook.com/profile.php?id=61589835586603" target="_blank" class="menu-item facebook">
   <img src="Facebook_Logo_(2019).png" width="20"> Facebook
</a>
      <a href="https://www.instagram.com/stylestock436/" target="_blank" class="menu-item instagram">
   <img src="Instagram_icon.png" width="20"> Instagram
</a>
<a href="https://mail.google.com/mail/u/0/?view=cm&to=stylestock436@gmail.com" target="_blank" class="menu-item correo">
   <img src="Gmail_icon_(2020).svg.png" width="20"> Correo
</a>

    </div>
  </div>
    
`;

document.body.appendChild(contenedor);

const btn = document.getElementById('toggleBtn');
const menu = document.getElementById('menu');

btn.addEventListener('click', () => {
  menu.classList.toggle('activo');
});

document.addEventListener('click', (e) => {
  if (!btn.contains(e.target) && !menu.contains(e.target)) {
    menu.classList.remove('activo');
  }
});




}
