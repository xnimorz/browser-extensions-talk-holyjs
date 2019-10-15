(function() {
  let audios = [];
  // https://bugzilla.mozilla.org/show_bug.cgi?id=1254003
  // Подключаем скрипт на страницу
  chrome.runtime.sendMessage({ action: "popupOpened" }, response => {
    audios = response.data;

    const audio = document.createElement("video");
    audio.src = response.data;
    audio.controls = true;
    document.querySelector(".js-audios").appendChild(audio);
    // audios.forEach((item, index) => {
    //   const audiosEl = document.querySelector(".js-audios");
    //   const li = document.createElement("li");
    //   const button = document.createElement("button");
    //   button.innerText = "Play";
    //   button.dataset.index = index;
    //   li.appendChild(button);
    //   audiosEl.appendChild(li);
    // });
  });

  document.querySelector(".js-audios").addEventListener("click", e => {
    if (e.target.dataset.index) {
      const audio = new Audio(audios[e.target.dataset.index]);
      audio.play();
    }
  });
})();
