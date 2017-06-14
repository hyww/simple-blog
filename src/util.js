
function newline(n) {
  return new Array(n+1).join('\n');
}
function pad(n, s, f) {
  if(typeof s !== 'undefined') {
    if(f)
      return (new Array(n+1).join(' ') + s).slice(-n);
    else
      return (s + new Array(n+1).join(' ')).slice(0, n);
  }

  return new Array(n+1).join(' ');
}

export {newline, pad};
