/** A single, low-resolution WebGL pass. The DOM poster remains the fallback. */
export function createOceanRenderer(
  canvas: HTMLCanvasElement,
  poster: HTMLImageElement,
) {
  const gl = canvas.getContext("webgl", {
    alpha: true,
    antialias: false,
    powerPreference: "low-power",
    depth: false,
    stencil: false,
  });
  if (!gl) return null;
  const shaders: WebGLShader[] = [];
  const compile = (type: number, source: string) => {
    const shader = gl.createShader(type);
    if (!shader) return null;
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
      gl.deleteShader(shader);
      return null;
    }
    shaders.push(shader);
    return shader;
  };
  const vertex = compile(
    gl.VERTEX_SHADER,
    `
    attribute vec2 a_position;
    varying vec2 v_uv;
    void main() { v_uv = a_position * .5 + .5; gl_Position = vec4(a_position, 0., 1.); }
  `,
  );
  const fragment = compile(
    gl.FRAGMENT_SHADER,
    `
    precision mediump float;
    varying vec2 v_uv;
    uniform sampler2D u_image;
    uniform float u_time;
    uniform float u_viewAspect;
    uniform float u_imageAspect;
    uniform float u_mobile;
    uniform vec2 u_pointer;
    void main() {
      vec2 uv = v_uv;
      if (u_imageAspect > u_viewAspect) uv.x = (uv.x - .5) * u_viewAspect / u_imageAspect + .5;
      else uv.y = (uv.y - .5) * u_imageAspect / u_viewAspect + .5;
      // Map the art-directed mobile crop to the original coastline mask.
      vec2 coastUV = uv;
      coastUV.x = mix(uv.x, (uv.x - .5) * .338 + .5, u_mobile);
      float coastline = .54 + pow(1. - coastUV.y, 1.2) * .38;
      float water = (1. - smoothstep(.69, .76, coastUV.y)) *
                    (1. - smoothstep(coastline - .12, coastline, coastUV.x));
      float depth = pow(1. - uv.y, 1.6);
      float swell = sin(coastUV.y * 54. + coastUV.x * 12. - u_time * .65);
      float ripple = sin(coastUV.y * 112. - coastUV.x * 24. + u_time * .4);
      vec2 displacement = vec2(swell * .00065, ripple * .0005) * water * depth;
      displacement += u_pointer * .00045 * water * depth;
      vec3 color = texture2D(u_image, clamp(uv + displacement, .001, .999)).rgb;
      float glint = sin(coastUV.y * 150. + swell * 1.2 - u_time * .45);
      color += vec3(.62,.77,.81) * glint * .0045 * water * depth;
      gl_FragColor = vec4(color, 1.);
    }
  `,
  );
  const program = gl.createProgram();
  if (!vertex || !fragment || !program) {
    shaders.forEach((s) => gl.deleteShader(s));
    return null;
  }
  gl.attachShader(program, vertex);
  gl.attachShader(program, fragment);
  gl.linkProgram(program);
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    gl.deleteProgram(program);
    shaders.forEach((s) => gl.deleteShader(s));
    return null;
  }
  gl.useProgram(program);
  const buffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
  gl.bufferData(
    gl.ARRAY_BUFFER,
    new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]),
    gl.STATIC_DRAW,
  );
  const position = gl.getAttribLocation(program, "a_position");
  gl.enableVertexAttribArray(position);
  gl.vertexAttribPointer(position, 2, gl.FLOAT, false, 0, 0);
  const texture = gl.createTexture();
  gl.activeTexture(gl.TEXTURE0);
  gl.bindTexture(gl.TEXTURE_2D, texture);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
  gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
  const uniforms = Object.fromEntries(
    [
      "u_image",
      "u_time",
      "u_viewAspect",
      "u_imageAspect",
      "u_mobile",
      "u_pointer",
    ].map((n) => [n, gl.getUniformLocation(program, n)]),
  );
  gl.uniform1i(uniforms.u_image, 0);
  let ready = false,
    destroyed = false;
  const upload = () => {
    if (
      destroyed ||
      gl.isContextLost() ||
      !poster.complete ||
      !poster.naturalWidth
    )
      return;
    try {
      gl.bindTexture(gl.TEXTURE_2D, texture);
      gl.texImage2D(
        gl.TEXTURE_2D,
        0,
        gl.RGBA,
        gl.RGBA,
        gl.UNSIGNED_BYTE,
        poster,
      );
      gl.uniform1f(
        uniforms.u_imageAspect,
        poster.naturalWidth / poster.naturalHeight,
      );
      gl.uniform1f(
        uniforms.u_mobile,
        poster.currentSrc.includes("mobile") ? 1 : 0,
      );
      ready = true;
    } catch {
      ready = false;
      canvas.style.opacity = "0";
    }
  };
  const lost = () => {
    ready = false;
    canvas.style.opacity = "0";
  };
  poster.addEventListener("load", upload);
  canvas.addEventListener("webglcontextlost", lost);
  upload();
  return {
    resize() {
      const dpr = Math.min(devicePixelRatio, innerWidth < 640 ? 1.25 : 1.5);
      canvas.width = Math.round(canvas.clientWidth * dpr);
      canvas.height = Math.round(canvas.clientHeight * dpr);
      gl.viewport(0, 0, canvas.width, canvas.height);
      gl.uniform1f(uniforms.u_viewAspect, canvas.width / canvas.height);
    },
    draw(time: number, x: number, y: number) {
      if (!ready || gl.isContextLost()) return;
      gl.uniform1f(uniforms.u_time, time);
      gl.uniform2f(uniforms.u_pointer, x, y);
      gl.drawArrays(gl.TRIANGLES, 0, 6);
      canvas.style.opacity = "1";
    },
    destroy() {
      destroyed = true;
      poster.removeEventListener("load", upload);
      canvas.removeEventListener("webglcontextlost", lost);
      gl.deleteBuffer(buffer);
      gl.deleteTexture(texture);
      gl.deleteProgram(program);
      shaders.forEach((s) => gl.deleteShader(s));
      canvas.style.opacity = "0";
    },
  };
}
