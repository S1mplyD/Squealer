import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { User } from "../utils/types";
import { getMe } from "../HTTPcalls";
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

  if (!loading && auth && auth.plan === "professional") {
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
              <button className="btn-link bg-grey text-white rounded-lg p-4 m-2 w-[200px]">
                <a href="/api/auth/logout">Logout</a>
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
              <button
                className="btn-link bg-grey text-white rounded-lg p-4 m-2 w-[200px]"
                onClick={() => {
                  navigate("/smm/analytics");
                }}
              >
                Analytics
              </button>
            </li>
            <li>
              <button className="btn-link bg-grey text-white rounded-lg p-4 m-2 w-[200px]">
                Buy More Character
              </button>
            </li>
            <li>
              <button
                className="btn-link bg-grey text-white rounded-lg p-4 m-2 w-[200px]"
                onClick={() => {
                  navigate("/smm/managesmm");
                }}
              >
                Add/Remove SMM
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
