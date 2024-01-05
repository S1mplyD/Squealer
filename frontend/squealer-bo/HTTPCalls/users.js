import axios from "axios";
import { config } from "dotenv";

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

const unblockUser = async (username) => {
  const response = await axios.post("/api/users/unblock", null, {
    params: { username },
  });
};

module.exports = { getAll, getByUsername, blockUser };
