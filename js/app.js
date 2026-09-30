/**
 * Sistema de Análisis de Crédito Rural - Controlador de la Interfaz
 * Versión: 0.1.1 - Localización Integral al Español
 */

document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('creditForm');
  const btnSample = document.getElementById('btnSample');
  const btnCopyDictamen = document.getElementById('btnCopyDictamen');
  const resultPlaceholder = document.getElementById('resultPlaceholder');
  const resultCard = document.getElementById('resultCard');
  const analysisTimestamp = document.getElementById('analysisTimestamp');
  const toast = document.getElementById('toast');

  // Elementos del Banner de Dictamen
  const decisionBanner = document.getElementById('decisionBanner');
  const decisionIcon = document.getElementById('decisionIcon');
  const decisionTitle = document.getElementById('decisionTitle');
  const decisionSubtitle = document.getElementById('decisionSubtitle');

  // Elementos de Métricas Solicitadas
  const metricGrossIncome = document.getElementById('metricGrossIncome');
  const metricTotalCost = document.getElementById('metricTotalCost');
  const metricOperatingMargin = document.getElementById('metricOperatingMargin');
  const metricMarginBadge = document.getElementById('metricMarginBadge');
  const metricICSD = document.getElementById('metricICSD');
  const metricICSDBadge = document.getElementById('metricICSDBadge');
  const metricCollateralCoverage = document.getElementById('metricCollateralCoverage');
  const metricCollateralBadge = document.getElementById('metricCollateralBadge');
  const metricRecommendedLimit = document.getElementById('metricRecommendedLimit');

  const reasonsList = document.getElementById('reasonsList');
  const dictamenText = document.getElementById('dictamenText');

  // Formateador monetario estándar ($ 123.456)
  const formatMoney = (val) => {
    const num = Math.round(Number(val) || 0);
    return '$ ' + num.toLocaleString('es-ES');
  };

  // Función para mostrar Toast de notificación
  const showToast = (message = '¡Copiado al portapapeles!') => {
    if (!toast) return;
    toast.textContent = message;
    toast.classList.add('show');
    setTimeout(() => {
      toast.classList.remove('show');
    }, 2500);
  };

  // Perfiles de prueba rotativos en español técnico
  let sampleIndex = 0;
  const sampleProfiles = [
    {
      producerName: 'Agropecuaria El Palmar S.A.',
      documentNumber: '30-71234567-8',
      cropType: 'SOJA',
      areaHectares: 400,
      estimatedYield: 3.6,
      marketPrice: 350,
      costPerHectare: 720,
      requestedCapital: 150000,
      paymentFrequency: 'ZAFRA_UNICA',
      loanTermMonths: 12,
      interestRate: 9.0,
      existingDebts: 20000,
      guaranteeType: 'HIPOTECA',
      guaranteeValue: 300000
    },
    {
      producerName: 'Establecimiento Don Joaquín',
      documentNumber: '20-28945612-4',
      cropType: 'MAIZ',
      areaHectares: 250,
      estimatedYield: 8.5,
      marketPrice: 180,
      costPerHectare: 1100,
      requestedCapital: 120000,
      paymentFrequency: 'SEMESTRAL',
      loanTermMonths: 18,
      interestRate: 10.5,
      existingDebts: 45000,
      guaranteeType: 'PRENDA_COSECHA',
      guaranteeValue: 140000
    },
    {
      producerName: 'Agrícola Valle Hermoso SRL',
      documentNumber: '33-65987412-9',
      cropType: 'TRIGO',
      areaHectares: 180,
      estimatedYield: 2.1,
      marketPrice: 210,
      costPerHectare: 680,
      requestedCapital: 90000,
      paymentFrequency: 'ZAFRA_UNICA',
      loanTermMonths: 10,
      interestRate: 12.0,
      existingDebts: 60000,
      guaranteeType: 'AVAL',
      guaranteeValue: 40000
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
      document.getElementById('paymentFrequency').value = sample.paymentFrequency;
      document.getElementById('loanTermMonths').value = sample.loanTermMonths;
      document.getElementById('interestRate').value = sample.interestRate;
      document.getElementById('existingDebts').value = sample.existingDebts;
      document.getElementById('guaranteeType').value = sample.guaranteeType;
      document.getElementById('guaranteeValue').value = sample.guaranteeValue;

      form.dispatchEvent(new Event('submit'));
    });
  }

  // Copia del Dictamen Formal al portapapeles
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
          // Fallback para navegadores antiguos
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

  // Validación y envío del formulario
  form.addEventListener('submit', (e) => {
    e.preventDefault();

    // Validación de campos vacíos o nulos
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
      showToast('Por favor, complete todos los campos obligatorios antes de calcular.');
      return;
    }

    const inputData = {
      producerName: document.getElementById('producerName').value.trim(),
      documentNumber: document.getElementById('documentNumber').value.trim(),
      cropType: document.getElementById('cropType').value,
      areaHectares: Number(document.getElementById('areaHectares').value),
      estimatedYield: Number(document.getElementById('estimatedYield').value),
      marketPrice: Number(document.getElementById('marketPrice').value),
      costPerHectare: Number(document.getElementById('costPerHectare').value),
      requestedCapital: Number(document.getElementById('requestedCapital').value),
      paymentFrequency: document.getElementById('paymentFrequency').value,
      loanTermMonths: Number(document.getElementById('loanTermMonths').value),
      interestRate: Number(document.getElementById('interestRate').value),
      existingDebts: Number(document.getElementById('existingDebts').value),
      guaranteeType: document.getElementById('guaranteeType').value,
      guaranteeValue: Number(document.getElementById('guaranteeValue').value)
    };

    if (typeof CreditEngine === 'undefined') {
      showToast('Error: Motor de cálculo no disponible');
      return;
    }

    const evaluation = CreditEngine.evaluateCredit(inputData);
    renderResults(evaluation);
  });

  function renderResults(res) {
    resultPlaceholder.style.display = 'none';
    resultCard.style.display = 'block';

    const now = new Date();
    analysisTimestamp.textContent = `Calculado: ${now.toLocaleTimeString('es-ES')}`;

    // Configuración del Banner de Dictamen
    // Estados: "Aprobado", "Riesgo Moderado", "Inviable"
    decisionBanner.className = 'decision-banner';
    if (res.status === 'Aprobado') {
      decisionBanner.classList.add('decision-aprobado');
      decisionIcon.textContent = '✅';
    } else if (res.status === 'Riesgo Moderado') {
      decisionBanner.classList.add('decision-moderado');
      decisionIcon.textContent = '⚠️';
    } else {
      decisionBanner.classList.add('decision-inviable');
      decisionIcon.textContent = '🛑';
    }

    decisionTitle.textContent = `Dictamen: ${res.status}`;
    decisionSubtitle.textContent = res.statusSubtitle;

    // Métricas Requeridas
    const m = res.metrics;
    metricGrossIncome.textContent = formatMoney(m.grossIncome);
    metricTotalCost.textContent = formatMoney(m.totalOperatingCost);
    metricOperatingMargin.textContent = formatMoney(m.grossOperatingMargin);

    metricMarginBadge.textContent = `${m.marginPct.toFixed(1)}% Margen`;
    metricMarginBadge.className = 'metric-badge ' + (m.marginPct >= 30 ? 'badge-good' : m.marginPct >= 15 ? 'badge-alert' : 'badge-danger');

    // Cobertura de Deuda (ICSD)
    const icsdVal = m.icsd >= 90 ? '> 10.0x' : `${m.icsd.toFixed(2)}x`;
    metricICSD.textContent = icsdVal;
    if (m.icsd >= 1.30) {
      metricICSDBadge.textContent = 'Solvente (≥ 1.30x)';
      metricICSDBadge.className = 'metric-badge badge-good';
    } else if (m.icsd >= 1.05) {
      metricICSDBadge.textContent = 'Ajustado (1.05x - 1.29x)';
      metricICSDBadge.className = 'metric-badge badge-alert';
    } else {
      metricICSDBadge.textContent = 'Insuficiente (< 1.05x)';
      metricICSDBadge.className = 'metric-badge badge-danger';
    }

    // Cobertura de Garantía
    metricCollateralCoverage.textContent = `${m.collateralCoverage.toFixed(0)}%`;
    metricCollateralBadge.textContent = m.collateralCoverage >= 120 ? 'Excelente (≥ 120%)' : m.collateralCoverage >= 100 ? 'Aceptable (≥ 100%)' : 'Insuficiente (< 100%)';
    metricCollateralBadge.className = 'metric-badge ' + (m.collateralCoverage >= 100 ? 'badge-good' : m.collateralCoverage >= 75 ? 'badge-alert' : 'badge-danger');

    // Límite Recomendado
    metricRecommendedLimit.textContent = formatMoney(m.recommendedLimit);

    // Lista de Factores
    reasonsList.innerHTML = '';
    res.reasons.forEach((r) => {
      const li = document.createElement('li');
      li.className = `item-${r.type}`;
      const icon = r.type === 'success' ? '✔' : r.type === 'warning' ? '▲' : '✖';
      li.innerHTML = `<span>${icon}</span> <span>${r.text}</span>`;
      reasonsList.appendChild(li);
    });

    // Dictamen Formal para Copiar
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
