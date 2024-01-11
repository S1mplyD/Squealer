const getAll = async () => {
  const response = await axios.get("/api/channels/official");
  return response.data;
};
const createOfficiaChannelsTable = async () => {
  const me = await getMe();
  if (me.status !== 404 && me.data.plan === "admin") {
    const channels = await getAll();
    const newMain = document.getElementById("officialmain");
    newMain.innerHTML =
      "<table id='table'>" +
      "<tr><th>Expand</th><th>Id</th><th>Name</th><th>Squeals</th><th>Channel admins</th><th>Allowed Read</th><th>Allowed Write</th></tr>" +
      "</table>";
    for (let i of channels) {
      newMain.innerHTML +=
        "<tr>" +
        "<td>> </td>" +
        "<td>" +
        i.id +
        "</td>" +
        "<td>" +
        i.name +
        "</td>" +
        "<td>" +
        i.squeals.length +
        "</td>" +
        "<td>" +
        i.channelAdmins.length +
        "</td>" +
        "<td>" +
        i.allowedRead.length +
        "</td>" +
        "<td>" +
        i.allowedWrite.length +
        "</td>" +
        "</tr>";
    }
  } else {
    await createLoginForm("squealmain");
  }
};

const deleteChannel = async (name) => {
  const response = await axios.delete("/api/channels/", null, {
    params: {
      name: name,
    },
  });
  return response.data;
};

const addChannel = async (channelName) => {
  const response = await axios.post("/api/channels", null, {
    params: {
      name: channelName,
      type: "officialchannel",
    },
  });
  return response.data;
};

const editChannel = async (
  name,
  newName,
  allowedRead,
  allowedWrite,
  channelAdmins,
) => {
  const response = await axios.patch("/api/channels/official", {
    name: name,
    newName: newName,
    allowedRead: allowedRead.replaceAll(" ", "").split(","),
    allowedWrite: allowedWrite.replaceAll(" ", "").split(","),
    channelAdmins: channelAdmins.replaceAll(" ", "").split(","),
  });
  return response.data;
};

const updateChannelSqueals = async (channelName, squeals) => {
  const response = await axios.patch(
    `/api/channels/official/${channelName}`,
    squeals.replaceAll(" ", "").split(","),
  );
  return response.data;
};
