# Registro de Cambios (Changelog)

Todas las modificaciones notables de este proyecto se documentan en este archivo.

El formato se basa en [Keep a Changelog](https://keepachangelog.com/es-ES/1.0.0/),
y este proyecto se adhiere a [Semantic Versioning](https://semver.org/lang/es/).

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
