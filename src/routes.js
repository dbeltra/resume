import { useTranslation } from "react-i18next";
import About from "./pages/About";
import Experience from "./pages/Experience";
import Skills from "./pages/Skills";
import Contact from "./pages/Contact";
import Search from "./pages/Search";
import Widgets from "./pages/Widgets";
import Settings from "./pages/Settings";

export const ROUTES = {
  ABOUT: {
    path: "/files/about",
    component: About,
    title: "About.xml",
    icon: "code",
  },
  EXPERIENCE: {
    path: "/files/experience",
    component: Experience,
    title: "Experience.json",
    icon: "data_object",
  },
  SKILLS: {
    path: "/files/skills",
    component: Skills,
    title: "Skills.py",
    icon: "description",
  },
  CONTACT: {
    path: "/files/contact",
    component: Contact,
    title: "Contact.rs",
    icon: "description",
  },
  SEARCH: {
    path: "/search",
    component: Search,
    title: "Search.txt",
    icon: "search",
  },
  WIDGETS: {
    path: "/widgets",
    component: Widgets,
    title: "Widgets.md",
    icon: "widgets",
  },
  SETTINGS: {
    path: "/settings",
    component: Settings,
    title: "Settings.toml",
    icon: "settings",
  },
};

export const routesList = Object.values(ROUTES).filter(
  (route) => route.path.startsWith("/files/") || route.path === "/files",
);
