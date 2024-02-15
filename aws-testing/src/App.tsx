import { useState } from 'react';
import './App.css';

function App() {
  const [count, setCount]= useState(0);
  const increment = () => {
    setCount(count+1);
  }
  const decrement = () => {
    setCount(count-1);
  }
  return (
    <>
     <h1 style={{textAlign:"center"}} >Hello world</h1>
     <p style={{width:"100%", textAlign:"center", fontSize:"20px", fontWeight:"bold"}}>Count: {count}</p>
     <div style={{display:"flex", justifyContent:"space-between"}}>
     <button style={{margin:"auto", width:"100%"}} onClick={increment}>Increment</button>
     <button style={{margin:"auto", width:"100%"}} onClick={decrement}>Decrement</button>    
     </div>
    </>
  )
}

export default App
