function cargarLogo(event) {
  const file = event.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = function(e) {
    const imgLogo = document.getElementById('img-logo');
    if (imgLogo) {
      imgLogo.src = e.target.result;
      imgLogo.style.display = 'block';
      localStorage.setItem('app_logo', e.target.result);
    }
  };
  reader.readAsDataURL(file);
}

document.addEventListener('DOMContentLoaded', () => {
  const logoGuardado = localStorage.getItem('app_logo');
  const imgLogo = document.getElementById('img-logo');
  if (logoGuardado && imgLogo) {
    imgLogo.src = logoGuardado;
    imgLogo.style.display = 'block';
  }
});