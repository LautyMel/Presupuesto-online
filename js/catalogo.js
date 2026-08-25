// Obtiene el catálogo de localStorage utilizando la clave estándar 'app_catalogo'
function obtenerCatalogo() {
  return JSON.parse(localStorage.getItem('app_catalogo')) || [];
}

// Actualiza el datalist de sugerencias con los elementos del catálogo
function actualizarDatalistSugerencias() {
  const dl = document.getElementById('lista-sugerencias');
  if (!dl) return;
  
  const catalogo = obtenerCatalogo();
  dl.innerHTML = catalogo.map(item => `<option value="${item.desc}">`).join('');
}

// Renderiza la lista visual dentro del modal del catálogo
function renderizarCatalogo() {
  const lista = document.getElementById('lista-catalogo');
  if (!lista) return;

  const catalogo = obtenerCatalogo();
  lista.innerHTML = '';

  if (catalogo.length === 0) {
    lista.innerHTML = '<div style="padding: 10px; font-size: 12px; color: var(--text-muted, #64748b);">Sin productos guardados.</div>';
    return;
  }

  catalogo.forEach((item, index) => {
    const div = document.createElement('div');
    div.className = 'catalogo-item';
    div.style.cssText = "display: flex; justify-content: space-between; align-items: center; padding: 8px 0; border-bottom: 1px solid #eee;";
    
    // Parsear precio de forma segura para mostrarlo
    const precioNum = parseFloat(item.precio) || 0;
    
    div.innerHTML = `
      <div>
        <strong>${item.desc}</strong>
        <div style="font-size: 11px; color: #666;">Unidad: ${item.unidad || 'un'} - $${precioNum.toLocaleString('es-AR', { minimumFractionDigits: 2 })}</div>
      </div>
      <div style="display: flex; gap: 8px;">
        <button type="button" class="btn-secondary" style="padding: 2px 6px; font-size: 12px;" onclick="editarDelCatalogo(${index})">✏️</button>
        <button type="button" class="btn-delete" onclick="eliminarDelCatalogo(${index})">✕</button>
      </div>
    `;
    lista.appendChild(div);
  });

  actualizarDatalistSugerencias();
}

// Guarda un nuevo ítem desde el modal del catálogo
function guardarEnCatalogo() {
  const descInput = document.getElementById('cat-desc');
  const precioInput = document.getElementById('cat-precio');
  const unitSelect = document.getElementById('cat-unit');

  const desc = descInput ? descInput.value.trim() : '';
  const precio = precioInput ? precioInput.value.trim() : '';
  const unidad = unitSelect ? unitSelect.value : 'un';

  if (!desc) {
    alert("Ingresa una descripción");
    return;
  }

  let catalogo = obtenerCatalogo();
  catalogo.push({ desc, precio, unidad });
  localStorage.setItem('app_catalogo', JSON.stringify(catalogo));

  // Limpiar campos del formulario del modal
  if (descInput) descInput.value = '';
  if (precioInput) precioInput.value = '';
  
  renderizarCatalogo();
  actualizarDatalistSugerencias();
}

// Edita un producto existente en el catálogo
function editarDelCatalogo(index) {
  let catalogo = obtenerCatalogo();
  let item = catalogo[index];
  if (!item) return;

  const nuevaDesc = prompt("Editar Descripción:", item.desc);
  if (nuevaDesc === null) return;
  
  const nuevoPrecio = prompt("Editar Precio:", item.precio);
  if (nuevoPrecio === null) return;

  catalogo[index].desc = nuevaDesc.trim() || item.desc;
  catalogo[index].precio = nuevoPrecio;
  
  localStorage.setItem('app_catalogo', JSON.stringify(catalogo));
  renderizarCatalogo();
  actualizarDatalistSugerencias();
}

// Elimina un producto del catálogo
function eliminarDelCatalogo(index) {
  if (!confirm("¿Eliminar este producto del catálogo?")) return;
  
  let catalogo = obtenerCatalogo();
  catalogo.splice(index, 1);
  localStorage.setItem('app_catalogo', JSON.stringify(catalogo));
  
  renderizarCatalogo();
  actualizarDatalistSugerencias();
}

// Funciones para abrir y cerrar el modal (compatibles con ambos nombres de funciones)
function abrirModalCatalogo() {
  renderizarCatalogo();
  const modal = document.getElementById('modal-catalogo');
  if (modal) modal.style.display = 'flex';
}
function abrirCatalogo() { abrirModalCatalogo(); }

function cerrarModalCatalogo() {
  const modal = document.getElementById('modal-catalogo');
  if (modal) modal.style.display = 'none';
}
function cerrarCatalogo() { cerrarModalCatalogo(); }

// Inicialización al cargar el DOM
document.addEventListener('DOMContentLoaded', () => {
  actualizarDatalistSugerencias();
});