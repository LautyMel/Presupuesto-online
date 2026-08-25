document.addEventListener('DOMContentLoaded', () => {
  const inputFecha = document.getElementById('fecha-emision');
  if (inputFecha && !inputFecha.value) {
    const hoy = new Date();
    const yyyy = hoy.getFullYear();
    const mm = String(hoy.getMonth() + 1).padStart(2, '0');
    const dd = String(hoy.getDate()).padStart(2, '0');
    inputFecha.value = `${yyyy}-${mm}-${dd}`;
  }

  if (typeof cargarDatos === 'function') cargarDatos();

  document.querySelectorAll('[contenteditable=true]').forEach(elem => {
    elem.addEventListener('input', () => {
      if (typeof guardarDatos === 'function') guardarDatos();
    });
  });

  actualizarDatalistSugerencias();
});

function normalizarUnidad(input) {
  if (!input) return 'un';
  const u = input.toString().trim().toLowerCase().replace('.', '');
  
  if (['u', 'un', 'und', 'unidad', 'unidades'].includes(u)) return 'un';
  if (['m2', 'm²', 'mt2', 'mts2'].includes(u)) return 'm²';
  if (['m', 'ml', 'mt', 'mts'].includes(u)) return 'm';
  if (['h', 'hs', 'hr', 'hrs'].includes(u)) return 'hs';
  if (['l', 'lts', 'lt', 'litros'].includes(u)) return 'litros';
  if (['kg', 'kgs', 'kilo', 'kilos'].includes(u)) return 'kilos';

  return 'un';
}

function actualizarDatalistSugerencias() {
  const dl = document.getElementById('lista-sugerencias');
  if (!dl) return;
  const catalogo = JSON.parse(localStorage.getItem('app_catalogo') || '[]');
  dl.innerHTML = catalogo.map(item => `<option value="${item.desc}">`).join('');
}

function abrirCatalogo() {
  const modal = document.getElementById('modal-catalogo');
  if (modal) modal.style.display = 'flex';
  limpiarFormCatalogo();
  renderizarCatalogo();
}

function cerrarCatalogo() {
  const modal = document.getElementById('modal-catalogo');
  if (modal) modal.style.display = 'none';
}

function limpiarFormCatalogo() {
  document.getElementById('cat-index-edit').value = '-1';
  document.getElementById('cat-desc').value = '';
  document.getElementById('cat-precio').value = '';
  document.getElementById('cat-unit').value = 'un';
  document.getElementById('btn-guardar-cat').innerText = 'Guardar Producto';
}

function guardarEnCatalogo() {
  const indexEdit = parseInt(document.getElementById('cat-index-edit').value);
  const descInput = document.getElementById('cat-desc');
  const precioInput = document.getElementById('cat-precio');
  const unitSelect = document.getElementById('cat-unit');

  const desc = descInput ? descInput.value.trim() : '';
  const precio = precioInput ? precioInput.value.trim() : '0';
  const unidad = unitSelect ? normalizarUnidad(unitSelect.value) : 'un';

  if (!desc) return alert("Ingresa una descripción");

  let catalogo = JSON.parse(localStorage.getItem('app_catalogo') || '[]');

  if (indexEdit >= 0 && indexEdit < catalogo.length) {
    catalogo[indexEdit] = { desc, precio, unidad };
  } else {
    catalogo.push({ desc, precio, unidad });
  }

  localStorage.setItem('app_catalogo', JSON.stringify(catalogo));

  limpiarFormCatalogo();
  renderizarCatalogo();
  actualizarDatalistSugerencias();
}

function renderizarCatalogo() {
  const contenedor = document.getElementById('lista-catalogo');
  if (!contenedor) return;

  let catalogo = JSON.parse(localStorage.getItem('app_catalogo') || '[]');
  contenedor.innerHTML = '';

  if (catalogo.length === 0) {
    contenedor.innerHTML = '<p style="font-size:12px; color:#94a3b8; text-align:center;">No hay productos guardados.</p>';
    return;
  }

  catalogo.forEach((item, index) => {
    const div = document.createElement('div');
    div.style.cssText = 'display:flex; justify-content:space-between; align-items:center; padding:8px 0; border-bottom:1px solid #eee;';

    div.innerHTML = `
      <div onclick="seleccionarDelCatalogo(${index})" style="flex:1; cursor:pointer;">
        <strong>${item.desc}</strong> <br>
        <small style="color:#64748b;">Medida: ${item.unidad} — $${item.precio}</small>
      </div>
      <div style="display:flex; gap:6px;">
        <button type="button" onclick="editarDelCatalogo(${index})" style="background:#f1f5f9; border:1px solid #cbd5e1; border-radius:4px; padding:2px 6px; cursor:pointer; font-size:11px;">✏️ Editar</button>
        <button type="button" onclick="eliminarDelCatalogo(${index})" style="background:none; border:none; color:#ef4444; cursor:pointer;">✕</button>
      </div>
    `;
    contenedor.appendChild(div);
  });
}

function editarDelCatalogo(index) {
  let catalogo = JSON.parse(localStorage.getItem('app_catalogo') || '[]');
  let item = catalogo[index];
  if (item) {
    document.getElementById('cat-index-edit').value = index;
    document.getElementById('cat-desc').value = item.desc;
    document.getElementById('cat-precio').value = item.precio;
    document.getElementById('cat-unit').value = item.unidad;
    document.getElementById('btn-guardar-cat').innerText = 'Actualizar Producto';
  }
}

function seleccionarDelCatalogo(index) {
  let catalogo = JSON.parse(localStorage.getItem('app_catalogo') || '[]');
  let item = catalogo[index];
  if (item && typeof agregarFilaHTML === 'function') {
    agregarFilaHTML(item.desc, item.unidad, 1, item.precio);
  }
  cerrarCatalogo();
}

function eliminarDelCatalogo(index) {
  let catalogo = JSON.parse(localStorage.getItem('app_catalogo') || '[]');
  catalogo.splice(index, 1);
  localStorage.setItem('app_catalogo', JSON.stringify(catalogo));
  renderizarCatalogo();
  actualizarDatalistSugerencias();
}

function limpiarDatos() {
  if (confirm('¿Iniciar un nuevo presupuesto?')) {
    localStorage.removeItem('presupuesto_guardado');
    location.reload();
  }
}