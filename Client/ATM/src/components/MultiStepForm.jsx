import { useState } from "react";

export default function MultiStepForm() {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({ name: "", city: "" });

  return (
    <div>
        <h1>MultiStepForm Here check</h1>
      {step === 1 && (
        <input
          placeholder="Name"
          onChange={e => setForm({...form, name:e.target.value})}
        />
      )}

      {step === 2 && (
        <input
          placeholder="City"
          onChange={e => setForm({...form, city:e.target.value})}
        />
      )}

      {step === 3 && <pre>{JSON.stringify(form)}</pre>}

      <button onClick={()=>setStep(step-1)} disabled={step===1}>Prev</button>
      <button onClick={()=>setStep(step+1)} disabled={step===3}>Next</button>
    </div>
  );
}   
