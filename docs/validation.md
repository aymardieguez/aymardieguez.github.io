# Validación del portfolio

Revisión del 28 de septiembre de 2026 (Europe/Madrid).

La versión inicial se integró en `main` mediante la PR #1. Esta revisión responde a problemas observados en la web publicada: solapamiento del gráfico, jerarquía de la formación, símbolos de móvil y uso del contacto.

## Resultados ejecutados

Commit de aplicación: `fb363b5cd0ec4d4051cc578d283ab635d4410efe`. [Ejecución de GitHub Actions](https://github.com/aymardieguez/aymardieguez.github.io/actions/runs/36359270448) completada correctamente.

- Seis pruebas Node y 22 pruebas Playwright superadas.
- ESLint, Prettier y build sin errores; HTML generado idéntico al versionado.
- Lighthouse móvil: rendimiento 99/100, accesibilidad 100/100, buenas prácticas 100/100 y SEO 100/100.
- LCP de laboratorio: 1,4 s; CLS: 0,06; tiempo total de bloqueo: 0 ms.
- Revisión visual de capturas de escritorio y móvil.

## Comprobaciones

- ESLint y Prettier, build de seis páginas y seis pruebas Node.
- Layout, imágenes y axe WCAG A/AA en 320, 390, 768, 1024, 1280, 1600 y 1920 px.
- Separación entre las tres capas del gráfico, su título y la descripción en los tres modos y siete anchos.
- Rutas directas de los tres casos de estudio; navegación por teclado y menú móvil.
- Vista previa del correo, codificación de caracteres, enlace a Gmail y aplicación de correo, edición conservando los campos.
- Copia del mensaje y de la dirección, con selección manual del texto cuando el portapapeles no está disponible.
- Contenido accesible sin JavaScript y con movimiento reducido.
- Presupuesto de HTML, CSS, JavaScript e imágenes; metadata y enlaces internos.

El contacto prepara un mensaje. El envío se realiza en la cuenta de correo del visitante; la web no afirma haber enviado ni recibido nada. No hay backend de correo, claves ni almacenamiento de los campos.

## Alcance de los resultados

Lighthouse se ejecuta sobre el build de producción en un servidor local de GitHub Actions, con emulación móvil. Sus métricas son de laboratorio y no equivalen a Core Web Vitals de visitantes reales.

Las capturas de los clientes son las imágenes reales conservadas del portfolio original. No se han fabricado interfaces ni resultados comerciales.

Los informes y capturas de cada ejecución se conservan como artifacts del workflow `Portfolio quality`. La configuración duplicada se ha corregido y el workflow temporal de importación se ha retirado.
