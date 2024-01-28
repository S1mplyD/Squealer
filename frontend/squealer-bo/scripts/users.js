let nameAsc = true;
let typeAsc = true;
let popularAsc = true;
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
  return response.data;
};

const ban = async (username) => {
  const response = await axios.post("/api/users/ban", null, {
    params: { username },
  });
  return response.data;
};

const unban = async (username) => {
  const response = await axios.post("/api/users/unban", null, {
    params: { username },
  });
  return response.data;
};

const createUserTable = async () => {
  const me = await getMe();
  if (me.status !== 404 && me.data.plan === "admin") {
    const users = await getAll();
    const newMain = document.getElementById("usertable");
    newMain.innerHTML =
      "<table id='table' class='table'>" +
      "<tr><th>Name</th><th>Username</th><th>Mail</th><th>Plan</th><th>Status</th><th>Daily Characters</th><th>Weekly Characters</thWee><th>Monthly Characters</th></tr>" +
      "</table>";
    fillTable(users);
  } else {
    await createLoginForm("usermain");
  }
};

const addCharactersToUser = async (
  username,
  dailyCharacters,
  weeklyCharacters,
  monthlyCharacters,
) => {
  const response = await axios.post(
    `/api/users/user/${username}/addcharacters`,
    {
      dailyCharacters: dailyCharacters,
      weeklyCharacters: weeklyCharacters,
      monthlyCharacters: monthlyCharacters,
    },
  );
  return response.data;
};

const grantPermission = async (username) => {
  const response = await axios.post("/api/users/grantPermissions", null, {
    params: username,
  });
  return response.data;
};
const revokePermission = async (username) => {
  const response = await axios.post("/api/users/revokePermissions", null, {
    params: username,
  });
  return response.data;
};

const orderByName = async () => {
  const orderedUsers = nameAsc
    ? await getUsersByNameAsc()
    : await getUsersByNameDesc();
  nameAsc = !nameAsc;
  const newMain = document.getElementById("usertable");
  newMain.innerHTML =
    "<table id='table' class='table'>" +
    "<tr><th>Name</th><th>Username</th><th>Mail</th><th>Plan</th><th>Status</th><th>Daily Characters</th><th>Weekly Characters</thWee><th>Monthly Characters</th></tr>" +
    "</table>";
  fillTable(orderedUsers);
};
const orderByType = async () => {
  const orderedUsers = typeAsc
    ? await getUsersByTypeAsc()
    : await getUsersByTypeDesc();
  typeAsc = !typeAsc;
  const newMain = document.getElementById("usertable");
  newMain.innerHTML =
    "<table id='table' class='table'>" +
    "<tr><th>Name</th><th>Username</th><th>Mail</th><th>Plan</th><th>Status</th><th>Daily Characters</th><th>Weekly Characters</thWee><th>Monthly Characters</th></tr>" +
    "</table>";
  fillTable(orderedUsers);
};

const orderByPopularity = async () => {
  const orderedUsers = popularAsc
    ? await getUsersByPopularityAsc()
    : await getUsersByPopularityDesc();
  popularAsc = !popularAsc;
  const newMain = document.getElementById("usertable");
  newMain.innerHTML =
    "<table id='table' class='table'>" +
    "<tr><th>Name</th><th>Username</th><th>Mail</th><th>Plan</th><th>Status</th><th>Daily Characters</th><th>Weekly Characters</thWee><th>Monthly Characters</th></tr>" +
    "</table>";
  fillTable(orderedUsers);
};
const fillTable = (items) => {
  const table = document.getElementById("table");
  for (let i of items) {
    table.innerHTML +=
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
};

const getUsersByNameAsc = async () => {
  const response = await axios.get("/api/users/name/asc");
  return response.data;
};

const getUsersByNameDesc = async () => {
  const response = await axios.get("/api/users/name/desc");
  return response.data;
};

const getUsersByTypeAsc = async () => {
  const response = await axios.get("/api/users/type/asc");
  return response.data;
};

const getUsersByTypeDesc = async () => {
  const response = await axios.get("/api/users/type/desc");
  return response.data;
};

const getUsersByPopularityAsc = async () => {
  const response = await axios.get("/api/users/popularity/asc");
  return response.data;
};

const getUsersByPopularityDesc = async () => {
  const response = await axios.get("/api/users/popularity/desc");
  return response.data;
};
