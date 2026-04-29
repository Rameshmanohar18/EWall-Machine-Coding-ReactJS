// import React from "react";

function Pattern() {
  const numbers = [5, 4, 3, 2, 1];

  return (
    <div>
      <h3>Pattern Output</h3>

      {numbers.map((_, row) => (
        <div key={row}>
          {numbers.map((num, col) =>
            col === numbers.length - 1 - row ? "$" : num
          )}
        </div>
      ))}
    </div>
  );
}

export default Pattern;