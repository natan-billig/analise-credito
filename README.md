# Sistema de Análisis de Crédito Rural

Plataforma técnica especializada para la evaluación de riesgo crediticio, análisis agronómico y emisión automatizada de dictámenes de crédito para productores agropecuarios en **USD ($)**, con soporte para la **República del Paraguay (C.I. / RUC)**.

## 🌾 Características Principales (v0.3.0)

- **Optimización y Estabilidad Web**:
  - Favicon SVG inline integrado para evitar peticiones 404.
  - Corrección de bucles de recarga y submisíon involuntaria en Mozilla Firefox (`type="button"` con listeners dedicados).

- **Identificación Oficial para Paraguay**:
  - Campo de identificación adaptado a **C.I. / RUC** (`Ej: 4.892.150 o 80012345-6`).

- **Gestor Dinámico de Compromisos Financieros**:
  - Tabla interactiva para incorporar cuotas y pasivos bancarios/comerciales preexistentes.
  - Campos por fila: **Entidad Financiera** (Banco Sudameris, Itaú, Banco Atlas, Continental, etc.), **Mes de Vencimiento** (Enero a Diciembre) y **Monto Cuota (USD)**.
  - Sumatoria automática en tiempo real de la carga de compromisos.

- **Cronograma y Concentración de Cuotas por Mes**:
  - Análisis de estacionalidad y concentración de vencimientos por mes.
  - Porcentaje de concentración de deuda frente al pasivo total y visualización con barras de progreso.
  - Detección automática del mes de mayor exigibilidad financiera.

- **Motor de Riesgo y Capacidad de Repago (USD)**:
  - Fórmulas oficiales de margen operativo, flujo de caja libre neto e índice de cobertura (ICSD Global).
  - Umbrales de corte:
    - **Aprobado**: `flujoCajaNeto > 0` y `cobertura >= 1.25x`.
    - **Riesgo Moderado**: `flujoCajaNeto >= 0` y `1.00x <= cobertura < 1.25x`.
    - **Inviable**: `flujoCajaNeto < 0` o `cobertura < 1.00x`.

- **Dictamen Técnico Formal para Comité**:
  - Resumen ejecutivo estructurado en español técnico listo para copiar al portapapeles.

## 🚀 Despliegue y Ejecución

El proyecto es una aplicación web ligera (HTML5, Vanilla JS, CSS3) lista para ejecución directa en navegador o despliegue en Vercel (`vercel.json`).

```bash
# Servidor local de prueba
npx serve .
```
