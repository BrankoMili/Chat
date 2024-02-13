import Chatroom from "./chat.js";
import ChatUi from "./ui.js";

// DOM
const formMessage = document.getElementById("form_message");
const updateButton = document.getElementById("update_button");
const displayUsername = document.getElementById("username_display");
const btnGeneral = document.getElementById("btn_general");
const btnJs = document.getElementById("btn_js");
const btnHomeworks = document.getElementById("btn_homeworks");
const btnTests = document.getElementById("btn_tests");
const notificationDiv = document.getElementById("notification_container");
const closeNotificationIcon = document.getElementById(
  "close_notification_icon"
);
const inputColor = document.getElementById("input_color");
const updateColorButton = document.getElementById("update_color_button");

let username = "anonymus"; // username by default

// If username is set in localStorage
if (localStorage.getItem("username")) {
  username = localStorage.getItem("username");
  displayUsername.innerText = username;
} else {
  displayUsername.innerText = "anonymus";
}

let chatroomName = "#general";
// If chatroom is set in localStorage
if (localStorage.getItem("chatroom")) {
  chatroomName = localStorage.getItem("chatroom");
}

const chatroom = new Chatroom(chatroomName, username); // create chatroom

const chatTextUl = document.getElementById("chat_text");
const chatUi1 = new ChatUi(chatTextUl);

const chatDisplay = () => {
  chatUi1.delete();
  chatroom.getChats(data => {
    const li = document.createElement("li");
    li.innerHTML = chatUi1.templateLi(data);
    li.id = data.id;

    if (data.username === username) {
      li.classList.add("li_position_right");
    } else {
      li.classList.remove("li_position_right");
    }
    chatUi1.list.appendChild(li);
  });
};

chatDisplay();

const styleCheck = () => {
  document
    .querySelectorAll(".chatroom_buttons_container button")
    .forEach(btn => {
      if (btn.innerText === chatroom.room) {
        btn.classList.add("selected_room");
      } else {
        btn.classList.remove("selected_room");
      }
    });
};
styleCheck();

// room change buttons events
btnGeneral.addEventListener("click", () => {
  chatroom.room = "#general";
  localStorage.setItem("chatroom", "#general"); // set chatroom in localStorage
  chatDisplay();
  styleCheck();
});
btnJs.addEventListener("click", () => {
  chatroom.room = "#js";
  localStorage.setItem("chatroom", "#js"); // set chatroom in localStorage
  chatDisplay();
  styleCheck();
});
btnHomeworks.addEventListener("click", () => {
  chatroom.room = "#homeworks";
  localStorage.setItem("chatroom", "#homeworks"); // set chatroom in localStorage
  chatDisplay();
  styleCheck();
});
btnTests.addEventListener("click", () => {
  chatroom.room = "#tests";
  localStorage.setItem("chatroom", "#tests"); // set chatroom in localStorage
  chatDisplay();
  styleCheck();
});

// send button event
formMessage.addEventListener("submit", e => {
  e.preventDefault();
  let message = document.getElementById("input_message");
  if (message.value.trim() !== "") {
    chatroom.addChat(message.value);
  } else {
    return;
  }
  formMessage.reset();
});

// update button event
let timer = undefined;
updateButton.addEventListener("click", () => {
  let inputUsername = document.getElementById("input_username");
  chatroom.username = inputUsername.value;
  localStorage.setItem("username", chatroom.username); // set username in localStorage
  username = chatroom.username;
  displayUsername.innerText = chatroom.username; // Change username display

  chatDisplay();
  // SHOW NOTIFICATION
  if (timer === undefined) {
    notificationDiv.style = "display: block";
    timer = setTimeout(() => {
      notificationDiv.style = "display: none";
      timer = undefined;
    }, 3000);
  }

  inputUsername.value = ""; // reset input value
});

// Close notification event
closeNotificationIcon.addEventListener("click", () => {
  clearTimeout(timer);
  timer = undefined;
  notificationDiv.style = "display: none";
});

// Update color event
updateColorButton.addEventListener("click", () => {
  document.querySelector("main").style.backgroundColor = inputColor.value;
  localStorage.setItem("background_color", inputColor.value); // set background color in localStorage
});

// If background color is set in localStorage
if (localStorage.getItem("background_color")) {
  document.querySelector("main").style.backgroundColor =
    localStorage.getItem("background_color");
  inputColor.value = localStorage.getItem("background_color");
} else {
  document.querySelector("main").style.backgroundColor = "#f1f5f1";
}

// delete message
chatTextUl.addEventListener("click", e => {
  if (e.target.tagName === "IMG") {
    let li = document.getElementById(e.target.id);

    let text = "Delete message?";
    if (confirm(text) == true) {
      // user can delete his messages from the database
      chatroom.chats
        .where("id", "==", e.target.id)
        .where("username", "==", localStorage.getItem("username"))
        .get()
        .then(snapshot => {
          snapshot.forEach(doc => {
            doc.ref.delete();
          });
        })
        .catch(err => {
          console.log(`Error: ${err}`);
        });

      li.parentNode.removeChild(li); // Other users can delete chat message from the screen
    }
  }
});
