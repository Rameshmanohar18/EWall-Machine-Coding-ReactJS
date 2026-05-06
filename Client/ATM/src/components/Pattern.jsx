function Pattern() {
  const numbers = [5, 4, 3, 2, 1];

  return (
    <div className="card">
      <h2 className="card-title">🔢 Pattern Output</h2>
      <div className="pattern-grid">
        {numbers.map((_, row) => (
          <div className="pattern-row" key={row}>
            {numbers.map((num, col) => (
              <div
                key={col}
                className={`pattern-cell${col === numbers.length - 1 - row ? " hi" : ""}`}
              >
                {col === numbers.length - 1 - row ? "$" : num}
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

export default Pattern;