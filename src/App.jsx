import { useState } from "react";
import Protfilo from "./protfilo/Protfilo";
import MilkyWayScene from "./milky way/MilkyWayScene";
import { AppProvider } from "./protfilo/context/AppContext";
function App() {
  const [isMobile, setIsMobile] = useState(false);
  return (
    <AppProvider value={{ isMobile, setIsMobile }}>
      {/* <Protfilo /> */}
      <MilkyWayScene />
    </AppProvider>
  );
}

export default App;
