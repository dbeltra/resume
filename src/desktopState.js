// Window manager + browser history for the desktop, as a pure reducer so it
// can be tested without rendering.

export const initialState = (page = "about", { browserOpen = true } = {}) => ({
  open: browserOpen ? { browser: true } : {},
  order: browserOpen ? ["browser"] : [], // back to front; last one is focused
  min: {}, // minimized windows stay mounted (and keep their state) but hidden
  slot: { browser: 0 }, // cascade step each window opened at
  menu: null,
  hist: [page],
  hIdx: 0,
  tab: "about", // file open in the Code app
});

const raise = (order, id) => order.filter((w) => w !== id).concat(id);
const unmin = (state, id) => ({ ...state.min, [id]: false });

// A window that wasn't open gets the next cascade step: one per window
// already showing, wrapping after 8. Re-focusing an open one keeps its slot.
const CASCADE_STEPS = 8;
const place = (state, id) => {
  if (state.open[id]) return state.slot;
  const showing = Object.keys(state.open).filter(
    (w) => w !== id && state.open[w] && !state.min[w],
  ).length;
  return { ...state.slot, [id]: showing % CASCADE_STEPS };
};

export function desktopReducer(state, action) {
  switch (action.type) {
    case "open":
      return {
        ...state,
        open: { ...state.open, [action.id]: true },
        order: raise(state.order, action.id),
        min: unmin(state, action.id),
        slot: place(state, action.id),
        menu: null,
        tab: action.tab || state.tab,
      };
    case "focus":
      if (
        state.order[state.order.length - 1] === action.id &&
        !state.min[action.id]
      )
        return state;
      return {
        ...state,
        order: raise(state.order, action.id),
        min: unmin(state, action.id),
      };
    case "minimize":
      // send it to the back so the next window becomes the focused one
      return {
        ...state,
        min: { ...state.min, [action.id]: true },
        order: [action.id, ...state.order.filter((w) => w !== action.id)],
      };
    case "close":
      return {
        ...state,
        open: { ...state.open, [action.id]: false },
        order: state.order.filter((w) => w !== action.id),
        min: unmin(state, action.id),
      };
    case "closeAll":
      return { ...state, open: {}, order: [], min: {}, menu: null };
    case "menu":
      return { ...state, menu: action.id };
    case "tab":
      return { ...state, tab: action.tab };
    case "go": {
      if (state.hist[state.hIdx] === action.page) {
        return {
          ...state,
          open: { ...state.open, browser: true },
          slot: place(state, "browser"),
          order: raise(state.order, "browser"),
          min: unmin(state, "browser"),
          menu: null,
        };
      }
      const hist = state.hist.slice(0, state.hIdx + 1).concat(action.page);
      return {
        ...state,
        hist,
        hIdx: hist.length - 1,
        open: { ...state.open, browser: true },
        slot: place(state, "browser"),
        order: raise(state.order, "browser"),
        min: unmin(state, "browser"),
        menu: null,
      };
    }
    case "back":
      return state.hIdx > 0 ? { ...state, hIdx: state.hIdx - 1 } : state;
    case "forward":
      return state.hIdx < state.hist.length - 1
        ? { ...state, hIdx: state.hIdx + 1 }
        : state;
    default:
      return state;
  }
}

export const currentPage = (state) => state.hist[state.hIdx];
