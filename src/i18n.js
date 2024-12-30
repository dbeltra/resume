import i18n from "i18next";
import { initReactI18next } from "react-i18next";

const resources = {
  en: {
    translation: {
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
    },
  },
  es: {
    translation: {
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
      skillsTitle: "Mis Habilidades",
      skillsDescription: [
        "Disfruto del mundo del desarrollo donde siempre hay espacio para crecer y explorar cosas nuevas. Me gustan los <b>entornos de equipo</b> donde puedo tanto aprender de mis colegas como ayudarlos con mi experiencia.",
        "Me considero una persona <b>comunicativa y proactiva</b> con una buena capacidad para gestionar tiempo y recursos, además de resolver problemas.",
        "Estoy comprometido a entregar código limpio y bien documentado, con un enfoque en la mantenibilidad y escalabilidad.",
      ],
      skillsLanguages: "Lenguajes y Frameworks",
      skillsTools: "Herramientas",
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
