import axios from "axios";

const getMe = async () => {
  const response = await axios.get("/api/users/me");
  return response.data;
};

const login = async (mail, password) => {
  const response = await axios.post("/api/auth/login", {
    username: mail,
    password: password,
  });
  return response.data;
};

module.exports = { getMe, login };
