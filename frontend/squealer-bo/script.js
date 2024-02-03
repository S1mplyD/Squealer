$(document).ready(function() {
    const users = [
      { id: 1, username: "user1", posts: ["post1", "post2"], blocked: false, banned: false, timeLimit: 0 },
      { id: 2, username: "user2", posts: ["post3"], blocked: false, banned: false, timeLimit: 0 }
      // Add more users here
    ];

    // Populate user list
    const userList = $("#users");
    users.forEach(user => {
      userList.append(`<li><a href="#" class="userLink" data-id="${user.id}">${user.username}</a></li>`);
    });

    // Show user details
    $(".userLink").click(function() {
      const userId = parseInt($(this).attr("data-id"));
      const user = users.find(user => user.id === userId);

      $("#userDetails").html(`
        <p>Username: ${user.username}</p>
        <p>Posts: ${user.posts.join(", ")}</p>
      `);

      $("#banUser").off().click(function() {
        user.banned = true;
        $("#userDetails").append("<p>User banned.</p>");
      });

      $("#blockUser").off().click(function() {
        user.blocked = true;
        $("#userDetails").append("<p>User blocked.</p>");
      });

      $("#timeLimit").off().click(function() {
        const time = prompt("Enter time limit (in minutes):");
        user.timeLimit = parseInt(time);
        $("#userDetails").append(`<p>Time limit set: ${time} minutes.</p>`);
      });
    });
  });