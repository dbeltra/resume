import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import reportWebVitals from "./reportWebVitals";
import { HashRouter, Routes, Route, Navigate } from "react-router-dom";
import { ROUTES } from "./routes";
import Layout from "./Layout";
import NotFound from "./pages/NotFound";
import "./i18n";

export default function App() {
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<ROUTES.ABOUT.component />} />
          <Route path="files">
            <Route index element={<Navigate to="/files/about" replace />} />
            {Object.values(ROUTES)
              .filter((route) => route.path.startsWith("/files"))
              .map((route) => (
                <Route
                  key={route.path}
                  path={
                    route.path === "/files"
                      ? "about"
                      : route.path.replace("/files/", "")
                  }
                  element={<route.component />}
                />
              ))}
          </Route>
          <Route path="search" element={<ROUTES.SEARCH.component />} />
          <Route path="widgets" element={<ROUTES.WIDGETS.component />} />
          <Route path="settings" element={<ROUTES.SETTINGS.component />} />
        </Route>
        <Route path="*" element={<NotFound />} />
      </Routes>
    </HashRouter>
  );
}

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);

reportWebVitals();
