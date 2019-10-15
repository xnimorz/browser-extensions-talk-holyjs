console.log('{PAGE — START}');

const windowApi = ['fetch', { document: ['querySelectorAll', 'querySelector'] }, 'postMessage'];

function proxify(api, caller) {
  api.forEach((item) => {
    if (typeof item === 'object') {
      return Object.entries(item).forEach(([key, values]) => proxify(values, caller[key]));
    }
    caller[item] = new Proxy(caller[item], {
      apply: (target, thisValue, args) => {
        const error = new Error('HOLY ERROR');
        console.log('{CAPTURE — START}');
        console.log(`PAGE CAPTURED API INVOCATION: ${item}`);
        console.log(args);
        console.log(error.stack.toString());
        if (error.stack.includes('anonymous')) {
          console.log('{CAPTURE — END}');
          throw new Error();
        }
        console.log('{CAPTURE — END}');
        return target.apply(thisValue, args);
      },
    });
  });
}

proxify(windowApi, window);

console.log('{PAGE — END}');
