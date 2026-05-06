import { useState } from "react";

const products = [
  { id: 1, name: "📱 Phone",  price: 10000 },
  { id: 2, name: "💻 Laptop", price: 50000 },
];

export default function Cart() {
  const [cart, setCart] = useState([]);

  const add = (product) => {
    const exists = cart.find((c) => c.id === product.id);
    if (exists) setCart(cart.map(c => c.id === product.id ? { ...c, qty: c.qty + 1 } : c));
    else setCart([...cart, { ...product, qty: 1 }]);
  };

  const total = cart.reduce((sum, item) => sum + item.price * item.qty, 0);

  return (
    <div className="card">
      <h2 className="card-title">🛒 Shopping Cart</h2>

      <div style={{ display: "flex", gap: "var(--s3)", marginBottom: "var(--s5)", flexWrap: "wrap" }}>
        {products.map(p => (
          <button key={p.id} className="btn btn-primary" onClick={() => add(p)}>
            + {p.name}
          </button>
        ))}
      </div>

      {cart.length > 0 && (
        <div style={{ display: "flex", flexDirection: "column", gap: "var(--s2)", marginBottom: "var(--s5)" }}>
          {cart.map(c => (
            <div key={c.id} className="scroll-item" style={{ margin: 0, display: "flex", justifyContent: "space-between" }}>
              <span>{c.name} × {c.qty}</span>
              <span style={{ color: "var(--a2)", fontWeight: 700 }}>₹{(c.price * c.qty).toLocaleString()}</span>
            </div>
          ))}
        </div>
      )}

      <div style={{ borderTop: "1px solid var(--gb)", paddingTop: "var(--s4)",
        display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <span style={{ color: "var(--t2)", fontWeight: 600 }}>Total</span>
        <span style={{ fontSize: "var(--xl)", fontWeight: 800, color: "var(--ok)" }}>
          ₹{total.toLocaleString()}
        </span>
      </div>
    </div>
  );
}