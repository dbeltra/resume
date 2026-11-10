import React, { useEffect, useReducer, useRef, useState } from "react";
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
import { PAGES, SKILLS, CODE } from "./data";
import AppTile, { APPS } from "./components/AppTile";
import PhoneHome from "./PhoneHome";
import Crash from "./components/Crash";
import ShakeCursor from "./desktop/ShakeCursor";
import AboutDialog from "./desktop/AboutDialog";
import Notifications from "./desktop/Notifications";
import Spotlight from "./desktop/Spotlight";
import TrashDialog from "./desktop/TrashDialog";
import Alert from "./desktop/Alert";
import ContextMenu from "./desktop/ContextMenu";
import { tile } from "./desktop/missionControl";
import { confetti } from "./components/confetti";
import PdfIcon from "./assets/icons/apps/pdf.png"; // desktop file
import { prefersReducedMotion } from "./components/genie";
import FolderIcon from "./assets/icons/apps/folder.png";
import FileIcon from "./assets/icons/apps/file.png";
import TrashIcon from "./assets/icons/apps/trash.png";

// Change Wallpaper cycles these; 0 is the default image from the CSS.
const WALLPAPERS = [
  null,
  "linear-gradient(135deg, #1e1b4b, #7e22ce 50%, #f472b6)",
  "radial-gradient(circle at 30% 20%, #7094db, #1b2440 70%)",
  "linear-gradient(160deg, #0f172a, #134e4a 60%, #a3e635)",
  "linear-gradient(180deg, #fde68a, #f97316 45%, #7c2d12)",
];

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
  const booted = useRef(false);
  useEffect(() => {
    booted.current = true;
  }, []);
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

  // sudo hire-me: confetti, then Mail opens with a draft already written
  const [draft, setDraft] = useState(0); // bump to remount Mail with the draft
  const hire = () => {
    confetti();
    setDraft((n) => n + 1);
    open("mail");
  };

  // rm -rf /: glitch -> kernel panic -> boot screen -> fresh desktop.
  // Restart / Shut Down in the system menu reuse the same screens.
  const [crash, setCrash] = useState(null);
  const later = (fn, ms) => setTimeout(fn, ms);
  const restart = () => {
    setCrash("boot");
    later(() => {
      booted.current = false; // windows just appear after a reboot
      dispatch({ type: "closeAll" });
      go("about");
      setCrash(null);
      later(() => (booted.current = true));
    }, 2600);
  };
  const rmrf = () => {
    const glitch = prefersReducedMotion() ? 0 : 1400; // straight to the panic
    if (glitch) setCrash("glitch");
    later(() => setCrash("panic"), glitch);
    later(restart, glitch + 3000);
  };
  const [about, setAbout] = useState(false);

  // right-click on the desktop
  const [ctx, setCtx] = useState(null);
  const [folders, setFolders] = useState([]);
  const [folderAlert, setFolderAlert] = useState(null);
  const newFolder = () =>
    setFolders((f) =>
      f.length >= 5 // ponytail: cap so the icon column never runs off screen
        ? f
        : f.concat(
            t("desktop.ctx.untitled") + (f.length ? ` ${f.length + 1}` : ""),
          ),
    );
  const [wall, setWall] = useState(() => {
    try {
      return Number(localStorage.getItem("wallpaper")) || 0;
    } catch {
      return 0;
    }
  });
  const nextWall = () =>
    setWall((w) => {
      const n = (w + 1) % WALLPAPERS.length;
      try {
        localStorage.setItem("wallpaper", n);
      } catch {}
      return n;
    });

  // Spotlight: ⌘K / ctrl+K / ctrl+space, or the magnifier in the menu bar
  const [spot, setSpot] = useState(false);
  useEffect(() => {
    if (phone) return;
    const key = (e) => {
      const k = e.key.toLowerCase();
      if (((e.metaKey || e.ctrlKey) && k === "k") || (e.ctrlKey && k === " ")) {
        e.preventDefault();
        setSpot((v) => !v);
      }
    };
    window.addEventListener("keydown", key);
    return () => window.removeEventListener("keydown", key);
  }, [phone]);
  const spotItems = () => [
    ...PAGES.map((p) => ({
      id: `page-${p}`,
      kind: "page",
      app: "browser",
      label: t(`desktop.pages.${p}`),
      keywords: `${p} davidbeltra.com/${p}`,
      act: () => go(p),
    })),
    ...["browser", "code", "term", "pdf", "mail", "trash"].map((id) => ({
      id: `app-${id}`,
      kind: "app",
      app: id === "trash" ? undefined : id,
      icon: "delete",
      label: t(`desktop.dock.${id}`),
      act: () => (id === "browser" ? go(page) : open(id)),
    })),
    ...JSON.parse(CODE.experience).map((j) => ({
      id: `job-${j.company}-${j.dates}`,
      kind: "job",
      icon: "work",
      label: `${j.title} @ ${j.company}`,
      keywords: `${j.dates} ${j.stack.join(" ")}`,
      act: () => go("experience"),
    })),
    ...Object.values(SKILLS)
      .flat()
      .flatMap((sk) => (sk.name ? sk.name.split(" · ") : [t(sk.nameKey)]))
      .map((name) => ({
        id: `skill-${name}`,
        kind: "skill",
        icon: "bolt",
        label: name,
        act: () => go("skills"),
      })),
    ...files.map((f) => ({
      id: `file-${f.label}`,
      kind: "file",
      icon: f.label.includes(".") ? "description" : "folder",
      label: f.label,
      act: f.act,
    })),
    {
      id: "cmd-about",
      kind: "command",
      icon: "person",
      label: t("desktop.menu.about"),
      act: () => setAbout(true),
    },
    {
      id: "cmd-mc",
      kind: "command",
      icon: "grid_view",
      label: "Mission Control",
      act: enterMc,
    },
    {
      id: "cmd-restart",
      kind: "command",
      icon: "restart_alt",
      label: t("desktop.menu.restart"),
      act: restart,
    },
    {
      id: "cmd-off",
      kind: "command",
      icon: "power_settings_new",
      label: t("desktop.menu.shutDown"),
      act: () => setCrash("off"),
    },
    ...[
      ["en", "English"],
      ["es", "Español"],
      ["ca", "Català"],
    ].map(([code, name]) => ({
      id: `lang-${code}`,
      kind: "language",
      icon: "translate",
      label: name,
      keywords: "language idioma",
      act: () => i18n.changeLanguage(code),
    })),
  ];

  // drag CV.pdf onto the Trash
  const [trashCv, setTrashCv] = useState(false);
  const [overTrash, setOverTrash] = useState(false);

  // Mission Control: hot corners (or ctrl+↑) tile every open window
  const [mc, setMc] = useState(null);
  const mcOn = useRef(false);
  mcOn.current = !!mc;
  const enterMc = () => {
    const rects = [...document.querySelectorAll("[data-win]")]
      .filter((el) => !el.getAttribute("aria-hidden"))
      .map((el) => {
        const r = el.getBoundingClientRect();
        return {
          id: el.dataset.win,
          left: r.left,
          top: r.top,
          width: r.width,
          height: r.height,
        };
      });
    if (rects.length) setMc(tile(rects, window.innerWidth, window.innerHeight));
  };
  useEffect(() => {
    if (phone) return;
    let timer;
    const move = (e) => {
      const edge = 3;
      const corner =
        (e.clientX <= edge || e.clientX >= window.innerWidth - edge - 1) &&
        (e.clientY <= edge || e.clientY >= window.innerHeight - edge - 1);
      if (!corner) {
        clearTimeout(timer);
        timer = null;
        return;
      }
      if (!timer) timer = setTimeout(() => !mcOn.current && enterMc(), 150);
    };
    const key = (e) => {
      if (e.key === "Escape") setMc(null);
      if (e.ctrlKey && e.key === "ArrowUp") {
        e.preventDefault();
        mcOn.current ? setMc(null) : enterMc();
      }
    };
    window.addEventListener("mousemove", move);
    window.addEventListener("keydown", key);
    return () => {
      clearTimeout(timer);
      window.removeEventListener("mousemove", move);
      window.removeEventListener("keydown", key);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phone]);

  const win = (id) => ({
    z: 10 + state.order.indexOf(id),
    onFocus: () => dispatch({ type: "focus", id }),
    onClose: () => dispatch({ type: "close", id }),
    onMinimize: () => dispatch({ type: "minimize", id }),
    minimized: !!state.min[id],
    dockId: id,
    // windows already open on page load just appear; later ones genie in
    animateOpen: booted.current,
    cascade: state.slot[id] || 0,
    phone,
    overview: mc?.[id] && {
      ...mc[id],
      onPick: () => {
        setMc(null);
        dispatch({ type: "focus", id });
      },
    },
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
      drag: "cv",
    },
    {
      label: "Agents.md",
      icon: FileIcon,
      act: () => open("code", "agents"),
    },
    ...folders.map((name) => ({
      label: name,
      icon: FolderIcon,
      act: () => setFolderAlert(name),
    })),
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
      {state.open.term && (
        <Terminal win={win("term")} onHire={hire} onCrash={rmrf} />
      )}
      {state.open.pdf && <Preview win={win("pdf")} />}
      {state.open.mail && (
        <Mail key={draft} win={win("mail")} draft={draft > 0} />
      )}
      {/* desktop only: phones have no Trash */}
      {!phone && state.open.trash && <Trash win={win("trash")} />}
    </>
  );

  if (phone) {
    return (
      <>
        <div className={crash === "glitch" ? "glitch" : ""}>
          <PhoneHome onOpen={open} onGo={go} page={page} />
          {apps}
        </div>
        {crash && crash !== "glitch" && (
          <Crash phase={crash} offText={t("desktop.off")} onWake={restart} />
        )}
      </>
    );
  }

  return (
    <main
      className={`relative h-screen w-screen overflow-hidden ${crash === "glitch" ? "glitch" : ""} bg-page-bg bg-cover bg-center font-sans text-ink-text`}
      style={
        WALLPAPERS[wall] ? { backgroundImage: WALLPAPERS[wall] } : undefined
      }
      onContextMenu={(e) => {
        // only the bare desktop; windows, dock and icons keep the browser's menu
        if (e.target.closest("section, header, nav, aside, [role=dialog]"))
          return;
        e.preventDefault();
        setCtx({ x: e.clientX, y: e.clientY });
      }}
    >
      {crash && crash !== "glitch" && (
        <Crash phase={crash} offText={t("desktop.off")} onWake={restart} />
      )}
      <MenuBar
        appName={front ? t(`desktop.apps.${front}`) : "David Beltrà"}
        menu={state.menu}
        onMenu={(id) => dispatch({ type: "menu", id })}
        onOpen={open}
        onGo={go}
        onCloseAll={() => dispatch({ type: "closeAll" })}
        onAbout={() => {
          dispatch({ type: "menu", id: null });
          setAbout(true);
        }}
        onRestart={() => {
          dispatch({ type: "menu", id: null });
          restart();
        }}
        onSpotlight={() => {
          dispatch({ type: "menu", id: null });
          setSpot(true);
        }}
        onShutDown={() => {
          dispatch({ type: "menu", id: null });
          setCrash("off");
        }}
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
            draggable={!!f.drag}
            onDragStart={(e) =>
              f.drag && e.dataTransfer.setData("text/x-desktop", f.drag)
            }
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

      {mc && (
        <button
          type="button"
          aria-label={t("desktop.labels.exitMc")}
          onClick={() => setMc(null)}
          className="fixed inset-0 z-[9400] cursor-default bg-black/35 backdrop-blur-sm"
        />
      )}
      {apps}
      {trashCv && <TrashDialog onClose={() => setTrashCv(false)} />}
      {folderAlert && (
        <Alert
          icon={FolderIcon}
          title={t("desktop.ctx.emptyTitle", { name: folderAlert })}
          body={t("desktop.ctx.emptyBody")}
          buttons={[
            { label: "OK", act: () => setFolderAlert(null), primary: true },
          ]}
          onClose={() => setFolderAlert(null)}
        />
      )}
      {ctx && (
        <ContextMenu
          x={ctx.x}
          y={ctx.y}
          onClose={() => setCtx(null)}
          items={[
            { label: t("desktop.ctx.newFolder"), act: newFolder },
            "-",
            { label: t("desktop.ctx.getInfo"), act: () => setAbout(true) },
            { label: t("desktop.ctx.wallpaper"), act: nextWall },
            "-",
            { label: "Mission Control", act: enterMc },
            { label: t("desktop.ctx.spotlight"), act: () => setSpot(true) },
          ]}
        />
      )}
      <ShakeCursor />
      <Notifications onOpen={open} />
      {spot && <Spotlight items={spotItems()} onClose={() => setSpot(false)} />}
      {about && (
        <AboutDialog
          onClose={() => setAbout(false)}
          onMore={() => {
            setAbout(false);
            go("about");
          }}
        />
      )}

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
          onDragOver={(e) => {
            if (!e.dataTransfer.types.includes("text/x-desktop")) return;
            e.preventDefault();
            setOverTrash(true);
          }}
          onDragLeave={() => setOverTrash(false)}
          onDrop={(e) => {
            e.preventDefault();
            setOverTrash(false);
            if (e.dataTransfer.getData("text/x-desktop") === "cv")
              setTrashCv(true);
          }}
          className={`flex flex-col items-center gap-1 transition-transform hover:-translate-y-1 ${overTrash ? "-translate-y-1 scale-110" : ""}`}
        >
          <img
            src={TrashIcon}
            alt=""
            className={`h-12 w-12 object-contain drop-shadow-md ${overTrash ? "brightness-125" : ""}`}
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
