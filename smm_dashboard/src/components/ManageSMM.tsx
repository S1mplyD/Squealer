import { useEffect, useState } from "react";
import { User } from "../utils/types";
import { addSMM, getMe, getUser, removeSMM } from "../HTTPcalls";

const ManageSMM: React.FC = () => {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [user, setUser] = useState<User>();
  const [SMM, setSMM] = useState<User>();
  useEffect(() => {
    const fetchData = async () => {
      const loggedUser: User = await getMe();
      setUser(loggedUser);
      if (loggedUser.SMM) {
        const smm = await getUser(loggedUser.SMM);
        setSMM(smm);
      }
    };
    fetchData().then(() => {
      setIsLoading(false);
    });
  }, []);

  if (!isLoading && user) {
    return (
      <div className="flex flex-row items-center justify-center my-4">
        <div className="flex flex-col items-center justify-between bg-orange rounded-lg w-fit">
          <div>
            {SMM ? (
              <div className="m-4 p-4">
                <div className="flex flex-row items-center justify-between m-4 p-4">
                  <img
                    src={SMM?.profilePicture}
                    alt="SMM's profile picture"
                    className="w-20 h-20 bg-grey p-2 rounded-lg mx-4"
                  ></img>
                  <div className="flex flex-col">
                    <p>{SMM?.username}</p>
                    <p>{SMM?.name}</p>
                  </div>
                </div>
                <div className="flex flex-row items-center justify-center  m-4 p-4">
                  <button
                    className="btn bg-grey text-white p-4 rounded-lg"
                    onClick={async () => {
                      await removeSMM(SMM.username);
                      location.reload();
                    }}
                  >
                    Remove SMM
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center bg-orange my-4">
                <div>
                  <label htmlFor="username">Username</label>
                  <input
                    type="text"
                    id="username"
                    placeholder="social media manager's username"
                  />
                  <button
                    className="btn bg-grey text-white rounded-lg m-4 p-4"
                    onClick={async () => {
                      await addSMM(
                        (
                          document.getElementById(
                            "username"
                          ) as HTMLInputElement
                        ).value
                      );
                      location.reload();
                    }}
                  >
                    Add SMM
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }
};

export default ManageSMM;
