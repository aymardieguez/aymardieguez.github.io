# Auditoría y decisiones

Revisión realizada el 27 de septiembre de 2026.

## Fuentes

| Fuente                        | Referencia                                 | Qué respalda                                                                                   |
| ----------------------------- | ------------------------------------------ | ---------------------------------------------------------------------------------------------- |
| Portfolio original            | `83df797f623e6e87d9b47243eb4215739bf46ce0` | Formación, prácticas, experiencias anteriores, clientes, email y LinkedIn                      |
| Instrucciones del propietario | Encargo adjunto                            | Actualmente estudia IA en la UDC; objetivo freelance; autoría comercial de José Vale y Nereida |
| VIAJA                         | `88e2f56b0f67982df4ff66a8829ac5f43ee4047e` | Stack y funcionalidades del caso de estudio                                                    |
| proyecto_indra                | `c93d7bae1ac6d802be60b5e59ac04373af793d2e` | Java y SQL en código público; no se infiere relación laboral a partir del nombre               |
| josevaleosteopata.es          | Página pública revisada                    | Servicios, equipo, contacto, WhatsApp, capturas y generador Astro v5.18.2                      |
| nereidaquiromasajista.es      | Página pública revisada                    | Carta y páginas de masajes, bonos, contacto, capturas y generador Astro v5.18.2                |

Los archivos propios del portfolio eran `index.html`, tres hojas CSS/entrada, `logo.svg`, tres imágenes y dos manifests npm. No había README ni instrucciones AGENTS. Se inventarió el árbol completo de 475 archivos; la gran mayoría eran dependencias de terceros incluidas en `node_modules`. Se revisaron manifiestos, lockfile y CSS generado; las dependencias no se tratan como experiencia propia.

## Hallazgos del portfolio anterior

- HTML estático con Tailwind compilado y también cargado mediante CDN en el navegador.
- Dos fuentes de CSS adicionales: una entrada de compilación y una hoja obsoleta con una imagen que no existe.
- Contenido oculto mediante `opacity: 0` hasta ejecutar JavaScript.
- Navegación de escritorio oculta en móvil sin alternativa.
- Proyectos detrás de formación, experiencia y una nube de tecnologías.
- Estudio de IA presentado como futuro; el propietario confirma que está en curso.
- El botón «Vídeo Demostrativo» abre el perfil de LinkedIn, no un vídeo identificable.
- Sin build definido, pruebas reales, README, canonical, sitemap ni metadata individual de proyectos.
- Capturas PNG de aproximadamente 1,1 y 1,95 MB. Se conservan y se derivan WebP a 720/1440 px.

## Información que se conserva

Formación DAW, prácticas como Software Analyst & Developer en Indra/Minsait y experiencias en Correos y McDonald's. Estas últimas se muestran en un desplegable secundario. Se conservan los tres proyectos, capturas originales y canales profesionales.

No se publican fechas de empleo no proporcionadas, años de experiencia, clientes adicionales, métricas comerciales, precios, testimonios ni certificaciones. Los servicios se vinculan a trabajos existentes y se plantean con alcance por definir.

## Contraste de VIAJA

El README indica Laravel 11 y PHP 8.3, pero `composer.json` declara Laravel 12 y PHP >=8.2; `compose.yaml` utiliza el runtime Sail 8.5. El portfolio utiliza Laravel 12 sin atribuir una versión PHP concreta.

- `routes/web.php`: autenticación, verificación de correo, favoritos, valoración, PDF, enlaces firmados y administración.
- `ViajeController.php`: validación de entrada, Gemini con salida JSON, comprobación de sintaxis JSON, errores, caché, Unsplash y persistencia por días.
- `Viaje.php` y `DiaViaje.php`: relaciones entre usuarios, viajes y días.
- `package.json`: Vue, Inertia y Tailwind. `composer.json`: Breeze, Dompdf y cliente Gemini.
- `compose.yaml`: MySQL y Redis.
- No se atribuye generación asíncrona de itinerarios: la llamada a Gemini del controlador es síncrona.
- No se promete información turística correcta, costes reales en tiempo real, ahorro medido ni seguridad absoluta. Se explica que el viajero debe revisar las propuestas de IA.
- Solo se utiliza la captura real disponible. No se recrean pantallas internas ni se publica un enlace etiquetado como vídeo sin verificarlo.

## Arquitectura y copy

Se conserva HTML estático, ahora generado desde módulos Node sin dependencias de ejecución. Esto permite compartir cabecera, footer y metadata sin añadir hidratación ni routing cliente. Se conservan archivos estáticos en la raíz para no exigir un cambio de fuente en Pages; `dist/` ofrece un paquete limpio.

Se valoraron tres titulares: «Webs y software para necesidades reales», «Construyo el software que tu idea necesita» y «Tu próximo paso. Bien construido.». Se elige el tercero, acompañado inmediatamente por una explicación explícita de desarrollo web y aplicaciones. Su función es dar personalidad sin afirmar resultados no demostrados.

Dirección visual: composición editorial, marfil, tinta y verde. Capturas amplias, secciones abiertas, servicios en filas y un único recurso interactivo de capas de software. Animaciones CSS y entrada con IntersectionObserver; no hay librería de movimiento.

## Límites de la verificación

Las webs comerciales responden y se han inspeccionado en navegador. No se dispone de sus repositorios privados; el stack publicado se limita a tecnologías observadas. No se atribuyen mejoras de conversión ni resultados SEO.

La consulta inicial sin autenticación de la configuración de Pages devolvió 404. Posteriormente se verificó la publicación de la PR #1 en la URL pública. Se conserva HTML en la raíz. Los resultados de la revisión posterior están documentados en `docs/validation.md`.
