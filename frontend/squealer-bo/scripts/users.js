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
  const me = await getMe();
  if (me.status !== 404 && me.data.plan === "admin") {
    const users = await getAll();
    const newMain = document.getElementById("usertable");
    newMain.innerHTML =
      "<table id='table'>" +
      "<tr><th>Name</th><th>Username</th><th>Mail</th><th>Plan</th><th>Status</th><th>Daily Characters</th><th>Weekly Characters</thWee><th>Monthly Characters</th></tr>" +
      "</table>";
    for (let i of users) {
      newMain.innerHTML +=
        "<tr>" +
        "<td>" +
        i.name +
        "</td>" +
        "<td>" +
        i.username +
        "</td>" +
        "<td>" +
        i.mail +
        "</td>" +
        "<td>" +
        i.plan +
        "</td>" +
        "<td>" +
        i.status +
        "</td>" +
        "<td>" +
        i.dailyCharacters +
        "</td>" +
        "<td>" +
        i.weeklyCharacters +
        "</td>" +
        "<td>" +
        i.monthlyCharacters +
        "</td>" +
        "</tr>";
    }
  } else {
    await createLoginForm("usermain");
  }
};
