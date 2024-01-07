const getAll = async () => {
  const response = await axios.get("/api/squeals");
  return response.data;
};
const createSquealTable = async () => {
  const me = await getMe();
  if (me.status !== 404 && me.data.plan === "admin") {
    const squeals = await getAll();
    const newMain = document.getElementById("squealtable");
    newMain.innerHTML =
      "<table id='table'>" +
      "<tr><th>Body</th><th>Author</th><th>Type</th><th>Recipients</th><th>Channels</th><th>Location</th><th>Category</th><th>Positive Reactions</th><th>Negative Reactions</th></tr>" +
      "</table>";
    for (let i of squeals) {
      if (i.type === "media") {
      } else {
      }
      newMain.innerHTML +=
        "<tr>" +
        "<td>" +
        i.body +
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
    await createLoginForm("squealmain");
  }
};
