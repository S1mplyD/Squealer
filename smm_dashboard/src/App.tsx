import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import CreateSqueal from "./components/CreateSqueal";
import Navbar from "./components/Navbar";
import Login from "./components/Login";
import ManageSMM from "./components/ManageSMM";
import { Analytics } from "./components/Analytics.tsx";
import { Characters } from "./components/Characters.tsx";

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <>
        <header>
          <Navbar></Navbar>
        </header>
        <Routes>
          <Route
            path="/smm/createsqueal"
            element={<CreateSqueal></CreateSqueal>}
          />
          <Route path="/smm/login" element={<Login />} />
          <Route path="/smm/managesmm" element={<ManageSMM />} />
          <Route path="/smm/analytics" element={<Analytics />} />
          <Route path="/smm/characters" element={<Characters />} />
        </Routes>
      </>
    </BrowserRouter>
  );
};

export default App;
