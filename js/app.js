/**
 * Sistema de Análise de Crédito Rural - Controlador da Interface (App)
 * Versão: 0.1.0 - Versão Base (Produtor Agrícola)
 */

document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('creditForm');
  const btnSample = document.getElementById('btnSample');
  const resultPlaceholder = document.getElementById('resultPlaceholder');
  const resultCard = document.getElementById('resultCard');
  const analysisTimestamp = document.getElementById('analysisTimestamp');

  // Elementos do Banner de Decisão
  const decisionBanner = document.getElementById('decisionBanner');
  const decisionIcon = document.getElementById('decisionIcon');
  const decisionTitle = document.getElementById('decisionTitle');
  const decisionSubtitle = document.getElementById('decisionSubtitle');

  // Métricas
  const metricScore = document.getElementById('metricScore');
  const metricScoreBadge = document.getElementById('metricScoreBadge');
  const metricMaxLimit = document.getElementById('metricMaxLimit');
  const metricDTI = document.getElementById('metricDTI');
  const metricDTIBadge = document.getElementById('metricDTIBadge');
  const metricLTV = document.getElementById('metricLTV');
  const metricLTVBadge = document.getElementById('metricLTVBadge');
  const reasonsList = document.getElementById('reasonsList');

  // Formatação em Moeda Brasileira (R$)
  const formatBRL = (value) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      maximumFractionDigits: 0
    }).format(value);
  };

  // Simulação pré-configurada alternativa
  let sampleIndex = 0;
  const sampleProfiles = [
    {
      producerName: 'Fazenda Rio Verde',
      documentNumber: '12.345.678/0001-90',
      producerType: 'PRONAMP',
      activity: 'GRAOS',
      areaHectares: 350,
      creditHistory: 'EXCELENTE',
      annualRevenue: 1800000,
      currentDebts: 250000,
      guaranteeType: 'IMOVEL_RURAL',
      guaranteeValue: 1500000,
      requestedAmount: 450000,
      creditPurpose: 'CUSTEIO',
      termMonths: 18
    },
    {
      producerName: 'Sítio Recanto dos Ipês',
      documentNumber: '321.654.987-12',
      producerType: 'PRONAF',
      activity: 'PECUARIA_LEITE',
      areaHectares: 45,
      creditHistory: 'BOM',
      annualRevenue: 280000,
      currentDebts: 65000,
      guaranteeType: 'MAQUINARIO',
      guaranteeValue: 120000,
      requestedAmount: 95000,
      creditPurpose: 'INVESTIMENTO',
      termMonths: 36
    },
    {
      producerName: 'Agropecuária Sol Nascente',
      documentNumber: '98.765.432/0001-11',
      producerType: 'DEMAIS',
      activity: 'GRAOS',
      areaHectares: 800,
      creditHistory: 'RESTRICAO_GRAVE',
      annualRevenue: 3500000,
      currentDebts: 2900000,
      guaranteeType: 'CPR_SAFRA',
      guaranteeValue: 800000,
      requestedAmount: 1200000,
      creditPurpose: 'CUSTEIO',
      termMonths: 12
    }
  ];

  if (btnSample) {
    btnSample.addEventListener('click', () => {
      const sample = sampleProfiles[sampleIndex % sampleProfiles.length];
      sampleIndex++;

      document.getElementById('producerName').value = sample.producerName;
      document.getElementById('documentNumber').value = sample.documentNumber;
      document.getElementById('producerType').value = sample.producerType;
      document.getElementById('activity').value = sample.activity;
      document.getElementById('areaHectares').value = sample.areaHectares;
      document.getElementById('creditHistory').value = sample.creditHistory;
      document.getElementById('annualRevenue').value = sample.annualRevenue;
      document.getElementById('currentDebts').value = sample.currentDebts;
      document.getElementById('guaranteeType').value = sample.guaranteeType;
      document.getElementById('guaranteeValue').value = sample.guaranteeValue;
      document.getElementById('requestedAmount').value = sample.requestedAmount;
      document.getElementById('creditPurpose').value = sample.creditPurpose;
      document.getElementById('termMonths').value = sample.termMonths;

      // Executa a análise automaticamente ao carregar exemplo
      form.dispatchEvent(new Event('submit'));
    });
  }

  // Manipulação do Formulário
  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const inputData = {
      producerName: document.getElementById('producerName').value.trim(),
      documentNumber: document.getElementById('documentNumber').value.trim(),
      producerType: document.getElementById('producerType').value,
      activity: document.getElementById('activity').value,
      areaHectares: Number(document.getElementById('areaHectares').value),
      creditHistory: document.getElementById('creditHistory').value,
      annualRevenue: Number(document.getElementById('annualRevenue').value),
      currentDebts: Number(document.getElementById('currentDebts').value),
      guaranteeType: document.getElementById('guaranteeType').value,
      guaranteeValue: Number(document.getElementById('guaranteeValue').value),
      requestedAmount: Number(document.getElementById('requestedAmount').value),
      creditPurpose: document.getElementById('creditPurpose').value,
      termMonths: Number(document.getElementById('termMonths').value)
    };

    if (typeof CreditEngine === 'undefined') {
      alert('Erro: Motor de crédito não foi inicializado corretamente.');
      return;
    }

    const result = CreditEngine.evaluateCredit(inputData);
    displayResults(result);
  });

  function displayResults(res) {
    resultPlaceholder.style.display = 'none';
    resultCard.style.display = 'block';

    const now = new Date();
    analysisTimestamp.textContent = `Avaliado em: ${now.toLocaleTimeString('pt-BR')}`;

    // Configurar Banner de Decisão
    decisionBanner.className = 'decision-banner';
    if (res.decision === 'APPROVED') {
      decisionBanner.classList.add('decision-approved');
      decisionIcon.textContent = '✅';
    } else if (res.decision === 'CONDITIONAL') {
      decisionBanner.classList.add('decision-conditional');
      decisionIcon.textContent = '⚠️';
    } else {
      decisionBanner.classList.add('decision-rejected');
      decisionIcon.textContent = '🛑';
    }

    decisionTitle.textContent = res.decisionTitle;
    decisionSubtitle.textContent = res.decisionSubtitle;

    // Métricas
    metricScore.textContent = `${res.score} / 100`;
    metricScoreBadge.textContent = `Rating ${res.rating}`;
    metricScoreBadge.className = 'metric-badge ' + (res.score >= 70 ? 'badge-good' : res.score >= 50 ? 'badge-alert' : 'badge-danger');

    metricMaxLimit.textContent = formatBRL(res.maxRecommendedCredit);

    // Comprometimento de Renda
    const dti = res.metrics.debtToIncomeRatio;
    metricDTI.textContent = `${dti.toFixed(1)}%`;
    metricDTIBadge.textContent = dti <= 35 ? 'Margem Segura' : dti <= 50 ? 'Atenção ao Fluxo' : 'Margem Excedida';
    metricDTIBadge.className = 'metric-badge ' + (dti <= 35 ? 'badge-good' : dti <= 50 ? 'badge-alert' : 'badge-danger');

    // LTV / Cobertura
    const cov = res.metrics.guaranteeCoverage;
    metricLTV.textContent = `${cov.toFixed(0)}%`;
    metricLTVBadge.textContent = cov >= 100 ? 'Adequada' : cov >= 70 ? 'Parcial' : 'Insuficiente';
    metricLTVBadge.className = 'metric-badge ' + (cov >= 100 ? 'badge-good' : cov >= 70 ? 'badge-alert' : 'badge-danger');

    // Detalhamento dos Fatores
    reasonsList.innerHTML = '';
    res.reasons.forEach(reason => {
      const li = document.createElement('li');
      li.className = `item-${reason.type}`;
      const icon = reason.type === 'success' ? '✔' : reason.type === 'warning' ? '▲' : '✖';
      li.innerHTML = `<span>${icon}</span> <span>${reason.text}</span>`;
      reasonsList.appendChild(li);
    });

    // Scroll suave até o resultado se em tela menor
    if (window.innerWidth < 992) {
      resultCard.scrollIntoView({ behavior: 'smooth' });
    }
  }

  // Execução inicial com valores padrão
  if (form) {
    form.dispatchEvent(new Event('submit'));
  }
});
