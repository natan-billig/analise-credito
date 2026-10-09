# Registro de Cambios (Changelog)

Todas las modificaciones notables de este proyecto se documentan en este archivo.

El formato se basa en [Keep a Changelog](https://keepachangelog.com/es-ES/1.0.0/),
y este proyecto se adhiere a [Semantic Versioning](https://semver.org/lang/es/).

## [0.6.0] - 2026-10-09

### Añadido / Modificado
- Incorporada calculadora financiera integrada con Sistema Alemán de amortización.
- Añadido cálculo automático del 1% de gasto administrativo sobre el capital solicitado.
- Implementado cómputo oficial de IVA del 10% sobre intereses bancarios según régimen PY.
- Posibilidad de proyectar de 1 a 10 años y transferir la cuota inicial al flujo de caja.

## [0.5.2] - 2026-10-05

### Modificado
- Rediseñado bloque de firmas con espacio vertical de 55px para firma manual y sello.
- Rebalanceada la distribución vertical de la hoja A4 para mayor legibilidad y presencia ejecutiva.
- Ajustado padding de tablas financieras en modo impresión.

## [0.5.1] - Rediseño Ejecutivo One-Pager y Confidencialidad Cotripar S.A. - 2026-10-05

### Modificado
- Rediseño total del dictamen impreso a formato One-Pager ejecutivo estricto.
- Eliminada duplicación de texto ASCII en el reporte.
- Incorporada cláusula oficial de confidencialidad para Cotripar S.A.
- Ocultado enlace de WhatsApp en impresión y sustituido por firma técnica sutil.
- Optimización de márgenes de impresión a `@page { size: A4 portrait; margin: 6mm 10mm 6mm 10mm; }`.
- Condensación del grid de solicitante a 4 columnas y densificación tipográfica de tablas de flujo y cronograma.

## [0.5.0] - Reporte Ejecutivo A4 Imprimible con Membrete y Exportación a PDF - 2026-10-05

### Añadido / Modificado
- Implementado formato de dictamen ejecutivo imprimible en hoja A4 con soporte para PDF nativo.
- Incorporado membrete corporativo con logotipo de la empresa.
- Añadido bloque de firmas formales y pie de página discreto con créditos de desarrollo.
- Agregado botón de acción destacado `🖨️ Imprimir / Guardar PDF` (`#btn-imprimir`) en el panel de dictamen con estilización moderna slate/emerald.
- Estructuración del contenedor `#reporte-impresion` con datos del solicitante, demostrativo de flujo de caja, cronograma de vencimientos y conclusión técnica.
- Configuración de estilos `@page { size: A4 portrait; margin: 10mm 12mm 10mm 12mm; }` y aislamiento de visualización en `@media print`.

## [0.4.0] - Módulo Prestador de Servicios y Pie de Página Institucional - 2026-10-01

### Añadido / Modificado
- Añadida pestaña funcional 'Prestador de Servicios' con análisis de contratos con silos.
- Parámetros de servicio: hectáreas contratadas, tarifa/ha, costos/ha y crédito solicitado.
- Añadido pie de página oficial con enlace de contacto.
- Incorporada función `CreditEngine.analisarPrestador` con modelo de flujo operativo para contratistas.
- Actualizado generador de dictamen formal para reflejar la naturaleza contractual del prestador de servicios.

## [0.3.0] - Gestor Dinámico de Compromisos y Soporte Paraguay - 2026-09-30

### Añadido / Modificado
- Solucionado bloqueo de carga en Firefox y agregado favicon SVG inline.
- Adaptado campo de identificación fiscal a C.I. / RUC (Paraguay).
- Implementado gestor dinámico de compromisos financieros por entidad y mes.
- Añadido cálculo de sumatoria automática y ratio de concentración de deuda mensual.
- Incorporada nueva sección de visualización "Cronograma y Concentración de Cuotas por Mes" con barras de distribución.
- Actualizado dictamen técnico formal con desglose de acreedores y mes de máxima concentración.

## [0.2.0] - Modelo de Flujo de Caja Agrícola con Compromisos Financieros en USD - 2026-09-30

### Añadido / Modificado
- **feat: implementado modelo de flujo de caja agricola con compromisos financieros en USD**:
  - Estandarización de la moneda oficial en toda la aplicación como **USD ($)**.
  - Nuevo campo numérico obligatorio: `Cuotas / Compromisos en el Sistema Financiero (USD)` con ID `deudas_financieras`.
  - Campo `Monto del Crédito Solicitado (USD)` actualizado indicando `(Intereses ya incluidos)`.
  - Nueva función central en el motor `CreditEngine.analisarProductor` implementando las fórmulas exactas:
    - `ingresoBruto = hectareas * rendimientoPorHa * precioPorTon`
    - `costoTotal = hectareas * costoPorHa`
    - `margenOperativo = ingresoBruto - costoTotal`
    - `cargaFinancieraTotal = deudasFinancieras + capitalSolicitado`
    - `flujoCajaNeto = margenOperativo - cargaFinancieraTotal`
    - `cobertura = cargaFinancieraTotal > 0 ? (margenOperativo / cargaFinancieraTotal) : (margenOperativo > 0 ? 99 : 0)`
  - Nuevas reglas de corte normativas:
    - **Aprobado**: `flujoCajaNeto > 0 && cobertura >= 1.25`
    - **Riesgo Moderado**: `flujoCajaNeto >= 0 && cobertura >= 1.00 && cobertura < 1.25`
    - **Inviable**: `flujoCajaNeto < 0`
  - Métricas oficiales exhibidas en el panel:
    - *Ingresos Proyectados (USD)*
    - *Costo Operacional de Producción (USD)*
    - *Margen Operativo Agrícola (USD)*
    - *Carga Financiera Total (USD) [Deudas previas + Crédito Solicitado]*
    - *Flujo de Caja Libre / Remanente Neto (USD)*
    - *Cobertura de Deuda (x)*
    - *Dictamen Oficial (Aprobado, Riesgo Moderado, Inviable)*
  - Texto técnico formal para copiar y pegar actualizado con el desglose de flujo de caja y compromisos en USD.

## [0.1.1] - Localización Integral al Español - 2026-09-30

### Modificado
- **Localización y Nomenclatura Técnica (100% Español)**:
  - Etiqueta HTML actualizada a `lang="es"` en `index.html`.
  - Reemplazo y ajuste de todas las variables, etiquetas y mensajes de interfaz a terminología agronómica y financiera en español:
    - *Área Cultivada (ha)*
    - *Costo de Producción por Hectárea ($/ha)*
    - *Rendimiento Estimado (t/ha)*
    - *Precio de Mercado ($/t)*
    - *Capital Solicitado ($)*
    - *Periodicidad de Pagos*: *Zafra Única*, *Semestral*, *Mensual*
    - Acciones: *Ejecutar Análisis*, *Cargar Ejemplo*
    - Título del panel de resultados: *Dictamen de Crédito*
    - Métricas clave: *Ingreso Bruto Proyectado*, *Costo Operacional Total*, *Margen Operativo Bruto*, *Cobertura de Deuda (ICSD)*
- **Motor de Riesgo y Dictamen (`js/engine.js`)**:
  - Unificación de los estados del dictamen a: **Aprobado**, **Riesgo Moderado** e **Inviable**.
  - Incorporación del cálculo del Índice de Cobertura del Servicio de la Deuda (ICSD) y amortización de zafra agrícola.
  - Implementación del generador de texto formal técnico para comités de crédito agropecuario.
- **Controlador e Interacción (`js/app.js`)**:
  - Incorporación de botón para copiar el dictamen al portapapeles con confirmación visual (*¡Copiado al portapapeles!*).
  - Validaciones de campos obligatorios y retroalimentación de errores en español.
  - Formato numérico y monetario localizado.
- **Documentación**:
  - Traducción y actualización completa de `README.md` y `CHANGELOG.md`.

## [0.1.0] - Versión Base (Productor Agrícola) - 2026-09-30

### Añadido
- Estructuración inicial del proyecto para análisis de crédito rural.
- Interfaz web interactiva (`index.html`) y configuración para Vercel (`vercel.json`).
- Motor de reglas de riesgo inicial (`js/engine.js`) y controlador (`js/app.js`).
- Archivo de exclusión de repositorio (`.gitignore`).
