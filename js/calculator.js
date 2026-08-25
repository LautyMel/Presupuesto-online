function recalcular() {
  let subtotal = 0;

  document.querySelectorAll('#tabla-productos tbody tr').forEach(tr => {
    const qtyInput = tr.querySelector('.col-qty');
    const priceInput = tr.querySelector('.col-price');
    const subtotalSpan = tr.querySelector('.subtotal-item');

    const qty = parseFloat(qtyInput?.value || 0);
    const price = parseFloat(priceInput?.value || 0);
    const itemSubtotal = qty * price;

    subtotal += itemSubtotal;

    if (subtotalSpan) {
      subtotalSpan.innerText = `$ ${itemSubtotal.toLocaleString('es-AR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    }
  });

  const ivaSelect = document.getElementById('select-iva');
  const ivaPerc = parseFloat(ivaSelect ? ivaSelect.value : 0);
  const ivaMonto = subtotal * (ivaPerc / 100);
  const total = subtotal + ivaMonto;

  const subtotalValElem = document.getElementById('subtotal-val');
  const ivaValElem = document.getElementById('iva-val');
  const rowIva = document.getElementById('row-iva');
  const lblIvaPerc = document.getElementById('lbl-iva-perc');
  const totalValElem = document.getElementById('total-val');

  if (subtotalValElem) subtotalValElem.innerText = `$ ${subtotal.toLocaleString('es-AR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

  if (ivaPerc > 0) {
    if (rowIva) rowIva.style.display = 'flex';
    if (lblIvaPerc) lblIvaPerc.innerText = ivaPerc;
    if (ivaValElem) ivaValElem.innerText = `$ ${ivaMonto.toLocaleString('es-AR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  } else {
    if (rowIva) rowIva.style.display = 'none';
  }

  if (totalValElem) totalValElem.innerText = `$ ${total.toLocaleString('es-AR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

  if (typeof guardarDatos === 'function') guardarDatos();
}

function agregarFilaHTML(desc = '', unit = 'un', qty = 1, price = 0) {
  const tbody = document.querySelector('#tabla-productos tbody');
  if (!tbody) return;

  const tr = document.createElement('tr');
  tr.style.borderBottom = '1px solid #e2e8f0';

  tr.innerHTML = `
    <td style="padding: 6px;">
      <input type="text" class="col-desc" value="${desc}" placeholder="Escribe o selecciona..." list="lista-sugerencias" oninput="alCambiarDescripcion(this)" style="width:100%; border:1px solid #cbd5e1; padding:4px; border-radius:4px;">
    </td>
    <td style="padding: 6px;">
      <select class="col-unit" style="width:100%; border:1px solid #cbd5e1; padding:4px; border-radius:4px;">
        <option value="un" ${unit === 'un' ? 'selected' : ''}>un</option>
        <option value="m²" ${unit === 'm²' ? 'selected' : ''}>m²</option>
        <option value="m" ${unit === 'm' ? 'selected' : ''}>m</option>
        <option value="hs" ${unit === 'hs' ? 'selected' : ''}>hs</option>
        <option value="litros" ${unit === 'litros' ? 'selected' : ''}>litros</option>
        <option value="kilos" ${unit === 'kilos' ? 'selected' : ''}>kilos</option>
      </select>
    </td>
    <td style="padding: 6px;">
      <input type="number" class="col-qty" value="${qty}" min="1" oninput="recalcular()" style="width:100%; text-align:center; border:1px solid #cbd5e1; padding:4px; border-radius:4px;">
    </td>
    <td style="padding: 6px;">
      <input type="number" class="col-price" value="${price}" min="0" step="any" oninput="recalcular()" style="width:100%; text-align:right; border:1px solid #cbd5e1; padding:4px; border-radius:4px;">
    </td>
    <td style="padding: 6px; text-align:right; font-weight:bold;" class="subtotal-item">
      $ 0,00
    </td>
    <td class="no-pdf" style="padding: 6px; text-align:center;">
      <button type="button" class="btn-eliminar-fila no-pdf" onclick="eliminarFila(this)" style="background:none; border:none; color:#ef4444; cursor:pointer; font-weight:bold;">✕</button>
    </td>
  `;

  tbody.appendChild(tr);
  recalcular();
}

function alCambiarDescripcion(input) {
  const val = input.value.trim();
  const catalogo = JSON.parse(localStorage.getItem('app_catalogo') || '[]');
  const encontrado = catalogo.find(item => item.desc.toLowerCase() === val.toLowerCase());

  if (encontrado) {
    const tr = input.closest('tr');
    const unitSelect = tr.querySelector('.col-unit');
    const priceInput = tr.querySelector('.col-price');

    if (unitSelect) unitSelect.value = encontrado.unidad;
    if (priceInput) priceInput.value = encontrado.precio;
  }
  recalcular();
}

function eliminarFila(btn) {
  const tr = btn.closest('tr');
  if (tr) {
    tr.remove();
    recalcular();
  }
}

function actualizarMoneda() {
  const selectMoneda = document.getElementById('select-moneda');
  const tagMoneda = document.getElementById('tag-moneda');
  if (selectMoneda && tagMoneda) {
    tagMoneda.innerText = selectMoneda.value;
  }
  if (typeof guardarDatos === 'function') guardarDatos();
}
function toggleDetalles() {
  const chk = document.getElementById('check-detalles');
  const bloque = document.getElementById('bloque-observaciones');
  if (chk && bloque) {
    // Se usa 'visibility' para ocultarlo sin perder el espacio, manteniendo los totales a la derecha
    bloque.style.visibility = chk.checked ? 'visible' : 'hidden';
  }
}