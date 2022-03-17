
export function locations(substring: string, str: string) {
  var a = [],
    i = -1;
  while ((i = str.indexOf(substring, i + 1)) >= 0) a.push(i);
  return a;
}
export function removeNonNumbers(str: string) {
  return str.replace(/[^0-9]/g, '');
}
