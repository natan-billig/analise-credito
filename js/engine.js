/**
 * Sistema de Análisis de Crédito Rural - Motor de Flujo de Caja y Riesgo Agropecuario
 * Versión: 0.2.0 - Modelo de Flujo de Caja Agrícola con Compromisos Financieros en USD
 */

(function (global) {
  'use strict';

  /**
   * Realiza el análisis técnico y financiero del productor agrícola según el modelo de flujo de caja en USD.
   * 
   * Fórmulas exactas del modelo:
   *  - ingresoBruto = hectareas * rendimientoPorHa * precioPorTon
   *  - costoTotal = hectareas * costoPorHa
   *  - margenOperativo = ingresoBruto - costoTotal
   *  - cargaFinancieraTotal = deudasFinancieras + capitalSolicitado
   *  - flujoCajaNeto = margenOperativo - cargaFinancieraTotal
   *  - cobertura = cargaFinancieraTotal > 0 ? (margenOperativo / cargaFinancieraTotal) : (margenOperativo > 0 ? 99 : 0)
   * 
   * Reglas de corte:
   *  - Aprobado: flujoCajaNeto > 0 && cobertura >= 1.25
   *  - Riesgo Moderado: flujoCajaNeto >= 0 && cobertura >= 1.00 && cobertura < 1.25
   *  - Inviable: flujoCajaNeto < 0 (o cobertura < 1.00)
   * 
   * @param {Object} input - Datos del productor y la solicitud
   * @returns {Object} Resultados con métricas, dictamen oficial y texto formal del dictamen
   */
  function analisarProductor(input) {
    const hectareas = Math.max(0, Number(input.hectareas ?? input.areaHectares) || 0);
    const rendimientoPorHa = Math.max(0, Number(input.rendimientoPorHa ?? input.estimatedYield) || 0);
    const precioPorTon = Math.max(0, Number(input.precioPorTon ?? input.marketPrice) || 0);
    const costoPorHa = Math.max(0, Number(input.costoPorHa ?? input.costPerHectare) || 0);
    const deudasFinancieras = Math.max(0, Number(input.deudasFinancieras ?? input.deudas_financieras ?? input.existingDebts) || 0);
    const capitalSolicitado = Math.max(0, Number(input.capitalSolicitado ?? input.requestedCapital) || 0);

    const nombreProductor = (input.nombreProductor || input.producerName || 'Productor Agrícola').trim();
    const identificacionFiscal = (input.identificacionFiscal || input.documentNumber || 'S/D').trim();
    const cultivo = (input.cultivo || input.cropType || 'Soja').trim();
    const periodicidad = (input.periodicidad || input.paymentFrequency || 'Zafra Única').trim();

    // 1. Cálculos de Producción y Costos
    const ingresoBruto = hectareas * rendimientoPorHa * precioPorTon;
    const costoTotal = hectareas * costoPorHa;
    const margenOperativo = ingresoBruto - costoTotal;
    const margenOperativoPct = ingresoBruto > 0 ? (margenOperativo / ingresoBruto) * 100 : 0;
    const produccionTotalTon = hectareas * rendimientoPorHa;

    // 2. Cálculos de Carga Financiera y Flujo de Caja
    const cargaFinancieraTotal = deudasFinancieras + capitalSolicitado;
    const flujoCajaNeto = margenOperativo - cargaFinancieraTotal;
    const cobertura = cargaFinancieraTotal > 0 ? (margenOperativo / cargaFinancieraTotal) : (margenOperativo > 0 ? 99 : 0);

    // 3. Reglas de Corte Oficiales
    let dictamen = 'Aprobado';
    let dictamenSubtitulo = '';

    if (flujoCajaNeto < 0) {
      dictamen = 'Inviable';
      dictamenSubtitulo = 'Flujo de caja libre deficitario. El margen operativo proyectado no cubre los compromisos financieros totales.';
    } else if (flujoCajaNeto >= 0 && cobertura >= 1.00 && cobertura < 1.25) {
      dictamen = 'Riesgo Moderado';
      dictamenSubtitulo = 'Capacidad de pago ajustada. Cobertura entre 1.00x y 1.25x con baja holgura frente a mermas de rinde o precio.';
    } else if (flujoCajaNeto > 0 && cobertura >= 1.25) {
      dictamen = 'Aprobado';
      dictamenSubtitulo = 'Operación viable y solvente. El margen operativo cubre holgadamente la carga financiera total con cobertura ≥ 1.25x.';
    } else {
      dictamen = 'Inviable';
      dictamenSubtitulo = 'Cobertura de deuda insuficiente para los parámetros crediticios mínimos.';
    }

    // 4. Generación de Texto Formal para Comité
    const dictamenFormal = generarDictamenFormal({
      nombreProductor,
      identificacionFiscal,
      cultivo,
      hectareas,
      rendimientoPorHa,
      precioPorTon,
      produccionTotalTon,
      costoPorHa,
      ingresoBruto,
      costoTotal,
      margenOperativo,
      margenOperativoPct,
      deudasFinancieras,
      capitalSolicitado,
      cargaFinancieraTotal,
      flujoCajaNeto,
      cobertura,
      periodicidad,
      dictamen,
      dictamenSubtitulo
    });

    return {
      dictamen,
      dictamenSubtitulo,
      metricas: {
        ingresoBruto,
        costoTotal,
        margenOperativo,
        margenOperativoPct,
        cargaFinancieraTotal,
        flujoCajaNeto,
        cobertura,
        deudasFinancieras,
        capitalSolicitado,
        produccionTotalTon
      },
      dictamenFormal
    };
  }

  /**
   * Genera el dictamen técnico formal en formato texto para comités de riesgo.
   */
  function generarDictamenFormal(d) {
    const fmtUSD = (n) => {
      const val = Math.round(Number(n) || 0);
      return '$ ' + val.toLocaleString('es-ES');
    };

    const dateStr = new Date().toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });

    return `======================================================================
DICTAMEN TÉCNICO DE CRÉDITO RURAL - COMITÉ DE RIESGO
Fecha de Emisión: ${dateStr}
Moneda Oficial: USD ($)
DICTAMEN OFICIAL: [ ${d.dictamen.toUpperCase()} ]
======================================================================

1. IDENTIFICACIÓN DEL PRODUCTOR Y CULTIVO
----------------------------------------------------------------------
• Productor / Titular       : ${d.nombreProductor}
• Identificación Fiscal     : ${d.identificacionFiscal}
• Cultivo Evaluado          : ${d.cultivo}
• Superficie Cultivada      : ${d.hectareas.toLocaleString('es-ES')} ha
• Rendimiento Esperado      : ${d.rendimientoPorHa.toFixed(2)} t/ha
• Producción Físico Total   : ${d.produccionTotalTon.toLocaleString('es-ES')} toneladas

2. FLUJO OPERATIVO AGRÍCOLA PROYECTADO (USD)
----------------------------------------------------------------------
• Precio de Mercado Base    : $ ${d.precioPorTon.toLocaleString('es-ES')}/t
• Ingresos Proyectados (USD): ${fmtUSD(d.ingresoBruto)}
• Costo Directo por Ha      : $ ${d.costoPorHa.toLocaleString('es-ES')}/ha
• Costo Operacional de Prod.: ${fmtUSD(d.costoTotal)}
• Margen Operativo Agrícola : ${fmtUSD(d.margenOperativo)} (${d.margenOperativoPct.toFixed(1)}% de margen)

3. CARGA FINANCIERA TOTAL Y LIQUIDEZ (USD)
----------------------------------------------------------------------
• Compromisos en Sist. Fin. : ${fmtUSD(d.deudasFinancieras)}
• Crédito Solicitado (c/int): ${fmtUSD(d.capitalSolicitado)}
• Modalidad de Pago         : ${d.periodicidad}
• Carga Financiera Total    : ${fmtUSD(d.cargaFinancieraTotal)} [Deudas previas + Crédito Solicitado]
• Flujo de Caja Libre Neto  : ${fmtUSD(d.flujoCajaNeto)}
• Cobertura de Deuda (x)    : ${d.cobertura >= 90 ? '> 10.0x' : d.cobertura.toFixed(2) + 'x'} (Umbral: ≥ 1.25x Aprobado | 1.00x - 1.24x Riesgo Moderado | < 1.00x Inviable)

4. CONCLUSIÓN Y RECOMENDACIÓN CREDITICIA
----------------------------------------------------------------------
DICTAMEN: ${d.dictamen.toUpperCase()}

${d.dictamen === 'Aprobado'
  ? 'Dictamen Favorable. El productor genera un flujo de caja operativo suficiente para amortizar íntegramente la carga financiera total (deudas existentes + nuevo financiamiento), preservando un remanente neto positivo y un ratio de cobertura superior a 1.25x.'
  : d.dictamen === 'Riesgo Moderado'
  ? 'Dictamen Observado / Riesgo Moderado. El margen operativo proyectado cubre la carga financiera total pero con un índice de cobertura ajustado (entre 1.00x y 1.25x). Se recomienda requerir garantías reales adicionales o estructurar desembolsos contra certificación de labores de campo.'
  : 'Dictamen Desfavorable / Inviable. La operación arroja un flujo de caja libre neto negativo (-). Los ingresos de la zafra deducidos los costos de producción no alcanzan para honrar los compromisos financieros previstos, configurando un riesgo inaceptable de incumplimiento.'}
======================================================================`;
  }

  // Compatibilidad con evaluateCredit como alias
  const CreditEngine = {
    analisarProductor,
    evaluateCredit: analisarProductor
  };

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = CreditEngine;
  } else {
    global.CreditEngine = CreditEngine;
  }
})(typeof window !== 'undefined' ? window : this);
