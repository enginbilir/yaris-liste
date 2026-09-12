// The bundled PDF.js version uses packed DrawOPS paths. Keep this decoder
// aligned with dist/vendor/pdf.mjs; text and grid coordinates share PDF space.
const identity = () => [1, 0, 0, 1, 0, 0];
function multiply(m, n) {
  return [m[0]*n[0]+m[2]*n[1], m[1]*n[0]+m[3]*n[1],
    m[0]*n[2]+m[2]*n[3], m[1]*n[2]+m[3]*n[3],
    m[0]*n[4]+m[2]*n[5]+m[4], m[1]*n[4]+m[3]*n[5]+m[5]];
}
export function verticalGridLines(operatorList, OPS) {
  let matrix = identity();
  const stack = [], verticals = [];
  const point = (x, y) => [matrix[0]*x+matrix[2]*y+matrix[4], matrix[1]*x+matrix[3]*y+matrix[5]];
  function segment(a, b) {
    if (!a || !b) return;
    const p = point(...a), q = point(...b);
    if (Math.abs(p[0]-q[0]) < 0.5 && Math.abs(p[1]-q[1]) >= 5)
      verticals.push({x:(p[0]+q[0])/2, bottom:Math.min(p[1],q[1]), top:Math.max(p[1],q[1])});
  }
  for (let i=0; i<operatorList.fnArray.length; i++) {
    const op=operatorList.fnArray[i], args=operatorList.argsArray[i];
    if (op===OPS.save) stack.push([...matrix]);
    else if (op===OPS.restore) matrix=stack.pop() || identity();
    else if (op===OPS.transform) matrix=multiply(matrix,args);
    else if (op===OPS.paintFormXObjectBegin) { stack.push([...matrix]); if(args[0]) matrix=multiply(matrix,args[0]); }
    else if (op===OPS.paintFormXObjectEnd) matrix=stack.pop() || identity();
    else if (op===OPS.constructPath) {
      const path=args?.[1]?.[0];
      if (!path || typeof path.length!=='number') continue;
      let last=null, start=null;
      for (let j=0; j<path.length;) {
        const command=path[j++];
        if (command===0) {last=[path[j++],path[j++]]; start=last;}
        else if (command===1) {const next=[path[j++],path[j++]]; segment(last,next); last=next;}
        else if (command===2) {j+=4; last=[path[j++],path[j++]];}
        else if (command===3) {j+=2; last=[path[j++],path[j++]];}
        else if (command===4) {segment(last,start); last=start;}
        else break;
      }
    }
  }
  return verticals;
}
