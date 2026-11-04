(() => {
  "use strict";
  const canvas = document.getElementById("orb-canvas");
  const reduceMotion = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const vertexSource = `
    attribute vec2 a_position;
    varying vec2 v_uv;
    void main(){ v_uv=a_position*.5+.5; gl_Position=vec4(a_position,0.0,1.0); }
  `;
  const fragmentSource = `
    precision highp float;
    varying vec2 v_uv;
    uniform vec2 u_resolution;
    uniform float u_time;
    uniform vec2 u_mouse;
    float hash(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}
    void main(){
      vec2 uv=(gl_FragCoord.xy-.5*u_resolution)/min(u_resolution.x,u_resolution.y);
      vec2 center=vec2(.20,-.015)+u_mouse*vec2(.025,-.02);
      vec2 p=uv-center;
      float r=length(p);
      float radius=.245;
      float sphere=smoothstep(radius,radius-.004,r);
      vec3 col=vec3(.012,.025,.038);
      float halo=exp(-r*5.0)*.22;
      col+=vec3(.08,.34,.48)*halo;
      float z=sqrt(max(0.0,1.0-(r/radius)*(r/radius)));
      vec3 normal=normalize(vec3(p/radius,z));
      vec3 light=normalize(vec3(-.48,.62,.9));
      float diffuse=max(dot(normal,light),0.0);
      float fresnel=pow(1.0-z,2.4);
      float spec=pow(max(dot(reflect(-light,normal),vec3(0.0,0.0,1.0)),0.0),28.0);
      vec3 deep=vec3(.012,.075,.115);
      vec3 ice=vec3(.35,.78,.98);
      vec3 surface=mix(deep,ice,.12+diffuse*.43);
      surface+=ice*(fresnel*.55+spec*.7);
      float grain=(hash(gl_FragCoord.xy+u_time*.02)-.5)*.018;
      surface+=grain;
      col=mix(col,surface,sphere);
      float rim=smoothstep(radius,radius-.014,r)-smoothstep(radius-.014,radius-.03,r);
      col+=ice*rim*.26;
      gl_FragColor=vec4(col,1.0);
    }
  `;
  let gl, program, resolution, timeUniform, mouseUniform, raf=0, pointer=[0,0], start=performance.now();
  function shader(type, source){
    const s=gl.createShader(type);gl.shaderSource(s,source);gl.compileShader(s);
    if(!gl.getShaderParameter(s,gl.COMPILE_STATUS)){console.warn(gl.getShaderInfoLog(s));return null;}return s;
  }
  function init(){
    if(!canvas)return false;
    gl=canvas.getContext("webgl",{alpha:true,antialias:false,powerPreference:"low-power"})||canvas.getContext("experimental-webgl");
    if(!gl)return false;
    const vs=shader(gl.VERTEX_SHADER,vertexSource),fs=shader(gl.FRAGMENT_SHADER,fragmentSource);
    if(!vs||!fs)return false;
    program=gl.createProgram();gl.attachShader(program,vs);gl.attachShader(program,fs);gl.linkProgram(program);
    if(!gl.getProgramParameter(program,gl.LINK_STATUS)){console.warn(gl.getProgramInfoLog(program));return false;}
    gl.useProgram(program);
    const buffer=gl.createBuffer();gl.bindBuffer(gl.ARRAY_BUFFER,buffer);
    gl.bufferData(gl.ARRAY_BUFFER,new Float32Array([-1,-1,1,-1,-1,1,-1,1,1,-1,1,1]),gl.STATIC_DRAW);
    const pos=gl.getAttribLocation(program,"a_position");gl.enableVertexAttribArray(pos);gl.vertexAttribPointer(pos,2,gl.FLOAT,false,0,0);
    resolution=gl.getUniformLocation(program,"u_resolution");timeUniform=gl.getUniformLocation(program,"u_time");mouseUniform=gl.getUniformLocation(program,"u_mouse");
    resize();return true;
  }
  function resize(){
    if(!gl)return;
    const rect=canvas.getBoundingClientRect(),dpr=Math.min(devicePixelRatio||1,1.35);
    canvas.width=Math.max(1,Math.round(rect.width*dpr));canvas.height=Math.max(1,Math.round(rect.height*dpr));
    gl.viewport(0,0,canvas.width,canvas.height);
    gl.uniform2f(resolution,canvas.width,canvas.height);
  }
  function render(now){
    if(!gl)return;
    gl.uniform1f(timeUniform,(now-start)*.001);
    gl.uniform2f(mouseUniform,pointer[0],pointer[1]);
    gl.drawArrays(gl.TRIANGLES,0,6);
    if(!reduceMotion)raf=requestAnimationFrame(render);
  }
  if(init()){
    addEventListener("resize",resize,{passive:true});
    addEventListener("pointermove",e=>{pointer=[(e.clientX/innerWidth-.5)*2,(e.clientY/innerHeight-.5)*2];},{passive:true});
    if(reduceMotion)render(start);else raf=requestAnimationFrame(render);
    document.addEventListener("visibilitychange",()=>{if(document.hidden){cancelAnimationFrame(raf);}else if(!reduceMotion){start=performance.now();raf=requestAnimationFrame(render);}});
  } else {
    // Graceful fallback: CSS-generated orb remains visible if WebGL is unavailable.
    canvas.classList.add("webgl-unavailable");
  }
  // Lenis is progressive enhancement; native scrolling remains available offline.
  if(!reduceMotion && window.Lenis){
    const lenis=new Lenis({duration:1.15,smoothWheel:true,touchMultiplier:1.15});
    const rafLenis=t=>{lenis.raf(t);requestAnimationFrame(rafLenis);};requestAnimationFrame(rafLenis);
  }
  const menuButton=document.querySelector(".menu-toggle"),nav=document.querySelector(".nav");
  if(menuButton&&nav){
    menuButton.addEventListener("click",()=>{const open=nav.classList.toggle("open");menuButton.setAttribute("aria-expanded",String(open));});
    nav.querySelectorAll("a").forEach(a=>a.addEventListener("click",()=>{nav.classList.remove("open");menuButton.setAttribute("aria-expanded","false");}));
  }
  const year=document.getElementById("year");if(year)year.textContent=new Date().getFullYear();
})();