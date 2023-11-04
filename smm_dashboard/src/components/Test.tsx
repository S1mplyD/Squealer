import { useEffect, useState } from "react";
import { getUser } from "../HTTPcalls";
import { User } from "../utils/types";

const Test: React.FC = () => {
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState<User>();
    useEffect(() => {
        async function fetchData() {
            const user = await getUser("LBAdmin");
            setUser(user);
        }
        fetchData().then(() => {
            setLoading(false);
        });
    }, []);

    if (!loading) {
        return (
            <>
                <img src={user?.profilePicture}></img>
            </>
        );
    }
};

export default Test;
