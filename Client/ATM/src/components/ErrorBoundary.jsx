import { Component, useState } from "react";

// ── Error Boundary — must be a CLASS component ───────────────
class Boundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  // Called when a child throws — update state to show fallback
  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  // Called after error is caught — good for logging
  componentDidCatch(error, info) {
    console.error("ErrorBoundary caught:", error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          background: "var(--err-bg)", border: "1px solid rgba(239,68,68,.35)",
          borderRadius: "var(--r2)", padding: "var(--s5)"
        }}>
          <div style={{ color: "var(--err)", fontWeight: 700, marginBottom: "var(--s2)" }}>
            💥 Something went wrong
          </div>
          <div style={{ color: "var(--t2)", fontSize: "var(--sm)", marginBottom: "var(--s4)" }}>
            {this.state.error?.message}
          </div>
          <button
            className="btn btn-danger btn-sm"
            onClick={() => this.setState({ hasError: false, error: null })}
          >
            ↺ Try Again
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

// ── Buggy child component ────────────────────────────────────
function BuggyComponent({ shouldCrash }) {
  if (shouldCrash) throw new Error("Intentional crash for demo!");
  return (
    <div style={{
      background: "var(--ok-bg)", border: "1px solid rgba(16,185,129,.3)",
      borderRadius: "var(--r2)", padding: "var(--s4)", color: "var(--ok)", fontWeight: 600
    }}>
      ✅ Component is healthy. No errors.
    </div>
  );
}

// ── Demo wrapper ─────────────────────────────────────────────
export default function ErrorBoundaryDemo() {
  const [crash, setCrash] = useState(false);

  return (
    <div className="card">
      <h2 className="card-title">🛡 Error Boundary</h2>
      <p style={{ marginBottom: "var(--s5)" }}>
        Error Boundaries are <strong>class components</strong> that catch JavaScript errors
        in their child tree and display a fallback UI instead of crashing the whole app.
        They use <code>getDerivedStateFromError</code> and <code>componentDidCatch</code>.
      </p>

      <button
        className={`btn btn-sm ${crash ? "btn-success" : "btn-danger"}`}
        style={{ marginBottom: "var(--s5)" }}
        onClick={() => setCrash(c => !c)}
      >
        {crash ? "✅ Fix Component" : "💥 Crash Component"}
      </button>

      <Boundary>
        <BuggyComponent shouldCrash={crash} />
      </Boundary>
    </div>
  );
}
