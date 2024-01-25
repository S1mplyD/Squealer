import { useEffect, useState } from "react";
import { User } from "../utils/types.ts";
import { getMe, getManagedUsers } from "../HTTPcalls.ts";

export function Analytics() {
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
        managedUsers.push(user);
        setManagedUsers(managedUsers);
      }
    }
    fetchData().then(() => {
      setIsLoading(false);
    });
  }, []);

  const handleChange = () => {
    const selectedValue = (
      document.getElementById("manageduserselect") as HTMLSelectElement
    ).value;
    setSelectedUser(selectedValue);
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
        </div>
      </>
    );
  }
}
