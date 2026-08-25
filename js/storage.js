function guardarDatos() {
  const datos = {
    empresaNombre: document.getElementById('empresa-nombre')?.innerText || '',
    empresaDetalles: document.getElementById('empresa-detalles')?.innerText || '',
    clienteNombre: document.getElementById('cliente-nombre')?.innerText || '',
    clienteCuit: document.getElementById('cliente-cuit')?.innerText || '',
    clienteDir: document.getElementById('cliente-dir')?.innerText || '',
    docNumero: document.getElementById('doc-numero')?.innerText || '',
    fechaEmision: document.getElementById('fecha-emision')?.value || '',
    validez: document.getElementById('validez-select')?.value || '',
    moneda: document.getElementById('select-moneda')?.value || 'ARS',
    iva: document.getElementById('select-iva')?.value || '0',
    mostrarDetalles: document.getElementById('check-detalles')?.checked ?? true,
    pago: document.getElementById('select-pago')?.value || '',
    entrega: document.getElementById('select-entrega')?.value || '',
    items: []
  };

  document.querySelectorAll('#tabla-productos tbody tr').forEach(tr => {
    datos.items.push({
      desc: tr.querySelector('.col-desc')?.value || '',
      unit: tr.querySelector('.col-unit')?.value || 'un',
      qty: tr.querySelector('.col-qty')?.value || '1',
      price: tr.querySelector('.col-price')?.value || '0'
    });
  });

  localStorage.setItem('presupuesto_guardado', JSON.stringify(datos));
}

function cargarDatos() {
  try {
    const raw = localStorage.getItem('presupuesto_guardado');
    if (!raw) {
      if (typeof agregarFilaHTML === 'function') agregarFilaHTML();
      return;
    }

    const datos = JSON.parse(raw);

    if (datos.empresaNombre && document.getElementById('empresa-nombre')) {
      document.getElementById('empresa-nombre').innerText = datos.empresaNombre;
    }
    if (datos.empresaDetalles && document.getElementById('empresa-detalles')) {
      document.getElementById('empresa-detalles').innerText = datos.empresaDetalles;
    }
    if (datos.clienteNombre && document.getElementById('cliente-nombre')) {
      document.getElementById('cliente-nombre').innerText = datos.clienteNombre;
    }
    if (datos.clienteCuit && document.getElementById('cliente-cuit')) {
      document.getElementById('cliente-cuit').innerText = datos.clienteCuit;
    }
    if (datos.clienteDir && document.getElementById('cliente-dir')) {
      document.getElementById('cliente-dir').innerText = datos.clienteDir;
    }
    if (datos.docNumero && document.getElementById('doc-numero')) {
      document.getElementById('doc-numero').innerText = datos.docNumero;
    }
    if (datos.fechaEmision && document.getElementById('fecha-emision')) {
      document.getElementById('fecha-emision').value = datos.fechaEmision;
    }
    if (datos.validez && document.getElementById('validez-select')) {
      document.getElementById('validez-select').value = datos.validez;
    }
    if (datos.moneda && document.getElementById('select-moneda')) {
      document.getElementById('select-moneda').value = datos.moneda;
    }
    if (datos.iva && document.getElementById('select-iva')) {
      document.getElementById('select-iva').value = datos.iva;
    }
    if (document.getElementById('check-detalles')) {
      document.getElementById('check-detalles').checked = datos.mostrarDetalles !== false;
      if (typeof toggleDetalles === 'function') toggleDetalles();
    }
    if (datos.pago && document.getElementById('select-pago')) {
      document.getElementById('select-pago').value = datos.pago;
    }
    if (datos.entrega && document.getElementById('select-entrega')) {
      document.getElementById('select-entrega').value = datos.entrega;
    }

    const tbody = document.querySelector('#tabla-productos tbody');
    if (tbody) {
      tbody.innerHTML = '';
      if (datos.items && datos.items.length > 0) {
        datos.items.forEach(item => {
          if (typeof agregarFilaHTML === 'function') {
            agregarFilaHTML(item.desc, item.unit, item.qty, item.price);
          }
        });
      } else {
        if (typeof agregarFilaHTML === 'function') agregarFilaHTML();
      }
    }

    if (typeof recalcular === 'function') recalcular();
  } catch (e) {
    console.error("Error al cargar localStorage:", e);
  }
}