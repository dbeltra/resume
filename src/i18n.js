import i18n from "i18next";
import { initReactI18next } from "react-i18next";

const resources = {
  en: {
    translation: {
      sidebarTitle: "Resumé",
      aboutTitle: "About Me",
      aboutRole: "Full stack developer",
      aboutDescription: [
        "I'm currently based in Barcelona, and I have worked with a wide range of technologies, both frontend and backend, such as Python, Django, Rust, Javascript or React.",
        "I enjoy challenges and finding ways to learn new skills or improve my current ones.",
      ],
      experienceTitle: "My Experience",
      experienceExperiences: [
        {
          title: "Full Stack developer",
          company: "Ancora Dual",
          dates: "2014 - 2018",
          responsibilities: [
            "I worked as a web designer and developer. We created a customizable CRUD business solution, based on Django and Backbone.",
            "I took a main role on developing Autopractick, a web-based management tool for driving schools, with a Phonegap partner app.",
            "I also enforced agile methodologies to our team workflow.",
          ],
        },
        {
          title: "Web and Python developer",
          company: "pEp Security → Planck Security",
          dates: "2018 - 2024",
          responsibilities: [
            "I joined the company as a frontend developer in charge of the website. My task was migrating a static HTML system to Mezzanine, a Django-based CMS. The website ended including a custom payment and invoicing system.",
            "I also created a Python-based CLI toolchain that worked with the company's decryption backend.",
            "I created a decryption demo solution for our presentations, combining an MQ system for the messages and a Django frontend.",
            "I took a main role in the development of a CLI tool and a Docker solution to decrypt email traffic.",
          ],
        },
        {
          title: "Rust and React developer",
          company: "Planck Security",
          dates: "2024 - 2025",
          responsibilities: [
            "I was in charge of developing the Security Hub, migrating our previous Python CLI tool to a Rust solution.",
            "This project combined several Docker services that interacted through APIs to decrypt, scan, and store encrypted email through a Postfix mail filter.",
            "All the settings and initial configuration could be managed from the browser through a React frontend.",
          ],
        },
      ],
      skillsTitle: "My Skills",
      skillsDescription: [
        "I enjoy the development world where there's always room to grow and explore new things. I like <b>team environments</b> where I get to both learn from my colleagues and help them with my expertise.",
        "I consider myself a <b>comunicative and proactive</b> person with a good ability to manage time and resources, as well as solving problems.",
        "I'm committed to delivering clean, well-documented code with a focus on maintainability and scalability.",
      ],
      skillsLanguages: "Languages & Frameworks",
      skillsTools: "Tools",
      contactTitle: "Contact Me",
      contactDescription: [
        "Whether you want to discuss a new project, need help with development, or have a general inquiry, feel free to reach out! I’m always open to networking and exploring exciting opportunities.",
      ],
      contactEmail: "Email",
      contactEmailText: "For the quickest response, send me an email!",
      contactLinkedin: "Linkedin",
      contactLinkedinText:
        "Let’s connect professionally and grow our networks.",
      contactGithub: "Github",
      contactGithubText:
        "Check out my projects, repositories, and contributions.",
      contactLocation: "Based in",
      contactLocationPlace: "Barcelona, Spain",
      contactLocationText: "Available for remote work.",
      settingsLanguageTitle: "Language settings",
      settingsLanguageHelper: "Customize the language",
      settingsAppearanceTitle: "Interface Appearance",
      settingsAppearanceHelper:
        "Customize the visual appearance of the interface",
      settingsAppearanceOpacityTitle: "Background Opacity",
      settingsAppearanceOpacityHelper:
        "Adjust the transparency of the main interface",
      settingsAppearanceScaleTitle: "Interface Scale",
      settingsAppearanceScaleHelper: "Adjust the overall size of the interface",
      settingsAppearanceScaleOptions: ["Big", "Default", "Small", "Tiny"],
      settingsAppearanceFontTitle: "Font Family",
      searchPlaceholderText: "an awesome developer",
      searchPlaceholder: "Search for...",
      searchSearchingText: "Searching...",
      searchResultsTitle: 'Search Results for "{{placeholderText}}":',
      searchResultsInfo:
        "Looks like I'm the developer you're looking for! Maybe you should",
      searchResultsContact: "contact me",
      consoleWelcomeMessage: [
        "Welcome to my personal console!",
        "* Type {{helpCommand}} for a list of commands.",
        "* Push tab for autocomplete.",
      ],
      consoleInputPlaceholder: "Type a command...",
      consoleHelp: "Available commands",
      consoleUnrecognizedCommand:
        "is not a recognized command. Type {{helpCommand}} for a list of commands.",
      notFoundTitle: "Sorry, but it looks like you're a bit lost.",
      notFoundImg: "Jack from Lost saying: We have to go back!",
      notFoundButton: "Go Back",
      restoreWindowTitle: "Don't worry, everything is under control!",
      restoreWindowImg:
        "'This is fine' meme image, with a dog sitting in a room on fire",
      restoreWindowButton: "Restore window",
    },
  },
  es: {
    translation: {
      sidebarTitle: "Currículum",
      aboutTitle: "Sobre Mí",
      aboutRole: "Desarrollador Full Stack",
      aboutDescription: [
        "Actualmente resido en Barcelona y he trabajado con una amplia gama de tecnologías, tanto de frontend como de backend, como Python, Django, Rust, Javascript o React.",
        "Disfruto de los desafíos y busco formas de aprender nuevas habilidades o mejorar las actuales.",
      ],
      experienceTitle: "Mi Experiencia",
      experienceExperiences: [
        {
          title: "Desarrollador Full Stack",
          company: "Ancora Dual",
          dates: "2014 - 2018",
          responsibilities: [
            "Trabajé como diseñador y desarrollador web. Creamos una solución empresarial CRUD personalizable, basada en Django y Backbone.",
            "Tuve un papel principal en el desarrollo de Autopractick, una herramienta de gestión web para autoescuelas, con una aplicación complementaria en Phonegap.",
            "También implementé metodologías ágiles en el flujo de trabajo de nuestro equipo.",
          ],
        },
        {
          title: "Desarrollador Web y Python",
          company: "pEp Security → Planck Security",
          dates: "2018 - 2024",
          responsibilities: [
            "Me uní a la empresa como desarrollador frontend encargado del sitio web. Mi tarea fue migrar un sistema HTML estático a Mezzanine, un CMS basado en Django. El sitio web incluyó un sistema personalizado de pago y facturación.",
            "También creé una cadena de herramientas CLI basada en Python que trabajaba con el backend de desencriptación de la empresa.",
            "Creé una solución de demostración de desencriptación para nuestras presentaciones, combinando un sistema MQ para los mensajes y un frontend Django.",
            "Tuve un papel principal en el desarrollo de una herramienta CLI y una solución Docker para desencriptar tráfico de correo electrónico.",
          ],
        },
        {
          title: "Desarrollador Rust y React",
          company: "Planck Security",
          dates: "2024 - 2025",
          responsibilities: [
            "Estuve a cargo de desarrollar el Security Hub, migrando nuestra herramienta CLI en Python a una solución en Rust.",
            "Este proyecto combinó varios servicios Docker que interactuaban a través de APIs para desencriptar, escanear y almacenar correos electrónicos cifrados a través de un filtro de correo Postfix.",
            "Todos los ajustes y la configuración inicial podían gestionarse desde el navegador a través de un frontend en React.",
          ],
        },
      ],
      skillsTitle: "Mis Aptitudes",
      skillsDescription: [
        "Disfruto del mundo del desarrollo donde siempre hay espacio para crecer y explorar cosas nuevas. Me gustan los <b>entornos de equipo</b> donde puedo tanto aprender de mis colegas como ayudarlos con mi experiencia.",
        "Me considero una persona <b>comunicativa y proactiva</b> con una buena capacidad para gestionar tiempo y recursos, además de resolver problemas.",
        "Estoy comprometido a entregar código limpio y bien documentado, con un enfoque en la mantenibilidad y escalabilidad.",
      ],
      skillsLanguages: "Lenguajes y Frameworks",
      skillsTools: "Herramientas",
      contactTitle: "Contáctame",
      contactDescription: [
        "Ya sea que quieras discutir un nuevo proyecto, necesites ayuda con desarrollo, o tengas una consulta general, ¡no dudes en contactarme! Siempre estoy abierto a hacer networking y explorar oportunidades emocionantes.",
      ],
      contactEmail: "Correo Electrónico",
      contactEmailText: "¡Para una respuesta más rápida, envíame un correo!",
      contactLinkedin: "Linkedin",
      contactLinkedinText:
        "Conectemos profesionalmente y hagamos crecer nuestras redes.",
      contactGithub: "Github",
      contactGithubText: "Revisa mis proyectos, repositorios y contribuciones.",
      contactLocation: "Residencia",
      contactLocationPlace: "Barcelona, España",
      contactLocationText: "Disponible para trabajo remoto.",
      settingsLanguageTitle: "Configuración de Idioma",
      settingsLanguageHelper: "Personaliza el idioma",
      settingsAppearanceTitle: "Apariencia de la Interfaz",
      settingsAppearanceHelper:
        "Personaliza la apariencia visual de la interfaz",
      settingsAppearanceOpacityTitle: "Opacidad del Fondo",
      settingsAppearanceOpacityHelper:
        "Ajusta la transparencia de la interfaz principal",
      settingsAppearanceScaleTitle: "Escala de la Interfaz",
      settingsAppearanceScaleHelper: "Ajusta el tamaño general de la interfaz",
      settingsAppearanceScaleOptions: [
        "Grande",
        "Por Defecto",
        "Pequeña",
        "Minúscula",
      ],
      settingsAppearanceFontTitle: "Familia Tipográfica",
      searchPlaceholderText: "un desarrollador fantástico",
      searchPlaceholder: "Buscar...",
      searchSearchingText: "Buscando...",
      searchResultsTitle: 'Resultados de búsqueda para "{{placeholderText}}":',
      searchResultsInfo:
        "¡Parece que soy el desarrollador que buscas! Quizás deberías",
      searchResultsContact: "contactarme",
      consoleWelcomeMessage: [
        "Bienvenido/a a mi consola personal!",
        "* Escribe {{helpCommand}} para una lista de los comandos disponibles.",
        "* Presiona tab para autocompletar.",
      ],
      consoleInputPlaceholder: "Escribe un comando...",
      consoleHelp: "Comandos disponibles",
      consoleUnrecognizedCommand:
        "no es un comando reconocido. Escribe {{helpCommand}} para una lista de los comandos disponibles.",
      notFoundTitle: "Disculpa, pero pareces un poco perdido.",
      notFoundImg: "Jack de Perdicos diciendo: We have to go back!",
      notFoundButton: "Volver",
      restoreWindowTitle: "Tranquilo, está todo bajo control!",
      restoreWindowImg:
        "Imagen del meme 'This is fine', con un perro sentado en una habitación en llamas",
      restoreWindowButton: "Restaurar ventana",
    },
  },
  ca: {
    translation: {
      sidebarTitle: "Currículum",
      aboutTitle: "Sobre Mi",
      aboutRole: "Desenvolupador Full Stack",
      aboutDescription: [
        "Actualment visc a Barcelona i he treballat amb un ampli ventall de tecnologies, tant de frontend com de backend, com Python, Django, Rust, Javascript o React.",
        "M'agraden els reptes i trobar maneres d'aprendre noves habilitats o millorar les meves actuals.",
      ],
      experienceTitle: "La Meva Experiència",
      experienceExperiences: [
        {
          title: "Desenvolupador Full Stack",
          company: "Ancora Dual",
          dates: "2014 - 2018",
          responsibilities: [
            "Vaig treballar com a dissenyador i desenvolupador web. Vam crear una solució empresarial CRUD personalitzable, basada en Django i Backbone.",
            "Vaig assumir un paper principal en el desenvolupament d'Autopractick, una eina de gestió basada en web per a autoescoles, amb una aplicació per a socis de Phonegap.",
            "També vaig aplicar metodologies àgils al nostre flux de treball en equip.",
          ],
        },
        {
          title: "Desenvolupador Web i Python",
          company: "pEp Security → Planck Security",
          dates: "2018 - 2024",
          responsibilities: [
            "Em vaig incorporar a l'empresa com a desenvolupador frontend a càrrec del lloc web. La meva tasca era migrar un sistema HTML estàtic a Mezzanine, un CMS basat en Django. El lloc web va incloure un sistema de pagament i facturació personalitzat.",
            "També vaig crear una cadena d'eines CLI basada en Python que funcionava amb el backend de desxifrat de l'empresa.",
            "Vaig crear una solució de demostració de desxifrat per a les nostres presentacions, combinant un sistema MQ per als missatges i una interfície de Django.",
            "Vaig assumir un paper principal en el desenvolupament d'una eina CLI i una solució Docker per desxifrar el trànsit de correu electrònic.",
          ],
        },
        {
          title: "Desenvolupador Rust i React",
          company: "Planck Security",
          dates: "2024 - 2025",
          responsibilities: [
            "Vaig ser l'encarregat de desenvolupar el Security Hub, migrant la nostra eina CLI de Python anterior a una solució Rust.",
            "Aquest projecte va combinar diversos serveis de Docker que van interactuar mitjançant API per desxifrar, escanejar i emmagatzemar el correu electrònic xifrat mitjançant un filtre de correu Postfix.",
            "Tots els paràmetres i la configuració inicial es podrien gestionar des del navegador mitjançant una interfície de React.",
          ],
        },
      ],
      skillsTitle: "Les Meves Habilitats",
      skillsDescription: [
        "M'agrada el món del desenvolupament on sempre hi ha espai per créixer i explorar coses noves. M'agraden els <b>entorns de treball en equip</b> on puc aprendre dels meus companys i ajudar-los amb la meva experiència.",
        "Em considero una persona <b>comunicativa i proactiva</b> amb una bona capacitat per gestionar el temps i els recursos, així com per resoldre problemes.",
        "Estic compromès a oferir codi net i ben documentat, amb un enfocament en el manteniment i l'escalabilitat.",
      ],
      skillsLanguages: "Llenguatges i Frameworks",
      skillsTools: "Eines",
      contactTitle: "Contacta Amb Mi",
      contactDescription: [
        "Si vols parlar d'un projecte nou, necessites ajuda amb el teu codi o tenss una consulta general, no dubtis a posar-te en contacte! Sempre estic obert a fer xarxa i explorar oportunitats emocionants.",
      ],
      contactEmail: "Correu Electrònic",
      contactEmailText:
        "Per a una resposta més ràpida, envieu-me un correu electrònic!",
      contactLinkedin: "Linkedin",
      contactLinkedinText:
        "Connectem-nos professionalment i fem créixer les nostres xarxes.",
      contactGithub: "Github",
      contactGithubText:
        "Consulta els meus projectes, repositoris i contribucions.",
      contactLocation: "Ubicació",
      contactLocationPlace: "Barcelona, Espanya",
      contactLocationText: "Disponible per a treball remot.",
      settingsLanguageTitle: "Configuració de l'Idioma",
      settingsLanguageHelper: "Personalitza l'idioma",
      settingsAppearanceTitle: "Aspecte de la Interfície",
      settingsAppearanceHelper:
        "Personalitza l'aspecte visual de la interfície.",
      settingsAppearanceOpacityTitle: "Opacitat del Fons",
      settingsAppearanceOpacityHelper:
        "Ajusta la transparència de la interfície principal.",
      settingsAppearanceScaleTitle: "Escala de la Interfície",
      settingsAppearanceScaleHelper: "Ajusta la mida general de la interfície.",
      settingsAppearanceScaleOptions: [
        "Gran",
        "Predeterminat",
        "Petit",
        "Diminut",
      ],
      settingsAppearanceFontTitle: "Família de Fonts",
      searchPlaceholderText: "un desenvolupador fantàstic",
      searchPlaceholder: "Cerca...",
      searchSearchingText: "Cercant...",
      searchResultsTitle: 'Resultats de la cerca per a "{{placeholderText}}":',
      searchResultsInfo:
        "Sembla que sóc el desenvolupador que estàs buscant! Potser hauries de",
      searchResultsContact: "contactar amb mi",
      consoleWelcomeMessage: [
        "Bienvingut/da a la meva consola personal!",
        "* Escriu {{helpCommand}} per veure una llista de les comandes disponibles.",
        "* Pressiona tab per a autocompletar.",
      ],
      consoleInputPlaceholder: "Escriu una comanda...",
      consoleHelp: "Comandes disponibles",
      consoleUnrecognizedCommand:
        "no es una comanda reconegura. Escriu {{helpCommand}} per veure una llista de les comandes disponibles.",
      notFoundTitle: "Disculpa, pro sembles una mica perdut.",
      notFoundImg: "Jack de Lost dient: We have to go back!",
      notFoundButton: "Tornar",
      restoreWindowTitle: "Tranquil, està tot controlat!",
      restoreWindowImg:
        "Imatge del meme 'This is fine', amb un gos assegut en una habitació en flames",
      restoreWindowButton: "Restaurar finestra",
    },
  },
};

i18n.use(initReactI18next).init({
  resources,
  lng: "en", // Default language
  fallbackLng: "en", // Fallback language
  interpolation: {
    escapeValue: false, // React already escapes by default
  },
});

export default i18n;
