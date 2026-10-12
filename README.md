# Sistema de Análisis de Crédito Rural

Plataforma técnica especializada para la evaluación de riesgo crediticio, análisis agronómico y emisión automatizada de dictámenes de crédito para **Productores Agropecuarios** y **Prestadores de Servicios Agrícolas** en **USD ($)**, con soporte para la **República del Paraguay (C.I. / RUC)**.

## 🌾 Características Principales (v0.7.1)

- **Calculadora Financiera Independiente - Sistema Alemán de Amortización**:
  - Herramienta ejecutiva accesible desde el encabezado general de la plataforma (`🧮 Calculadora Financiera`).
  - Proyección de cuotas decrecientes bajo el Sistema Alemán con **amortización anual o semestral**.
  - **Soporte para Cuotas Semestrales (Esquema Zafra)**: pago exclusivo de intereses en el primer semestre (entresafra) y amortización de capital e intereses en el segundo semestre (cosecha).
  - Modalidad de amortización constante semestral.
  - Plazo parametrizable de 1 a 6 años (estándar normativo de Cotripar S.A.).
  - Cómputo automático del **1% de gasto administrativo** sobre el capital solicitado.
  - Cómputo oficial del **IVA del 10%** sobre intereses bancarios según régimen fiscal de Paraguay.
  - Cronograma visual optimizado para visualización completa sin cortes en zoom 100% con cabecera fija (*sticky header*).
  - Resumen financiero consolidado: Total Intereses, Gasto Administrativo, Costo Financiero Total y Total Pagado.
  - Botón *Aplicar al Formulario Activo* para transferir la cuota más exigente del primer año al análisis crediticio principal con recálculo automático del flujo de caja.

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
  - Observación discreta de amortización bajo Sistema Alemán en el demostrativo de impresión cuando el crédito es proyectado vía calculadora.
  - Emisión e impresión de **Dictamen Ejecutivo One-Pager en hoja A4** (`🖨️ Imprimir / Guardar PDF`), con membrete oficial de Cotripar S.A., indicadores de flujo de caja, cronograma de vencimientos densificado, conclusión técnica formal, espacio físico de 55px para firmas manuales y sello, y cláusula oficial de confidencialidad institucional.

- **Pie de Página Institucional**:
  - Enlace de contacto directo con el desarrollador del sistema.

## 🚀 Despliegue y Ejecución

El proyecto es una aplicación web ligera (HTML5, Vanilla JS, CSS3) lista para ejecución directa en navegador o despliegue en Vercel (`vercel.json`).

```bash
# Servidor local de prueba
npx serve .
```
