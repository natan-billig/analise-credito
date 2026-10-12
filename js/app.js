/**
 * Sistema de Análisis de Crédito Rural - Controlador de la Interfaz
 * Versión: 0.8.1 - Referencias Comerciales y Formato Bifrontal A4 en Reporte de Impresión
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
  const btnImprimir = document.getElementById('btn-imprimir');
  const resultPlaceholder = document.getElementById('resultPlaceholder');
  const resultCard = document.getElementById('resultCard');
  const analysisTimestamp = document.getElementById('analysisTimestamp');
  const toast = document.getElementById('toast');

  let ultimoAnalisis = null;

  // Calculadora Financiera (Sistema Alemán)
  const modalCalculadora = document.getElementById('modal-calculadora');
  const btnAbrirCalculadoraTop = document.getElementById('btn-abrir-calculadora-top');
  const btnAbrirCalculadora = document.getElementById('btn-abrir-calculadora');
  const btnAbrirCalculadoraPrestador = document.getElementById('btn-abrir-calculadora-prestador');
  const btnCerrarModalX = document.getElementById('btn-cerrar-modal-x');
  const btnCerrarCalculadora = document.getElementById('btn-cerrar-calculadora');
  const btnAplicarCalculadora = document.getElementById('btn-aplicar-calculadora');

  const calcCapital = document.getElementById('calcCapital');
  const calcGastoAdmin = document.getElementById('calcGastoAdmin');
  const calcTasaInteres = document.getElementById('calcTasaInteres');
  const calcPlazoAnios = document.getElementById('calcPlazoAnios');
  const calcFrecuencia = document.getElementById('calcFrecuencia');
  const calcEsquemaSemestral = document.getElementById('calcEsquemaSemestral');
  const groupEsquemaSemestral = document.getElementById('groupEsquemaSemestral');
  const calcEntidadSelect = document.getElementById('calcEntidadSelect');
  const btnGestionarTasas = document.getElementById('btn-gestionar-tasas');

  // Gestor de Tasas de Bancos
  const modalGestorTasas = document.getElementById('modal-gestor-tasas');
  const btnCerrarTasasX = document.getElementById('btn-cerrar-tasas-x');
  const btnCerrarTasas = document.getElementById('btn-cerrar-tasas');
  const btnGuardarEntidad = document.getElementById('btn-guardar-entidad');
  const btnResetTasas = document.getElementById('btn-reset-tasas');
  const inputNombreBanco = document.getElementById('inputNombreBanco');
  const inputTasaBanco = document.getElementById('inputTasaBanco');
  const tasaBancoEditId = document.getElementById('tasaBancoEditId');
  const tasasBancosBody = document.getElementById('tasasBancosBody');
  const badgeTotalBancos = document.getElementById('badgeTotalBancos');

  const calcCronogramaBody = document.getElementById('calcCronogramaBody');
  const calcTableBadge = document.getElementById('calcTableBadge');
  const thColPeriodo = document.getElementById('thColPeriodo');
  const thColCuota = document.getElementById('thColCuota');
  const calcKpiIntereses = document.getElementById('calcKpiIntereses');
  const calcKpiGastoAdmin = document.getElementById('calcKpiGastoAdmin');
  const calcKpiCostoTotal = document.getElementById('calcKpiCostoTotal');
  const calcKpiTotalPagado = document.getElementById('calcKpiTotalPagado');

  const calcAplicadaBadge = document.getElementById('calc-aplicada-badge');
  const badgeCalcAnios = document.getElementById('badgeCalcAnios');
  const badgeCalcTasa = document.getElementById('badgeCalcTasa');
  const calcAplicadaBadgePrestador = document.getElementById('calc-aplicada-badge-prestador');
  const badgeCalcAniosPrestador = document.getElementById('badgeCalcAniosPrestador');
  const badgeCalcTasaPrestador = document.getElementById('badgeCalcTasaPrestador');

  let calculadoraAplicada = null;
  let ultimoResultadoAleman = null;

  // Pestañas de Perfil
  const tabProductor = document.getElementById('tabProductor');
  const tabPrestador = document.getElementById('tabPrestador');
  const sectionProductor = document.getElementById('sectionProductor');
  const sectionPrestador = document.getElementById('sectionPrestador');
  const formCardTitle = document.getElementById('formCardTitle');
  const formCardSubtitle = document.getElementById('formCardSubtitle');

  // Etiquetas Dinámicas de Métricas
  const labelIngresos = document.getElementById('labelIngresos');
  const badgeIngresos = document.getElementById('badgeIngresos');
  const labelCostos = document.getElementById('labelCostos');
  const badgeCostos = document.getElementById('badgeCostos');
  const labelMargen = document.getElementById('labelMargen');

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

  // Referencias Comerciales
  const refComerciales = document.getElementById('refComerciales');
  const serviceRefComerciales = document.getElementById('serviceRefComerciales');
  const groupRefComercialesProductor = document.getElementById('groupRefComercialesProductor');
  const groupRefComercialesPrestador = document.getElementById('groupRefComercialesPrestador');
  const printRefComercialesBox = document.getElementById('printRefComercialesBox');

  let activeProfile = 'productor'; // 'productor' | 'prestador'

  const MESES = [
    'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
    'Julio', 'Agosto', 'Setiembre', 'Octubre', 'Noviembre', 'Diciembre'
  ];

  const formatUSD = (val) => {
    const num = Math.round(Number(val) || 0);
    return '$ ' + num.toLocaleString('en-US');
  };

  const showToast = (message = '¡Copiado al portapapeles!') => {
    if (!toast) return;
    toast.textContent = message;
    toast.classList.add('show');
    setTimeout(() => {
      toast.classList.remove('show');
    }, 2500);
  };

  // --- CONTROL DE PESTAÑAS (TABS) ---
  function setActiveProfile(profile) {
    activeProfile = profile;
    if (profile === 'productor') {
      tabProductor.classList.add('active');
      tabProductor.setAttribute('aria-selected', 'true');
      tabPrestador.classList.remove('active');
      tabPrestador.setAttribute('aria-selected', 'false');

      sectionProductor.style.display = 'block';
      sectionPrestador.style.display = 'none';

      if (groupRefComercialesProductor) groupRefComercialesProductor.style.display = 'block';
      if (groupRefComercialesPrestador) groupRefComercialesPrestador.style.display = 'none';

      if (formCardTitle) formCardTitle.textContent = '📝 Datos Técnicos y Financieros del Productor';
      if (formCardSubtitle) formCardSubtitle.textContent = 'Valores en USD ($) • Paraguay (C.I. / RUC)';
      if (labelIngresos) labelIngresos.textContent = 'Ingresos Proyectados (USD)';
      if (badgeIngresos) badgeIngresos.textContent = 'Ventas Totales';
      if (labelCostos) labelCostos.textContent = 'Costo Operacional de Producción (USD)';
      if (badgeCostos) badgeCostos.textContent = 'Costos Directos';
      if (labelMargen) labelMargen.textContent = 'Margen Operativo Agrícola (USD)';
    } else {
      tabPrestador.classList.add('active');
      tabPrestador.setAttribute('aria-selected', 'true');
      tabProductor.classList.remove('active');
      tabProductor.setAttribute('aria-selected', 'false');

      sectionPrestador.style.display = 'block';
      sectionProductor.style.display = 'none';

      if (groupRefComercialesPrestador) groupRefComercialesPrestador.style.display = 'block';
      if (groupRefComercialesProductor) groupRefComercialesProductor.style.display = 'none';

      if (formCardTitle) formCardTitle.textContent = '📝 Datos Técnicos y Financieros del Prestador de Servicios';
      if (formCardSubtitle) formCardSubtitle.textContent = 'Valores en USD ($) • Contratos con Silos';
      if (labelIngresos) labelIngresos.textContent = 'Ingresos por Servicios Facturados (USD)';
      if (badgeIngresos) badgeIngresos.textContent = 'Facturación a Silo';
      if (labelCostos) labelCostos.textContent = 'Costo Operacional del Servicio (USD)';
      if (badgeCostos) badgeCostos.textContent = 'Costos de Maquinaria';
      if (labelMargen) labelMargen.textContent = 'Margen Operativo del Servicio (USD)';
    }

    executeAnalysis();
  }

  if (tabProductor) {
    tabProductor.addEventListener('click', (e) => {
      e.preventDefault();
      setActiveProfile('productor');
    });
  }

  if (tabPrestador) {
    tabPrestador.addEventListener('click', (e) => {
      e.preventDefault();
      setActiveProfile('prestador');
    });
  }

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

  // --- PERFILES DE PRUEBA DE PARAGUAY ---
  let sampleIndexProductor = 0;
  const sampleProfilesProductor = [
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
      refComerciales: 'Agrofértil S.A.: Línea de crédito activa, excelente cumplimiento. Dekalpar S.A.: Compras al día a cosecha sin reclamos. Silo Santa Rosa: Entrega normal de granos.',
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
      refComerciales: 'Ciabay S.A.: Cumplimiento intachable en insumos. Cooperativa Colonias Unidas: Socio clase A con entregas periódicas. Diagro: Cancelación puntual a cosecha.',
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
      refComerciales: 'Somax Agro: Cuenta corriente comercial normal sin atrasos. Matrisoja: Proveedor de fertilizantes con historial regular y positivo.',
      compromisos: [
        { entidad: 'Banco Regional / Sudameris', mes: 'Setiembre', monto: 18000 },
        { entidad: 'Cooperativa Colonias Unidas', mes: 'Diciembre', monto: 12000 }
      ]
    }
  ];

  let sampleIndexPrestador = 0;
  const sampleProfilesPrestador = [
    {
      providerName: 'Maquinarias & Servicios del Este S.A.',
      providerDoc: '80054321-9',
      contractClient: 'Silo Santa Rosa (ADM)',
      serviceArea: 600,
      serviceTariff: 140,
      serviceCost: 85,
      serviceRequestedCapital: 20000,
      servicePaymentFrequency: 'Zafra Única',
      refComerciales: 'Silo Santa Rosa (ADM): Contratista homologado hace 4 zafras con cumplimiento óptimo. Agrofértil S.A.: Línea de lubricantes y repuestos al día.',
      compromisos: [
        { entidad: 'Banco Sudameris', mes: 'Mayo', monto: 8000 },
        { entidad: 'Banco Continental', mes: 'Octubre', monto: 5000 }
      ]
    },
    {
      providerName: 'Agro Servicios Bella Vista SRL',
      providerDoc: '80076543-1',
      contractClient: 'Cargill Agropecuaria SACI',
      serviceArea: 1000,
      serviceTariff: 135,
      serviceCost: 80,
      serviceRequestedCapital: 35000,
      servicePaymentFrequency: 'Semestral',
      refComerciales: 'Cargill Agropecuaria: Cumplimiento riguroso de cronograma de cosecha. Kurosu & Cía. (John Deere): Mantenimiento de parque de cosechadoras al día.',
      compromisos: [
        { entidad: 'Itaú Paraguay', mes: 'Junio', monto: 10000 },
        { entidad: 'Banco Atlas', mes: 'Diciembre', monto: 8000 }
      ]
    },
    {
      providerName: 'Cosechas y Fletes del Chaco',
      providerDoc: '4.195.880',
      contractClient: 'Cooperativa Fernheim Ltda.',
      serviceArea: 450,
      serviceTariff: 150,
      serviceCost: 95,
      serviceRequestedCapital: 15000,
      servicePaymentFrequency: 'Zafra Única',
      refComerciales: 'Cooperativa Fernheim: Prestador de servicios con calificación comercial excelente. Tracto Agro Vial: Créditos para maquinarias al día.',
      compromisos: [
        { entidad: 'Banco Basa', mes: 'Agosto', monto: 6000 }
      ]
    }
  ];

  if (btnSample) {
    btnSample.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();

      if (activeProfile === 'productor') {
        const sample = sampleProfilesProductor[sampleIndexProductor % sampleProfilesProductor.length];
        sampleIndexProductor++;

        document.getElementById('producerName').value = sample.producerName;
        document.getElementById('documentNumber').value = sample.documentNumber;
        document.getElementById('cropType').value = sample.cropType;
        document.getElementById('areaHectares').value = sample.areaHectares;
        document.getElementById('estimatedYield').value = sample.estimatedYield;
        document.getElementById('marketPrice').value = sample.marketPrice;
        document.getElementById('costPerHectare').value = sample.costPerHectare;
        document.getElementById('requestedCapital').value = sample.requestedCapital;
        document.getElementById('paymentFrequency').value = sample.paymentFrequency;
        if (refComerciales) refComerciales.value = sample.refComerciales || '';

        resetCommitments(sample.compromisos);
      } else {
        const sample = sampleProfilesPrestador[sampleIndexPrestador % sampleProfilesPrestador.length];
        sampleIndexPrestador++;

        document.getElementById('providerName').value = sample.providerName;
        document.getElementById('providerDoc').value = sample.providerDoc;
        document.getElementById('contractClient').value = sample.contractClient;
        document.getElementById('serviceArea').value = sample.serviceArea;
        document.getElementById('serviceTariff').value = sample.serviceTariff;
        document.getElementById('serviceCost').value = sample.serviceCost;
        document.getElementById('serviceRequestedCapital').value = sample.serviceRequestedCapital;
        document.getElementById('servicePaymentFrequency').value = sample.servicePaymentFrequency;
        if (serviceRefComerciales) serviceRefComerciales.value = sample.refComerciales || '';

        resetCommitments(sample.compromisos);
      }

      calculadoraAplicada = null;
      if (calcAplicadaBadge) calcAplicadaBadge.style.display = 'none';
      if (calcAplicadaBadgePrestador) calcAplicadaBadgePrestador.style.display = 'none';

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

  // --- EJECUCIÓN DEL ANÁLISIS ---
  function executeAnalysis() {
    if (typeof CreditEngine === 'undefined') {
      showToast('Error: Motor de análisis no disponible');
      return;
    }

    const compromisosList = getCommitmentsData();
    let resultado = null;

    if (activeProfile === 'productor') {
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
        referenciasComerciales: refComerciales ? refComerciales.value.trim() : '',
        compromisos: compromisosList,
        sistemaAlemanInfo: calculadoraAplicada
      };

      resultado = CreditEngine.analisarProductor(inputData);
    } else {
      const inputData = {
        nombreEmpresa: document.getElementById('providerName').value.trim(),
        identificacionFiscal: document.getElementById('providerDoc').value.trim(),
        contratante: document.getElementById('contractClient').value.trim(),
        hectareas: Number(document.getElementById('serviceArea').value),
        tarifaPorHa: Number(document.getElementById('serviceTariff').value),
        costoPorHa: Number(document.getElementById('serviceCost').value),
        capitalSolicitado: Number(document.getElementById('serviceRequestedCapital').value),
        periodicidad: document.getElementById('servicePaymentFrequency').value,
        referenciasComerciales: serviceRefComerciales ? serviceRefComerciales.value.trim() : '',
        compromisos: compromisosList,
        sistemaAlemanInfo: calculadoraAplicada
      };

      resultado = CreditEngine.analisarPrestador(inputData);
    }

    renderResults(resultado);
  }

  if (btnCalcular) {
    btnCalcular.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      executeAnalysis();
    });
  }

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

    // Configuración del Banner de Dictamen Oficial
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

    // Métricas del Modelo en USD
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
      if (boxFlujoCaja) boxFlujoCaja.className = 'metric-box highlight';
    } else if (m.flujoCajaNeto === 0) {
      metricFlujoBadge.textContent = 'Punto de Equilibrio (Sin Remanente)';
      metricFlujoBadge.className = 'metric-badge badge-alert';
      if (boxFlujoCaja) boxFlujoCaja.className = 'metric-box';
    } else {
      metricFlujoBadge.textContent = 'Flujo Deficitario (Déficit)';
      metricFlujoBadge.className = 'metric-badge badge-danger';
      if (boxFlujoCaja) boxFlujoCaja.className = 'metric-box danger-highlight';
    }

    // Cobertura de Deuda / ICSD Global (x)
    const coberturaVal = m.icsd >= 90 ? '> 10.0x' : `${m.icsd.toFixed(2)}x`;
    metricCobertura.textContent = coberturaVal;
    if (m.icsd >= 1.25 && m.flujoCajaNeto > 0) {
      metricCoberturaBadge.textContent = 'Solvente (ICSD ≥ 1.25x)';
      metricCoberturaBadge.className = 'metric-badge badge-good';
      if (boxCobertura) boxCobertura.className = 'metric-box highlight';
    } else if (m.icsd >= 1.00 && m.flujoCajaNeto >= 0) {
      metricCoberturaBadge.textContent = 'Riesgo Moderado (1.00x - 1.24x)';
      metricCoberturaBadge.className = 'metric-badge badge-alert';
      if (boxCobertura) boxCobertura.className = 'metric-box';
    } else {
      metricCoberturaBadge.textContent = 'Inviable (ICSD < 1.00x)';
      metricCoberturaBadge.className = 'metric-badge badge-danger';
      if (boxCobertura) boxCobertura.className = 'metric-box danger-highlight';
    }

    // Renderizado del Cronograma y Concentración Mensual
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

    // Inyección de Referencias Comerciales en el Reporte Impreso
    if (printRefComercialesBox) {
      const activeRef = (res && res.referenciasComerciales) ? res.referenciasComerciales : (activeProfile === 'productor'
        ? (refComerciales ? refComerciales.value.trim() : '')
        : (serviceRefComerciales ? serviceRefComerciales.value.trim() : ''));
      printRefComercialesBox.textContent = activeRef || 'Sin referencias comerciales registradas para esta operación.';
    }

    // Almacenar el último análisis ejecutado para el reporte imprimible
    ultimoAnalisis = res;

    if (window.innerWidth < 1024) {
      resultCard.scrollIntoView({ behavior: 'smooth' });
    }
  }

  // --- PREPARACIÓN DEL REPORTE EJECUTIVO IMPRIMIBLE EN A4 ---
  function prepararReporteImpresion(res) {
    if (!res) return;

    const ahora = new Date();
    const pad = (n) => String(n).padStart(2, '0');
    const dia = pad(ahora.getDate());
    const mesNum = pad(ahora.getMonth() + 1);
    const anio = ahora.getFullYear();
    const hora = pad(ahora.getHours());
    const min = pad(ahora.getMinutes());
    const fechaStr = `${dia}/${mesNum}/${anio} ${hora}:${min}`;
    const codAleatorio = Math.floor(1000 + Math.random() * 9000);
    const protocoloStr = `SAC-PY-${anio}${mesNum}${dia}-${codAleatorio}`;

    // a) Cabeçalho Executivo
    const elFecha = document.getElementById('printFechaEmision');
    const elProto = document.getElementById('printProtocolo');
    if (elFecha) elFecha.textContent = fechaStr;
    if (elProto) elProto.textContent = protocoloStr;

    // b) Dados do Solicitante e Operação
    const esProductor = res.perfil === 'productor';
    const elNombre = document.getElementById('printNombreCliente');
    const elDoc = document.getElementById('printDocCliente');
    const elTipo = document.getElementById('printTipoCliente');
    const elLabelDetalle = document.getElementById('printLabelDetalleEspecifico');
    const elValDetalle = document.getElementById('printValDetalleEspecifico');
    const elSup = document.getElementById('printSuperficie');
    const elLabelRend = document.getElementById('printLabelRendTarifa');
    const elValRend = document.getElementById('printValRendTarifa');
    const elLabelPrecio = document.getElementById('printLabelPrecioCosto');
    const elValPrecio = document.getElementById('printValPrecioCosto');
    const elPer = document.getElementById('printPeriodicidad');
    const elMargenLabel = document.getElementById('printMargenLabel');

    if (esProductor) {
      if (elNombre) elNombre.textContent = document.getElementById('producerName').value.trim() || 'Productor Agrícola';
      if (elDoc) elDoc.textContent = document.getElementById('documentNumber').value.trim() || 'S/D';
      if (elTipo) elTipo.textContent = 'Productor Agrícola';
      if (elLabelDetalle) elLabelDetalle.textContent = 'Cultivo Principal:';
      if (elValDetalle) elValDetalle.textContent = document.getElementById('cropType').value || 'Soja';
      if (elSup) elSup.textContent = `${document.getElementById('areaHectares').value || 0} ha`;
      if (elLabelRend) elLabelRend.textContent = 'Rendimiento Estimado:';
      if (elValRend) elValRend.textContent = `${document.getElementById('estimatedYield').value || 0} t/ha`;
      if (elLabelPrecio) elLabelPrecio.textContent = 'Precio de Mercado:';
      if (elValPrecio) elValPrecio.textContent = `$ ${document.getElementById('marketPrice').value || 0} / t`;
      if (elPer) elPer.textContent = document.getElementById('paymentFrequency').value || 'Zafra Única';
      if (elMargenLabel) elMargenLabel.textContent = 'Margen Agropecuario';
    } else {
      if (elNombre) elNombre.textContent = document.getElementById('providerName').value.trim() || 'Prestador de Servicios';
      if (elDoc) elDoc.textContent = document.getElementById('providerDoc').value.trim() || 'S/D';
      if (elTipo) elTipo.textContent = 'Prestador de Servicios Agrícolas';
      if (elLabelDetalle) elLabelDetalle.textContent = 'Silo Contratante:';
      if (elValDetalle) elValDetalle.textContent = document.getElementById('contractClient').value.trim() || 'Silo Contratante';
      if (elSup) elSup.textContent = `${document.getElementById('serviceArea').value || 0} ha`;
      if (elLabelRend) elLabelRend.textContent = 'Tarifa Facturada:';
      if (elValRend) elValRend.textContent = `$ ${document.getElementById('serviceTariff').value || 0} / ha`;
      if (elLabelPrecio) elLabelPrecio.textContent = 'Costo Operacional:';
      if (elValPrecio) elValPrecio.textContent = `$ ${document.getElementById('serviceCost').value || 0} / ha`;
      if (elPer) elPer.textContent = document.getElementById('servicePaymentFrequency').value || 'Zafra Única';
      if (elMargenLabel) elMargenLabel.textContent = 'Margen Operativo del Servicio';
    }

    // c) Demonstrativo de Fluxo de Caixa e Indicadores
    const m = res.metricas;
    const elIng = document.getElementById('printIngresos');
    const elCost = document.getElementById('printCostos');
    const elMarg = document.getElementById('printMargen');
    const elMargPct = document.getElementById('printMargenPct');
    const elComp = document.getElementById('printCompromisosPrevios');
    const elCred = document.getElementById('printCreditoSolicitado');
    const elCarga = document.getElementById('printCargaTotal');
    const elFlujo = document.getElementById('printFlujoNeto');
    const elFlujoRef = document.getElementById('printFlujoNetoRef');
    const elICSD = document.getElementById('printICSD');
    const elICSDRef = document.getElementById('printICSDRef');

    if (elIng) elIng.textContent = formatUSD(m.ingresoBruto);
    if (elCost) elCost.textContent = formatUSD(m.costoTotal);
    if (elMarg) elMarg.textContent = formatUSD(m.margenOperativo);
    if (elMargPct) elMargPct.textContent = `${m.margenOperativoPct.toFixed(1)}% s/ ingresos`;
    if (elComp) elComp.textContent = formatUSD(m.deudasFinancieras);
    if (elCred) elCred.textContent = formatUSD(m.capitalSolicitado);

    // Observación de Amortización bajo Sistema Alemán en el demostrativo de impresión
    const elNota = document.getElementById('printNotaCalculadora');
    const elAnios = document.getElementById('printCalcAnios');
    const elTasa = document.getElementById('printCalcTasa');
    const infoAleman = res.sistemaAlemanInfo || calculadoraAplicada;
    if (elNota && infoAleman) {
      elNota.style.display = 'block';
      if (elAnios) elAnios.textContent = infoAleman.plazoAnios;
      const entidadDesc = infoAleman.entidad ? ` (${infoAleman.entidad})` : '';
      if (elTasa) elTasa.textContent = `${infoAleman.tasaAnual}${infoAleman.frecuencia === 'semestral' ? ' (Semestral)' : ''}${entidadDesc}`;
    } else if (elNota) {
      elNota.style.display = 'none';
    }

    if (elCarga) elCarga.textContent = formatUSD(m.cargaFinancieraTotal);
    if (elFlujo) elFlujo.textContent = formatUSD(m.flujoCajaNeto);

    if (elFlujoRef) {
      if (m.flujoCajaNeto > 0) {
        elFlujoRef.textContent = 'Superávit disponible';
        elFlujoRef.style.color = '#15803d';
      } else if (m.flujoCajaNeto === 0) {
        elFlujoRef.textContent = 'Equilibrio exacto';
        elFlujoRef.style.color = '#b45309';
      } else {
        elFlujoRef.textContent = 'Déficit proyectado';
        elFlujoRef.style.color = '#b91c1c';
      }
    }

    const coberturaStr = m.icsd >= 90 ? '> 10.0x' : `${m.icsd.toFixed(2)}x`;
    if (elICSD) elICSD.textContent = coberturaStr;
    if (elICSDRef) {
      if (m.icsd >= 1.25 && m.flujoCajaNeto > 0) {
        elICSDRef.textContent = 'Solvente (≥ 1.25x)';
        elICSDRef.style.color = '#15803d';
      } else if (m.icsd >= 1.00 && m.flujoCajaNeto >= 0) {
        elICSDRef.textContent = 'Riesgo Moderado (1.00x - 1.24x)';
        elICSDRef.style.color = '#b45309';
      } else {
        elICSDRef.textContent = 'Inviable (< 1.00x)';
        elICSDRef.style.color = '#b91c1c';
      }
    }

    // d) Cronograma de Compromissos Mensais
    const cronBody = document.getElementById('printCronogramaBody');
    const cronFoot = document.getElementById('printCronogramaFoot');
    const elTotalCron = document.getElementById('printTotalCronograma');
    const elEntidades = document.getElementById('printEntidadesTotal');

    if (cronBody) {
      cronBody.innerHTML = '';
      if (!res.cronogramaMensual || res.cronogramaMensual.length === 0) {
        const tr = document.createElement('tr');
        tr.innerHTML = `<td colspan="4" style="text-align: center; color: #64748b; padding: 0.5rem;">
          Sin compromisos financieros previos registrados en el sistema financiero.
        </td>`;
        cronBody.appendChild(tr);
        if (cronFoot) cronFoot.style.display = 'none';
      } else {
        if (cronFoot) cronFoot.style.display = '';
        let totalMonto = 0;
        const todasEntidades = new Set();
        res.cronogramaMensual.forEach(c => {
          totalMonto += c.totalMes;
          c.entidades.forEach(e => todasEntidades.add(e));
          const tr = document.createElement('tr');
          tr.innerHTML = `
            <td style="font-weight: 600;">${c.mes}</td>
            <td style="text-align: right; font-weight: 600;">${formatUSD(c.totalMes)}</td>
            <td style="text-align: center;">${c.porcentajeCompromisos.toFixed(1)}%</td>
            <td style="font-size: 0.72rem; color: #334155;">${c.entidades.join(', ')}</td>
          `;
          cronBody.appendChild(tr);
        });
        if (elTotalCron) elTotalCron.textContent = formatUSD(totalMonto);
        if (elEntidades) elEntidades.textContent = Array.from(todasEntidades).join(', ') || '-';
      }
    }

    // e) Dictamen Oficial y Resolución
    const elBoxVeredicto = document.getElementById('printVeredictoBox');
    const elBadgeVeredicto = document.getElementById('printVeredictoBadge');
    const elSubVeredicto = document.getElementById('printVeredictoSub');

    if (elBadgeVeredicto) elBadgeVeredicto.textContent = `DICTAMEN: ${res.dictamen.toUpperCase()}`;
    if (elSubVeredicto) elSubVeredicto.textContent = res.dictamenSubtitulo;

    if (elBoxVeredicto && elBadgeVeredicto && elSubVeredicto) {
      if (res.dictamen === 'Aprobado') {
        elBoxVeredicto.style.borderColor = '#16a34a';
        elBoxVeredicto.style.backgroundColor = '#f0fdf4';
        elBadgeVeredicto.style.backgroundColor = '#15803d';
        elBadgeVeredicto.style.color = '#ffffff';
        elSubVeredicto.style.color = '#14532d';
      } else if (res.dictamen === 'Riesgo Moderado') {
        elBoxVeredicto.style.borderColor = '#d97706';
        elBoxVeredicto.style.backgroundColor = '#fffbeb';
        elBadgeVeredicto.style.backgroundColor = '#d97706';
        elBadgeVeredicto.style.color = '#ffffff';
        elSubVeredicto.style.color = '#78350f';
      } else {
        elBoxVeredicto.style.borderColor = '#dc2626';
        elBoxVeredicto.style.backgroundColor = '#fef2f2';
        elBadgeVeredicto.style.backgroundColor = '#dc2626';
        elBadgeVeredicto.style.color = '#ffffff';
        elSubVeredicto.style.color = '#7f1d1d';
      }
    }

    // f) Referencias Comerciales en Reporte Impreso
    const elRefBox = document.getElementById('printRefComercialesBox');
    if (elRefBox) {
      const activeRef = (res && res.referenciasComerciales) ? res.referenciasComerciales : (esProductor
        ? (document.getElementById('refComerciales') ? document.getElementById('refComerciales').value.trim() : '')
        : (document.getElementById('serviceRefComerciales') ? document.getElementById('serviceRefComerciales').value.trim() : ''));
      elRefBox.textContent = activeRef || 'Sin referencias comerciales registradas para esta operación.';
    }
  }

  // Sincronización en tiempo real de Referencias Comerciales con el reporte A4
  if (refComerciales) {
    refComerciales.addEventListener('input', () => {
      if (printRefComercialesBox && activeProfile === 'productor') {
        printRefComercialesBox.textContent = refComerciales.value.trim() || 'Sin referencias comerciales registradas para esta operación.';
      }
    });
  }

  if (serviceRefComerciales) {
    serviceRefComerciales.addEventListener('input', () => {
      if (printRefComercialesBox && activeProfile === 'prestador') {
        printRefComercialesBox.textContent = serviceRefComerciales.value.trim() || 'Sin referencias comerciales registradas para esta operación.';
      }
    });
  }

  // Listener del Botón de Impresión
  if (btnImprimir) {
    btnImprimir.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();

      if (!ultimoAnalisis) {
        alert('Por favor, ejecute el análisis antes de imprimir.');
        showToast('Por favor, ejecute el análisis antes de imprimir.');
        return;
      }

      prepararReporteImpresion(ultimoAnalisis);
      window.print();
    });
  }

  // --- GESTOR DE TASAS BANCARIAS PERSISTENTE (LOCALSTORAGE) ---
  const BANCOS_DEFAULT = [
    { id: 'interfisa', nombre: 'Interfisa Banco', tasa: 7.40 },
    { id: 'sudameris', nombre: 'Banco Sudameris', tasa: 7.50 },
    { id: 'atlas', nombre: 'Banco Atlas', tasa: 7.50 },
    { id: 'continental', nombre: 'Banco Continental', tasa: 7.65 },
    { id: 'itau', nombre: 'Banco Itaú', tasa: 7.75 },
    { id: 'basa', nombre: 'Banco Basa', tasa: 7.60 }
  ];
  const STORAGE_KEY_TASAS = 'sac_tasas_bancos_py';
  let bancosList = [];

  function carregarBancos() {
    try {
      const data = localStorage.getItem(STORAGE_KEY_TASAS);
      if (data) {
        const parsed = JSON.parse(data);
        if (Array.isArray(parsed) && parsed.length > 0) {
          bancosList = parsed.map(b => ({
            id: String(b.id || 'banco_' + Math.random().toString(36).substr(2, 9)),
            nombre: String(b.nombre || 'Entidad Financiera'),
            tasa: parseFloat(b.tasa) || 7.50
          }));
          return bancosList;
        }
      }
    } catch (err) {
      console.warn('Error al cargar tasas de localStorage:', err);
    }
    bancosList = BANCOS_DEFAULT.map(b => ({ ...b }));
    salvarBancos(bancosList, false);
    return bancosList;
  }

  function salvarBancos(bancos, sincronizar = true) {
    try {
      localStorage.setItem(STORAGE_KEY_TASAS, JSON.stringify(bancos));
    } catch (err) {
      console.warn('Error al guardar tasas en localStorage:', err);
    }
    bancosList = bancos;
    if (sincronizar) {
      sincronizarSelectBancos();
      renderizarTablaBancos();
    }
  }

  function sincronizarSelectBancos() {
    if (!calcEntidadSelect) return;
    const prevVal = calcEntidadSelect.value;
    calcEntidadSelect.innerHTML = '';

    bancosList.forEach(b => {
      const opt = document.createElement('option');
      opt.value = b.id;
      opt.textContent = `${b.nombre} — ${b.tasa.toFixed(2)}% anual`;
      opt.dataset.tasa = b.tasa;
      opt.dataset.nombre = b.nombre;
      calcEntidadSelect.appendChild(opt);
    });

    const existe = bancosList.some(b => b.id === prevVal);
    if (existe) {
      calcEntidadSelect.value = prevVal;
    } else if (bancosList.length > 0) {
      calcEntidadSelect.value = bancosList[0].id;
    }
  }

  function renderizarTablaBancos() {
    if (!tasasBancosBody) return;
    tasasBancosBody.innerHTML = '';

    if (badgeTotalBancos) {
      badgeTotalBancos.textContent = `${bancosList.length} ${bancosList.length === 1 ? 'entidad activa' : 'entidades activas'}`;
    }

    if (bancosList.length === 0) {
      const tr = document.createElement('tr');
      tr.innerHTML = `<td colspan="3" style="text-align: center; color: var(--text-muted); padding: 1rem;">
        No hay entidades configuradas. Presione "Restablecer Tasas Predeterminadas".
      </td>`;
      tasasBancosBody.appendChild(tr);
      return;
    }

    bancosList.forEach(b => {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td style="font-weight: 600; color: #1e293b;">
          ${b.nombre}
        </td>
        <td class="text-right" style="font-weight: 700; color: #15803d; font-size: 0.9rem;">
          ${b.tasa.toFixed(2)}%
        </td>
        <td class="text-center">
          <div style="display: inline-flex; gap: 0.35rem; justify-content: center;">
            <button type="button" class="btn-table-action edit btn-edit-tasa" data-id="${b.id}" title="Editar tasa de ${b.nombre}">
              ✏️ Editar
            </button>
            <button type="button" class="btn-table-action delete btn-del-tasa" data-id="${b.id}" title="Eliminar ${b.nombre}">
              🗑️ Eliminar
            </button>
          </div>
        </td>
      `;
      tasasBancosBody.appendChild(tr);
    });

    // Event listeners de la tabla
    tasasBancosBody.querySelectorAll('.btn-edit-tasa').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.getAttribute('data-id');
        iniciarEdicionBanco(id);
      });
    });

    tasasBancosBody.querySelectorAll('.btn-del-tasa').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.getAttribute('data-id');
        removerBanco(id);
      });
    });
  }

  function limpiarFormularioBanco() {
    if (inputNombreBanco) inputNombreBanco.value = '';
    if (inputTasaBanco) inputTasaBanco.value = '';
    if (tasaBancoEditId) tasaBancoEditId.value = '';
    if (btnGuardarEntidad) btnGuardarEntidad.textContent = '+ Guardar Entidad';
  }

  function iniciarEdicionBanco(id) {
    const banco = bancosList.find(b => b.id === id);
    if (!banco) return;
    if (inputNombreBanco) inputNombreBanco.value = banco.nombre;
    if (inputTasaBanco) inputTasaBanco.value = banco.tasa;
    if (tasaBancoEditId) tasaBancoEditId.value = banco.id;
    if (btnGuardarEntidad) btnGuardarEntidad.textContent = '💾 Actualizar Entidad';
    if (inputNombreBanco) inputNombreBanco.focus();
  }

  function adicionarBanco(nombre, tasa) {
    const trimmedNombre = (nombre || '').trim();
    const numTasa = parseFloat(tasa);

    if (!trimmedNombre) {
      showToast('Por favor, ingrese el nombre de la entidad financiera');
      if (inputNombreBanco) inputNombreBanco.focus();
      return false;
    }

    if (isNaN(numTasa) || numTasa <= 0 || numTasa > 100) {
      showToast('Por favor, ingrese una tasa anual válida (ej: 7.40)');
      if (inputTasaBanco) inputTasaBanco.focus();
      return false;
    }

    const editId = tasaBancoEditId ? tasaBancoEditId.value.trim() : '';
    if (editId) {
      const idx = bancosList.findIndex(b => b.id === editId);
      if (idx !== -1) {
        bancosList[idx].nombre = trimmedNombre;
        bancosList[idx].tasa = numTasa;
        salvarBancos(bancosList);
        limpiarFormularioBanco();
        showToast(`Entidad "${trimmedNombre}" actualizada (${numTasa.toFixed(2)}%)`);

        // Si la entidad editada está seleccionada actualmente, actualizar tasa y recalcular
        if (calcEntidadSelect && calcEntidadSelect.value === editId && calcTasaInteres) {
          calcTasaInteres.value = numTasa;
          recalcularModalCalculadora();
        }
        return true;
      }
    }

    const slugId = 'banco_' + Date.now();
    bancosList.push({
      id: slugId,
      nombre: trimmedNombre,
      tasa: numTasa
    });

    salvarBancos(bancosList);
    limpiarFormularioBanco();
    showToast(`Entidad "${trimmedNombre}" agregada (${numTasa.toFixed(2)}%)`);

    // Asignar en el select de la calculadora
    if (calcEntidadSelect) {
      calcEntidadSelect.value = slugId;
      if (calcTasaInteres) {
        calcTasaInteres.value = numTasa;
        recalcularModalCalculadora();
      }
    }
    return true;
  }

  function removerBanco(id) {
    if (bancosList.length <= 1) {
      showToast('Debe existir al menos una entidad bancaria configurada');
      return;
    }
    const banco = bancosList.find(b => b.id === id);
    const nombre = banco ? banco.nombre : 'Entidad';
    bancosList = bancosList.filter(b => b.id !== id);
    salvarBancos(bancosList);
    limpiarFormularioBanco();
    showToast(`Entidad "${nombre}" eliminada`);

    if (calcEntidadSelect && calcEntidadSelect.value === id) {
      if (bancosList.length > 0) {
        calcEntidadSelect.value = bancosList[0].id;
        if (calcTasaInteres) {
          calcTasaInteres.value = bancosList[0].tasa;
          recalcularModalCalculadora();
        }
      }
    }
  }

  function resetarBancos() {
    bancosList = BANCOS_DEFAULT.map(b => ({ ...b }));
    salvarBancos(bancosList);
    limpiarFormularioBanco();
    showToast('Tasas bancarias restablecidas a los valores predeterminados');

    if (calcEntidadSelect && bancosList.length > 0) {
      calcEntidadSelect.value = bancosList[0].id;
      if (calcTasaInteres) {
        calcTasaInteres.value = bancosList[0].tasa;
        recalcularModalCalculadora();
      }
    }
  }

  function abrirModalGestorTasas() {
    if (!modalGestorTasas) return;
    limpiarFormularioBanco();
    renderizarTablaBancos();
    modalGestorTasas.style.display = 'flex';
    requestAnimationFrame(() => {
      modalGestorTasas.classList.add('show');
    });
    document.body.style.overflow = 'hidden';
  }

  function cerrarModalGestorTasas() {
    if (!modalGestorTasas) return;
    limpiarFormularioBanco();
    modalGestorTasas.classList.remove('show');
    setTimeout(() => {
      modalGestorTasas.style.display = 'none';
      if (!modalCalculadora || !modalCalculadora.classList.contains('show')) {
        document.body.style.overflow = '';
      }
    }, 250);
  }

  // --- CALCULADORA FINANCIERA (SISTEMA ALEMÁN) ---
  function abrirModalCalculadora() {
    if (!modalCalculadora) return;

    let capitalActual = 110000;
    if (activeProfile === 'productor') {
      const val = parseFloat(document.getElementById('requestedCapital')?.value);
      if (!isNaN(val) && val > 0) capitalActual = val;
    } else {
      const val = parseFloat(document.getElementById('serviceRequestedCapital')?.value);
      if (!isNaN(val) && val > 0) capitalActual = val;
    }

    if (calculadoraAplicada) {
      if (calcCapital) calcCapital.value = calculadoraAplicada.capital;
      if (calcTasaInteres) calcTasaInteres.value = calculadoraAplicada.tasaAnual;
      if (calcPlazoAnios) calcPlazoAnios.value = Math.min(6, calculadoraAplicada.plazoAnios);
      if (calcFrecuencia) calcFrecuencia.value = calculadoraAplicada.frecuencia || 'anual';
      if (calcEsquemaSemestral) calcEsquemaSemestral.value = calculadoraAplicada.esquemaSemestral || 'zafra_interes_primero';

      // Sincronizar select con banco asociado
      if (calcEntidadSelect) {
        const bancoEncontrado = bancosList.find(b => 
          b.id === calculadoraAplicada.bancoId || 
          b.nombre.toLowerCase() === (calculadoraAplicada.entidad || '').toLowerCase()
        );
        if (bancoEncontrado) {
          calcEntidadSelect.value = bancoEncontrado.id;
        } else if (bancosList.length > 0) {
          calcEntidadSelect.value = bancosList[0].id;
        }
      }
    } else {
      if (calcCapital) calcCapital.value = capitalActual;
      if (calcPlazoAnios) calcPlazoAnios.value = 5;
      if (calcFrecuencia) calcFrecuencia.value = 'anual';
      if (calcEsquemaSemestral) calcEsquemaSemestral.value = 'zafra_interes_primero';

      // Asignar primer banco registrado por defecto y cargar su tasa preferencial
      if (calcEntidadSelect && bancosList.length > 0) {
        calcEntidadSelect.value = bancosList[0].id;
        if (calcTasaInteres) calcTasaInteres.value = bancosList[0].tasa;
      } else {
        if (calcTasaInteres) calcTasaInteres.value = 7.40;
      }
    }

    if (groupEsquemaSemestral) {
      groupEsquemaSemestral.style.display = (calcFrecuencia && calcFrecuencia.value === 'semestral') ? 'flex' : 'none';
    }

    recalcularModalCalculadora();

    modalCalculadora.style.display = 'flex';
    requestAnimationFrame(() => {
      modalCalculadora.classList.add('show');
    });
    document.body.style.overflow = 'hidden';
  }

  function cerrarModalCalculadora() {
    if (!modalCalculadora) return;
    modalCalculadora.classList.remove('show');
    setTimeout(() => {
      modalCalculadora.style.display = 'none';
      if (!modalGestorTasas || !modalGestorTasas.classList.contains('show')) {
        document.body.style.overflow = '';
      }
    }, 250);
  }

  function recalcularModalCalculadora() {
    if (!calcCapital || !calcTasaInteres || !calcPlazoAnios) return;

    const capital = Math.max(0, parseFloat(calcCapital.value) || 0);
    const tasa = Math.max(0, parseFloat(calcTasaInteres.value) || 0);
    const plazo = Math.max(1, Math.min(6, parseInt(calcPlazoAnios.value, 10) || 1));
    const frecuencia = calcFrecuencia ? calcFrecuencia.value : 'anual';
    const esquema = calcEsquemaSemestral ? calcEsquemaSemestral.value : 'zafra_interes_primero';

    // 1% Gasto Administrativo calculado automáticamente [Capital * 0.01]
    const gastoAdmin = capital * 0.01;
    if (calcGastoAdmin) {
      calcGastoAdmin.value = formatUSD(gastoAdmin);
    }

    if (typeof CreditEngine === 'undefined' || !CreditEngine.calcularSistemaAleman) {
      return;
    }

    const res = CreditEngine.calcularSistemaAleman(capital, tasa, plazo, frecuencia, esquema);
    ultimoResultadoAleman = res;

    // Actualización de títulos de columna
    if (thColPeriodo) {
      thColPeriodo.textContent = (frecuencia === 'semestral') ? 'Período (Semestre)' : 'Año';
    }
    if (thColCuota) {
      thColCuota.textContent = (frecuencia === 'semestral') ? 'Cuota Semestral' : 'Cuota Anual';
    }

    // Actualización del badge del cronograma
    if (calcTableBadge) {
      if (frecuencia === 'semestral') {
        const semRef = esquema === 'zafra_interes_primero' ? '2 (Cap + Int)' : '1';
        calcTableBadge.innerHTML = `Mayor Cuota Año 1: <strong>${formatUSD(res.cuotaMayorAnio1)}</strong> (Exigibilidad Semestre ${semRef})`;
      } else {
        calcTableBadge.innerHTML = `Amortización Constante • Cuota Año 1: <strong>${formatUSD(res.cuotaAnio1)}</strong>`;
      }
    }

    // Renderizado del cronograma
    if (calcCronogramaBody) {
      calcCronogramaBody.innerHTML = '';
      if (!res.cronograma || res.cronograma.length === 0) {
        const tr = document.createElement('tr');
        tr.innerHTML = `<td colspan="7" style="text-align: center; color: var(--text-muted); padding: 1rem;">
          Ingrese un monto de capital válido para generar el cronograma.
        </td>`;
        calcCronogramaBody.appendChild(tr);
      } else {
        res.cronograma.forEach(c => {
          const isMayorCuotaAnio1 = (c.anio === 1 && c.cuota === res.cuotaMayorAnio1);
          const tr = document.createElement('tr');
          if (isMayorCuotaAnio1) {
            tr.className = 'row-destacada';
          }
          tr.innerHTML = `
            <td style="font-weight: 700;">
              ${c.label}
              ${isMayorCuotaAnio1 ? '<span class="badge-exigibilidad" title="Mayor cuota del primer año para referencia de exigibilidad">★ Mayor Cuota Año 1</span>' : ''}
            </td>
            <td class="text-right">${formatUSD(c.saldoInicial)}</td>
            <td class="text-right">${formatUSD(c.amortizacion)}</td>
            <td class="text-right">${formatUSD(c.interes)}</td>
            <td class="text-right">${formatUSD(c.iva)}</td>
            <td class="text-right highlight-col">${formatUSD(c.cuota)}</td>
            <td class="text-right">${formatUSD(c.saldoFinal)}</td>
          `;
          calcCronogramaBody.appendChild(tr);
        });
      }
    }

    // Actualización de KPIs del Resumen Financiero
    if (calcKpiIntereses) calcKpiIntereses.textContent = formatUSD(res.totalIntereses);
    if (calcKpiGastoAdmin) calcKpiGastoAdmin.textContent = formatUSD(res.gastoAdmin);
    if (calcKpiCostoTotal) calcKpiCostoTotal.textContent = formatUSD(res.costoFinancieroTotal);
    if (calcKpiTotalPagado) calcKpiTotalPagado.textContent = formatUSD(res.totalPagado);
  }

  function aplicarCuotaAlAnalisis() {
    if (!ultimoResultadoAleman || ultimoResultadoAleman.capital <= 0) {
      showToast('Ingrese un monto de capital válido');
      return;
    }

    const cuotaTransferir = Math.round(ultimoResultadoAleman.cuotaMayorAnio1 || ultimoResultadoAleman.cuotaAnio1);

    let bancoId = '';
    let entidadBancaria = '';
    if (calcEntidadSelect) {
      const b = bancosList.find(item => item.id === calcEntidadSelect.value);
      if (b) {
        bancoId = b.id;
        entidadBancaria = b.nombre;
      } else {
        entidadBancaria = calcEntidadSelect.value;
      }
    }

    calculadoraAplicada = {
      capital: ultimoResultadoAleman.capital,
      tasaAnual: ultimoResultadoAleman.tasaAnual,
      plazoAnios: ultimoResultadoAleman.plazoAnios,
      frecuencia: ultimoResultadoAleman.frecuencia,
      esquemaSemestral: ultimoResultadoAleman.esquemaSemestral,
      cuotaAnio1: cuotaTransferir,
      cuotaMayorAnio1: ultimoResultadoAleman.cuotaMayorAnio1,
      totalCuotasAnio1: ultimoResultadoAleman.totalCuotasAnio1,
      gastoAdmin: ultimoResultadoAleman.gastoAdmin,
      bancoId: bancoId,
      entidad: entidadBancaria
    };

    const freqDesc = ultimoResultadoAleman.frecuencia === 'semestral' ? ' (Semestral)' : '';
    const entidadDesc = entidadBancaria ? ` (${entidadBancaria})` : '';

    if (activeProfile === 'productor') {
      const inputCredito = document.getElementById('requestedCapital');
      if (inputCredito) inputCredito.value = cuotaTransferir;
      if (badgeCalcAnios) badgeCalcAnios.textContent = ultimoResultadoAleman.plazoAnios;
      if (badgeCalcTasa) badgeCalcTasa.textContent = `${ultimoResultadoAleman.tasaAnual}${freqDesc}${entidadDesc}`;
      if (calcAplicadaBadge) calcAplicadaBadge.style.display = 'flex';
      if (calcAplicadaBadgePrestador) calcAplicadaBadgePrestador.style.display = 'none';
    } else {
      const inputCredito = document.getElementById('serviceRequestedCapital');
      if (inputCredito) inputCredito.value = cuotaTransferir;
      if (badgeCalcAniosPrestador) badgeCalcAniosPrestador.textContent = ultimoResultadoAleman.plazoAnios;
      if (badgeCalcTasaPrestador) badgeCalcTasaPrestador.textContent = `${ultimoResultadoAleman.tasaAnual}${freqDesc}${entidadDesc}`;
      if (calcAplicadaBadgePrestador) calcAplicadaBadgePrestador.style.display = 'flex';
      if (calcAplicadaBadge) calcAplicadaBadge.style.display = 'none';
    }

    cerrarModalCalculadora();
    executeAnalysis();
    showToast(`¡Cuota Año 1 (${formatUSD(cuotaTransferir)}) aplicada al análisis!`);
  }

  // Listeners de la Calculadora y Gestor de Tasas
  if (btnAbrirCalculadoraTop) {
    btnAbrirCalculadoraTop.addEventListener('click', (e) => {
      e.preventDefault();
      abrirModalCalculadora();
    });
  }

  if (btnAbrirCalculadora) {
    btnAbrirCalculadora.addEventListener('click', (e) => {
      e.preventDefault();
      abrirModalCalculadora();
    });
  }

  if (btnAbrirCalculadoraPrestador) {
    btnAbrirCalculadoraPrestador.addEventListener('click', (e) => {
      e.preventDefault();
      abrirModalCalculadora();
    });
  }

  if (btnCerrarModalX) {
    btnCerrarModalX.addEventListener('click', (e) => {
      e.preventDefault();
      cerrarModalCalculadora();
    });
  }

  if (btnCerrarCalculadora) {
    btnCerrarCalculadora.addEventListener('click', (e) => {
      e.preventDefault();
      cerrarModalCalculadora();
    });
  }

  if (btnAplicarCalculadora) {
    btnAplicarCalculadora.addEventListener('click', (e) => {
      e.preventDefault();
      aplicarCuotaAlAnalisis();
    });
  }

  if (modalCalculadora) {
    modalCalculadora.addEventListener('click', (e) => {
      if (e.target === modalCalculadora) {
        cerrarModalCalculadora();
      }
    });
  }

  // Selección de Entidad Bancaria: actualiza automáticamente la tasa anual y recalcula
  if (calcEntidadSelect) {
    calcEntidadSelect.addEventListener('change', () => {
      const selected = bancosList.find(b => b.id === calcEntidadSelect.value);
      if (selected && calcTasaInteres) {
        calcTasaInteres.value = selected.tasa;
        recalcularModalCalculadora();
      }
    });
  }

  // Botón para abrir el Gestor de Tasas desde la calculadora
  if (btnGestionarTasas) {
    btnGestionarTasas.addEventListener('click', (e) => {
      e.preventDefault();
      abrirModalGestorTasas();
    });
  }

  // Controles del Modal Gestor de Tasas
  if (btnCerrarTasasX) {
    btnCerrarTasasX.addEventListener('click', (e) => {
      e.preventDefault();
      cerrarModalGestorTasas();
    });
  }

  if (btnCerrarTasas) {
    btnCerrarTasas.addEventListener('click', (e) => {
      e.preventDefault();
      cerrarModalGestorTasas();
    });
  }

  if (modalGestorTasas) {
    modalGestorTasas.addEventListener('click', (e) => {
      if (e.target === modalGestorTasas) {
        cerrarModalGestorTasas();
      }
    });
  }

  if (btnGuardarEntidad) {
    btnGuardarEntidad.addEventListener('click', (e) => {
      e.preventDefault();
      const nombre = inputNombreBanco ? inputNombreBanco.value : '';
      const tasa = inputTasaBanco ? inputTasaBanco.value : '';
      adicionarBanco(nombre, tasa);
    });
  }

  if (inputNombreBanco) {
    inputNombreBanco.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        if (inputTasaBanco) inputTasaBanco.focus();
      }
    });
  }

  if (inputTasaBanco) {
    inputTasaBanco.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        if (btnGuardarEntidad) btnGuardarEntidad.click();
      }
    });
  }

  if (btnResetTasas) {
    btnResetTasas.addEventListener('click', (e) => {
      e.preventDefault();
      if (confirm('¿Desea restablecer todas las entidades y tasas a los valores estándar de Paraguay?')) {
        resetarBancos();
      }
    });
  }

  // Teclado: Escape cierra modales en orden de superposición
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      if (modalGestorTasas && modalGestorTasas.classList.contains('show')) {
        cerrarModalGestorTasas();
        return;
      }
      if (modalCalculadora && modalCalculadora.classList.contains('show')) {
        cerrarModalCalculadora();
      }
    }
  });

  if (calcCapital) calcCapital.addEventListener('input', recalcularModalCalculadora);
  if (calcTasaInteres) calcTasaInteres.addEventListener('input', recalcularModalCalculadora);
  if (calcPlazoAnios) calcPlazoAnios.addEventListener('change', recalcularModalCalculadora);
  if (calcFrecuencia) {
    calcFrecuencia.addEventListener('change', () => {
      if (groupEsquemaSemestral) {
        groupEsquemaSemestral.style.display = calcFrecuencia.value === 'semestral' ? 'flex' : 'none';
      }
      recalcularModalCalculadora();
    });
  }
  if (calcEsquemaSemestral) calcEsquemaSemestral.addEventListener('change', recalcularModalCalculadora);

  // Reset de la observación si el usuario modifica el campo principal manualmente
  const reqCapInput = document.getElementById('requestedCapital');
  if (reqCapInput) {
    reqCapInput.addEventListener('input', () => {
      if (calculadoraAplicada && Math.round(Number(reqCapInput.value)) !== calculadoraAplicada.cuotaAnio1) {
        calculadoraAplicada = null;
        if (calcAplicadaBadge) calcAplicadaBadge.style.display = 'none';
      }
    });
  }

  const servCapInput = document.getElementById('serviceRequestedCapital');
  if (servCapInput) {
    servCapInput.addEventListener('input', () => {
      if (calculadoraAplicada && Math.round(Number(servCapInput.value)) !== calculadoraAplicada.cuotaAnio1) {
        calculadoraAplicada = null;
        if (calcAplicadaBadgePrestador) calcAplicadaBadgePrestador.style.display = 'none';
      }
    });
  }

  // Inicialización
  carregarBancos();
  sincronizarSelectBancos();
  resetCommitments([
    { entidad: 'Banco Sudameris', mes: 'Mayo', monto: 15000 },
    { entidad: 'Banco Atlas', mes: 'Agosto', monto: 10000 }
  ]);
  setActiveProfile('productor');
});
