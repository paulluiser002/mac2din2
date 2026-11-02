// A damped pull travels down the hanging fabric after the rail starts moving.
export function entranceGather(seconds: number, vertical: number) {
  const t = Math.max(0, Math.min(1, (seconds - 0.2 - vertical * 0.17) / 2.05));
  return t * t * (3 - 2 * t);
}

export function animateEntrance(canvas: HTMLCanvasElement, done: () => void) {
  const gl = canvas.getContext("webgl", {
    alpha: true,
    antialias: true,
    powerPreference: "low-power",
  });
  if (!gl) return () => {};
  const vertex = `attribute vec2 uv; uniform float time; uniform float side; varying vec3 pos; varying vec2 cloth;
  void main(){
    float v=uv.y; float t=clamp((time-.2-v*.17)/2.05,0.,1.); float pull=t*t*(3.-2.*t);
    float width=mix(1.012,.055,pull);float phase=uv.x*75.398+sin(v*3.1+uv.x*9.)*.7*v;
    float wave=sin(time*6.0-v*3.5)*sin(v*1.57)*sin(t*3.14159)*.026;
    float x=side*(1.01-uv.x*width+wave*uv.x);
    float y=1.02-v*2.04+sin(phase*.5)*.008*v*v;
    float z=cos(phase)*(.017+.018*v)+sin(phase*.5)*.006+sin(v*3.14)*.012;
    pos=vec3(x,y,z);cloth=uv;gl_Position=vec4(x,y,z,1.);
  }`;
  const fragment = `#extension GL_OES_standard_derivatives : enable
  precision mediump float;varying vec3 pos;varying vec2 cloth;
  void main(){vec3 n=normalize(cross(dFdx(pos),dFdy(pos)));if(n.z<0.)n=-n;
    float diffuse=max(dot(n,normalize(vec3(-.6,.25,1.))),0.);
    float sheen=pow(max(dot(reflect(normalize(vec3(.6,-.25,-1.)),n),vec3(0.,0.,1.)),0.),18.);
    float weave=sin(cloth.x*1800.)*sin(cloth.y*2300.)*.012;
    vec3 gold=vec3(.62,.47,.26);vec3 color=gold*(.42+diffuse*.64)+vec3(.85,.7,.41)*sheen*.045+weave;
    color*=.88+.12*(1.-cloth.y);gl_FragColor=vec4(color,1.);
  }`;
  if (!gl.getExtension("OES_standard_derivatives")) return () => {};
  const shader = (type: number, source: string) => {
    const s = gl.createShader(type)!;
    gl.shaderSource(s, source);
    gl.compileShader(s);
    return s;
  };
  const vs = shader(gl.VERTEX_SHADER, vertex),
    fs = shader(gl.FRAGMENT_SHADER, fragment);
  const program = gl.createProgram()!;
  gl.attachShader(program, vs);
  gl.attachShader(program, fs);
  gl.linkProgram(program);
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    gl.deleteProgram(program);
    gl.deleteShader(vs);
    gl.deleteShader(fs);
    return () => {};
  }
  const points: number[] = [],
    indices: number[] = [],
    columns = 192,
    rows = 36;
  for (let y = 0; y <= rows; y++)
    for (let x = 0; x <= columns; x++) {
      points.push(x / columns, y / rows);
      if (x < columns && y < rows) {
        const a = y * (columns + 1) + x;
        indices.push(
          a,
          a + 1,
          a + columns + 1,
          a + 1,
          a + columns + 2,
          a + columns + 1,
        );
      }
    }
  const buffer = gl.createBuffer(),
    element = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(points), gl.STATIC_DRAW);
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, element);
  gl.bufferData(
    gl.ELEMENT_ARRAY_BUFFER,
    new Uint16Array(indices),
    gl.STATIC_DRAW,
  );
  gl.useProgram(program);
  const uv = gl.getAttribLocation(program, "uv");
  gl.enableVertexAttribArray(uv);
  gl.vertexAttribPointer(uv, 2, gl.FLOAT, false, 0, 0);
  const time = gl.getUniformLocation(program, "time"),
    side = gl.getUniformLocation(program, "side");
  const dpr = Math.min(window.devicePixelRatio, 1.5);
  canvas.width = Math.round(innerWidth * dpr);
  canvas.height = Math.round(innerHeight * dpr);
  gl.viewport(0, 0, canvas.width, canvas.height);
  const start = performance.now();
  let frame = 0,
    disposed = false;
  const draw = (now: number) => {
    if (disposed) return;
    const elapsed = (now - start) / 1000;
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.uniform1f(time, elapsed);
    for (const direction of [-1, 1]) {
      gl.uniform1f(side, direction);
      gl.drawElements(gl.TRIANGLES, indices.length, gl.UNSIGNED_SHORT, 0);
    }
    canvas.parentElement?.classList.add("cloth-ready");
    if (elapsed < 2.7) frame = requestAnimationFrame(draw);
    else done();
  };
  frame = requestAnimationFrame(draw);
  return () => {
    disposed = true;
    cancelAnimationFrame(frame);
    gl.deleteBuffer(buffer);
    gl.deleteBuffer(element);
    gl.deleteProgram(program);
    gl.deleteShader(vs);
    gl.deleteShader(fs);
    gl.getExtension("WEBGL_lose_context")?.loseContext();
  };
}
