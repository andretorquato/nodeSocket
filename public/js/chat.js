const socket = io("http://localhost:3000");

function onLoad() {
  const urlParams = new URLSearchParams(window.location.search);
  const name = urlParams.get("name");
  const avatar = urlParams.get("avatar");
  const email = urlParams.get("email");
  document.querySelector(".user_logged").innerHTML += `
    <img
      class="avatar_user_logged"
      src="${avatar}"
    />
    <strong id="user_logged">${name}</strong>
  `;

  socket.emit("start", { name, avatar, email });

  socket.on("new_users", (data) => {
    addUsers(data);
  });

  socket.emit("get_users", (data) => {
    console.log(data);
  });
}

onLoad();

function addUsers(user) {
  document.getElementById("users_list").innerHTML += `
    <li
      class="user_name_list"
      id="user_${user._id}"
      idUser="${user._id}"
    >
      <img
        class="nav_avatar"
        src="${user.avatar}"
      />
      ${user.name}
    </li>
  `;
}
