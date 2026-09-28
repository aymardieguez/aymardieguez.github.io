export const profile = {
  name: 'Aymar Salgado Dieguez',
  email: 'salgadodieguezaymar@gmail.com',
  url: 'https://aymardieguez.github.io',
  github: 'https://github.com/aymardieguez',
  linkedin: 'https://www.linkedin.com/in/aymar-salgado-dieguez',
};

// Spanish content is kept separate from templates for a future, authored English edition.
export const projects = [
  {
    slug: 'jose-vale',
    name: 'José Vale',
    discipline: 'Osteopatía',
    type: 'Web para cliente',
    category: 'Diseño y desarrollo web',
    headline: 'Una consulta profesional. Una presencia digital a su altura.',
    summary: 'Una web que presenta la consulta, explica sus servicios y acerca al visitante al contacto.',
    url: 'https://josevaleosteopata.es/',
    color: 'jose',
    imageAlt:
      'Página de inicio real de José Vale, con presentación de la consulta y botón para reservar cita',
    context:
      'Web profesional desarrollada como proyecto freelance para la consulta de osteopatía de José Vale en Viveiro.',
    need: 'Presentar al profesional y sus tratamientos con una estructura comprensible, y facilitar que quien busca información encuentre cómo contactar.',
    solution:
      'Una página principal con presentación, servicios y equipo, acompañada de páginas de tratamiento y un acceso destacado al contacto.',
    details: [
      [
        'Contenido con jerarquía',
        'La información se organiza desde una presentación breve hasta el detalle de cada servicio. El visitante puede explorar la consulta antes de decidirse a contactar.',
      ],
      [
        'Contacto visible',
        'Los enlaces para reservar cita conducen a la página de contacto. La web también ofrece teléfono y acceso directo a WhatsApp.',
      ],
      [
        'Identidad y navegación',
        'Fotografía de la consulta, tipografía clara y un acento turquesa construyen una identidad reconocible. La navegación conecta servicios, equipo y contacto.',
      ],
    ],
    stack: ['Astro', 'HTML', 'CSS', 'JavaScript'],
    stackNote: 'Web estática construida con Astro, HTML, CSS y JavaScript.',
    result:
      'Una web publicada para un negocio real, con información de sus servicios y canales de contacto accesibles desde la navegación.',
    galleryCaption:
      'Página de inicio de José Vale. Puedes visitar la web publicada desde el enlace del proyecto.',
  },
  {
    slug: 'nereida',
    name: 'Nereida Soria',
    discipline: 'Quiromasaje y bienestar',
    type: 'Web para cliente',
    category: 'Diseño y desarrollo web',
    headline: 'De conocer un servicio a dar el primer paso.',
    summary:
      'Una presencia cercana para descubrir los masajes, consultar sus detalles y contactar por WhatsApp.',
    url: 'https://nereidaquiromasajista.es/',
    color: 'nereida',
    imageAlt:
      'Página de inicio real de Nereida Soria, con fotografía de masaje y acceso a la carta de servicios',
    context: 'Proyecto freelance para presentar los servicios de quiromasaje y bienestar de Nereida Soria.',
    need: 'Dar a conocer a la profesional y ayudar al visitante a entender las opciones disponibles antes de solicitar una sesión.',
    solution:
      'Una web de servicios con una dirección visual cálida, carta de masajes, información sobre las sesiones y contacto directo por WhatsApp.',
    details: [
      [
        'Servicios fáciles de explorar',
        'La carta permite consultar cada masaje y acceder a su página de detalle. La web publicada también recoge las duraciones y los bonos.',
      ],
      [
        'Un siguiente paso claro',
        'Los accesos a WhatsApp acompañan la presentación y los servicios para facilitar una conversación con la profesional.',
      ],
      [
        'Una identidad propia',
        'Los tonos cálidos, la fotografía y la combinación tipográfica diferencian esta web y acompañan su contenido de bienestar.',
      ],
    ],
    stack: ['Astro', 'HTML', 'CSS', 'JavaScript'],
    stackNote: 'Astro como base de una web estática, con estilos e interacciones en CSS y JavaScript.',
    result:
      'Una web comercial publicada que reúne presentación, carta de servicios y vías de contacto en una misma experiencia.',
    galleryCaption:
      'Página de inicio de Nereida Soria. Puedes visitar la web publicada desde el enlace del proyecto.',
  },
  {
    slug: 'viaja',
    name: 'VIAJA',
    discipline: 'Planificación de viajes con IA',
    type: 'Proyecto final · DAW',
    category: 'Aplicación web e integración de IA',
    headline: 'Un viaje empieza con preferencias. La aplicación las convierte en un itinerario.',
    summary:
      'Una aplicación completa que conecta preferencias de viaje, generación con Gemini y gestión de itinerarios.',
    url: 'https://github.com/aymardieguez/viaja-tfc',
    color: 'viaja',
    imageAlt: 'Pantalla de bienvenida real de VIAJA, con acceso al registro y al inicio de sesión',
    context:
      'VIAJA es mi proyecto final de Desarrollo de Aplicaciones Web: una aplicación para centralizar la planificación de viajes e integrar generación de itinerarios mediante IA.',
    need: 'Reunir destino, presupuesto, duración e intereses en un único flujo, y conservar la propuesta generada para consultarla o compartirla después.',
    solution:
      'Un frontend en Vue conectado a Laravel mediante Inertia. El backend valida las preferencias, solicita un itinerario a Gemini y almacena el viaje y sus días en una base de datos relacional.',
    details: [
      [
        'Frontend y backend conectados',
        'Inertia permite entregar los datos de los controladores de Laravel a las vistas de Vue. Breeze aporta la base de autenticación y las rutas de usuario requieren verificación del correo.',
      ],
      [
        'IA integrada en un flujo útil',
        'El formulario recoge preferencias y filtros. Laravel solicita una respuesta JSON a Gemini, comprueba su sintaxis y gestiona errores antes de guardar el itinerario. Las recomendaciones generadas requieren revisión del viajero.',
      ],
      [
        'Un itinerario que se puede conservar',
        'El código implementa histórico, favoritos, valoraciones, exportación a PDF y enlaces públicos firmados para compartir un viaje. Las consultas privadas se limitan a los viajes del usuario autenticado.',
      ],
      [
        'Servicios y persistencia',
        'MySQL relaciona usuarios, viajes y días. Se cachean respuestas de Gemini y búsquedas de imágenes de Unsplash; el entorno Docker incluye MySQL y Redis.',
      ],
    ],
    stack: [
      'Vue 3',
      'Laravel 12',
      'PHP',
      'Inertia.js',
      'Breeze',
      'MySQL',
      'Tailwind CSS',
      'Gemini API',
      'Redis',
    ],
    stackNote: '',
    result:
      'Una aplicación de proyecto final con autenticación, creación y gestión de itinerarios, administración y exportación. El código está disponible en GitHub.',
    galleryCaption: 'Pantalla de bienvenida de VIAJA, con acceso al registro y al inicio de sesión.',
  },
];

export const services = [
  [
    '01',
    'Tu negocio necesita una buena web.',
    'Web profesional y landing pages',
    'Una presencia clara para explicar qué haces, presentar tus servicios y facilitar que te contacten.',
    'jose-vale',
  ],
  [
    '02',
    'Tu idea necesita funcionar.',
    'Aplicaciones web',
    'Interfaces, cuentas de usuario, bases de datos y lógica de negocio para construir una aplicación con un propósito concreto.',
    'viaja',
  ],
  [
    '03',
    'Tu proceso necesita una herramienta.',
    'Software a medida',
    'Paneles y herramientas internas adaptados a una necesidad. Empezamos por definir qué debe resolver la primera versión.',
    'viaja',
  ],
  [
    '04',
    'Tus herramientas necesitan conectarse.',
    'APIs e inteligencia artificial',
    'Integraciones y funcionalidades de IA cuando aporten una utilidad concreta, como la generación de itinerarios en VIAJA.',
    'viaja',
  ],
];
