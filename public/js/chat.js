const socket = io("http://localhost:3000");
let idChatRoom = "";

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
    const userExist = document.getElementById(`user_${user._id}`);
    if (!userExist) {
      addUsers(data);
    }
  });

  socket.emit("get_users", (users) => {
    users.map((user) => {
      if (user.email !== email) {
        addUsers(user);
      }
    });
  });

  socket.on("message", (data) => {
    addMessage(data);
  });
}

document.getElementById("users_list").addEventListener("click", (e) => {
  document.getElementById("message_user").innerHTML = "";
  if (e.target && e.target.matches("li.user_name_list")) {
    const idUser = e.target.getAttribute("idUser");
    socket.emit("start_chat", { idUser }, (response) => {
      idChatRoom = response.room.idChatRoom;

      response.messages.forEach((message) => {
        const data = {
          message,
          user: message.to,
        }

        addMessage(data);
      });
    });
  }
});

document.getElementById("user_message").addEventListener("keypress", (e) => {
  if (e.key === "Enter") {
    const message = e.target.value;
    e.target.value = "";
    const data = {
      message,
      idChatRoom,
    };
    socket.emit("message", data);
  }
});
onLoad();

function addMessage(data) {
  const divMessageUser = document.getElementById("message_user");

  divMessageUser.innerHTML += `
    <span class="user_name user_name_date">
      <img class="img_user" src="${data.user.avatar}" />
      <strong>${data.user.name}</strong> &nbsp;
      <span>${dayjs(data.message.created_at).format("DD/MM/YYYY HH:mm")}</span>
    </span>
    <div class="messages"><span class="chat_message">${
      data.message.text
    }</span></div> 
  `;
}

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
