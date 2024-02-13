const notificationTitle = document.getElementById("notification_title");
const notificationText = document.getElementById("notification_text");
const successIcon = document.getElementById("success_icon");

class Chatroom {
  constructor(r, u) {
    this.room = r;
    this.username = u;
    this.chats = db.collection("chats");
    this.unsub = false;
  }
  set room(r) {
    this._room = r;
    if (this.unsub) {
      this.unsub();
    }
  }
  set username(u) {
    if (u.length < 2 || u.length > 10 || u.trim() === "") {
      notificationTitle.innerText = "Invalid username";
      notificationText.innerText =
        "Number of characters must be between 2 and 10.";
      successIcon.src = "img/error.svg";
    } else {
      this._username = u;
      notificationTitle.innerText = "Success";
      notificationText.innerHTML = `Your username has been successfully updated.`;
      successIcon.src = "img/success.svg";
    }
    if (this.unsub) {
      this.unsub();
    }
  }
  get room() {
    return this._room;
  }
  get username() {
    return this._username;
  }

  // Method for new chat messages
  async addChat(msg) {
    try {
      // let response = await this.chats.add(message);
      let docRef = await this.chats.doc();

      const message = {
        message: msg,
        username: this.username,
        room: this.room,
        created_at: new Date(),
        id: docRef.id
      };

      let response = await docRef.set(message);
      return response;
    } catch {
      console.error("Error: ", err);
    }
  }

  getChats(callback) {
    this.unsub = this.chats
      .where("room", "==", this.room)
      .orderBy("created_at", "asc")
      .onSnapshot(snapshot => {
        snapshot.docChanges().forEach(change => {
          // snapshot sadrzi niz "promena"
          if (change.type === "added") {
            // svaka promena (change) sadrzi u sebi i dokument i tip promene
            callback(change.doc.data());
          }
        });

        // Scroll to the bottom of the chat
        const chatContainer = document.querySelector(".chat_container");
        chatContainer.scrollTo(0, chatContainer.scrollHeight);
      });
  }
}

export default Chatroom;
