/**
 * Sistema de Análisis de Crédito Rural - Motor de Evaluación de Riesgo y Dictamen
 * Versión: 0.1.1 - Localización Integral al Español
 */

(function (global) {
  'use strict';

  // Ponderaciones de liquidez y realización por tipo de garantía
  const GUARANTEE_WEIGHTS = {
    HIPOTECA: 1.0,         // Hipoteca de Inmueble Rural
    PRENDA_COSECHA: 0.80,  // Prenda Agrícola / Warrant de Cosecha
    MAQUINARIA: 0.70,      // Prenda sobre Maquinaria y Equipos
    AVAL: 0.50             // Fianza personal o solidaria
  };

  /**
   * Calcula el servicio de la deuda del crédito solicitado según monto, tasa, plazo y periodicidad.
   */
  function calculateDebtService(capital, annualInterestRatePct, termMonths, frequency) {
    const rate = (annualInterestRatePct || 0) / 100;
    const termYears = termMonths / 12;

    if (capital <= 0 || termMonths <= 0) {
      return { totalAnnualService: 0, installmentAmount: 0, numberOfInstallments: 1 };
    }

    if (frequency === 'ZAFRA_UNICA') {
      // Un solo pago al final del ciclo agrícola (capital + interés acumulado simple del periodo)
      const interest = capital * rate * termYears;
      const totalDue = capital + interest;
      const annualEquivalent = termYears > 0 ? totalDue / termYears : totalDue;
      return {
        totalAnnualService: annualEquivalent,
        installmentAmount: totalDue,
        numberOfInstallments: 1
      };
    }

    if (frequency === 'SEMESTRAL') {
      const periods = Math.max(1, Math.round(termMonths / 6));
      const semiRate = rate / 2;
      let installment = 0;
      if (semiRate > 0) {
        installment = (capital * semiRate) / (1 - Math.pow(1 + semiRate, -periods));
      } else {
        installment = capital / periods;
      }
      const annualEquivalent = installment * Math.min(periods, 2);
      return {
        totalAnnualService: annualEquivalent,
        installmentAmount: installment,
        numberOfInstallments: periods
      };
    }

    // Mensual
    const monthlyRate = rate / 12;
    let installment = 0;
    if (monthlyRate > 0) {
      installment = (capital * monthlyRate) / (1 - Math.pow(1 + monthlyRate, -termMonths));
    } else {
      installment = capital / termMonths;
    }
    const annualEquivalent = installment * Math.min(termMonths, 12);
    return {
      totalAnnualService: annualEquivalent,
      installmentAmount: installment,
      numberOfInstallments: termMonths
    };
  }

  /**
   * Ejecuta el análisis técnico y financiero de la solicitud de crédito agrícola.
   * @param {Object} input - Datos del formulario
   * @returns {Object} Dictamen, métricas y texto formal del informe
   */
  function evaluateCredit(input) {
    const area = Math.max(0, Number(input.areaHectares) || 0);
    const yieldEst = Math.max(0, Number(input.estimatedYield) || 0);
    const price = Math.max(0, Number(input.marketPrice) || 0);
    const costHa = Math.max(0, Number(input.costPerHectare) || 0);
    const capital = Math.max(0, Number(input.requestedCapital) || 0);
    const termMonths = Math.max(1, Number(input.loanTermMonths) || 12);
    const interestRate = Math.max(0, Number(input.interestRate) || 0);
    const existingDebts = Math.max(0, Number(input.existingDebts) || 0);
    const guaranteeVal = Math.max(0, Number(input.guaranteeValue) || 0);
    const guaranteeType = input.guaranteeType || 'HIPOTECA';
    const frequency = input.paymentFrequency || 'ZAFRA_UNICA';
    const producerName = input.producerName || 'Productor Agrícola';
    const documentNumber = input.documentNumber || 'S/D';
    const cropType = input.cropType || 'SOJA';

    const reasons = [];

    // 1. Proyecciones Económicas Básicas
    const grossIncome = area * yieldEst * price;
    const totalOperatingCost = area * costHa;
    const grossOperatingMargin = grossIncome - totalOperatingCost;
    const marginPct = grossIncome > 0 ? (grossOperatingMargin / grossIncome) * 100 : 0;
    const productionVolumeTons = area * yieldEst;

    // 2. Servicio de la Deuda
    const newDebtCalc = calculateDebtService(capital, interestRate, termMonths, frequency);
    // Estimación del servicio anual de deudas preexistentes (asumiendo plazo promedio a 2 años con tasa estándar)
    const existingAnnualService = existingDebts > 0 ? existingDebts * 0.45 : 0;
    const totalAnnualDebtService = newDebtCalc.totalAnnualService + existingAnnualService;

    // 3. Índice de Cobertura del Servicio de la Deuda (ICSD)
    let icsd = 0;
    if (totalAnnualDebtService > 0) {
      icsd = grossOperatingMargin / totalAnnualDebtService;
    } else if (grossOperatingMargin > 0) {
      icsd = 99.0;
    }

    // 4. Cobertura de Garantías
    const guaranteeWeight = GUARANTEE_WEIGHTS[guaranteeType] || 0.7;
    const adjustedGuaranteeVal = guaranteeVal * guaranteeWeight;
    const collateralCoverage = capital > 0 ? (guaranteeVal / capital) * 100 : 0;
    const adjustedCollateralCoverage = capital > 0 ? (adjustedGuaranteeVal / capital) * 100 : 0;

    // 5. Límite de Crédito Recomendado
    // Basado en hasta el 65% del margen operativo disponible para el servicio de nueva deuda
    const maxAvailableService = Math.max(0, (grossOperatingMargin * 0.65) - existingAnnualService);
    let recommendedLimit = 0;
    if (maxAvailableService > 0) {
      const termYears = termMonths / 12;
      const rate = interestRate / 100;
      if (frequency === 'ZAFRA_UNICA') {
        recommendedLimit = (maxAvailableService * termYears) / (1 + (rate * termYears));
      } else {
        recommendedLimit = maxAvailableService / (rate + (1 / termYears));
      }
    }
    // Cap por valor de garantía ponderada
    if (guaranteeVal > 0) {
      recommendedLimit = Math.min(recommendedLimit, adjustedGuaranteeVal * 1.15);
    }
    recommendedLimit = Math.max(0, Math.round(recommendedLimit / 1000) * 1000);

    // 6. Evaluación de Criterios y Factores
    // Factor Margen
    if (grossOperatingMargin <= 0) {
      reasons.push({
        type: 'danger',
        text: `Margen operativo negativo (-$ ${Math.abs(grossOperatingMargin).toLocaleString('es-ES')}). Los costos de producción superan los ingresos proyectados.`
      });
    } else if (marginPct >= 30) {
      reasons.push({
        type: 'success',
        text: `Margen operativo robusto (${marginPct.toFixed(1)}%). La actividad agrícola proyecta excelente rentabilidad neta por hectárea.`
      });
    } else if (marginPct >= 15) {
      reasons.push({
        type: 'warning',
        text: `Margen operativo moderado (${marginPct.toFixed(1)}%). Vulnerable ante eventuales variaciones de precio o clima.`
      });
    } else {
      reasons.push({
        type: 'danger',
        text: `Margen operativo muy estrecho (${marginPct.toFixed(1)}%). Escasa absorción de contingencias operativas.`
      });
    }

    // Factor ICSD
    if (icsd >= 1.30) {
      reasons.push({
        type: 'success',
        text: `ICSD de ${icsd.toFixed(2)}x: Cobertura sólida y holgada del servicio de la deuda (excede el umbral prudencial de 1.30x).`
      });
    } else if (icsd >= 1.05) {
      reasons.push({
        type: 'warning',
        text: `ICSD ajustado de ${icsd.toFixed(2)}x: El flujo operativo cubre la deuda pero con poco margen de seguridad frente a caídas de rendimiento.`
      });
    } else {
      reasons.push({
        type: 'danger',
        text: `ICSD crítico de ${icsd.toFixed(2)}x: El flujo de caja es insuficiente para cumplir con las amortizaciones e intereses previstos.`
      });
    }

    // Factor Garantías
    if (collateralCoverage >= 130) {
      reasons.push({
        type: 'success',
        text: `Garantía con cobertura amplia (${collateralCoverage.toFixed(0)}% nominal / ${adjustedCollateralCoverage.toFixed(0)}% ajustada por liquidez).`
      });
    } else if (collateralCoverage >= 100) {
      reasons.push({
        type: 'success',
        text: `Garantía suficiente (${collateralCoverage.toFixed(0)}% nominal) para respaldar el capital solicitado.`
      });
    } else if (collateralCoverage >= 75) {
      reasons.push({
        type: 'warning',
        text: `Garantía parcial (${collateralCoverage.toFixed(0)}% nominal). Se sugiere reforzar con prenda agrícola o fianza complementaria.`
      });
    } else {
      reasons.push({
        type: 'danger',
        text: `Garantía deficiente (${collateralCoverage.toFixed(0)}% nominal). Incumple los aforos mínimos requeridos para la operación.`
      });
    }

    // 7. Determinación del Dictamen Final
    // Estados requeridos: "Aprobado", "Riesgo Moderado", "Inviable"
    let status = 'Aprobado';
    let statusSubtitle = 'La operación reúne las condiciones técnico-agronómicas y de capacidad de pago para su aprobación.';

    if (grossOperatingMargin <= 0 || icsd < 1.05 || (collateralCoverage < 75 && capital > 50000)) {
      status = 'Inviable';
      statusSubtitle = 'La operación presenta un perfil de riesgo inaceptable o capacidad de repago insuficiente.';
    } else if (icsd < 1.30 || collateralCoverage < 100 || marginPct < 20 || capital > (recommendedLimit * 1.15)) {
      status = 'Riesgo Moderado';
      statusSubtitle = 'Viabilidad condicionada a mitigantes de riesgo, refuerzo de garantías o readecuación del monto.';
    }

    // 8. Generación del Dictamen Formal en Texto Técnico
    const dictamenFormal = generateFormalDictamen({
      producerName,
      documentNumber,
      cropType,
      area,
      yieldEst,
      price,
      productionVolumeTons,
      grossIncome,
      costHa,
      totalOperatingCost,
      grossOperatingMargin,
      marginPct,
      capital,
      termMonths,
      frequency,
      interestRate,
      existingDebts,
      guaranteeType,
      guaranteeVal,
      collateralCoverage,
      totalAnnualDebtService,
      icsd,
      status,
      recommendedLimit
    });

    return {
      status,
      statusSubtitle,
      metrics: {
        grossIncome,
        totalOperatingCost,
        grossOperatingMargin,
        marginPct,
        totalAnnualDebtService,
        icsd,
        collateralCoverage,
        recommendedLimit,
        productionVolumeTons
      },
      reasons,
      dictamenFormal
    };
  }

  /**
   * Genera el texto formal del dictamen de crédito para el comité de riesgos.
   */
  function generateFormalDictamen(d) {
    const fmt = (num) => '$ ' + Math.round(num).toLocaleString('es-ES');
    const freqLabels = {
      ZAFRA_UNICA: 'Zafra Única (al vencimiento de cosecha)',
      SEMESTRAL: 'Amortización Semestral',
      MENSUAL: 'Amortización Mensual'
    };
    const guaranteeLabels = {
      HIPOTECA: 'Hipoteca de Inmueble Rural',
      PRENDA_COSECHA: 'Prenda Agrícola / Warrant de Cosecha',
      MAQUINARIA: 'Prenda sobre Maquinaria y Equipos',
      AVAL: 'Aval / Fianza Solidaria'
    };

    const dateStr = new Date().toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });

    return `======================================================================
DICTAMEN TÉCNICO DE CRÉDITO AGROPECUARIO - COMITÉ DE RIESGO
Fecha de Emisión: ${dateStr}
Estado del Dictamen: ${d.status.toUpperCase()}
======================================================================

1. IDENTIFICACIÓN DE LA OPERACIÓN
----------------------------------------------------------------------
• Productor / Titular     : ${d.producerName}
• Identificación Fiscal   : ${d.documentNumber}
• Actividad Productiva    : Cultivo de ${d.cropType}
• Superficie Bajo Riego/Secano: ${d.area.toLocaleString('es-ES')} hectáreas
• Volumen Físico Estimado : ${d.productionVolumeTons.toLocaleString('es-ES')} toneladas

2. PARÁMETROS ECONÓMICO-PRODUCTIVOS PROYECTADOS
----------------------------------------------------------------------
• Rendimiento Esperado    : ${d.yieldEst.toFixed(2)} t/ha
• Precio de Mercado Base  : $ ${d.price.toLocaleString('es-ES')}/t
• Ingreso Bruto Proyectado: ${fmt(d.grossIncome)}
• Costo Directo por Ha    : $ ${d.costHa.toLocaleString('es-ES')}/ha
• Costo Operacional Total : ${fmt(d.totalOperatingCost)}
• Margen Operativo Bruto  : ${fmt(d.grossOperatingMargin)} (Margen: ${d.marginPct.toFixed(1)}%)

3. ESTRUCTURA FINANCIERA Y CAPACIDAD DE PAGO
----------------------------------------------------------------------
• Capital Solicitado      : ${fmt(d.capital)}
• Plazo y Modalidad       : ${d.termMonths} meses | ${freqLabels[d.frequency] || d.frequency}
• Tasa de Interés Pactada : ${d.interestRate.toFixed(2)}% anual
• Deuda Financiera Previa : ${fmt(d.existingDebts)}
• Servicio Anual de Deuda : ${fmt(d.totalAnnualDebtService)}
• Cobertura de Deuda (ICSD): ${d.icsd >= 90 ? '> 10.0x' : d.icsd.toFixed(2) + 'x'} (Mínimo recomendado: 1.30x)
• Límite Recomendado      : ${fmt(d.recommendedLimit)}

4. ESQUEMA DE GARANTÍAS
----------------------------------------------------------------------
• Garantía Propuesta      : ${guaranteeLabels[d.guaranteeType] || d.guaranteeType}
• Tasación Estimada       : ${fmt(d.guaranteeVal)}
• Ratio Cobertura/Capital : ${d.collateralCoverage.toFixed(0)}%

5. CONCLUSIÓN Y RECOMENDACIÓN DEL ANALISTA
----------------------------------------------------------------------
DICTAMEN FINAL: [ ${d.status.toUpperCase()} ]

${d.status === 'Aprobado' 
  ? 'Se recomienda la aprobación de la línea solicitada en las condiciones presentadas. El flujo proyectado demuestra capacidad suficiente de absorción del servicio de deuda y las garantías aportadas resguardan adecuadamente el crédito.'
  : d.status === 'Riesgo Moderado'
  ? 'Se recomienda elevar la propuesta con condicionamientos: constituir garantía real complementaria y/o ajustar el desembolso a hitos de siembra y labores culturales para mitigar el riesgo de flujo.'
  : 'Se desestima la solicitud en las condiciones actuales. El flujo operacional proyectado es insuficiente para afrontar el esquema de amortización, existiendo alto riesgo de cesación de pagos.'}
======================================================================`;
  }

  // Exportación para Node o Navegador
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = { evaluateCredit, calculateDebtService };
  } else {
    global.CreditEngine = { evaluateCredit, calculateDebtService };
  }
})(typeof window !== 'undefined' ? window : this);
