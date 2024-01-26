import { useState, useEffect } from "react";
import { User } from "../utils/types";
import { getMe } from "../HTTPcalls";

export function Characters() {
  const [user, setUser] = useState<User>();
  const [price, setPrice] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);
  let pricePerCharacter = 0.05;

  const buyCharacters = async () => {};

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
        <button onClick={buyCharacters}>BUY</button>
      </div>
    );
  }
}
