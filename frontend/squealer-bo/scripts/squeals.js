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
        newMain.innerHTML +=
          "<tr>" +
          "<td>" +
          "<img src='/" +
          i.body +
          "'/>" +
          "</td>" +
          "<td>" +
          i.author +
          "</td>" +
          "<td>" +
          i.type +
          "</td>" +
          "<td>" +
          i.recipients +
          "</td>" +
          "<td>" +
          i.channels +
          "</td>" +
          "<td>" +
          i.locationName +
          "</td>" +
          "<td>" +
          i.positiveReactions +
          "</td>" +
          "<td>" +
          i.negativeReactions +
          "</td>" +
          "</tr>";
      } else {
        newMain.innerHTML +=
          "<tr>" +
          "<td>" +
          i.body +
          "</td>" +
          "<td>" +
          i.author +
          "</td>" +
          "<td>" +
          i.type +
          "</td>" +
          "<td>" +
          i.recipients +
          "</td>" +
          "<td>" +
          i.channels +
          "</td>" +
          "<td>" +
          i.locationName +
          "</td>" +
          "<td>" +
          i.positiveReactions +
          "</td>" +
          "<td>" +
          i.negativeReactions +
          "</td>" +
          "</tr>";
      }
    }
  } else {
    await createLoginForm("squealmain");
  }
};
