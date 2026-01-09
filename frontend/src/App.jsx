import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import Home from "./assets/Pages/Home";
import GalleryPage from "./assets/Pages/Gallery";
import BookNow from "../src/assets/Pages/BookNow";
function App() {
  const [count, setCount] = useState(0);

  return (
    <>
      <BookNow />
    </>
  );
}

export default App;
