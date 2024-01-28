let senderAsc = true;
let dateAsc = true;
let recipientsAsc = true;

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
      "<table id='table' class='table'>" +
      "<tr><th>Id</th><th>Body</th><th>Author</th><th>Date</th><th>Recipients</th><th>Channels</th><th>Location</th><th>Category</th><th>Positive Reactions</th><th>Negative Reactions</th></tr>" +
      "</table>";
    fillTable(squeals);
  } else {
    await createLoginForm("squealmain");
  }
};

const changeSquealRecipients = async (squealId, recipients) => {
  const response = await axios.post(
    `/api/squeals/recipients/${squealId}`,
    recipients.replaceAll(" ", "").split(","),
  );
  return response.data;
};

//TODO
const changeReactions = async (
  squealId,
  positiveReactions,
  negativeReactions,
) => {
  console.log(positiveReactions);
};

const fillTable = (items) => {
  const table = document.getElementById("table");
  for (let i of items) {
    if (i.type === "media") {
      table.innerHTML +=
        "<tr>" +
        "<td>" +
        i._id +
        "</td>" +
        "<td>" +
        "<img src='/" +
        i.body +
        "' class='w-50 h-50'/>" +
        "</td>" +
        "<td>" +
        i.author +
        "</td>" +
        "<td>" +
        i.date +
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
        i.positiveReactions.length +
        "</td>" +
        "<td>" +
        i.negativeReactions.length +
        "</td>" +
        "</tr>";
    } else {
      table.innerHTML +=
        "<tr>" +
        "<td>" +
        i._id +
        "</td>" +
        "<td>" +
        i.body +
        "</td>" +
        "<td>" +
        i.author +
        "</td>" +
        "<td>" +
        i.date +
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
        i.positiveReactions.length +
        "</td>" +
        "<td>" +
        i.negativeReactions.length +
        "</td>" +
        "</tr>";
    }
  }
};

const getSquealsBySenderAsc = async () => {
  const response = await axios.get("/api/squeals/sender/asc");
  return response.data;
};
const getSquealsBySenderDesc = async () => {
  const response = await axios.get("/api/squeals/sender/desc");
  return response.data;
};
const getSquealsByDateAsc = async () => {
  const response = await axios.get("/api/squeals/date/asc");
  return response.data;
};
const getSquealsByDateDesc = async () => {
  const response = await axios.get("/api/squeals/date/desc");
  return response.data;
};
const getSquealsByRecipientsAsc = async () => {
  const response = await axios.get("/api/squeals/recipients/asc");
  return response.data;
};
const getSquealsByRecipientsDesc = async () => {
  const response = await axios.get("/api/squeals/recipients/desc");
  return response.data;
};

const orderBySender = async () => {
  const orderedSqueals = senderAsc
    ? await getSquealsBySenderAsc()
    : await getSquealsBySenderDesc();
  senderAsc = !senderAsc;
  const newMain = document.getElementById("squealtable");
  newMain.innerHTML =
    "<table id='table' class='table'>" +
    "<tr><th>Body</th><th>Author</th><th>Date</th><th>Recipients</th><th>Channels</th><th>Location</th><th>Category</th><th>Positive Reactions</th><th>Negative Reactions</th></tr>" +
    "</table>";
  fillTable(orderedSqueals);
};

const orderByDate = async () => {
  const orderedSqueals = dateAsc
    ? await getSquealsByDateAsc()
    : await getSquealsByDateDesc();
  dateAsc = !dateAsc;
  const newMain = document.getElementById("squealtable");
  newMain.innerHTML =
    "<table id='table' class='table'>" +
    "<tr><th>Body</th><th>Author</th><th>Date</th><th>Recipients</th><th>Channels</th><th>Location</th><th>Category</th><th>Positive Reactions</th><th>Negative Reactions</th></tr>" +
    "</table>";
  fillTable(orderedSqueals);
};

const orderByRecipients = async () => {
  const orderedSqueals = recipientsAsc
    ? await getSquealsByRecipientsAsc()
    : await getSquealsByRecipientsDesc();
  recipientsAsc = !recipientsAsc;
  const newMain = document.getElementById("squealtable");
  newMain.innerHTML =
    "<table id='table' class='table'>" +
    "<tr><th>Body</th><th>Author</th><th>Date</th><th>Recipients</th><th>Channels</th><th>Location</th><th>Category</th><th>Positive Reactions</th><th>Negative Reactions</th></tr>" +
    "</table>";
  fillTable(orderedSqueals);
};
