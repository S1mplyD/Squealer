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
                <div className="container mx-auto mt-4 p-4 sm:px-6 lg:px-8 rounded-lg bg-orange ">
                    <div>
                        <label htmlFor="manageduserselect" className="font-bold">
                            Selected User:{" "}
                        </label>
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
                    <label htmlFor="characters" className="font-bold">
                        Characters
                    </label>
                    <div id="characters" className="flex flex-row ">
                        <p className="mr-4">
                            Daily Characters Left: {selectedUser?.dailyCharacters}
                        </p>
                        <p className="mr-4">
                            Weekly Characters Left: {selectedUser?.weeklyCharacters}
                        </p>
                        <p className="mr-4">
                            Monthly Characters Left: {selectedUser?.monthlyCharacters}
                        </p>
                    </div>
                    <div>
                        <button
                            className="btn-link bg-grey text-white rounded-lg p-4 m-2 w-[200px]"
                            onClick={handleShowAll}
                        >
                            All squeals
                        </button>
                        <button
                            className="btn-link bg-grey text-white rounded-lg p-4 m-2 w-[200px]"
                            onClick={handleShowPopular}
                        >
                            Popular
                        </button>
                        <button
                            className="btn-link bg-grey text-white rounded-lg p-4 m-2 w-[200px] "
                            onClick={handleShowUnpopular}
                        >
                            Unpopular
                        </button>
                        <button
                            className="btn-link bg-grey text-white rounded-lg p-4 m-2 w-[200px]"
                            onClick={handleShowControversial}
                        >
                            Controversial
                        </button>
                    </div>
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
