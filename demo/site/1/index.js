console.log('index.js');

const script = "(function(){console.log('I work inside the script tag, from index.js');})();";

const scriptEl = document.createElement('script');
scriptEl.textContent = script;
document.body.appendChild(scriptEl);

window.test = '123';
