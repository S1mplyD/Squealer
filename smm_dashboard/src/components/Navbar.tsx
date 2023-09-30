import { useState } from "react";
import { FiSun, FiMoon } from "react-icons/fi";
import { useNavigate } from "react-router-dom";

const Navbar: React.FC = () => {
  const navigate = useNavigate();
  const [darkMode, setDarkMode] = useState(false);
  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    document.documentElement.classList.toggle("dark");
  };

  return (
    <div
      className={`container mx-auto px-4 sm:px-6 lg:px-8 ${
        darkMode ? "bg-orange" : "bg-orange"
      } rounded-lg`}
    >
      <nav className="flex items-center justify-between py-4 ">
        <div>
          <h1 className="text-2xl font-bold">Dashboard</h1>
        </div>
        <div>
          <button
            className="p-4 py-2 rounded-lg bg-grey text-white"
            onClick={toggleDarkMode}
          >
            {darkMode ? <FiSun /> : <FiMoon />}
            {/* <span className="ml-2">
              {darkMode ? "Light Mode" : "Dark Mode"}
            </span> */}
          </button>
        </div>
      </nav>
      <div
        className={`py-4 rounded-lg ${darkMode ? "bg-orange" : "bg-orange"}`}
      >
        <ul className="flex flex-wrap justify-center space-x-2 sm:justify-center sm:space-x-4">
          <li>
            <button
              className="btn-link bg-grey text-white rounded-lg p-4 m-2 w-[200px] "
              onClick={() => {
                navigate("/smm/createsqueal");
              }}
            >
              Create New Squeal
            </button>
          </li>
          <li>
            <button className="btn-link bg-grey text-white rounded-lg p-4 m-2 w-[200px]">
              Analytics
            </button>
          </li>
          <li>
            <button className="btn-link bg-grey text-white rounded-lg p-4 m-2 w-[200px]">
              Geolocation
            </button>
          </li>
          <li>
            <button className="btn-link bg-grey text-white rounded-lg p-4 m-2 w-[200px]">
              Buy More Character
            </button>
          </li>
          <li>
            <button className="btn-link bg-grey text-white rounded-lg p-4 m-2 w-[200px]">
              Add/Remove SMM
            </button>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Navbar;
