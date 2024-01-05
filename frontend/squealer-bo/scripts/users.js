import userFunctions from "../HTTPCalls/users";

const createUserTable = async () => {
  const users = await userFunctions.getAll();
};

module.exports = { createUserTable };
