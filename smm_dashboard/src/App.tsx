import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import CreateSqueal from "./components/CreateSqueal";
import Navbar from "./components/Navbar";
import Test from "./components/Test";
import Login from "./components/Login";
import ManageSMM from "./components/ManageSMM";
import { Analytics } from "./components/Analytics.tsx";

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
          <Route path="/smm/test" element={<Test />} />
          <Route path="/smm/login" element={<Login />} />
          <Route path="/smm/managesmm" element={<ManageSMM />} />
          <Route path={"/smm/analytics"} element={<Analytics />}></Route>
        </Routes>
      </>
    </BrowserRouter>
  );
};

export default App;
