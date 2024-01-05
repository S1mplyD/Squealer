import userFunctions from "../HTTPCalls/users";

const createUserTable = async () => {
  const users = await userFunctions.getAll();
  const newMain = document.getElementById("usertable");
  newMain.html(
    "<table id='table'><tr><th>Name</th><th>Username</th></tr></table>",
  );
};

module.exports = { createUserTable };
