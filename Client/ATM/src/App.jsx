// import { useState } from 'react'
// import reactLogo from './assets/react.svg'
// import viteLogo from './assets/vite.svg'
// import heroImg from './assets/hero.png'
// import './App.css'

// function App() {
//   const [count, setCount] = useState(0)

//   return (
//     <>
//       <section id="center">
//         <div className="hero">
//           <img src={heroImg} className="base" width="170" height="179" alt="" />
//           <img src={reactLogo} className="framework" alt="React logo" />
//           <img src={viteLogo} className="vite" alt="Vite logo" />
//         </div>
//         <div>
//           <h1>Get started</h1>
//           <p>
//             Edit <code>src/App.jsx</code> and save to test <code>HMR</code>
//           </p>
//         </div>
//         <button
//           type="button"
//           className="counter"
//           onClick={() => setCount((count) => count + 1)}
//         >
//           Count is {count}
//         </button>
//       </section>

//       <div className="ticks"></div>

//       <section id="next-steps">
//         <div id="docs">
//           <svg className="icon" role="presentation" aria-hidden="true">
//             <use href="/icons.svg#documentation-icon"></use>
//           </svg>
//           <h2>Documentation</h2>
//           <p>Your questions, answered</p>
//           <ul>
//             <li>
//               <a href="https://vite.dev/" target="_blank">
//                 <img className="logo" src={viteLogo} alt="" />
//                 Explore Vite
//               </a>
//             </li>
//             <li>
//               <a href="https://react.dev/" target="_blank">
//                 <img className="button-icon" src={reactLogo} alt="" />
//                 Learn more
//               </a>
//             </li>
//           </ul>
//         </div>
//         <div id="social">
//           <svg className="icon" role="presentation" aria-hidden="true">
//             <use href="/icons.svg#social-icon"></use>
//           </svg>
//           <h2>Connect with us</h2>
//           <p>Join the Vite community</p>
//           <ul>
//             <li>
//               <a href="https://github.com/vitejs/vite" target="_blank">
//                 <svg
//                   className="button-icon"
//                   role="presentation"
//                   aria-hidden="true"
//                 >
//                   <use href="/icons.svg#github-icon"></use>
//                 </svg>
//                 GitHub
//               </a>
//             </li>
//             <li>
//               <a href="https://chat.vite.dev/" target="_blank">
//                 <svg
//                   className="button-icon"
//                   role="presentation"
//                   aria-hidden="true"
//                 >
//                   <use href="/icons.svg#discord-icon"></use>
//                 </svg>
//                 Discord
//               </a>
//             </li>
//             <li>
//               <a href="https://x.com/vite_js" target="_blank">
//                 <svg
//                   className="button-icon"
//                   role="presentation"
//                   aria-hidden="true"
//                 >
//                   <use href="/icons.svg#x-icon"></use>
//                 </svg>
//                 X.com
//               </a>
//             </li>
//             <li>
//               <a href="https://bsky.app/profile/vite.dev" target="_blank">
//                 <svg
//                   className="button-icon"
//                   role="presentation"
//                   aria-hidden="true"
//                 >
//                   <use href="/icons.svg#bluesky-icon"></use>
//                 </svg>
//                 Bluesky
//               </a>
//             </li>
//           </ul>
//         </div>
//       </section>

//       <div className="ticks"></div>
//       <section id="spacer"></section>
//     </>
//   )
// }

// export default App


// import Pattern from "./components/Pattern";
// import NumberList from "./components/CRUD_add";
// import Login from "./components/Login";
// import ATM from "./components/ATM";
// import UL_LI from "./components/UL_LI";

// function App() {
//   return (
//     <div>
//       <Pattern />
//       <hr />
//       <NumberList />
//       <hr />
//       <Login />
//       <ATM/>
//       <UL_LI/>
//     </div>
//   );
// }

// export default App;

import  { useState, useEffect } from "react";
import Login from "./components/Login";
import Profile from "./components/Profile";
import ATM from "./components/ATM";
import Pattern from "./components/Pattern"
import CRUD_add from "./components/CRUD_add";
import UL_LI from "./components/UL_LI";
import Spreadsheet from "./components/Spreadsheet";
import Kanban from "./components/Kanban";
import InfiniteScroll from "./components/InfiniteScroll";
import DebounceSearch from "./components/Debounce";
import DynamicForm from "./components/DynamicForm";
import ShoppingCart from "./components/ShoppingCart"
import ModalManager from "./components/ModalManager";
import PaginationTable from "./components/Pagination";
import GmailClone from "./components/GmailClone";
import OTPInput from "./components/OTPInput";
import MultiStepForm from "./components/MultiStepForm";
import DataTable from "./components/DataTable";
import AutoComplete from "./components/AutoComplete";
import FileExplorer from "./components/FileExplorer";
import { useTheme } from "./components/ThemeToggle";
import GoogleDocs from "./components/GoogleDocs"
import Chat from "./components/Chat";
import UndoRedo from "./components/UndoRedo";
import MiniReactRouter from "./components/MiniReactRouter"




function App() {

  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Check localStorage on reload
  useEffect(() => {
    const user = localStorage.getItem("user");
    if (user) {
      setIsLoggedIn(true);
    }
  }, []);

  return (
    <div>
      {isLoggedIn ? (
        <Profile setIsLoggedIn={setIsLoggedIn} />
      ) : (
        <Login setIsLoggedIn={setIsLoggedIn} />
      )}
     <ATM/>
     <br></br>
     <Pattern/>
        <br></br>
     <CRUD_add/>
        <br></br>
     <UL_LI/>
        <br></br>
<Spreadsheet/>
   <br></br>
<ShoppingCart/>
   <br></br>
<DebounceSearch/>
   <br></br>
<DynamicForm/>
   <br></br>
<Kanban/>
   <br></br>
<ModalManager/>
   <br></br>
<PaginationTable/>
   <br></br>




<GmailClone/>
   <br></br>

<OTPInput/>
   <br></br>

<MultiStepForm/>
   <br></br>

<DataTable/>
   <br></br>

<AutoComplete/>
   <br></br>

<FileExplorer/>
   <br></br>

<GoogleDocs/>
   <br></br>

<Chat/> 
   <br></br>

<UndoRedo/>
   <br></br>

<MiniReactRouter/>
   <br></br>
<InfiniteScroll/>
    </div>
  );
}

export default App;