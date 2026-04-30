import { useRef } from "react";

export default function OTPInput() {
  const inputs = useRef([]);

  const handleChange = (e, i) => {
    if (e.target.value && inputs.current[i + 1]) {
      inputs.current[i + 1].focus();
    }
  };

  return (
    <div>
        <h1 className="btn btn-success">OTP Input Here</h1>
      {[...Array(6)].map((_, i) => (
        <input
          key={i}
          maxLength="1"
          ref={el => inputs.current[i] = el}
          onChange={e => handleChange(e, i)}
          style={{ width: 40, margin: 5 }}
        />
      ))}
    </div>
  );
}