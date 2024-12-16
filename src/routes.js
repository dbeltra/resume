// src/routes.js
import About from "./pages/About";
import Experience from "./pages/Experience";
import Skills from "./pages/Skills";
import Contact from "./pages/Contact";

export const ROUTES = {
  ABOUT: {
    path: "/",
    component: About,
    title: "About.xml",
    icon: "code",
  },
  EXPERIENCE: {
    path: "/experience",
    component: Experience,
    title: "Experience.json",
    icon: "data_object",
  },
  SKILLS: {
    path: "/skills",
    component: Skills,
    title: "Skills.py",
    icon: "description",
  },
  CONTACT: {
    path: "/contact",
    component: Contact,
    title: "Contact.rs",
    icon: "description",
  },
};

export const routesList = Object.values(ROUTES);
