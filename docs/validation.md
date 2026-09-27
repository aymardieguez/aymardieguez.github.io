# Estado de validación

27 de septiembre de 2026. Este documento distingue comprobaciones ejecutadas de pruebas preparadas. No constituye una aprobación del despliegue.

## Ejecutado

- Instalación de dependencias npm y lockfile actualizado.
- ESLint sin errores y Prettier sin diferencias de formato.
- Build de seis páginas estáticas. Repetición del build para verificar que puede regenerarse.
- Seis pruebas Node superadas: codificación y validación del borrador de contacto; escape HTML; metadata y estructura; enlaces y fragmentos internos; presupuesto de assets.
- Presencia de canonical, Open Graph, Twitter Card, JSON-LD válido, sitemap, robots y página 404.
- Imágenes con alt, dimensiones y variantes WebP de 720/1440 px. Carga diferida salvo imagen principal de casos de estudio.
- Revisión de colores de texto y estados de foco en CSS. Corrección de contrastes secundarios por debajo de 4,5:1. Esto no reemplaza una auditoría visual y axe ejecutada.
- Revisión del código de navegación, movimiento reducido, tamaños táctiles y alternativa sin JavaScript.
- Búsqueda de patrones de claves privadas, tokens GitHub, claves de Google y credenciales AWS: sin coincidencias en archivos candidatos.
- Inspección visual de las tres capturas originales; webs de clientes revisadas en navegador.
- Respuesta HTTP 200 de portfolio actual, perfil GitHub, VIAJA, proyecto_indra, José Vale y Nereida. LinkedIn devuelve HTTP 999 a la comprobación automatizada; se conserva la URL del portfolio original, también encontrada en búsqueda pública.

## Preparado, todavía sin ejecutar

- Once pruebas Playwright, descubiertas correctamente con `playwright test --list`.
- Layout a 320, 390, 768, 1280 y 1600 px; imágenes, overflow y axe.
- Navegación de casos de estudio, teclado, menú móvil y borrador editable.
- Modo sin JavaScript y preferencia de movimiento reducido.
- Capturas de la nueva web e informes Lighthouse de rendimiento, accesibilidad, buenas prácticas y SEO.

El navegador remoto no permite acceder a la vista previa local. La descarga de Chromium local no pudo completarse. No se han declarado puntuaciones Lighthouse, resultados de Playwright, Core Web Vitals de campo ni capturas de la nueva web como si se hubieran obtenido.

Las capturas de clientes publicadas son las imágenes desktop reales del repositorio original. No se han fabricado vistas móviles ni interfaces de VIAJA. Las capturas móviles adicionales de esos proyectos quedan pendientes.

## Publicación pendiente

Rama de trabajo local: `feat/portfolio-redesign`.

GitHub aparece instalado, pero esta ejecución no dispone de sus herramientas autenticadas. `git push --dry-run` falla con `could not read Username for 'https://github.com'`. No se han subido commits ni cambiado la web pública.

La consulta sin autenticación de la configuración de Pages devuelve 404. No se ha alterado la configuración. La salida mantiene HTML en la raíz y rutas de directorio compatibles con el esquema anterior.

## Para completar la entrega

1. Recuperar acceso autenticado al repositorio y subir la rama.
2. Ejecutar el workflow `Portfolio quality`, inspeccionar capturas y corregir los hallazgos visuales, de accesibilidad o rendimiento.
3. Confirmar la fuente de publicación de Pages y publicar la versión validada en `main`.
4. Comprobar la URL pública, entradas directas a proyectos, assets y contacto. Verificar que la versión servida corresponde al commit publicado.

La instalación de herramientas de validación no añade esas dependencias a la web: el navegador recibe HTML, CSS y aproximadamente 5 KB de JavaScript propio sin comprimir. Las capturas optimizadas pesan entre 13 y 44 KB cada una.
