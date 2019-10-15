console.log('{PAGE — START}');
window.test = '123';

document.querySelectorAll = function() {
  console.log('monkey patched');
  return [];
};

document.querySelectorAll('button');
console.log('{PAGE — END}');
