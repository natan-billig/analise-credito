/**
 * Sistema de Análisis de Crédito Rural - Controlador de la Interfaz
 * Versión: 0.2.0 - Modelo de Flujo de Caja y Riesgo Agropecuario en USD
 */

document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('creditForm');
  const btnSample = document.getElementById('btnSample');
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

  // Perfiles de prueba rotativos en USD
  let sampleIndex = 0;
  const sampleProfiles = [
    {
      producerName: 'Agropecuaria El Palmar S.A.',
      documentNumber: '30-71234567-8',
      cropType: 'Soja',
      areaHectares: 400,
      estimatedYield: 3.8,
      marketPrice: 370,
      costPerHectare: 720,
      requestedCapital: 110000,
      deudasFinancieras: 25000,
      paymentFrequency: 'Zafra Única'
    },
    {
      producerName: 'Establecimiento Don Joaquín',
      documentNumber: '20-28945612-4',
      cropType: 'Maíz',
      areaHectares: 250,
      estimatedYield: 7.8,
      marketPrice: 190,
      costPerHectare: 1050,
      requestedCapital: 75000,
      deudasFinancieras: 18000,
      paymentFrequency: 'Semestral'
    },
    {
      producerName: 'Agrícola Valle Hermoso SRL',
      documentNumber: '33-65987412-9',
      cropType: 'Trigo',
      areaHectares: 200,
      estimatedYield: 2.2,
      marketPrice: 220,
      costPerHectare: 650,
      requestedCapital: 55000,
      deudasFinancieras: 30000,
      paymentFrequency: 'Zafra Única'
    }
  ];

  if (btnSample) {
    btnSample.addEventListener('click', () => {
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
      document.getElementById('deudas_financieras').value = sample.deudasFinancieras;
      document.getElementById('paymentFrequency').value = sample.paymentFrequency;

      form.dispatchEvent(new Event('submit'));
    });
  }

  // Copia del Dictamen al Portapapeles
  if (btnCopyDictamen) {
    btnCopyDictamen.addEventListener('click', async () => {
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

  // Validación y Envío del Formulario
  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const requiredInputs = form.querySelectorAll('input[required], select[required]');
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

    const inputData = {
      nombreProductor: document.getElementById('producerName').value.trim(),
      identificacionFiscal: document.getElementById('documentNumber').value.trim(),
      cultivo: document.getElementById('cropType').value,
      hectareas: Number(document.getElementById('areaHectares').value),
      rendimientoPorHa: Number(document.getElementById('estimatedYield').value),
      precioPorTon: Number(document.getElementById('marketPrice').value),
      costoPorHa: Number(document.getElementById('costPerHectare').value),
      capitalSolicitado: Number(document.getElementById('requestedCapital').value),
      deudasFinancieras: Number(document.getElementById('deudas_financieras').value),
      periodicidad: document.getElementById('paymentFrequency').value
    };

    if (typeof CreditEngine === 'undefined' || typeof CreditEngine.analisarProductor !== 'function') {
      showToast('Error: Motor de análisis no disponible');
      return;
    }

    const resultado = CreditEngine.analisarProductor(inputData);
    renderResults(resultado);
  });

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

    // Métricas del Modelo de Miguel en USD
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

    // Cobertura de Deuda (x)
    const coberturaVal = m.cobertura >= 90 ? '> 10.0x' : `${m.cobertura.toFixed(2)}x`;
    metricCobertura.textContent = coberturaVal;
    if (m.cobertura >= 1.25 && m.flujoCajaNeto > 0) {
      metricCoberturaBadge.textContent = 'Solvente (≥ 1.25x)';
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
      metricCoberturaBadge.textContent = 'Inviable (< 1.00x)';
      metricCoberturaBadge.className = 'metric-badge badge-danger';
      if (boxCobertura) {
        boxCobertura.className = 'metric-box danger-highlight';
      }
    }

    // Texto del Dictamen Oficial
    dictamenText.textContent = res.dictamenFormal;

    if (window.innerWidth < 1024) {
      resultCard.scrollIntoView({ behavior: 'smooth' });
    }
  }

  // Ejecución inicial automática
  if (form) {
    form.dispatchEvent(new Event('submit'));
  }
});
