import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import reportWebVitals from "./reportWebVitals";
import {
  HashRouter,
  Routes,
  Route,
  Navigate,
  useParams,
} from "react-router-dom";
import Desktop from "./Desktop";
import "./i18n";

// Old v1 links (#/files/experience, #/console, ...) keep working.
const LegacyFile = () => <Navigate to={`/${useParams().page}`} replace />;

export default function App() {
  return (
    <HashRouter>
      <Routes>
        {/* one route, so moving between pages never remounts the desktop */}
        <Route path="/:page?" element={<Desktop />} />
        <Route path="/files/:page" element={<LegacyFile />} />
        <Route path="*" element={<Navigate to="/" replace />} />
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
