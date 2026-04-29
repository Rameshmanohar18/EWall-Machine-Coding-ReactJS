
function UL_LI() {
  const numbers = [];
  
  for (let i = 1; i <= 8; i++) {
    numbers.push(i);
  }

  const groupSize = 3;

  const grouped = [];
  for (let i = 0; i < numbers.length; i += groupSize) {
    grouped.push(numbers.slice(i, i + groupSize));
  }

  return (
    <div>
      <h3>Grouped Numbers</h3>

      {grouped.map((group, index) => (
        <ul key={index}>
          {group.map((num) => (
            <li key={num}>{num}</li>
          ))}
        </ul>
      ))}
    </div>
  );
}

export default UL_LI;