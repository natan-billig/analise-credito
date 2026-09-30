# Sistema de Análisis de Crédito Rural

Plataforma técnica especializada para la evaluación de riesgo crediticio, análisis agronómico y emisión automatizada de dictámenes de crédito para productores agropecuarios.

## 🌾 Características Principales

- **Parámetros Agronómicos y Productivos**:
  - Evaluación de superficie productiva (`ha`), rendimiento estimado (`t/ha`) y precio de mercado (`$/t`).
  - Estimación precisa del **Ingreso Bruto Proyectado** y **Costo Operacional Total**.
  - Cálculo del **Margen Operativo Bruto** y margen porcentual sobre ingresos.

- **Motor de Riesgo Financiero y Capacidad de Repago**:
  - Modalidades flexibles de amortización: **Zafra Única** (al vencimiento de la cosecha), **Semestral** y **Mensual**.
  - **Índice de Cobertura del Servicio de la Deuda (ICSD)**: Contempla la nueva financiación y pasivos financieros preexistentes frente al flujo operativo agrícola.
  - Evaluación y ponderación de aforos de garantías (Hipoteca Rural, Prenda de Cosecha / Warrant, Maquinaria, Fianza/Aval).
  - Cálculo automático del **Límite de Crédito Recomendado**.

- **Dictamen Técnico Formal para Comité**:
  - Clasificación del riesgo en tres estados normativos: **Aprobado**, **Riesgo Moderado** e **Inviable**.
  - Generación de informe técnico detallado listo para copiar al portapapeles y anexar a las carpetas de crédito o actas de comité.

## 🚀 Despliegue y Ejecución

El proyecto está diseñado como una aplicación web ligera sin dependencias de compilación.

Para ejecutar localmente, abra `index.html` en cualquier navegador web o inicie un servidor local:

```bash
# Ejemplo con servidor local
npx serve .
```

Configurado para despliegue automático en la plataforma [Vercel](https://vercel.com) (`vercel.json`).
