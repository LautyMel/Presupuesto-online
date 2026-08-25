async function descargarPDF() {
  const btn = document.querySelector('.btn-primary');
  const elemento = document.getElementById('presupuesto-factura');

  if (!elemento) return;

  // Verificación de librerías cargadas
  if (typeof html2canvas === 'undefined') {
    alert("La librería html2canvas no está cargada. Revisa los scripts de tu index.html.");
    return;
  }

  const textoOriginal = btn ? btn.innerText : '';
  if (btn) {
    btn.innerText = "⏳ Generando PDF...";
    btn.disabled = true;
  }

  // 1. Desactivar modo oscuro temporalmente
  const teniaDark = document.body.classList.contains('dark-mode');
  if (teniaDark) {
    document.body.classList.remove('dark-mode');
  }

  // 2. Ocultar botones y elementos no imprimibles
  const elementosOcultar = elemento.querySelectorAll('.no-pdf, button, .btn-remove, [onclick*="eliminarFila"], [onclick*="agregarFila"]');
  elementosOcultar.forEach(el => {
    el.style.setProperty('display', 'none', 'important');
  });

  const empresaNombre = document.getElementById('empresa-nombre');
  let ocultoTempNombre = false;
  if (empresaNombre && empresaNombre.innerText.trim() === '') {
    empresaNombre.style.display = 'none';
    ocultoTempNombre = true;
  }

  // 3. Reemplazar inputs y selects por nodos de texto estático alineados
  const reemplazos = [];
  const elementosPdf = elemento.querySelectorAll('input, select');

  elementosPdf.forEach(input => {
    if (input.type === 'file' || input.type === 'checkbox' || input.classList.contains('no-pdf')) return;

    let valorTexto = '';

    if (input.type === 'date' && input.value) {
      const partes = input.value.split('-');
      valorTexto = `${partes[2]}/${partes[1]}/${partes[0]}`;
    } else if (input.tagName === 'SELECT') {
      valorTexto = input.options[input.selectedIndex]?.text || input.value || '';
    } else {
      valorTexto = input.value || '';
    }

    const span = document.createElement('span');
    span.innerText = valorTexto;
    span.className = 'pdf-text-temp';
    span.style.fontSize = '12px';
    span.style.fontFamily = 'inherit';
    span.style.color = 'inherit';

    const esCondicionComercial = input.closest('#select-pago, #select-entrega') || input.id === 'select-pago' || input.id === 'select-entrega';
    const esCabeceraDerecha = input.type === 'date' || input.id?.includes('validez') || input.closest('.header-info, .doc-info');

    if (esCondicionComercial) {
      span.style.display = 'inline-block';
      span.style.float = 'right';
      span.style.textAlign = 'right';
    } else if (esCabeceraDerecha) {
      span.style.display = 'inline-block';
      span.style.textAlign = 'right';
    } else if (input.classList.contains('col-price')) {
      span.style.display = 'block';
      span.style.textAlign = 'right';
    } else if (input.classList.contains('col-qty') || input.tagName === 'SELECT') {
      span.style.display = 'block';
      span.style.textAlign = 'center';
    } else {
      span.style.display = 'block';
      span.style.textAlign = 'left';
    }

    input.style.display = 'none';
    input.parentNode.insertBefore(span, input);
    reemplazos.push({ input, span });
  });

  // 4. Fijar tamaño del lienzo para la captura
  const estiloAncho = elemento.style.width;
  const estiloPadding = elemento.style.padding;
  const estiloOverflow = elemento.style.overflow;

  elemento.style.width = '750px';
  elemento.style.padding = '20px';
  elemento.style.overflow = 'hidden';

  const numDoc = document.getElementById('doc-numero')?.innerText.trim().replace(/[^a-zA-Z0-9]/g, '_') || '001';

  try {
    // 5. Capturar con html2canvas
    const canvas = await html2canvas(elemento, {
      scale: 2,
      useCORS: true,
      logging: false,
      scrollY: 0,
      scrollX: 0
    });

    const imgData = canvas.toDataURL('image/jpeg', 0.98);

    // 6. Generar documento A4 con jsPDF
    const jsPDF = window.jspdf ? window.jspdf.jsPDF : window.jsPDF;
    const pdf = new jsPDF('p', 'mm', 'a4');

    const pdfWidth = 210;  // Ancho A4 en mm
    const pdfHeight = 297; // Alto A4 en mm
    const margin = 8;      // Margen de 8mm

    const printWidth = pdfWidth - (margin * 2);
    let finalHeight = (canvas.height * printWidth) / canvas.width;
    let finalWidth = printWidth;

    if (finalHeight > (pdfHeight - (margin * 2))) {
      finalHeight = pdfHeight - (margin * 2);
      finalWidth = (canvas.width * finalHeight) / canvas.height;
    }

    const posX = (pdfWidth - finalWidth) / 2;
    const posY = margin;

    pdf.addImage(imgData, 'JPEG', posX, posY, finalWidth, finalHeight);
    pdf.save(`Presupuesto_${numDoc}.pdf`);

  } catch (err) {
    console.error("Error al generar el PDF:", err);
  } finally {
    restaurarVista();
  }

  function restaurarVista() {
    reemplazos.forEach(item => {
      item.input.style.display = '';
      item.span.remove();
    });

    elementosOcultar.forEach(el => {
      el.style.display = '';
    });

    if (ocultoTempNombre && empresaNombre) {
      empresaNombre.style.display = '';
    }

    elemento.style.width = estiloAncho;
    elemento.style.padding = estiloPadding;
    elemento.style.overflow = estiloOverflow;

    if (teniaDark) {
      document.body.classList.add('dark-mode');
    }

    if (btn) {
      btn.innerText = textoOriginal;
      btn.disabled = false;
    }
  }
}

function compartirWhatsApp() {
  const docNumero = document.getElementById('doc-numero')?.innerText || '0001';
  const cliente = document.getElementById('cliente-nombre')?.innerText || 'Cliente';
  const moneda = document.getElementById('select-moneda')?.value || 'ARS';
  const grandTotal = document.getElementById('total-val')?.innerText || '$ 0,00';
  const pagoSelect = document.getElementById('select-pago')?.value || 'Contado';

  let texto = `*PRESUPUESTO ${docNumero}*\n`;
  texto += `━━━━━━━━━━━━━━━━━━━\n`;
  texto += `👤 *Cliente:* ${cliente}\n\n`;
  texto += `*Detalle:*\n`;

  document.querySelectorAll('#tabla-productos tbody tr').forEach(tr => {
    const desc = tr.querySelector('.col-desc')?.value || "";
    const unidad = tr.querySelector('.col-unit')?.value || "un";
    const cant = tr.querySelector('.col-qty')?.value || "1";
    const sub = tr.querySelector('.subtotal-item')?.innerText || "$ 0,00";

    if (desc.trim() !== '') {
      texto += `• ${desc} (${cant} ${unidad}) → *${sub}*\n`;
    }
  });

  texto += `\n💰 *TOTAL: ${grandTotal} ${moneda}*\n`;
  texto += `━━━━━━━━━━━━━━━━━━━\n`;
  texto += `💳 *Pago:* ${pagoSelect}\n`;

  window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(texto)}`, '_blank');
}