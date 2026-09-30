# Sistema de Análisis de Crédito Rural

Plataforma técnica especializada para la evaluación de riesgo crediticio, análisis agronómico y emisión automatizada de dictámenes de crédito para productores agropecuarios en **USD ($)**.

## 🌾 Características Principales (v0.2.0)

- **Parámetros Agronómicos y Productivos**:
  - Evaluación de superficie productiva (`ha`), rendimiento estimado (`t/ha`) y precio de mercado (`USD/t`).
  - Estimación precisa de los **Ingresos Proyectados (USD)** y **Costo Operacional de Producción (USD)**.
  - Cálculo del **Margen Operativo Agrícola (USD)** y margen porcentual sobre ingresos.

- **Modelo de Carga Financiera y Flujo de Caja Libre**:
  - Registro de **Cuotas / Compromisos en el Sistema Financiero (USD)** (`deudas_financieras`).
  - Registro de **Monto del Crédito Solicitado (USD)** (con intereses ya incluidos).
  - Determinación de la **Carga Financiera Total (USD)** = Deudas previas + Crédito Solicitado.
  - Determinación del **Flujo de Caja Libre / Remanente Neto (USD)** = Margen Operativo - Carga Financiera Total.
  - Cálculo del índice de **Cobertura de Deuda (x)** = Margen Operativo / Carga Financiera Total.

- **Reglas de Dictamen Oficial**:
  - **Aprobado**: `flujoCajaNeto > 0` y `cobertura >= 1.25x`.
  - **Riesgo Moderado**: `flujoCajaNeto >= 0` y `1.00x <= cobertura < 1.25x`.
  - **Inviable**: `flujoCajaNeto < 0` (déficit de caja).

- **Dictamen Técnico Formal para Comité**:
  - Generación de informe técnico detallado listo para copiar al portapapeles y anexar a carpetas de crédito o actas de comité.

## 🚀 Despliegue y Ejecución

El proyecto está diseñado como una aplicación web ligera sin dependencias de compilación.

Para ejecutar localmente, abra `index.html` en cualquier navegador web o inicie un servidor local:

```bash
# Ejemplo con servidor local
npx serve .
```

Configurado para despliegue automático en la plataforma [Vercel](https://vercel.com) (`vercel.json`).
