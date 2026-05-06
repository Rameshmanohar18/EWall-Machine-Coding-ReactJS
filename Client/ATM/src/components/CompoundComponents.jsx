import { createContext, useContext, useState } from "react";

// ================================================================
// COMPOUND COMPONENT PATTERN
// Parent manages shared state; children access it via context.
// No prop drilling — children just "know" their parent's state.
// ================================================================

// ── Tabs ─────────────────────────────────────────────────────
const TabsCtx = createContext(null);

function Tabs({ children, defaultTab }) {
  const [active, setActive] = useState(defaultTab);
  return (
    <TabsCtx.Provider value={{ active, setActive }}>
      <div>{children}</div>
    </TabsCtx.Provider>
  );
}

function TabList({ children }) {
  return (
    <div style={{
      display: "flex", gap: "var(--s1)",
      borderBottom: "1px solid var(--gb)", marginBottom: "var(--s4)"
    }}>
      {children}
    </div>
  );
}

function Tab({ id, children }) {
  const { active, setActive } = useContext(TabsCtx);
  const isActive = active === id;
  return (
    <button
      onClick={() => setActive(id)}
      style={{
        padding: "8px 16px", border: "none", cursor: "pointer",
        background: "transparent", fontFamily: "var(--font)",
        fontSize: "var(--sm)", fontWeight: isActive ? 700 : 400,
        color: isActive ? "var(--a2)" : "var(--t2)",
        borderBottom: isActive ? "2px solid var(--a2)" : "2px solid transparent",
        marginBottom: -1, transition: "all var(--tr)"
      }}
    >
      {children}
    </button>
  );
}

function TabPanel({ id, children }) {
  const { active } = useContext(TabsCtx);
  if (active !== id) return null;
  return (
    <div style={{ animation: "fadeIn .2s ease" }}>
      {children}
    </div>
  );
}

// ── Accordion ────────────────────────────────────────────────
const AccordionCtx = createContext(null);

function Accordion({ children, allowMultiple = false }) {
  const [open, setOpen] = useState([]);

  const toggle = (id) => {
    if (allowMultiple) {
      setOpen(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
    } else {
      setOpen(prev => prev.includes(id) ? [] : [id]);
    }
  };

  return (
    <AccordionCtx.Provider value={{ open, toggle }}>
      <div style={{ display: "flex", flexDirection: "column", gap: "var(--s2)" }}>
        {children}
      </div>
    </AccordionCtx.Provider>
  );
}

function AccordionItem({ id, title, children }) {
  const { open, toggle } = useContext(AccordionCtx);
  const isOpen = open.includes(id);

  return (
    <div style={{
      border: `1px solid ${isOpen ? "var(--a)" : "var(--gb)"}`,
      borderRadius: "var(--r2)", overflow: "hidden",
      transition: "border-color var(--tr)"
    }}>
      <button
        onClick={() => toggle(id)}
        style={{
          width: "100%", padding: "12px 16px",
          display: "flex", justifyContent: "space-between", alignItems: "center",
          background: isOpen ? "var(--abg)" : "var(--glass2)",
          border: "none", cursor: "pointer", fontFamily: "var(--font)",
          fontSize: "var(--base)", fontWeight: 600,
          color: isOpen ? "var(--a2)" : "var(--t1)",
          transition: "all var(--tr)"
        }}
      >
        {title}
        <span style={{
          transform: isOpen ? "rotate(180deg)" : "rotate(0deg)",
          transition: "transform .25s ease", color: "var(--t3)"
        }}>▼</span>
      </button>
      {isOpen && (
        <div style={{
          padding: "12px 16px", color: "var(--t2)", fontSize: "var(--sm)",
          borderTop: "1px solid var(--gb)", animation: "slideUp .2s ease"
        }}>
          {children}
        </div>
      )}
    </div>
  );
}

// ── Demo ─────────────────────────────────────────────────────
export default function CompoundComponents() {
  return (
    <div className="card">
      <h2 className="card-title">🧩 Compound Components</h2>
      <p style={{ marginBottom: "var(--s6)" }}>
        Parent manages shared state via <code>Context</code>. Child components
        (<code>Tab</code>, <code>TabPanel</code>, <code>AccordionItem</code>) consume it
        without any prop drilling — they just work when placed inside the parent.
      </p>

      {/* Tabs demo */}
      <div style={{ marginBottom: "var(--s8)" }}>
        <div className="label" style={{ marginBottom: "var(--s3)" }}>Tabs Component</div>
        <Tabs defaultTab="overview">
          <TabList>
            <Tab id="overview">Overview</Tab>
            <Tab id="features">Features</Tab>
            <Tab id="code">Code</Tab>
          </TabList>
          <TabPanel id="overview">
            <p>This is the <strong style={{ color: "var(--a2)" }}>Overview</strong> tab content.
              Switch tabs without any prop drilling.</p>
          </TabPanel>
          <TabPanel id="features">
            <p>This is the <strong style={{ color: "var(--ok)" }}>Features</strong> tab.
              Each TabPanel only renders when active.</p>
          </TabPanel>
          <TabPanel id="code">
            <code style={{ display: "block", padding: "var(--s3)", background: "var(--glass2)",
              borderRadius: "var(--r1)", fontSize: "var(--xs)" }}>
              {"<Tabs defaultTab='overview'>\n  <TabList>\n    <Tab id='overview'>Overview</Tab>\n  </TabList>\n  <TabPanel id='overview'>Content</TabPanel>\n</Tabs>"}
            </code>
          </TabPanel>
        </Tabs>
      </div>

      {/* Accordion demo */}
      <div>
        <div className="label" style={{ marginBottom: "var(--s3)" }}>Accordion Component (single open)</div>
        <Accordion>
          <AccordionItem id="q1" title="What is the Compound Component pattern?">
            It lets a parent component share implicit state with its children via Context,
            so children can communicate without explicit prop passing.
          </AccordionItem>
          <AccordionItem id="q2" title="When should I use it?">
            Use it for UI components like Tabs, Accordion, Select, or any component
            where multiple sub-components need to share state.
          </AccordionItem>
          <AccordionItem id="q3" title="What's the alternative?">
            Prop drilling or render props — both are more verbose and harder to maintain
            compared to the compound component pattern.
          </AccordionItem>
        </Accordion>
      </div>
    </div>
  );
}
