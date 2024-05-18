import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import * as React from 'react';
import RegistrationForm from './components/RegistrationForm'; // Adjust the path if necessary
function App() {
  const [count, setCount] = useState(0);

  return (
    <>
      
      <div>
      <RegistrationForm /> 
        <a href="https://vitejs.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1 className="text-white">Vite + React</h1>
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
        <p>
          Edit <code>src/App.tsx</code> and save to test HMR
        </p>
      </div>
      <div className="read-the-docs font-bold">
        Click on the Vite and React logos to learn more
      </div>
      <div className="font-bold">Classify</div>
    </>
  );
}

export default App;
