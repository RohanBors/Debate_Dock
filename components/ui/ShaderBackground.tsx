"use client";

import { useRef, useEffect } from "react";

// Neon-green & black shader — adapted from Matthias Hurrle (@atzedent)
const SHADER_SRC = `#version 300 es
precision highp float;
out vec4 O;
uniform vec2 resolution;
uniform float time;
uniform vec2 touch;
uniform vec2 move;
#define FC gl_FragCoord.xy
#define T time
#define R resolution
#define MN min(R.x,R.y)

float rnd(vec2 p){p=fract(p*vec2(12.9898,78.233));p+=dot(p,p+34.56);return fract(p.x*p.y);}
float noise(in vec2 p){vec2 i=floor(p),f=fract(p),u=f*f*(3.-2.*f);float a=rnd(i),b=rnd(i+vec2(1,0)),c=rnd(i+vec2(0,1)),d=rnd(i+1.);return mix(mix(a,b,u.x),mix(c,d,u.x),u.y);}
float fbm(vec2 p){float t=.0,a=1.;mat2 m=mat2(1.,-.5,.2,1.2);for(int i=0;i<5;i++){t+=a*noise(p);p*=2.*m;a*=.5;}return t;}
float clouds(vec2 p){float d=1.,t=.0;for(float i=.0;i<3.;i++){float a=d*fbm(i*10.+p.x*.2+.2*(1.+i)*p.y+d+i*i+p);t=mix(t,d,a);d=a;p*=2./(i+1.);}return t;}

void main(void){
  vec2 uv=(FC-.5*R)/MN, st=uv*vec2(2.,1.);
  vec3 col=vec3(0);
  float bg=clouds(vec2(st.x+T*.3,-st.y));
  uv*=1.-.3*(sin(T*.15)*.5+.5);

  // Neon green palette  #ccff00 = vec3(0.8, 1.0, 0.0)
  vec3 neon = vec3(0.8, 1.0, 0.0);
  vec3 darkGreen = vec3(0.3, 0.5, 0.0);

  for(float i=1.;i<10.;i++){
    uv+=.08*cos(i*vec2(.1+.01*i,.8)+i*i+T*.4+.1*uv.x);
    vec2 p=uv;
    float d=length(p);
    // Replace warm tones with neon green family
    col+=.001/d*(neon*cos(sin(i)*vec3(0.8,1.0,0.1))+darkGreen);
    float b=noise(i+p+bg*1.731);
    col+=.0015*b/length(max(p,vec2(b*p.x*.02,p.y)));
    col=mix(col,vec3(bg*.05,bg*.12,bg*.0),d);
  }

  // Boost the green channel subtly
  col = col * vec3(0.6, 1.2, 0.3);
  // Clamp to prevent over-saturation
  col = clamp(col, 0.0, 0.6);

  O=vec4(col, 1.0);
}`;

const VERT_SRC = `#version 300 es
precision highp float;
in vec4 position;
void main(){gl_Position=position;}`;

export default function ShaderBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const gl = canvas.getContext("webgl2");
    if (!gl) return;

    // Compile helpers
    const compile = (type: number, src: string) => {
      const s = gl.createShader(type)!;
      gl.shaderSource(s, src);
      gl.compileShader(s);
      if (!gl.getShaderParameter(s, gl.COMPILE_STATUS))
        console.error(gl.getShaderInfoLog(s));
      return s;
    };

    const vs = compile(gl.VERTEX_SHADER, VERT_SRC);
    const fs = compile(gl.FRAGMENT_SHADER, SHADER_SRC);
    const prog = gl.createProgram()!;
    gl.attachShader(prog, vs);
    gl.attachShader(prog, fs);
    gl.linkProgram(prog);
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS))
      console.error(gl.getProgramInfoLog(prog));

    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1,1,-1,-1,1,1,1,-1]), gl.STATIC_DRAW);
    const pos = gl.getAttribLocation(prog, "position");
    gl.enableVertexAttribArray(pos);
    gl.vertexAttribPointer(pos, 2, gl.FLOAT, false, 0, 0);

    const uRes    = gl.getUniformLocation(prog, "resolution");
    const uTime   = gl.getUniformLocation(prog, "time");
    const uTouch  = gl.getUniformLocation(prog, "touch");
    const uMove   = gl.getUniformLocation(prog, "move");

    let mouse = [0, 0];
    let move  = [0, 0];
    let raf: number;

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio, 2);
      canvas.width  = window.innerWidth  * dpr;
      canvas.height = window.innerHeight * dpr;
      gl.viewport(0, 0, canvas.width, canvas.height);
    };
    resize();
    window.addEventListener("resize", resize);

    const onMove = (e: MouseEvent) => {
      const dpr = Math.min(window.devicePixelRatio, 2);
      mouse = [e.clientX * dpr, (window.innerHeight - e.clientY) * dpr];
      move  = [move[0] + e.movementX, move[1] + e.movementY];
    };
    window.addEventListener("mousemove", onMove);

    const loop = (now: number) => {
      gl.clearColor(0,0,0,1);
      gl.clear(gl.COLOR_BUFFER_BIT);
      gl.useProgram(prog);
      gl.bindBuffer(gl.ARRAY_BUFFER, buf);
      gl.uniform2f(uRes,   canvas.width, canvas.height);
      gl.uniform1f(uTime,  now * 1e-3);
      gl.uniform2f(uTouch, ...mouse as [number,number]);
      gl.uniform2f(uMove,  ...move  as [number,number]);
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", onMove);
      gl.deleteProgram(prog);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none"
      style={{ background: "#000" }}
    />
  );
}
