// import { useState } from "react";

// export default function MultiStepForm() {
//   const [step, setStep] = useState(1);
//   const [form, setForm] = useState({ name: "", city: "" });

//   return (
//     <div>
//         <h1>MultiStepForm Here check</h1>
//       {step === 1 && (
//         <input
//           placeholder="Name"
//           onChange={e => setForm({...form, name:e.target.value})}
//         />
//       )}

//       {step === 2 && (
//         <input
//           placeholder="City"
//           onChange={e => setForm({...form, city:e.target.value})}
//         />
//       )}

//       {step === 3 && <pre>{JSON.stringify(form)}</pre>}

//       <button onClick={()=>setStep(step-1)} disabled={step===1}>Prev</button>
//       <button onClick={()=>setStep(step+1)} disabled={step===3}>Next</button>
//     </div>
//   );
// }   
import { useState } from "react";

const products=[
 {id:1,name:"Phone",price:10000},
 {id:2,name:"Laptop",price:50000}
];

export default function Cart(){
 const[cart,setCart]=useState([]);

 const add=p=>{
   const exist=cart.find(i=>i.id===p.id);

   if(exist){
     setCart(cart.map(i=>
       i.id===p.id?{...i,qty:i.qty+1}:i
     ));
   }else{
     setCart([...cart,{...p,qty:1}]);
   }
 };

 const total=cart.reduce(
   (t,i)=>t+i.price*i.qty,0
 );

 return(
  <div>
    <h1>ShoppingCart here</h1>
   {products.map(p=>(
     <button key={p.id} onClick={()=>add(p)}>
       Add {p.name}
     </button>
   ))}

   <h3>Total ₹{total}</h3>
  </div>
 );
}