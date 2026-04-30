import {createContext,useContext,useState} from "react";

const Theme=createContext();

export const Provider=({children})=>{
 const[dark,setDark]=useState(false);

 return(
  <Theme.Provider value={{dark,setDark}}>
   <div style={{
     background:dark?"black":"white",
     color:dark?"white":"black",
     minHeight:"100vh"
   }}>
     {children}
   </div>
  </Theme.Provider>
 );
};

export const useTheme=()=>useContext(Theme);