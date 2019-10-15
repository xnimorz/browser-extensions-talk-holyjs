console.log('{PLUGIN — START}');
console.log('window.test = ', window.test);
console.log('cookie = ', document.cookie);
console.log('localStorage = ', localStorage);

console.log(document.querySelectorAll);
console.log(document.querySelectorAll('button'));

const script = `
    (function()
    {
      console.log('{INLINE SCRIPT FROM PLUGIN — START}');
      console.log('window.test = ', window.test);
      console.log('cookie = ', document.cookie);
      console.log('localStorage = ', localStorage);
      console.log('I work inside the script tag from extension'); 
      console.log(document.querySelectorAll('button'))
      const iframe = document.createElement('iframe');
      iframe.classList.add('holy-example');
      iframe.src = 'http://127.0.0.1:8080/ad';      
      iframe.width = 200;
      iframe.height = 236;
      document.body.appendChild(iframe);
      console.log('{INLINE SCRIPT FROM PLUGIN — END}');
    })();
    `;

const scriptEl = document.createElement('script');
scriptEl.textContent = script;
document.body.appendChild(scriptEl);
document.body.removeChild(scriptEl);

console.log('{PLUGIN — END}');
