import { useState } from "react";

const products = [
  { id: 1, name: "Phone", price: 10000 },
  { id: 2, name: "Laptop", price: 50000 }
];

export default function Cart() {
  const [cart, setCart] = useState([]);

  const add = (product) => {
    const exists = cart.find((c) => c.id === product.id);
    if (exists) {
      setCart(cart.map(c =>
        c.id === product.id ? { ...c, qty: c.qty + 1 } : c
      ));
    } else {
      setCart([...cart, { ...product, qty: 1 }]);
    }
  };

  const total = cart.reduce(
    (sum, item) => sum + item.price * item.qty,
    0
  );

  return (
    <div>
      <h1>ShoppingCart here!!</h1>
      {products.map(p => (
        <button key={p.id} onClick={() => add(p)}>
          Add {p.name}
        </button>
      ))}

      {cart.map(c => (
        <p key={c.id}>
          {c.name} x {c.qty}
        </p>
      ))}

      <h3>Total: ₹{total}</h3>
    </div>
  );
}