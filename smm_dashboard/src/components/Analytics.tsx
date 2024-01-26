import { useEffect, useState } from "react";
import { Squeal, User } from "../utils/types.ts";
import {
  getMe,
  getManagedUsers,
  getUser,
  getAllUserSqueal,
  getAllPopularSqueals,
  getAllUnpopularSqueals,
  getAllControversialSqueals,
} from "../HTTPcalls.ts";
import Analytic from "./Analytic.tsx";

export function Analytics() {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [user, setUser] = useState<User>();
  const [managedUsers, setManagedUsers] = useState<User[]>();
  const [selectedUser, setSelectedUser] = useState<User>();
  const [showAll, setShowAll] = useState<boolean>(true);
  const [showPopular, setShowPopular] = useState<boolean>(false);
  const [showUnpopular, setShowUnpopular] = useState<boolean>(false);
  const [showControversial, setShowControversial] = useState<boolean>(false);
  const [squeals, setSqueals] =
    useState<{ originalSqueal: Squeal; responses: Squeal[] }[]>();

  useEffect(() => {
    async function fetchData() {
      const user: User = await getMe();
      setUser(user);
      if (user && user.managedAccounts && user.managedAccounts.length > 0) {
        const managedUsers = await getManagedUsers(user.username);
        managedUsers.push(user);
        setManagedUsers(managedUsers);
        const userSqueals: { originalSqueal: Squeal; responses: Squeal[] }[] =
          await getAllUserSqueal(managedUsers[0].username);
        setSqueals(userSqueals);
        setSelectedUser(managedUsers[0]);
        console.log(managedUsers[0]);
      }
    }
    fetchData().then(() => {
      setIsLoading(false);
    });
  }, []);

  const handleShowAll = async () => {
    setShowAll(true);
    setShowPopular(false);
    setShowUnpopular(false);
    setShowControversial(false);
    if (selectedUser) {
      console.log(selectedUser?.username);
      const userSqueals: { originalSqueal: Squeal; responses: Squeal[] }[] =
        await getAllUserSqueal(selectedUser.username);
      setSqueals(userSqueals);
    }
  };

  const handleShowPopular = async () => {
    setShowAll(false);
    setShowPopular(true);
    setShowUnpopular(false);
    setShowControversial(false);
    if (selectedUser) {
      const userSqueals: { originalSqueal: Squeal; responses: Squeal[] }[] =
        await getAllPopularSqueals(selectedUser.username);
      setSqueals(userSqueals);
    }
  };

  const handleShowUnpopular = async () => {
    setShowAll(false);
    setShowPopular(false);
    setShowUnpopular(true);
    setShowControversial(false);
    if (selectedUser) {
      const userSqueals: { originalSqueal: Squeal; responses: Squeal[] }[] =
        await getAllUnpopularSqueals(selectedUser.username);
      setSqueals(userSqueals);
    }
  };

  const handleShowControversial = async () => {
    setShowAll(false);
    setShowPopular(false);
    setShowUnpopular(false);
    setShowControversial(true);
    if (selectedUser) {
      const userSqueals: { originalSqueal: Squeal; responses: Squeal[] }[] =
        await getAllControversialSqueals(selectedUser.username);
      setSqueals(userSqueals);
    }
  };

  const handleChange = async () => {
    const selectedValue = (
      document.getElementById("manageduserselect") as HTMLSelectElement
    ).value;
    const selUser = await getUser(selectedValue);
    await handleChangeSqueals(selUser);
  };

  const handleChangeSqueals = async (selUser: User) => {
    setSelectedUser(selUser);
    if (selUser) {
      if (showAll) {
        const userSqueals: { originalSqueal: Squeal; responses: Squeal[] }[] =
          await getAllUserSqueal(selUser.username);
        setSqueals(userSqueals);
      } else if (showPopular) {
        const userSqueals: { originalSqueal: Squeal; responses: Squeal[] }[] =
          await getAllPopularSqueals(selUser.username);
        setSqueals(userSqueals);
      } else if (showUnpopular) {
        const userSqueals: { originalSqueal: Squeal; responses: Squeal[] }[] =
          await getAllUnpopularSqueals(selUser.username);
        setSqueals(userSqueals);
      } else if (showControversial) {
        const userSqueals: { originalSqueal: Squeal; responses: Squeal[] }[] =
          await getAllControversialSqueals(selUser.username);
        setSqueals(userSqueals);
      }
    }
  };

  if (!isLoading && user && user.plan === "professional") {
    return (
      <>
        <div className="flex flex-row m-4 p-4 bg-orange rounded-lg">
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
          {selectedUser ? (
            <div className="flex flex-row m-4 p-4">
              <ul>
                <li>{selectedUser.dailyCharacters}</li>
                <li>{selectedUser.weeklyCharacters}</li>
                <li>{selectedUser.monthlyCharacters}</li>
              </ul>
            </div>
          ) : null}
          <button onClick={handleShowAll}>All squeals</button>
          <button onClick={handleShowPopular}>Popular</button>
          <button onClick={handleShowUnpopular}>Unpopular</button>
          <button onClick={handleShowControversial}>Controversial</button>
        </div>
        <div>
          {showAll && squeals ? (
            <div>
              {squeals.map((el, index) => (
                <Analytic squeal={el} key={index} />
              ))}
            </div>
          ) : null}

          {showPopular && squeals ? (
            <div>
              {squeals.map((el, index) => (
                <Analytic squeal={el} key={index} />
              ))}
            </div>
          ) : null}

          {showUnpopular && squeals ? (
            <div>
              {squeals.map((el, index) => (
                <Analytic squeal={el} key={index} />
              ))}
            </div>
          ) : null}

          {showControversial && squeals ? (
            <div>
              {squeals.map((el, index) => (
                <Analytic squeal={el} key={index} />
              ))}
            </div>
          ) : null}
        </div>
      </>
    );
  }
}
