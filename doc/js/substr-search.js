const myArgs = process.argv.slice(2);
const haystack = myArgs[0].slice();
const needle = myArgs[1].slice();



let match = -1;

for (let i = 0; i < haystack.length - needle.length + 1; i++) {

  for (let j = 0; j < needle.length; j++) {
    if (haystack[i+j] === needle[j]) {
      if (j === 0) {
        match = i;
      }
    } else {
      match = -1;
    }
  }

  if (match !== -1) {
    return;
  }

}

console.log(match);

