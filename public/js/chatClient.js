const socket = io();
const messages = document.getElementById("messages");
const form = document.getElementById("form");
const input = document.getElementById("input");
// const displayMessages = require("../../src//ultils/displayMessages");

form.addEventListener("submit", (e) => {
  e.preventDefault();
  if (input.value) {
    socket.emit("chat message", input.value);
    input.value = "";
  }
});
document.getElementById("location").addEventListener("click", () => {
  if (!navigator.geolocation) {
    return "Trình duyệt web hiện tại không hỗ trợ vị trí";
  }
  navigator.geolocation.getCurrentPosition((position) => {
    const { latitude, longitude } = position.coords;
    socket.emit("share location", { latitude, longitude });
    socket.on("share location", (urlLocation) => {
      console.log("location: ", urlLocation);
      // displayMessages(urlLocation);
    });
  });
});
//xử lý queryString
const queryString = location.search;
const params = Qs.parse(queryString, {
  ignoreQueryPrefix: true,
});
console.log(params);
const { room, username } = params;
// send queryString
socket.emit("send queryString", { room, username });
//dù server io nhưng client vẫn socket
socket.on("send msg from server to all client", (msg) => {
  //displayMessages
  var item = document.createElement("li");
  item.textContent = JSON.stringify(msg);
  messages.appendChild(item);
  window.scrollTo(0, document.body.scrollHeight);
});
//userList
socket.on("send userList", (userList) => {
  console.log("list user: ", userList);
});
