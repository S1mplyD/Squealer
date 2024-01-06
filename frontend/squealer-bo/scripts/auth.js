async function getMe() {
  const response = await axios.get("/api/users/me").catch((err) => {
    if (err.response.status === 404) {
      return err.response;
    }
  });

  if (response) {
    return response;
  }
}

async function createLoginForm(mainfield) {
  const me = await getMe();
  const main = document.getElementById(mainfield);
  if (me.status === 200 && me.data.plan === "admin") {
    main.innerHTML = "<h1>Welcome " + me.data.username + "</h1>";
  } else {
    main.innerHTML =
      "<h1>Login</h1>" +
      "<form>" +
      '<label for="mail">E-mail:</label><input type="email" name="mail" id="mail" placeholder="E-mail" />' +
      '<label for="password">Password:</label> <input type="password" name="password" id="password" placeholder="Password"/>' +
      '<button type="button" value="login" onclick="login()">Login</button>' +
      "</form>";
  }
}

async function login() {
  const response = await axios.post("/api/auth/login", {
    username: document.getElementById("mail").value,
    password: document.getElementById("password").value,
  });
  document.location.reload();
  return response.data;
}
