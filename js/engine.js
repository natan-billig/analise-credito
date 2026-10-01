/**
 * Sistema de Análisis de Crédito Rural - Motor de Flujo de Caja y Riesgo Agropecuario
 * Versión: 0.4.0 - Módulo de Prestador de Servicios Agrícolas y Productor Agropecuario
 */

(function (global) {
  'use strict';

  const MESES_ANIO = [
    'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
    'Julio', 'Agosto', 'Setiembre', 'Octubre', 'Noviembre', 'Diciembre'
  ];

  const fmtUSD = (n) => {
    const val = Math.round(Number(n) || 0);
    return '$ ' + val.toLocaleString('es-ES');
  };

  /**
   * Procesa y agrupa los compromisos financieros por mes de vencimiento.
   */
  function procesarCompromisos(compromisosRaw, fallbackTotal, margenOperativo) {
    let compromisos = Array.isArray(compromisosRaw) ? compromisosRaw : [];
    compromisos = compromisos
      .map(c => ({
        entidad: (c.entidad || '').trim() || 'Entidad No Especificada',
        mes: (c.mes || 'Enero').trim(),
        monto: Math.max(0, Number(c.monto) || 0)
      }))
      .filter(c => c.monto > 0 || c.entidad !== 'Entidad No Especificada');

    let deudasFinancierasTotal = 0;
    if (compromisos.length > 0) {
      deudasFinancierasTotal = compromisos.reduce((sum, c) => sum + c.monto, 0);
    } else {
      deudasFinancierasTotal = Math.max(0, Number(fallbackTotal) || 0);
    }

    const cronogramaMensual = MESES_ANIO.map(mesNombre => {
      const itemsMes = compromisos.filter(c => c.mes.toLowerCase() === mesNombre.toLowerCase());
      const totalMes = itemsMes.reduce((acc, curr) => acc + curr.monto, 0);
      const porcentajeCompromisos = deudasFinancierasTotal > 0 ? (totalMes / deudasFinancierasTotal) * 100 : 0;
      const porcentajeMargen = margenOperativo > 0 ? (totalMes / margenOperativo) * 100 : 0;
      const entidadesList = [...new Set(itemsMes.map(i => i.entidad))];

      return {
        mes: mesNombre,
        totalMes,
        porcentajeCompromisos,
        porcentajeMargen,
        entidades: entidadesList,
        cantidadCuotas: itemsMes.length
      };
    }).filter(m => m.totalMes > 0);

    let mesPico = null;
    if (cronogramaMensual.length > 0) {
      mesPico = cronogramaMensual.reduce((max, curr) => (curr.totalMes > max.totalMes ? curr : max), cronogramaMensual[0]);
    }

    return { compromisos, deudasFinancierasTotal, cronogramaMensual, mesPico };
  }

  /**
   * Determina el dictamen oficial según las reglas de corte:
   *  - Aprobado: flujoCajaNeto > 0 && icsd >= 1.25
   *  - Riesgo Moderado: flujoCajaNeto >= 0 && icsd >= 1.00 && icsd < 1.25
   *  - Inviable: flujoCajaNeto < 0 || icsd < 1.00
   */
  function determinarDictamen(flujoCajaNeto, icsd, tipo = 'productor') {
    let dictamen = 'Aprobado';
    let dictamenSubtitulo = '';

    const labelFlujo = tipo === 'prestador' ? 'del servicio' : 'de la zafra';

    if (flujoCajaNeto < 0 || icsd < 1.00) {
      dictamen = 'Inviable';
      dictamenSubtitulo = `Flujo de caja libre deficitario o cobertura insuficiente (< 1.00x). El margen operativo ${labelFlujo} no cubre los compromisos financieros.`;
    } else if (flujoCajaNeto >= 0 && icsd >= 1.00 && icsd < 1.25) {
      dictamen = 'Riesgo Moderado';
      dictamenSubtitulo = 'Capacidad de pago ajustada. Cobertura entre 1.00x y 1.25x con estrecha holgura operativa.';
    } else if (flujoCajaNeto > 0 && icsd >= 1.25) {
      dictamen = 'Aprobado';
      dictamenSubtitulo = `Operación viable y solvente. El margen operativo ${labelFlujo} cubre holgadamente la carga financiera total con cobertura ≥ 1.25x.`;
    } else {
      dictamen = 'Inviable';
      dictamenSubtitulo = 'Cobertura de deuda insuficiente para los parámetros crediticios mínimos.';
    }

    return { dictamen, dictamenSubtitulo };
  }

  /**
   * Análisis para PRODUCTOR AGRÍCOLA
   */
  function analisarProductor(input) {
    const hectareas = Math.max(0, Number(input.hectareas ?? input.areaHectares) || 0);
    const rendimientoPorHa = Math.max(0, Number(input.rendimientoPorHa ?? input.estimatedYield) || 0);
    const precioPorTon = Math.max(0, Number(input.precioPorTon ?? input.marketPrice) || 0);
    const costoPorHa = Math.max(0, Number(input.costoPorHa ?? input.costPerHectare) || 0);
    const capitalSolicitado = Math.max(0, Number(input.capitalSolicitado ?? input.requestedCapital) || 0);

    const nombreProductor = (input.nombreProductor || input.producerName || 'Productor Agrícola').trim();
    const identificacionFiscal = (input.identificacionFiscal || input.documentNumber || 'S/D').trim();
    const cultivo = (input.cultivo || input.cropType || 'Soja').trim();
    const periodicidad = (input.periodicidad || input.paymentFrequency || 'Zafra Única').trim();

    // 1. Ingresos y Margen Operativo Agrícola
    const ingresoBruto = hectareas * rendimientoPorHa * precioPorTon;
    const costoTotal = hectareas * costoPorHa;
    const margenOperativo = ingresoBruto - costoTotal;
    const margenOperativoPct = ingresoBruto > 0 ? (margenOperativo / ingresoBruto) * 100 : 0;
    const produccionTotalTon = hectareas * rendimientoPorHa;

    // 2. Compromisos y Carga Financiera
    const { compromisos, deudasFinancierasTotal, cronogramaMensual, mesPico } = procesarCompromisos(
      input.compromisos,
      input.deudasFinancieras ?? input.deudas_financieras ?? input.existingDebts,
      margenOperativo
    );

    const cargaFinancieraTotal = deudasFinancierasTotal + capitalSolicitado;
    const flujoCajaNeto = margenOperativo - cargaFinancieraTotal;
    const icsd = cargaFinancieraTotal > 0 ? (margenOperativo / cargaFinancieraTotal) : (margenOperativo > 0 ? 99 : 0);

    // 3. Dictamen Oficial
    const { dictamen, dictamenSubtitulo } = determinarDictamen(flujoCajaNeto, icsd, 'productor');

    // 4. Dictamen Formal en Texto
    const dictamenFormal = generarDictamenFormalProductor({
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
      deudasFinancierasTotal,
      compromisos,
      cronogramaMensual,
      mesPico,
      capitalSolicitado,
      cargaFinancieraTotal,
      flujoCajaNeto,
      icsd,
      periodicidad,
      dictamen,
      dictamenSubtitulo
    });

    return {
      perfil: 'productor',
      dictamen,
      dictamenSubtitulo,
      metricas: {
        ingresoBruto,
        costoTotal,
        margenOperativo,
        margenOperativoPct,
        cargaFinancieraTotal,
        flujoCajaNeto,
        cobertura: icsd,
        icsd,
        deudasFinancieras: deudasFinancierasTotal,
        capitalSolicitado,
        produccionTotalTon
      },
      compromisos,
      cronogramaMensual,
      mesPico,
      dictamenFormal
    };
  }

  /**
   * Análisis para PRESTADOR DE SERVICIOS AGRÍCOLAS
   * Fórmulas solicitadas:
   *  - ingresoBruto = hectareas * tarifaPorHa
   *  - costoTotal = hectareas * costoPorHa
   *  - margenOperativo = ingresoBruto - costoTotal
   *  - cargaFinancieraTotal = deudasFinancierasTotal + capitalSolicitado
   *  - flujoCajaNeto = margenOperativo - cargaFinancieraTotal
   *  - icsd = cargaFinancieraTotal > 0 ? (margenOperativo / cargaFinancieraTotal) : 0
   */
  function analisarPrestador(input) {
    const hectareas = Math.max(0, Number(input.hectareas ?? input.serviceArea) || 0);
    const tarifaPorHa = Math.max(0, Number(input.tarifaPorHa ?? input.serviceTariff) || 0);
    const costoPorHa = Math.max(0, Number(input.costoPorHa ?? input.serviceCost) || 0);
    const capitalSolicitado = Math.max(0, Number(input.capitalSolicitado ?? input.serviceRequestedCapital) || 0);

    const nombreEmpresa = (input.nombreEmpresa || input.providerName || 'Empresa Prestadora de Servicios').trim();
    const identificacionFiscal = (input.identificacionFiscal || input.providerDoc || 'S/D').trim();
    const contratante = (input.contratante || input.contractClient || 'Silo / Cliente Contratante').trim();
    const periodicidad = (input.periodicidad || input.servicePaymentFrequency || 'Zafra Única').trim();

    // 1. Cálculos de Facturación y Costos de Servicio
    const ingresoBruto = hectareas * tarifaPorHa;
    const costoTotal = hectareas * costoPorHa;
    const margenOperativo = ingresoBruto - costoTotal;
    const margenOperativoPct = ingresoBruto > 0 ? (margenOperativo / ingresoBruto) * 100 : 0;

    // 2. Compromisos y Carga Financiera
    const { compromisos, deudasFinancierasTotal, cronogramaMensual, mesPico } = procesarCompromisos(
      input.compromisos,
      input.deudasFinancieras ?? input.deudas_financieras ?? input.existingDebts,
      margenOperativo
    );

    const cargaFinancieraTotal = deudasFinancierasTotal + capitalSolicitado;
    const flujoCajaNeto = margenOperativo - cargaFinancieraTotal;
    const icsd = cargaFinancieraTotal > 0 ? (margenOperativo / cargaFinancieraTotal) : (margenOperativo > 0 ? 99 : 0);

    // 3. Reglas de Corte Oficiales
    const { dictamen, dictamenSubtitulo } = determinarDictamen(flujoCajaNeto, icsd, 'prestador');

    // 4. Dictamen Formal en Texto Técnico
    const dictamenFormal = generarDictamenFormalPrestador({
      nombreEmpresa,
      identificacionFiscal,
      contratante,
      hectareas,
      tarifaPorHa,
      costoPorHa,
      ingresoBruto,
      costoTotal,
      margenOperativo,
      margenOperativoPct,
      deudasFinancierasTotal,
      compromisos,
      cronogramaMensual,
      mesPico,
      capitalSolicitado,
      cargaFinancieraTotal,
      flujoCajaNeto,
      icsd,
      periodicidad,
      dictamen,
      dictamenSubtitulo
    });

    return {
      perfil: 'prestador',
      dictamen,
      dictamenSubtitulo,
      metricas: {
        ingresoBruto,
        costoTotal,
        margenOperativo,
        margenOperativoPct,
        cargaFinancieraTotal,
        flujoCajaNeto,
        cobertura: icsd,
        icsd,
        deudasFinancieras: deudasFinancierasTotal,
        capitalSolicitado
      },
      compromisos,
      cronogramaMensual,
      mesPico,
      dictamenFormal
    };
  }

  /**
   * Generador de Texto Formal para PRODUCTOR
   */
  function generarDictamenFormalProductor(d) {
    const dateStr = new Date().toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' });

    let detalleCompromisosTxt = '• No se registraron compromisos preexistentes en el sistema financiero.';
    if (d.compromisos && d.compromisos.length > 0) {
      detalleCompromisosTxt = d.compromisos
        .map(c => `  - ${c.entidad.padEnd(25, ' ')} | Vto: ${c.mes.padEnd(12, ' ')} | Cuota: ${fmtUSD(c.monto)}`)
        .join('\n');
    }

    let cronogramaTxt = '• Sin concentración mensual registrada.';
    if (d.cronogramaMensual && d.cronogramaMensual.length > 0) {
      cronogramaTxt = d.cronogramaMensual
        .map(m => `  * ${m.mes.padEnd(12, ' ')}: ${fmtUSD(m.totalMes).padStart(12, ' ')} (${m.porcentajeCompromisos.toFixed(1)}% del pasivo) [${m.entidades.join(', ')}]`)
        .join('\n');
    }

    const picoTxt = d.mesPico 
      ? `• Mes de Máxima Concentración: ${d.mesPico.mes} (${fmtUSD(d.mesPico.totalMes)} - ${d.mesPico.porcentajeCompromisos.toFixed(1)}% del pasivo previo)` 
      : '• Concentración uniforme o sin pasivos.';

    return `======================================================================
DICTAMEN TÉCNICO DE CRÉDITO RURAL - COMITÉ DE RIESGO
Fecha de Emisión: ${dateStr}
Moneda Oficial: USD ($) | República del Paraguay
DICTAMEN OFICIAL: [ ${d.dictamen.toUpperCase()} ]
======================================================================

1. IDENTIFICACIÓN DEL CLIENTE Y CULTIVO
----------------------------------------------------------------------
• TIPO DE CLIENTE          : Productor Agrícola
• PRODUCTOR                : ${d.nombreProductor}
• DOC (PY)                 : ${d.identificacionFiscal}
• Cultivo Principal        : ${d.cultivo}
• Superficie Cultivada     : ${d.hectareas.toLocaleString('es-ES')} ha
• Rendimiento Esperado     : ${d.rendimientoPorHa.toFixed(2)} t/ha
• Producción Físico Total  : ${d.produccionTotalTon.toLocaleString('es-ES')} toneladas

2. FLUJO OPERATIVO AGRÍCOLA PROYECTADO (USD)
----------------------------------------------------------------------
• Precio de Mercado Base   : $ ${d.precioPorTon.toLocaleString('es-ES')}/t
• Ingresos Proyectados (USD): ${fmtUSD(d.ingresoBruto)}
• Costo Directo por Ha     : $ ${d.costoPorHa.toLocaleString('es-ES')}/ha
• Costo Operacional Total  : ${fmtUSD(d.costoTotal)}
• Margen Operativo Agrícola: ${fmtUSD(d.margenOperativo)} (${d.margenOperativoPct.toFixed(1)}% de margen)

3. COMPROMISOS FINANCIEROS Y CRONOGRAMA MENSUAL
----------------------------------------------------------------------
Detalle de Compromisos por Entidad:
${detalleCompromisosTxt}

Concentración de Vencimientos por Mes:
${cronogramaTxt}
${picoTxt}

4. CARGA FINANCIERA TOTAL Y LIQUIDEZ (USD)
----------------------------------------------------------------------
• Suma de Compromisos Prev. : ${fmtUSD(d.deudasFinancierasTotal)}
• Crédito Solicitado (c/int): ${fmtUSD(d.capitalSolicitado)}
• Modalidad del Crédito     : ${d.periodicidad}
• Carga Financiera Total    : ${fmtUSD(d.cargaFinancieraTotal)} [Compromisos + Crédito Solicitado]
• Flujo de Caja Libre Neto  : ${fmtUSD(d.flujoCajaNeto)}
• Cobertura / ICSD Global   : ${d.icsd >= 90 ? '> 10.0x' : d.icsd.toFixed(2) + 'x'} (Umbral: ≥ 1.25x Aprobado | 1.00x - 1.24x Riesgo Moderado | < 1.00x Inviable)

5. CONCLUSIÓN Y RECOMENDACIÓN CREDITICIA
----------------------------------------------------------------------
DICTAMEN: ${d.dictamen.toUpperCase()}

${d.dictamen === 'Aprobado'
  ? 'Dictamen Favorable. El productor genera un flujo de caja operativo suficiente para amortizar íntegramente la carga financiera total (compromisos en el sistema financiero paraguayo + nuevo crédito solicitado), preservando un remanente neto positivo y un índice ICSD global superior a 1.25x.'
  : d.dictamen === 'Riesgo Moderado'
  ? 'Dictamen Observado / Riesgo Moderado. El margen operativo proyectado cubre la carga financiera total pero con un índice de cobertura ajustado (entre 1.00x y 1.25x). Se recomienda verificar la coincidencia de los meses de mayor vencimiento con la fecha de liquidación de zafra y exigir garantías reales adicionales.'
  : 'Dictamen Desfavorable / Inviable. La operación arroja un flujo de caja libre neto negativo o cobertura insuficiente. Los ingresos de la zafra deducidos los costos de producción no alcanzan para honrar los compromisos financieros previstos, configurando un riesgo inaceptable de incumplimiento.'}
======================================================================`;
  }

  /**
   * Generador de Texto Formal para PRESTADOR DE SERVICIOS
   */
  function generarDictamenFormalPrestador(d) {
    const dateStr = new Date().toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' });

    let detalleCompromisosTxt = '• No se registraron compromisos preexistentes en el sistema financiero.';
    if (d.compromisos && d.compromisos.length > 0) {
      detalleCompromisosTxt = d.compromisos
        .map(c => `  - ${c.entidad.padEnd(25, ' ')} | Vto: ${c.mes.padEnd(12, ' ')} | Cuota: ${fmtUSD(c.monto)}`)
        .join('\n');
    }

    let cronogramaTxt = '• Sin concentración mensual registrada.';
    if (d.cronogramaMensual && d.cronogramaMensual.length > 0) {
      cronogramaTxt = d.cronogramaMensual
        .map(m => `  * ${m.mes.padEnd(12, ' ')}: ${fmtUSD(m.totalMes).padStart(12, ' ')} (${m.porcentajeCompromisos.toFixed(1)}% del pasivo) [${m.entidades.join(', ')}]`)
        .join('\n');
    }

    const picoTxt = d.mesPico 
      ? `• Mes de Máxima Concentración: ${d.mesPico.mes} (${fmtUSD(d.mesPico.totalMes)} - ${d.mesPico.porcentajeCompromisos.toFixed(1)}% del pasivo previo)` 
      : '• Concentración uniforme o sin pasivos.';

    return `======================================================================
DICTAMEN TÉCNICO DE CRÉDITO RURAL - COMITÉ DE RIESGO
Fecha de Emisión: ${dateStr}
Moneda Oficial: USD ($) | República del Paraguay
DICTAMEN OFICIAL: [ ${d.dictamen.toUpperCase()} ]
======================================================================

1. IDENTIFICACIÓN DEL CLIENTE Y CONTRATO
----------------------------------------------------------------------
• TIPO DE CLIENTE          : Prestador de Servicios Agrícolas
• EMPRESA                  : ${d.nombreEmpresa}
• DOC (PY)                 : ${d.identificacionFiscal}
• CONTRATO CON             : ${d.contratante}
• Superficie de Servicio   : ${d.hectareas.toLocaleString('es-ES')} ha
• Tarifa de Cobro Pactada  : $ ${d.tarifaPorHa.toLocaleString('es-ES')}/ha

2. FLUJO OPERATIVO DEL SERVICIO (USD)
----------------------------------------------------------------------
• Ingresos por Servicio    : ${fmtUSD(d.ingresoBruto)}
• Costo Operacional por Ha : $ ${d.costoPorHa.toLocaleString('es-ES')}/ha
• Costo Operacional Total  : ${fmtUSD(d.costoTotal)}
• Margen Operativo Neto    : ${fmtUSD(d.margenOperativo)} (${d.margenOperativoPct.toFixed(1)}% de margen)

3. COMPROMISOS FINANCIEROS Y CRONOGRAMA MENSUAL
----------------------------------------------------------------------
Detalle de Compromisos por Entidad:
${detalleCompromisosTxt}

Concentración de Vencimientos por Mes:
${cronogramaTxt}
${picoTxt}

4. CARGA FINANCIERA TOTAL Y LIQUIDEZ (USD)
----------------------------------------------------------------------
• Suma de Compromisos Prev. : ${fmtUSD(d.deudasFinancierasTotal)}
• Crédito Solicitado (c/int): ${fmtUSD(d.capitalSolicitado)}
• Modalidad del Crédito     : ${d.periodicidad}
• Carga Financiera Total    : ${fmtUSD(d.cargaFinancieraTotal)} [Compromisos + Crédito Solicitado]
• Flujo de Caja Libre Neto  : ${fmtUSD(d.flujoCajaNeto)}
• Cobertura / ICSD Global   : ${d.icsd >= 90 ? '> 10.0x' : d.icsd.toFixed(2) + 'x'} (Umbral: ≥ 1.25x Aprobado | 1.00x - 1.24x Riesgo Moderado | < 1.00x Inviable)

5. CONCLUSIÓN Y RECOMENDACIÓN CREDITICIA
----------------------------------------------------------------------
DICTAMEN: ${d.dictamen.toUpperCase()}

${d.dictamen === 'Aprobado'
  ? 'Dictamen Favorable. La empresa prestadora genera un flujo de caja operativo robusto proveniente del contrato de servicios agrícolas, suficiente para amortizar íntegramente la carga financiera total y mantener un remanente neto holgado con un índice de cobertura ICSD superior a 1.25x.'
  : d.dictamen === 'Riesgo Moderado'
  ? 'Dictamen Observado / Riesgo Moderado. El margen operativo del servicio cubre la carga financiera total pero con un índice de cobertura ajustado (entre 1.00x y 1.25x). Se recomienda validar la solvencia del silo contratante, solicitar cesión de crédito de cobro o exigir garantías sobre el parque de maquinarias.'
  : 'Dictamen Desfavorable / Inviable. La operación arroja un flujo de caja libre neto negativo o cobertura insuficiente. La tarifa facturada no cubre los costos operacionales y la carga financiera prevista, representando un alto riesgo crediticio.'}
======================================================================`;
  }

  /**
   * Evaluador unificado
   */
  function evaluateCredit(input) {
    if (input.perfil === 'prestador' || input.tipoCliente === 'prestador') {
      return analisarPrestador(input);
    }
    return analisarProductor(input);
  }

  const CreditEngine = {
    analisarProductor,
    analisarPrestador,
    evaluateCredit,
    MESES_ANIO
  };

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = CreditEngine;
  } else {
    global.CreditEngine = CreditEngine;
  }
})(typeof window !== 'undefined' ? window : this);
