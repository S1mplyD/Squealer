import { useState, useEffect } from "react";
import { User } from "../utils/types";
import { buyCharactersForUser, getManagedUsers, getMe } from "../HTTPcalls";

export function Characters() {
  const [user, setUser] = useState<User>();
  const [price, setPrice] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedUser, setSelectedUser] = useState<User>();

  let pricePerCharacter = 0.05;

  const buyCharacters = async () => {
    if (selectedUser) {
      let daily = document.getElementById("daily") as HTMLInputElement;
      let weekly = document.getElementById("weekly") as HTMLInputElement;
      let monthly = document.getElementById("monthly") as HTMLInputElement;
      const response = await buyCharactersForUser(
        selectedUser.username,
        +daily.value,
        +weekly.value,
        +monthly.value,
      );
      if (response.status === 200) return true;
      else return false;
    }
  };

  const getPrice = () => {
    let daily = document.getElementById("daily") as HTMLInputElement;
    let weekly = document.getElementById("weekly") as HTMLInputElement;
    let monthly = document.getElementById("monthly") as HTMLInputElement;
    let price =
      (+daily.value + +weekly.value + +monthly.value) * pricePerCharacter;
    setPrice(price);
  };

  useEffect(() => {
    const fetchData = async () => {
      const user: User = await getMe();
      setUser(user);
      const managedUsers: User[] = await getManagedUsers(user.username);
      managedUsers.push(user);
      setSelectedUser(managedUsers[0]);
    };

    fetchData().then(() => {
      setLoading(false);
    });
  }, []);

  if (!loading && user && user.plan === "professional") {
    return (
      <div>
        <div>Buy More Characters</div>
        <input
          id="daily"
          type="number"
          placeholder="Daily characters"
          defaultValue={0}
          min={0}
          onChange={getPrice}
        />
        <input
          type="number"
          placeholder="Weekly characters"
          id="weekly"
          defaultValue={0}
          min={0}
          onChange={getPrice}
        />
        <input
          type="number"
          placeholder="Monthly characters"
          id="monthly"
          defaultValue={0}
          min={0}
          onChange={getPrice}
        />
        <div>The price is {price.toFixed(2)}€</div>
        <button
          onClick={async () => {
            const result = await buyCharacters();
            if (result) {
              alert(
                `Characters correctly added to user ${selectedUser?.username}`,
              );
              window.location.reload();
            } else alert("Something went wrong");
          }}
        >
          BUY
        </button>
      </div>
    );
  }
}
