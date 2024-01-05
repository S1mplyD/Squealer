import axios from "axios";

const getAll = async () => {
  const response = await axios.get("/api/users");
  return response.data;
};

const getByUsername = async (username) => {
  const response = await axios.get(`/api/users/user/${username}`);
  return response.data;
};

const blockUser = async (username, time) => {
  const response = await axios.post("/api/users/block", null, {
    params: { username, time },
  });
  return response.data;
};

module.exports = { getAll, getByUsername, blockUser };
