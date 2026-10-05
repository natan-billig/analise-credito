# Sistema de Análisis de Crédito Rural

Plataforma técnica especializada para la evaluación de riesgo crediticio, análisis agronómico y emisión automatizada de dictámenes de crédito para **Productores Agropecuarios** y **Prestadores de Servicios Agrícolas** en **USD ($)**, con soporte para la **República del Paraguay (C.I. / RUC)**.

## 🌾 Características Principales (v0.5.1)

- **Módulo Dual de Evaluación**:
  - **🚜 Productor Agrícola**: Evaluación de superficie (`ha`), rendimiento esperado (`t/ha`), precio de mercado (`USD/t`), costo por hectárea (`USD/ha`) y financiamiento.
  - **🛠️ Prestador de Servicios**: Evaluación de contratos con silos/agroexportadoras (`ha` de servicio contratadas, tarifa de cobro por hectárea `USD/ha`, costos operativos de maquinaria/personal `USD/ha` y capital solicitado).

- **Gestor Dinámico de Compromisos Financieros**:
  - Tabla interactiva para incorporar cuotas bancarias y comerciales con entidad y mes de vencimiento.
  - Sumatoria automática en tiempo real de la carga financiera previa.
  - Cronograma visual de concentración de vencimientos por mes con barras de progreso y detección del mes de mayor exigibilidad.

- **Motor de Riesgo y Capacidad de Repago (USD)**:
  - Fórmulas de flujo operativo, margen neto, flujo de caja libre y ratio de cobertura (ICSD Global).
  - Reglas de decisión:
    - **Aprobado**: `flujoCajaNeto > 0` e `icsd >= 1.25x`.
    - **Riesgo Moderado**: `flujoCajaNeto >= 0` e `1.00x <= icsd < 1.25x`.
    - **Inviable**: `flujoCajaNeto < 0` o `icsd < 1.00x`.

- **Dictamen Técnico Formal para Comité y Reporte Ejecutivo Imprimible One-Pager A4 (PDF)**:
  - Resumen ejecutivo estructurado en español formal con identificación del tipo de cliente (Productor o Prestador con Silo contratante).
  - Emisión e impresión de **Dictamen Ejecutivo One-Pager en hoja A4** (`🖨️ Imprimir / Guardar PDF`), con membrete oficial de Cotripar S.A., indicadores de flujo de caja, cronograma de vencimientos densificado, conclusión técnica formal, campo para firmas físicas y cláusula oficial de confidencialidad institucional.

- **Pie de Página Institucional**:
  - Enlace de contacto directo con el desarrollador del sistema.

## 🚀 Despliegue y Ejecución

El proyecto es una aplicación web ligera (HTML5, Vanilla JS, CSS3) lista para ejecución directa en navegador o despliegue en Vercel (`vercel.json`).

```bash
# Servidor local de prueba
npx serve .
```
