// SISTEMA DE TOASTS
function mostrarToast(mensaje, tipo = 'info') {
  let contenedor = document.getElementById('toast-container');
  if (!contenedor) {
    contenedor = document.createElement('div');
    contenedor.id = 'toast-container';
    contenedor.style.cssText = 'position:fixed; bottom:20px; right:20px; z-index:10000; display:flex; flex-direction:column; gap:8px;';
    document.body.appendChild(contenedor);
  }

  const toast = document.createElement('div');
  const colores = {
    success: '#10b981',
    error: '#ef4444',
    info: '#3b82f6'
  };

  toast.style.cssText = `background:${colores[tipo] || colores.info}; color:#fff; padding:10px 16px; border-radius:8px; font-size:13px; font-weight:600; box-shadow:0 4px 12px rgba(0,0,0,0.15); transition:all 0.3s ease; opacity:0; transform:translateY(10px);`;
  toast.innerText = mensaje;

  contenedor.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = '1';
    toast.style.transform = 'translateY(0)';
  }, 10);

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(10px)';
    setTimeout(() => toast.remove(), 300);
  }, 3000);
}

// INDICADOR DE AUTO-GUARDADO
let autoSaveTimeout;
function notificarAutoGuardado() {
  const badge = document.getElementById('status-guardado');
  if (badge) {
    badge.innerText = '⏳ Guardando...';
    badge.style.color = '#f59e0b';
  }

  clearTimeout(autoSaveTimeout);
  autoSaveTimeout = setTimeout(() => {
    if (typeof guardarDatos === 'function') guardarDatos();
    if (badge) {
      badge.innerText = '✓ Cambios guardados';
      badge.style.color = '#10b981';
    }
  }, 800);
}

