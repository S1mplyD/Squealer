async function getMe() {
  const main = document.getElementById("main");
  const response = await axios.get("/api/users/me").catch((err) => {
    console.log("here");
    if (err.response.status === 404) {
      main.innerHTML =
        "<h1>Login</h1>" +
        "<form>" +
        '<label for="mail">E-mail:</label><input type="email" name="mail" id="mail" placeholder="E-mail" />' +
        '<label for="password">Password:</label> <input type="password" name="password" id="password" placeholder="Password"/>' +
        '<button type="button" value="login" onclick="login()">Login</button>' +
        "</form>";
    }
  });

  if (response) {
    main.innerHTML = "<h1>Welcome " + response.data.username + "</h1>";
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
