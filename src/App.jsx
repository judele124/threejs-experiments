import { useState } from "react";
import MilkyWayScene from "./milkyWay/MilkyWayScene";
import { AppProvider } from "./protfilo/context/AppContext";
function App() {
  const [isMobile, setIsMobile] = useState(false);
  return (
    <AppProvider value={{ isMobile, setIsMobile }}>
      <MilkyWayScene />
    </AppProvider>
  );
}

export default App;
