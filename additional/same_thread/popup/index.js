(function() {
  // https://bugzilla.mozilla.org/show_bug.cgi?id=1254003
  // Подключаем скрипт на страницу
  chrome.runtime.sendMessage({ action: 'popupOpened' });
})();
