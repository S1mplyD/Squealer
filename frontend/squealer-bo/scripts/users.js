import getAll from "../HTTPCalls/users";

const createUserTable = async () => {
  const users = await getAll();
};
