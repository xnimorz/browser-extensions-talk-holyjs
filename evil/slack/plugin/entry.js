const CONFIG = {
  editor: "ql-editor",
  buttons: "ql-buttons",
  workspace: "p-workspace__primary_view",
  message: "c-message",
  messageBody: "c-message__body"
};

const STICKERS = {
  hh: {
    html: '<span class="plugin-sticker plugin-sticker_hh" />',
    text: "To see message get slack plugin here: https://xnim.ru/plugin?hh"
  },
  github: {
    html: '<span class="plugin-sticker plugin-sticker_github" />',
    text: "To see message get slack plugin here: https://xnim.ru/plugin?github"
  },
  writing: {
    html: '<span class="plugin-sticker plugin-sticker_writing" />',
    text: "To see message get slack plugin here: https://xnim.ru/plugin?writing"
  }
};

const mo = new MutationObserver(function callback(mutationsList) {
  for (const mutation of mutationsList) {
    mutation.addedNodes.forEach(addedNode => {
      if (
        addedNode.innerText &&
        addedNode.innerText.includes("To see message get slack plugin here:")
      ) {
        if (addedNode.querySelector(`.${CONFIG.message}`)) {
          const messageBody = addedNode.querySelector(`.${CONFIG.messageBody}`);
          const match = messageBody.innerText.match(/\?(.+)/);
          if (match && match[1]) {
            messageBody.innerHTML = STICKERS[match[1]].html;
          }
        }
      }
      if (addedNode.nodeType !== Node.ELEMENT_NODE) return false;
      if (addedNode.classList.contains(CONFIG.editor)) {
        insertStickerSwitcher();
      }
    });
  }
});

const config = {
  attributes: true,
  attributeOldValue: true,
  characterData: true,
  characterDataOldValue: true,
  childList: true,
  subtree: true
};
mo.observe(document, config);

function insertStickerSwitcher() {
  const editor = document.querySelector(`.${CONFIG.editor}`);
  if (editor.parentNode.querySelector(".plugin-button")) {
    return;
  }
  const button = document.createElement("button");
  button.classList.add("plugin-button");
  const span = document.createElement("span");
  span.classList.add("plugin-stickers");
  button.appendChild(span);

  editor.parentNode.querySelector(`.${CONFIG.buttons}`).appendChild(button);

  button.addEventListener("click", function() {
    toggleDropdown();
  });
}

function toggleDropdown() {
  if (!document.querySelector(".plugin-dropdown")) {
    return showDropdown();
  }
  const dropdown = document.querySelector(".plugin-dropdown");
  dropdown.parentNode.removeChild(dropdown);
}

function showDropdown() {
  const template = `
    <div class="plugin-dropdown">      
      <button class="plugin-button plugin-button_switcher js-select-sticker" data-kind='hh'>
        <span class="plugin-sticker plugin-sticker_hh" />
      </button>
      <span class='plugin-delim'> </span>      
      <button class="plugin-button plugin-button_switcher js-select-sticker" data-kind='github'>
        <span class="plugin-sticker plugin-sticker_github" />
      </button>
      <span class='plugin-delim'> </span>
      <button class="plugin-button plugin-button_switcher js-select-sticker" data-kind='writing'>
        <span class="plugin-sticker plugin-sticker_writing" />
      </button>
    </div>
  `;

  const div = document.createElement("div");
  div.classList.add("plugin-anchor");
  div.innerHTML = template;

  document.querySelector(`.${CONFIG.workspace}`).append(div);
  document.querySelectorAll(".js-select-sticker").forEach(item =>
    item.addEventListener("click", e => {
      const sticker = STICKERS[e.currentTarget.dataset.kind];
      const editor = document.querySelector(`.${CONFIG.editor}`);
      editor.innerHTML = `<p>${sticker.text}</p>`;
      toggleDropdown();
      editor.focus();
      editor.dispatchEvent(
        new KeyboardEvent("keydown", {
          bubbles: true,
          cancelable: true,
          keyCode: 13
        })
      );
    })
  );
}
