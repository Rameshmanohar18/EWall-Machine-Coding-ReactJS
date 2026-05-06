import { useRef } from "react";

export default function OTPInput() {
  const inputs = useRef([]);

  const handleChange = (e, i) => {
    if (e.target.value && inputs.current[i + 1]) inputs.current[i + 1].focus();
  };

  const handleKeyDown = (e, i) => {
    if (e.key === "Backspace" && !e.target.value && inputs.current[i - 1])
      inputs.current[i - 1].focus();
  };

  return (
    <div className="card">
      <h2 className="card-title">🔑 OTP Input</h2>
      <p style={{ marginBottom: "var(--s5)" }}>Enter the 6-digit code sent to your device.</p>
      <div className="otp-wrap">
        {[...Array(6)].map((_, i) => (
          <input
            key={i}
            className="otp-input"
            maxLength="1"
            ref={el => inputs.current[i] = el}
            onChange={e => handleChange(e, i)}
            onKeyDown={e => handleKeyDown(e, i)}
          />
        ))}
      </div>
    </div>
  );
}