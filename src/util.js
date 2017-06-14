
function newline(n) {
  return new Array(n+1).join('\n');
}
function pad(n, s, f) {
  if(typeof s !== 'undefined') {
    s = s.toString();
    let o = s.length;
    s.replace(/[ -~]/g,a=>{o--;return a});
    if(f)
      return (new Array(n+1).join(' ') + s).slice(-(n-o));
    else
      return (s + new Array(n+1).join(' ')).slice(0, (n-o));
  }

  return new Array(n+1).join(' ');
}

export {newline, pad};
