import React, { useEffect, useReducer } from "react";
import { Navigate, useNavigate, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import MenuBar from "./components/MenuBar";
import Browser from "./apps/Browser";
import Code from "./apps/Code";
import Terminal from "./apps/Terminal";
import Preview, { cvFile } from "./apps/Preview";
import Mail from "./apps/Mail";
import Trash from "./apps/Trash";
import { desktopReducer, initialState, currentPage } from "./desktopState";
import { useResponsive } from "./hooks/useResponsive";
import { PAGES } from "./data";
import AppTile, { APPS } from "./components/AppTile";
import PhoneHome from "./PhoneHome";
import PdfIcon from "./assets/icons/apps/pdf.png"; // desktop file
import FolderIcon from "./assets/icons/apps/folder.png";
import FileIcon from "./assets/icons/apps/file.png";
import TrashIcon from "./assets/icons/apps/trash.png";

const usePageParam = () => {
  const { page } = useParams();
  return PAGES.includes(page) ? page : "about";
};

// One state and the same apps for both layouts: a macOS-style desktop, or on
// phones an iOS-style home screen where each app opens full screen.
const Desktop = ({ phone }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const routePage = usePageParam();
  const linkedPage = !!useParams().page;
  // phones start on the home screen unless the link points at a page
  const [state, dispatch] = useReducer(desktopReducer, null, () =>
    initialState(routePage, { browserOpen: !phone || linkedPage }),
  );
  const page = currentPage(state);

  // Keep the address bar and the in-window browser in sync both ways.
  useEffect(() => {
    if (routePage !== page) dispatch({ type: "go", page: routePage });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [routePage]);
  useEffect(() => {
    if (routePage !== page)
      navigate(page === "about" ? "/" : `/${page}`, { replace: true });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);

  const { i18n } = useTranslation();
  const open = (id, tab) => {
    // phones: embedded PDFs are unreliable in mobile browsers, so hand the
    // CV to the phone's own viewer instead of the Preview sheet
    if (phone && id === "pdf") {
      window.open(
        `${process.env.PUBLIC_URL}/cv/${cvFile(i18n.resolvedLanguage)}`,
        "_blank",
        "noopener",
      );
      return;
    }
    dispatch({ type: "open", id, tab });
  };
  const go = (p) => dispatch({ type: "go", page: p });
  const win = (id) => ({
    z: 10 + state.order.indexOf(id),
    onFocus: () => dispatch({ type: "focus", id }),
    onClose: () => dispatch({ type: "close", id }),
    onMinimize: () => dispatch({ type: "minimize", id }),
    minimized: !!state.min[id],
    dockId: id,
    cascade: state.slot[id] || 0,
    phone,
  });
  const front = [...state.order].reverse().find((id) => !state.min[id]);

  const files = [
    {
      label: "resume-src",
      icon: FolderIcon,
      act: () => open("code", "about"),
    },
    {
      label: "CV.pdf",
      icon: PdfIcon,
      act: () => open("pdf"),
    },
    {
      label: "Agents.md",
      icon: FileIcon,
      act: () => open("code", "agents"),
    },
  ];

  const apps = (
    <>
      {state.open.browser && (
        <Browser
          win={win("browser")}
          page={page}
          canBack={state.hIdx > 0}
          canForward={state.hIdx < state.hist.length - 1}
          onBack={() => dispatch({ type: "back" })}
          onForward={() => dispatch({ type: "forward" })}
          onGo={go}
          onOpen={open}
        />
      )}
      {state.open.code && (
        <Code
          win={win("code")}
          tab={state.tab}
          onTab={(tab) => dispatch({ type: "tab", tab })}
        />
      )}
      {state.open.term && <Terminal win={win("term")} />}
      {state.open.pdf && <Preview win={win("pdf")} />}
      {state.open.mail && <Mail win={win("mail")} />}
      {/* desktop only: phones have no Trash */}
      {!phone && state.open.trash && <Trash win={win("trash")} />}
    </>
  );

  if (phone) {
    return (
      <>
        <PhoneHome onOpen={open} onGo={go} page={page} />
        {apps}
      </>
    );
  }

  return (
    <main className="relative h-screen w-screen overflow-hidden bg-page-bg bg-cover bg-center font-sans text-ink-text">
      <MenuBar
        appName={front ? t(`desktop.apps.${front}`) : "David Beltrà"}
        menu={state.menu}
        onMenu={(id) => dispatch({ type: "menu", id })}
        onOpen={open}
        onGo={go}
        onCloseAll={() => dispatch({ type: "closeAll" })}
      />

      <nav
        aria-label={t("desktop.labels.files")}
        className="absolute left-5 top-[52px] flex flex-col gap-3"
      >
        {files.map((f) => (
          <button
            key={f.label}
            type="button"
            onClick={f.act}
            className="flex w-24 flex-col items-center gap-1.5 rounded-lg py-1.5 text-white hover:bg-white/10"
          >
            <img
              src={f.icon}
              alt=""
              className="h-10 w-10 drop-shadow-[0_4px_8px_rgba(40,20,60,0.3)]"
            />
            <span className="rounded-[5px] bg-ink-950/70 px-[7px] py-0.5 text-xs font-medium">
              {f.label}
            </span>
          </button>
        ))}
      </nav>

      <aside
        aria-label={t("desktop.labels.status")}
        className="absolute right-[22px] top-[52px] hidden w-[212px] flex-col gap-2 rounded-xl border border-[#2a2f3b] bg-ink-800/90 p-4 text-[13px] min-[1400px]:flex"
      >
        <div className="font-mono text-[11px] text-ink-muted">status.json</div>
        <div className="flex items-center gap-2 font-semibold">
          <span aria-hidden="true" className="h-2 w-2 rounded-full bg-lilac" />
          {t("desktop.status.roles")}
        </div>
        <div className="text-ink-muted">{t("desktop.status.where")}</div>
        <button
          type="button"
          onClick={() => open("mail")}
          className="text-left text-lilac-text hover:underline"
        >
          dbeltra@gmail.com
        </button>
      </aside>

      {apps}

      <nav
        aria-label={t("desktop.labels.dock")}
        className="absolute bottom-3 left-1/2 z-[950] flex -translate-x-1/2 gap-3.5 rounded-[26px] border border-white/20 bg-[rgba(110,110,120,0.32)] px-3 pb-1 pt-2.5 shadow-[0_8px_30px_rgba(0,0,0,0.18),inset_0_1px_0_rgba(255,255,255,0.15)] backdrop-blur-3xl backdrop-saturate-150"
      >
        {Object.keys(APPS).map((id) => (
          <React.Fragment key={id}>
            {/* separator between the site apps and the documents/mail, like macOS */}
            {id === "pdf" && (
              <span
                aria-hidden="true"
                className="mb-2 w-px self-stretch bg-white/30"
              />
            )}
            <button
              type="button"
              data-dock={id}
              aria-label={t(`desktop.dock.${id}`)}
              title={t(`desktop.dock.${id}`)}
              onClick={() => (id === "browser" ? go(page) : open(id))}
              className="flex flex-col items-center gap-1 transition-transform hover:-translate-y-1"
            >
              <AppTile app={id} size="h-12 w-12 rounded-[11px]" />
              <span
                className={`h-1 w-1 rounded-full ${state.open[id] ? "bg-white/70" : "bg-transparent"}`}
              />
            </button>
          </React.Fragment>
        ))}
        {/* Trash sits at the far right after a separator, like macOS */}
        <span
          aria-hidden="true"
          className="mb-2 w-px self-stretch bg-white/30"
        />
        <button
          type="button"
          data-dock="trash"
          aria-label={t("desktop.dock.trash")}
          title={t("desktop.dock.trash")}
          onClick={() => open("trash")}
          className="flex flex-col items-center gap-1 transition-transform hover:-translate-y-1"
        >
          <img
            src={TrashIcon}
            alt=""
            className="h-12 w-12 object-contain drop-shadow-md"
          />
          <span
            className={`h-1 w-1 rounded-full ${state.open.trash ? "bg-white/70" : "bg-transparent"}`}
          />
        </button>
      </nav>
      <a
        href="https://www.flaticon.com/"
        target="_blank"
        rel="noopener noreferrer"
        className="absolute bottom-2 right-3 text-[11px] text-white/80 hover:text-white"
      >
        {t("desktop.credits")}
      </a>
    </main>
  );
};

const DesktopOrMobile = () => {
  const { isMobile } = useResponsive();
  const { page } = useParams();
  if (page && !PAGES.includes(page)) return <Navigate to="/" replace />;
  return <Desktop phone={isMobile} />;
};

export default DesktopOrMobile;
