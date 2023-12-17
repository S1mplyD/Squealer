import { useEffect, useState } from "react";
import { Analytic, User } from "../utils/types.ts";
import AnalyticComponent from "./Analytic.tsx";
import { getAllUserAnalytics, getManagedUsers, getMe } from "../HTTPcalls.ts";

export function Analytics() {
  const [userAnalytics, setUserAnalytics] = useState<Analytic[]>();
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [user, setUser] = useState<User>();
  const [managedUsers, setManagedUsers] = useState<User[]>();
  const [selectedUser, setSelectedUser] = useState<string>();
  useEffect(() => {
    async function fetchData() {
      const user: User = await getMe();
      setUser(user);
      if (user.managedAccounts && user.managedAccounts.length > 0) {
        const managedUsers = await getManagedUsers(user.username);
        setManagedUsers(managedUsers);
        const analytics = await getAllUserAnalytics(managedUsers[0].username);
        setUserAnalytics(analytics);
      }
    }

    fetchData().then(() => {
      setIsLoading(false);
    });
  }, []);

  const changeAnalytics = async () => {
    if (selectedUser) {
      const analytics = await getAllUserAnalytics(selectedUser);
      setUserAnalytics(analytics);
    }
  };

  const handleChange = () => {
    const selectedValue = (
      document.getElementById("manageduserselect") as HTMLSelectElement
    ).value;
    setSelectedUser(selectedValue);
    changeAnalytics();
  };

  if (!isLoading && user) {
    return (
      <>
        <div className="flex flex-row m-4 p-4 ">
          {managedUsers ? (
            <select
              id="manageduserselect"
              onChange={() => {
                handleChange();
              }}
            >
              {managedUsers.map((managedUser) => (
                <option key={managedUser.username}>
                  {managedUser.username}
                </option>
              ))}
            </select>
          ) : null}
          <div>
            {userAnalytics ? (
              <div className={"flex flex-col"}>
                {userAnalytics.map((userAnalytic) => (
                  <AnalyticComponent
                    analytic={userAnalytic}
                  ></AnalyticComponent>
                ))}
              </div>
            ) : null}
          </div>
        </div>
      </>
    );
  }
}
