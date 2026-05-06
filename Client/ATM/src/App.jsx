import { useState, useEffect } from "react";
import "./index.css";
import Login from "./components/Login";
import Profile from "./components/Profile";
import ATM from "./components/ATM";
import Pattern from "./components/Pattern";
import CRUD_add from "./components/CRUD_add";
import UL_LI from "./components/UL_LI";
import Spreadsheet from "./components/Spreadsheet";
import Kanban from "./components/Kanban";
import InfiniteScroll from "./components/InfiniteScroll";
import DebounceSearch from "./components/Debounce";
import DynamicForm from "./components/DynamicForm";
import ShoppingCart from "./components/ShoppingCart";
import ModalManager from "./components/ModalManager";
import PaginationTable from "./components/Pagination";
import GmailClone from "./components/GmailClone";
import OTPInput from "./components/OTPInput";
import MultiStepForm from "./components/MultiStepForm";
import DataTable from "./components/DataTable";
import AutoComplete from "./components/AutoComplete";
import FileExplorer from "./components/FileExplorer";
import GoogleDocs from "./components/GoogleDocs";
import Chat from "./components/Chat";
import UndoRedo from "./components/UndoRedo";
import MiniReactRouter from "./components/MiniReactRouter";
import UseMemoDemo from "./components/UseMemoDemo";
import UseCallbackDemo from "./components/UseCallbackDemo";
import UseRefDemo from "./components/UseRefDemo";
import UseReducerDemo from "./components/UseReducerDemo";
import ContextDemo from "./components/ContextDemo";
import CustomHookDemo from "./components/CustomHookDemo";
import ErrorBoundaryDemo from "./components/ErrorBoundary";
import PortalDemo from "./components/PortalDemo";
import ForwardRefDemo from "./components/ForwardRefDemo";
import LazyLoad from "./components/LazyLoad";
// ── Machine coding round components ──────────────────────────
import VirtualList        from "./components/VirtualList";
import ThrottleDemo       from "./components/ThrottleDemo";
import ResizablePanel     from "./components/ResizablePanel";
import NestedComments     from "./components/NestedComments";
import StarRating         from "./components/StarRating";
import ToastSystem        from "./components/ToastSystem";
import TypeaheadSearch    from "./components/TypeaheadSearch";
import UseLocalStorageDemo from "./components/UseLocalStorage";
import PollingDemo        from "./components/PollingDemo";
import CompoundComponents from "./components/CompoundComponents";

function SectionLabel({ children }) {
  return (
    <div style={{
      fontSize: "var(--xs)", fontWeight: 800, letterSpacing: ".12em",
      textTransform: "uppercase", color: "var(--a2)",
      padding: "var(--s2) var(--s4)",
      borderLeft: "3px solid var(--a)",
      background: "var(--abg)",
      borderRadius: "0 var(--r1) var(--r1) 0",
    }}>
      {children}
    </div>
  );
}

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const user = localStorage.getItem("user");
    if (user) setIsLoggedIn(true);
  }, []);

  return (
    <div className="app-wrap">
      {isLoggedIn
        ? <Profile setIsLoggedIn={setIsLoggedIn} />
        : <Login setIsLoggedIn={setIsLoggedIn} />
      }

      <SectionLabel>Core React Hooks</SectionLabel>
      <UseMemoDemo />
      <UseCallbackDemo />
      <UseRefDemo />
      <UseReducerDemo />
      <ContextDemo />

      <SectionLabel>Advanced Patterns</SectionLabel>
      <CustomHookDemo />
      <ForwardRefDemo />
      <ErrorBoundaryDemo />
      <PortalDemo />
      <LazyLoad />

      <SectionLabel>Machine Coding Round Essentials</SectionLabel>
      <VirtualList />
      <ThrottleDemo />
      <ResizablePanel />
      <NestedComments />
      <StarRating />
      <ToastSystem />
      <TypeaheadSearch />
      <UseLocalStorageDemo />
      <PollingDemo />
      <CompoundComponents />

      <SectionLabel>Components</SectionLabel>
      <ATM />
      <Pattern />
      <CRUD_add />
      <UL_LI />
      <Spreadsheet />
      <ShoppingCart />
      <DebounceSearch />
      <DynamicForm />
      <Kanban />
      <ModalManager />
      <PaginationTable />
      <GmailClone />
      <OTPInput />
      <MultiStepForm />
      <DataTable />
      <AutoComplete />
      <FileExplorer />
      <GoogleDocs />
      <Chat />
      <UndoRedo />
      <MiniReactRouter />
      <InfiniteScroll />
    </div>
  );
}

export default App;
