class ChatUi {
  constructor(l) {
    this.list = l;

    this.currentDate = new Date(); // current date
  }

  set list(l) {
    this._list = l;
  }
  get list() {
    return this._list;
  }

  formatDate(timestamp) {
    let date = timestamp.toDate();
    let day = date.getDate() < 10 ? "0" + date.getDate() : date.getDate();
    let currentMonth = date.getMonth() + 1;
    let month = currentMonth < 10 ? "0" + currentMonth : currentMonth;
    let year = date.getFullYear();
    let hour = date.getHours() < 10 ? "0" + date.getHours() : date.getHours();
    let minutes =
      date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes();

    // check if message is sent today
    if (
      this.currentDate.getDate() === date.getDate() &&
      this.currentDate.getMonth() === date.getMonth() &&
      this.currentDate.getFullYear() === date.getFullYear()
    ) {
      return `${hour}:${minutes}`;
    } else {
      return `${day}.${month}.${year}. - ${hour}:${minutes}`;
    }
  }

  templateLi(obj) {
    return `<span id="username_text_chat">${
      obj.username
    }:</span> <span id="message_text_chat">${
      obj.message
    }</span><br/><span id="date_text_chat">${this.formatDate(
      obj.created_at
    )}</span><img src="img/bin.svg" alt="delete" class="bin_icon" id="${
      obj.id
    }"/>`;
  }

  delete() {
    this.list.innerHTML = "";
  }
}

export default ChatUi;
