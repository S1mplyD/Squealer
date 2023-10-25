import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { User } from "../utils/types";
import { getMe, logout } from "../HTTPcalls";
import Login from "./Login";

const Navbar: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [auth, setAuth] = useState<User>();
  useEffect(() => {
    async function fetchData() {
      const user = await getMe();
      setAuth(user);
    }
    fetchData().then(() => {
      setLoading(false);
    });
  }, []);
  console.log(auth);
  if (!loading && auth) {
    return (
      <div
        className={`container mx-auto px-4 sm:px-6 lg:px-8  rounded-lg bg-orange`}
      >
        <nav className="flex items-center justify-between py-4 ">
          <div>
            <h1 className="text-2xl font-bold">Dashboard</h1>
          </div>
          <div>
            <div>
              <button
                className="p-4 py-2 rounded-lg bg-grey text-white"
                onClick={() => {
                  logout();
                }}
              >
                Logout
              </button>
            </div>
          </div>
        </nav>
        <div className={`py-4 rounded-lg bg-orange`}>
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
            <li>
              <button
                className="btn-link bg-grey text-white rounded-lg p-4 m-2 w-[200px] "
                onClick={() => {
                  navigate("/smm/test");
                }}
              >
                Test
              </button>
            </li>
          </ul>
        </div>
      </div>
    );
  } else {
    return (
      <>
        <Login />
      </>
    );
  }
};

export default Navbar;
