console.log('index.js');

const script = "(function(){console.log('I work inside the script tag, from index.js');})();";

const scriptEl = document.createElement('script');
scriptEl.textContent = script;
document.body.appendChild(scriptEl);

window.test = '123';

// const mo = new MutationObserver((...args) => {
//   console.log(args);
// });
// const config = {
//   attributes: true,
//   attributeOldValue: true,
//   characterData: true,
//   characterDataOldValue: true,
//   childList: true,
//   subtree: true,
// };
// mo.observe(document, config);

// document.addEventListener('blur', (e) => {
//   if (document.hasFocus()) {
//     console.log('[blur] focus');
//   }
// });
// document.addEventListener('focus', (e) => {
//   if (document.hasFocus()) {
//     console.log('[focus] focus');
//   }
// });
// document.querySelector('button').addEventListener('click', () => {
//   console.log('clicked');
// });

const documentApi = ['querySelectorAll', 'querySelector'];
documentApi.forEach((item) => {
  document[item] = new Proxy(document[item], {
    apply: (target, thisValue, args) => {
      const error = new Error('test');
      console.log('CAPTURED — ', item);
      console.log(args);
      console.log(error.stack.toString());
      if (error.stack.includes('anonymous')) {
        throw new Error();
      }
      console.log('CAPTURE END');
      return target.apply(thisValue, args);
    },
  });
});
