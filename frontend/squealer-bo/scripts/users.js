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

const createUserTable = async () => {
  const users = await getAll();
  const newMain = document.getElementById("usertable");
  newMain.html(
    "<table id='table'>" +
      "<tr><th>Name</th><th>Username</th><th>Mail</th><th>Plan</th><th>Status</th><th>Daily Characters</th><th>Weekly Characters</thWee><th>Monthly Characters</th></tr>" +
      "</table>",
  );
  for (let i of users) {
    newMain.append(
      "<tr>" +
        "<td>i.name</td>" +
        "<td>i.username</td>" +
        "<td>i.mail</td>" +
        "<td>i.plan</td>" +
        "<td>i.status</td>" +
        "<td>i.dailycharacters</td>" +
        "<td>i.weeklycharacters</td>" +
        "<td>i.monthlycharacters</td>" +
        "</tr>",
    );
  }
};
