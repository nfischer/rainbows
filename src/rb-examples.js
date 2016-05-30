var rbExamples = [
{ name: 'Fibonacci',
  code:
`// Recursive fibonacci algorithm
function fib(n) {
  if (n == 0) {
    return 0;
  } else if (n == 1) {
    return 1;
  } else {
    return fib(n-1)+fib(n-2);
  }
}

var output = fib(12);
var msg = "hello world";
`,
},
{
  name: 'Repeat String',
  code:
`function repeatstring(str, count) {
  var mylist = [];
  for (var k in range(1, count)) {
    mylist.append(str);
  }
  return mylist.join();
}
`,
},
{
  name: 'getLength()',
  code:
`// This will catch if you use a list instead of a string!
var cache = {};
function getLength(str) {
  try {
    return cache[str];
  } catch(e) {
    var c = 0;
    while str[c] != '\\0' {
      c++;
    }
    cache[str] = c;
    return c;
  }
}

print getLength("hello world")
print getLength("hello world")
print getLength(['h', 'e', 'l', 'l', 'o'])
`,
},
];