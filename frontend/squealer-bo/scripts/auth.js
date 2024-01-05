import auth from "../HTTPCalls/auth";
const getLoggedUser = async () => {
  return await auth.getMe();
};

const login = async (mail, password) => {
  return await auth.login(mail, password);
};

module.exports = { getLoggedUser, login };
