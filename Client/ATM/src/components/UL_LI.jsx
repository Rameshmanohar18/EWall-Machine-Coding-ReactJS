function UL_LI() {
  const numbers = [];
  for (let i = 1; i <= 8; i++) numbers.push(i);

  const grouped = [];
  for (let i = 0; i < numbers.length; i += 3)
    grouped.push(numbers.slice(i, i + 3));

  return (
    <div className="card">
      <h2 className="card-title">🔢 Grouped Numbers</h2>
      <div style={{ display: "flex", gap: "var(--s4)", flexWrap: "wrap" }}>
        {grouped.map((group, index) => (
          <div key={index} style={{
            background: "var(--glass2)", border: "1px solid var(--gb)",
            borderRadius: "var(--r2)", padding: "var(--s4)", minWidth: 80
          }}>
            <div style={{ fontSize: "var(--xs)", color: "var(--a2)", fontWeight: 700,
              textTransform: "uppercase", letterSpacing: ".08em", marginBottom: "var(--s2)" }}>
              Group {index + 1}
            </div>
            {group.map((num) => (
              <div key={num} style={{ padding: "4px 0", color: "var(--t1)", fontWeight: 600 }}>
                {num}
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

export default UL_LI;