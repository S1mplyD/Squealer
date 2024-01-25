import { useEffect, useState } from "react";
import { User } from "../utils/types.ts";
import { getMe, getManagedUsers, getUser } from "../HTTPcalls.ts";

export function Analytics() {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [user, setUser] = useState<User>();
  const [managedUsers, setManagedUsers] = useState<User[]>();
  const [selectedUser, setSelectedUser] = useState<User>();

  useEffect(() => {
    async function fetchData() {
      const user: User = await getMe();
      setUser(user);
      if (user.managedAccounts && user.managedAccounts.length > 0) {
        const managedUsers = await getManagedUsers(user.username);
        managedUsers.push(user);
        setManagedUsers(managedUsers);
        setSelectedUser(user);
      }
    }
    fetchData().then(() => {
      setIsLoading(false);
    });
  }, []);

  const handleChange = async () => {
    const selectedValue = (
      document.getElementById("manageduserselect") as HTMLSelectElement
    ).value;
    const selUser = await getUser(selectedValue);
    setSelectedUser(selUser);
  };

  if (!isLoading && user && user.plan === "professional") {
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
            {selectedUser ? (
              <div className="flex flex-row m-4 p-4">
                <ul>
                  <li>{selectedUser.dailyCharacters}</li>
                  <li>{selectedUser.weeklyCharacters}</li>
                  <li>{selectedUser.monthlyCharacters}</li>
                </ul>
              </div>
            ) : null}
          </div>
        </div>
      </>
    );
  }
}
