import axios from "axios";

const getAll = async () => {
  const response = await axios("/api/users");
  return response.data;
};

module.exports = { getAll };
