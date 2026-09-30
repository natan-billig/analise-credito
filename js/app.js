/**
 * Sistema de Análisis de Crédito Rural - Controlador de la Interfaz
 * Versión: 0.3.0 - Soporte C.I. / RUC (Paraguay), Gestor Dinámico de Compromisos y Fix de Firefox
 */

document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('creditForm');
  const btnCalcular = document.getElementById('btn-calcular');
  const btnSample = document.getElementById('btnSample');
  const btnAddCommitment = document.getElementById('btnAddCommitment');
  const commitmentsBody = document.getElementById('commitmentsBody');
  const totalCommitmentsBadge = document.getElementById('totalCommitmentsBadge');
  const cronogramaBody = document.getElementById('cronogramaBody');
  const btnCopyDictamen = document.getElementById('btnCopyDictamen');
  const resultPlaceholder = document.getElementById('resultPlaceholder');
  const resultCard = document.getElementById('resultCard');
  const analysisTimestamp = document.getElementById('analysisTimestamp');
  const toast = document.getElementById('toast');

  // Banner del Dictamen Oficial
  const decisionBanner = document.getElementById('decisionBanner');
  const decisionIcon = document.getElementById('decisionIcon');
  const decisionTitle = document.getElementById('decisionTitle');
  const decisionSubtitle = document.getElementById('decisionSubtitle');

  // Métricas Oficiales
  const metricIngresos = document.getElementById('metricIngresos');
  const metricCostos = document.getElementById('metricCostos');
  const metricMargen = document.getElementById('metricMargen');
  const metricMargenBadge = document.getElementById('metricMargenBadge');
  const metricCargaFinanciera = document.getElementById('metricCargaFinanciera');
  const metricFlujoNeto = document.getElementById('metricFlujoNeto');
  const metricFlujoBadge = document.getElementById('metricFlujoBadge');
  const metricCobertura = document.getElementById('metricCobertura');
  const metricCoberturaBadge = document.getElementById('metricCoberturaBadge');

  const boxFlujoCaja = document.getElementById('boxFlujoCaja');
  const boxCobertura = document.getElementById('boxCobertura');
  const dictamenText = document.getElementById('dictamenText');

  const MESES = [
    'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
    'Julio', 'Agosto', 'Setiembre', 'Octubre', 'Noviembre', 'Diciembre'
  ];

  // Formato Monetario en USD ($ 123,456)
  const formatUSD = (val) => {
    const num = Math.round(Number(val) || 0);
    return '$ ' + num.toLocaleString('en-US');
  };

  // Toast de Notificación
  const showToast = (message = '¡Copiado al portapapeles!') => {
    if (!toast) return;
    toast.textContent = message;
    toast.classList.add('show');
    setTimeout(() => {
      toast.classList.remove('show');
    }, 2500);
  };

  // --- GESTOR DINÁMICO DE COMPROMISOS FINANCIEROS ---
  function getCommitmentsData() {
    const rows = commitmentsBody.querySelectorAll('tr');
    const data = [];
    rows.forEach(row => {
      const inputEntidad = row.querySelector('.input-entidad');
      const selectMes = row.querySelector('.select-mes');
      const inputMonto = row.querySelector('.input-monto');

      if (inputMonto) {
        const monto = parseFloat(inputMonto.value) || 0;
        const entidad = inputEntidad ? inputEntidad.value.trim() : '';
        const mes = selectMes ? selectMes.value : 'Enero';
        if (monto > 0 || entidad.length > 0) {
          data.push({ entidad: entidad || 'Entidad Financiera', mes, monto });
        }
      }
    });
    return data;
  }

  function updateTotalCommitments() {
    const data = getCommitmentsData();
    const total = data.reduce((sum, item) => sum + item.monto, 0);
    if (totalCommitmentsBadge) {
      totalCommitmentsBadge.textContent = formatUSD(total);
    }
    return total;
  }

  function createCommitmentRow(entidad = '', mes = 'Mayo', monto = '') {
    const tr = document.createElement('tr');

    const tdEntidad = document.createElement('td');
    const inputEntidad = document.createElement('input');
    inputEntidad.type = 'text';
    inputEntidad.className = 'input-entidad';
    inputEntidad.placeholder = 'Ej: Banco Sudameris, Itaú, Banco Atlas';
    inputEntidad.value = entidad;
    inputEntidad.addEventListener('input', updateTotalCommitments);
    tdEntidad.appendChild(inputEntidad);

    const tdMes = document.createElement('td');
    const selectMes = document.createElement('select');
    selectMes.className = 'select-mes';
    MESES.forEach(m => {
      const opt = document.createElement('option');
      opt.value = m;
      opt.textContent = m;
      if (m.toLowerCase() === mes.toLowerCase()) {
        opt.selected = true;
      }
      selectMes.appendChild(opt);
    });
    selectMes.addEventListener('change', updateTotalCommitments);
    tdMes.appendChild(selectMes);

    const tdMonto = document.createElement('td');
    const inputMonto = document.createElement('input');
    inputMonto.type = 'number';
    inputMonto.step = 'any';
    inputMonto.min = '0';
    inputMonto.className = 'input-monto';
    inputMonto.placeholder = '0.00';
    inputMonto.value = monto !== '' ? monto : '';
    inputMonto.addEventListener('input', updateTotalCommitments);
    tdMonto.appendChild(inputMonto);

    const tdAccion = document.createElement('td');
    tdAccion.style.textAlign = 'center';
    const btnRemove = document.createElement('button');
    btnRemove.type = 'button';
    btnRemove.className = 'btn-remove-row';
    btnRemove.innerHTML = '✕';
    btnRemove.title = 'Eliminar este compromiso';
    btnRemove.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      tr.remove();
      updateTotalCommitments();
      // Si no quedan filas, agregamos una vacía
      if (commitmentsBody.children.length === 0) {
        addCommitmentRow();
      }
    });
    tdAccion.appendChild(btnRemove);

    tr.appendChild(tdEntidad);
    tr.appendChild(tdMes);
    tr.appendChild(tdMonto);
    tr.appendChild(tdAccion);

    return tr;
  }

  function addCommitmentRow(entidad = '', mes = 'Mayo', monto = '') {
    const row = createCommitmentRow(entidad, mes, monto);
    commitmentsBody.appendChild(row);
    updateTotalCommitments();
  }

  if (btnAddCommitment) {
    btnAddCommitment.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      addCommitmentRow('', 'Mayo', '');
    });
  }

  // Carga inicial de compromisos predeterminados
  function resetCommitments(list) {
    commitmentsBody.innerHTML = '';
    if (list && list.length > 0) {
      list.forEach(c => addCommitmentRow(c.entidad, c.mes, c.monto));
    } else {
      addCommitmentRow('Banco Sudameris', 'Mayo', 15000);
      addCommitmentRow('Banco Atlas', 'Agosto', 10000);
    }
    updateTotalCommitments();
  }

  // --- PERFILES DE PRUEBA DE PARAGUAY (USD / C.I. / RUC) ---
  let sampleIndex = 0;
  const sampleProfiles = [
    {
      producerName: 'Agropecuaria El Palmar S.A.',
      documentNumber: '80034921-5',
      cropType: 'Soja',
      areaHectares: 400,
      estimatedYield: 3.8,
      marketPrice: 370,
      costPerHectare: 720,
      requestedCapital: 110000,
      paymentFrequency: 'Zafra Única',
      compromisos: [
        { entidad: 'Banco Sudameris', mes: 'Mayo', monto: 15000 },
        { entidad: 'Banco Atlas', mes: 'Agosto', monto: 10000 }
      ]
    },
    {
      producerName: 'Establecimiento Don Joaquín - Suc. Hohenau',
      documentNumber: '3.489.120',
      cropType: 'Maíz',
      areaHectares: 250,
      estimatedYield: 7.8,
      marketPrice: 190,
      costPerHectare: 1050,
      requestedCapital: 75000,
      paymentFrequency: 'Semestral',
      compromisos: [
        { entidad: 'Banco Continental', mes: 'Junio', monto: 12000 },
        { entidad: 'Itaú Paraguay', mes: 'Noviembre', monto: 6000 }
      ]
    },
    {
      producerName: 'Agrícola Valle Hermoso SRL - Katueté',
      documentNumber: '80098412-2',
      cropType: 'Trigo',
      areaHectares: 200,
      estimatedYield: 2.2,
      marketPrice: 220,
      costPerHectare: 650,
      requestedCapital: 55000,
      paymentFrequency: 'Zafra Única',
      compromisos: [
        { entidad: 'Banco Regional / Sudameris', mes: 'Setiembre', monto: 18000 },
        { entidad: 'Cooperativa Colonias Unidas', mes: 'Diciembre', monto: 12000 }
      ]
    }
  ];

  if (btnSample) {
    btnSample.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();

      const sample = sampleProfiles[sampleIndex % sampleProfiles.length];
      sampleIndex++;

      document.getElementById('producerName').value = sample.producerName;
      document.getElementById('documentNumber').value = sample.documentNumber;
      document.getElementById('cropType').value = sample.cropType;
      document.getElementById('areaHectares').value = sample.areaHectares;
      document.getElementById('estimatedYield').value = sample.estimatedYield;
      document.getElementById('marketPrice').value = sample.marketPrice;
      document.getElementById('costPerHectare').value = sample.costPerHectare;
      document.getElementById('requestedCapital').value = sample.requestedCapital;
      document.getElementById('paymentFrequency').value = sample.paymentFrequency;

      resetCommitments(sample.compromisos);
      executeAnalysis();
    });
  }

  // --- COPIA DEL DICTAMEN AL PORTAPAPELES ---
  if (btnCopyDictamen) {
    btnCopyDictamen.addEventListener('click', async (e) => {
      e.preventDefault();
      e.stopPropagation();

      const text = dictamenText.textContent || '';
      if (!text) {
        showToast('No hay dictamen generado para copiar');
        return;
      }

      try {
        if (navigator.clipboard && navigator.clipboard.writeText) {
          await navigator.clipboard.writeText(text);
        } else {
          const textarea = document.createElement('textarea');
          textarea.value = text;
          document.body.appendChild(textarea);
          textarea.select();
          document.execCommand('copy');
          document.body.removeChild(textarea);
        }

        btnCopyDictamen.classList.add('copied');
        btnCopyDictamen.innerHTML = '✔ ¡Copiado!';
        showToast('¡Copiado al portapapeles!');

        setTimeout(() => {
          btnCopyDictamen.classList.remove('copied');
          btnCopyDictamen.innerHTML = '📋 Copiar Dictamen';
        }, 2500);
      } catch (err) {
        showToast('Error al copiar al portapapeles');
      }
    });
  }

  // --- EJECUCIÓN DEL ANÁLISIS (FIX FIREFOX: SIN SUBMIT NATIVO) ---
  function executeAnalysis() {
    const requiredInputs = form.querySelectorAll('input[required]:not(.input-entidad):not(.input-monto), select[required]');
    let hasEmpty = false;

    requiredInputs.forEach((input) => {
      if (!input.value.trim()) {
        input.style.borderColor = '#dc2626';
        hasEmpty = true;
      } else {
        input.style.borderColor = '';
      }
    });

    if (hasEmpty) {
      showToast('Por favor complete todos los campos obligatorios antes de calcular.');
      return;
    }

    const compromisosList = getCommitmentsData();

    const inputData = {
      nombreProductor: document.getElementById('producerName').value.trim(),
      identificacionFiscal: document.getElementById('documentNumber').value.trim(),
      cultivo: document.getElementById('cropType').value,
      hectareas: Number(document.getElementById('areaHectares').value),
      rendimientoPorHa: Number(document.getElementById('estimatedYield').value),
      precioPorTon: Number(document.getElementById('marketPrice').value),
      costoPorHa: Number(document.getElementById('costPerHectare').value),
      capitalSolicitado: Number(document.getElementById('requestedCapital').value),
      periodicidad: document.getElementById('paymentFrequency').value,
      compromisos: compromisosList
    };

    if (typeof CreditEngine === 'undefined' || typeof CreditEngine.analisarProductor !== 'function') {
      showToast('Error: Motor de análisis no disponible');
      return;
    }

    const resultado = CreditEngine.analisarProductor(inputData);
    renderResults(resultado);
  }

  // Interceptar clic en btn-calcular con preventDefault / stopPropagation
  if (btnCalcular) {
    btnCalcular.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      executeAnalysis();
    });
  }

  // Prevención de submit accidental en el formulario para evitar loops en Firefox
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      e.stopPropagation();
      executeAnalysis();
      return false;
    });
  }

  function renderResults(res) {
    resultPlaceholder.style.display = 'none';
    resultCard.style.display = 'block';

    const now = new Date();
    analysisTimestamp.textContent = `Calculado: ${now.toLocaleTimeString('es-ES')}`;

    // Configuración del Banner de Dictamen Oficial (Aprobado, Riesgo Moderado, Inviable)
    decisionBanner.className = 'decision-banner';
    if (res.dictamen === 'Aprobado') {
      decisionBanner.classList.add('decision-aprobado');
      decisionIcon.textContent = '✅';
    } else if (res.dictamen === 'Riesgo Moderado') {
      decisionBanner.classList.add('decision-moderado');
      decisionIcon.textContent = '⚠️';
    } else {
      decisionBanner.classList.add('decision-inviable');
      decisionIcon.textContent = '🛑';
    }

    decisionTitle.textContent = `Dictamen Oficial: ${res.dictamen}`;
    decisionSubtitle.textContent = res.dictamenSubtitulo;

    // Métricas del Modelo Consolidado en USD
    const m = res.metricas;
    metricIngresos.textContent = formatUSD(m.ingresoBruto);
    metricCostos.textContent = formatUSD(m.costoTotal);
    metricMargen.textContent = formatUSD(m.margenOperativo);

    metricMargenBadge.textContent = `${m.margenOperativoPct.toFixed(1)}% Margen`;
    metricMargenBadge.className = 'metric-badge ' + (m.margenOperativoPct >= 30 ? 'badge-good' : m.margenOperativoPct >= 15 ? 'badge-alert' : 'badge-danger');

    metricCargaFinanciera.textContent = formatUSD(m.cargaFinancieraTotal);

    // Flujo de Caja Libre / Remanente Neto (USD)
    metricFlujoNeto.textContent = formatUSD(m.flujoCajaNeto);
    if (m.flujoCajaNeto > 0) {
      metricFlujoBadge.textContent = 'Remanente Positivo (Superávit)';
      metricFlujoBadge.className = 'metric-badge badge-good';
      if (boxFlujoCaja) {
        boxFlujoCaja.className = 'metric-box highlight';
      }
    } else if (m.flujoCajaNeto === 0) {
      metricFlujoBadge.textContent = 'Punto de Equilibrio (Sin Remanente)';
      metricFlujoBadge.className = 'metric-badge badge-alert';
      if (boxFlujoCaja) {
        boxFlujoCaja.className = 'metric-box';
      }
    } else {
      metricFlujoBadge.textContent = 'Flujo Deficitario (Déficit)';
      metricFlujoBadge.className = 'metric-badge badge-danger';
      if (boxFlujoCaja) {
        boxFlujoCaja.className = 'metric-box danger-highlight';
      }
    }

    // Cobertura de Deuda / ICSD Global (x)
    const coberturaVal = m.cobertura >= 90 ? '> 10.0x' : `${m.cobertura.toFixed(2)}x`;
    metricCobertura.textContent = coberturaVal;
    if (m.cobertura >= 1.25 && m.flujoCajaNeto > 0) {
      metricCoberturaBadge.textContent = 'Solvente (ICSD ≥ 1.25x)';
      metricCoberturaBadge.className = 'metric-badge badge-good';
      if (boxCobertura) {
        boxCobertura.className = 'metric-box highlight';
      }
    } else if (m.cobertura >= 1.00 && m.flujoCajaNeto >= 0) {
      metricCoberturaBadge.textContent = 'Riesgo Moderado (1.00x - 1.24x)';
      metricCoberturaBadge.className = 'metric-badge badge-alert';
      if (boxCobertura) {
        boxCobertura.className = 'metric-box';
      }
    } else {
      metricCoberturaBadge.textContent = 'Inviable (ICSD < 1.00x)';
      metricCoberturaBadge.className = 'metric-badge badge-danger';
      if (boxCobertura) {
        boxCobertura.className = 'metric-box danger-highlight';
      }
    }

    // Renderizado de la Sección: Cronograma y Concentración Mensual
    if (cronogramaBody) {
      cronogramaBody.innerHTML = '';
      if (!res.cronogramaMensual || res.cronogramaMensual.length === 0) {
        const trEmpty = document.createElement('tr');
        trEmpty.innerHTML = `<td colspan="4" style="text-align: center; color: var(--text-muted); padding: 1rem;">
          No se registraron cuotas ni compromisos financieros previos.
        </td>`;
        cronogramaBody.appendChild(trEmpty);
      } else {
        res.cronogramaMensual.forEach(c => {
          const tr = document.createElement('tr');
          const pct = c.porcentajeCompromisos.toFixed(1);
          tr.innerHTML = `
            <td style="font-weight: 600; color: var(--secondary);">${c.mes}</td>
            <td style="font-weight: 700;">${formatUSD(c.totalMes)}</td>
            <td>
              <span>${pct}%</span>
              <div class="progress-bar-container">
                <div class="progress-bar-fill" style="width: ${Math.min(100, pct)}%;"></div>
              </div>
            </td>
            <td style="font-size: 0.75rem; color: var(--text-muted);">${c.entidades.join(', ')}</td>
          `;
          cronogramaBody.appendChild(tr);
        });
      }
    }

    // Texto del Dictamen Oficial
    dictamenText.textContent = res.dictamenFormal;

    if (window.innerWidth < 1024) {
      resultCard.scrollIntoView({ behavior: 'smooth' });
    }
  }

  // Inicialización
  resetCommitments([
    { entidad: 'Banco Sudameris', mes: 'Mayo', monto: 15000 },
    { entidad: 'Banco Atlas', mes: 'Agosto', monto: 10000 }
  ]);
  executeAnalysis();
});
