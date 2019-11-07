const start = window.performance.now();
const SEC_20 = 20000;
while (performance.now() - start < SEC_20) {
  console.log("WAIT!");
}
console.log("Done");
