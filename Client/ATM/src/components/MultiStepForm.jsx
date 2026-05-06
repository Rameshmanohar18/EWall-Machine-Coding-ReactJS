import { useState } from "react";

const STEPS = ["Personal Info", "Location", "Review"];

export default function MultiStepForm() {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({ name: "", city: "" });

  return (
    <div className="card">
      <h2 className="card-title">📝 Multi-Step Form</h2>

      {/* Step indicator */}
      <div className="steps">
        {STEPS.map((label, i) => (
          <>
            <div key={i} className={`step-dot ${step === i + 1 ? "on" : step > i + 1 ? "done" : ""}`}>
              {step > i + 1 ? "✓" : i + 1}
            </div>
            {i < STEPS.length - 1 && <div key={`line-${i}`} className="step-line" />}
          </>
        ))}
      </div>

      <p style={{ marginBottom: "var(--s5)", color: "var(--a2)", fontWeight: 600 }}>
        Step {step}: {STEPS[step - 1]}
      </p>

      {step === 1 && (
        <div className="form-row">
          <label className="label">Full Name</label>
          <input className="input" placeholder="Enter your name"
            value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
        </div>
      )}

      {step === 2 && (
        <div className="form-row">
          <label className="label">City</label>
          <input className="input" placeholder="Enter your city"
            value={form.city} onChange={e => setForm({ ...form, city: e.target.value })} />
        </div>
      )}

      {step === 3 && (
        <div style={{ background: "var(--glass2)", border: "1px solid var(--gb)", borderRadius: "var(--r2)", padding: "var(--s4)", marginBottom: "var(--s5)" }}>
          <div style={{ marginBottom: "var(--s2)" }}><span style={{ color: "var(--t2)" }}>Name: </span><strong>{form.name}</strong></div>
          <div><span style={{ color: "var(--t2)" }}>City: </span><strong>{form.city}</strong></div>
        </div>
      )}

      <div style={{ display: "flex", gap: "var(--s3)" }}>
        <button className="btn btn-ghost" onClick={() => setStep(s => s - 1)} disabled={step === 1}>← Back</button>
        <button className="btn btn-primary" onClick={() => setStep(s => s + 1)} disabled={step === 3}>
          {step === 2 ? "Review →" : "Next →"}
        </button>
      </div>
    </div>
  );
}   
