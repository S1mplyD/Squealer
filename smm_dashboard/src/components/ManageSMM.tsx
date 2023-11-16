import { useEffect, useState } from "react";
import { User } from "../utils/types";
import { addSMM, getMe, getProUsers, getUser, removeSMM } from "../HTTPcalls";
import Autocomplete from "@mui/material/Autocomplete";
import { TextField } from "@mui/material";

const ManageSMM: React.FC = () => {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [user, setUser] = useState<User>();
  const [SMM, setSMM] = useState<User>();
  const [professionals, setProfessionals] = useState<string[]>();
  useEffect(() => {
    const fetchData = async () => {
      const proUsers = await getProUsers();
      let proNames: string[] = [];
      if (proUsers) {
        proUsers.forEach((el: { username: string }) =>
          proNames.push(el.username),
        );
      }
      setProfessionals(proNames);
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
      <>
        {SMM ? (
          <div className="flex flex-row items-center justify-center my-4">
            <div className="flex flex-col items-center justify-between bg-orange rounded-lg w-fit">
              <div>
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
                        const status = await removeSMM(SMM.username);
                        setSMM(undefined);
                        status == 200
                          ? alert("SMM removed correctly")
                          : alert("Cannot remove SMM");
                      }}
                    >
                      Remove SMM
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex flex-row items-center justify-center my-4 ">
            <div className="flex flex-col m-4 p-4 bg-orange w-fit rounded-lg">
              <div className="m-4 p-4 flex flex-col">
                <label htmlFor="username">Username</label>
                {professionals ? (
                  <Autocomplete
                    disablePortal
                    id="combo-box"
                    options={professionals}
                    sx={{ width: 300 }}
                    renderInput={(params) => <TextField {...params} />}
                  ></Autocomplete>
                ) : null}
              </div>
              <button
                className="btn bg-grey text-white rounded-lg m-4 p-4"
                onClick={async () => {
                  const username: string = (
                    document.getElementById("combo-box") as HTMLInputElement
                  ).value;
                  const status = await addSMM(username);
                  const newSmm: User = await getUser(username);
                  setSMM(newSmm);
                  status == 200
                    ? alert("SMM added correctly")
                    : alert("Cannot add SMM");
                }}
              >
                Add SMM
              </button>
            </div>
          </div>
        )}
      </>
    );
  }
};

export default ManageSMM;
