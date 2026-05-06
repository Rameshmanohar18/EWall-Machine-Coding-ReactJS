# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.


<!--   -->







Let me check what components you already have first.

Good. You already have 25 components. Here are the most commonly asked React interview concepts you're missing — I'll add all of them:

| Component | Concept |
|---|---|
| `UseMemoDemo` | `useMemo` — expensive computation caching |
| `UseCallbackDemo` | `useCallback` — stable function references |
| `UseRefDemo` | `useRef` — DOM access + persist values |
| `UseReducerDemo` | `useReducer` — complex state management |
| `ContextDemo` | `useContext` + `createContext` — global state |
| `LazyLoad` | `React.lazy` + `Suspense` — code splitting |
| `ErrorBoundary` | Class component error boundary |
| `PortalDemo` | `ReactDOM.createPortal` |
| `CustomHookDemo` | Custom hook (`useFetch`) |
| `ForwardRefDemo` | `forwardRef` + `useImperativeHandle` |

Now wire all 10 new components into `App.jsx`:

The old `App` function is still in the file — let me check and clean it up:

There's a duplicate — the old `App` block is still there. Let me read the full file and rewrite it cleanly:

Clean. Here's everything that was added:

---

**10 new interview-essential components:**

| Component | Concept | What it shows |
|---|---|---|
| `UseMemoDemo` | `useMemo` | Caches factorial — only recomputes when `num` changes, not on unrelated re-renders |
| `UseCallbackDemo` | `useCallback` + `React.memo` | Stable vs unstable function refs — shows why memo'd children re-render unnecessarily without it |
| `UseRefDemo` | `useRef` | DOM access (focus/select), persisting render count & previous value without triggering re-renders |
| `UseReducerDemo` | `useReducer` | Full todo app with ADD/TOGGLE/DELETE/FILTER actions — shows reducer pattern for complex state |
| `ContextDemo` | `createContext` + `useContext` | Theme shared across 3 levels with zero prop drilling |
| `CustomHookDemo` | Custom hook | `useFetch` — reusable hook with loading/error/data/refetch |
| `ForwardRefDemo` | `forwardRef` + `useImperativeHandle` | Parent controls child input via custom ref methods (focus, clear, highlight, getValue) |
| `ErrorBoundaryDemo` | Error Boundary (class) | `getDerivedStateFromError` + `componentDidCatch` — crash a child and recover |
| `PortalDemo` | `ReactDOM.createPortal` | Modal rendered directly into `document.body` outside the component tree |
| `LazyLoad` | `React.lazy` + `Suspense` | Code-split component with skeleton fallback and simulated 1.5s load delay |