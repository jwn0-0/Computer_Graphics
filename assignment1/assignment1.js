var gl;

window.onload = function init() {
    var canvas = document.getElementById("gl-canvas");

    gl = WebGLUtils.setupWebGL(canvas);
    if (!gl) {
        alert("WebGL isn't available");
    }

    var vertices = [
        vec2(-1, 1),
        vec2(-1, -1),
        vec2(1, 1),
        vec2(1, -1)
    ];

    var colors = [
        vec4(0.2, 0.5, 0.7, 1.0),
        vec4(0.6, 0.4, 0.0, 0.9),
        vec4(0.2, 0.5, 0.7, 1.0),
        vec4(0.6, 0.4, 0.0, 0.9),
    ];

    var mountain = new Float32Array([
        -0.1, 0.7, -0.7, 0, 0.7, 0,
    ]);

    var mountain2 = new Float32Array([
        0.2, 0.7, -0.7, 0, 0.7, 0,
    ]);

    var line = [
        vec2(0, 0.25),
        vec2(0, 0),
        vec2(0, -0.1)
    ]

    var flag = [
        vec2(-0.1, 0.05),
        vec2(0.1, 0.05),
        vec2(-0.1, -0.05),
        vec2(0.1, -0.05)
    ]

    var sun = [
        vec2(0.1, 0.2),
        vec2(0.4, 0.4),
        vec2(0.3, 0.5),
        vec2(0.2, 0.55),
        vec2(0.1, 0.55),
        vec2(0.0, 0.5),
        vec2(-0.1, 0.4),
        vec2(-0.2, 0.0)
    ]

    var cloud = [
        vec2(-0.4, 0.6),
        vec2(-0.5, 0.7),
        vec2(-0.7, 0.7),
        vec2(-0.8, 0.6),
        vec2(-0.7, 0.5),
        vec2(-0.5, 0.5),
        vec2(-0.4, 0.6)
    ];

    var star = [
      vec2(-0.5, 0.65),
      vec2(-0.6, 0.4),
      vec2(-0.35, 0.55),
      vec2(-0.65, 0.55),
      vec2(-0.4, 0.4),
      vec2(-0.5, 0.65)
    ];

    //  Configure WebGL
    gl.viewport(0, 0, canvas.width, canvas.height);
    gl.clearColor(0.0, 0.0, 0.0, 1.0);

    //  Load shaders and initialize attribute buffers
    var program = initShaders(gl, "vertex-shader", "fragment-shader");
    gl.useProgram(program);

    // Load the data into the GPU
    var backBufferId = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, backBufferId);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(vertices), gl.STATIC_DRAW);

    // Associate out shader variables with our data buffter
    var vPosition = gl.getAttribLocation(program, "vPosition");
    gl.vertexAttribPointer(vPosition, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(vPosition);

    var backColorBufferId = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, backColorBufferId);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(colors), gl.STATIC_DRAW);

    var vColor = gl.getAttribLocation(program, "vColor");
    gl.vertexAttribPointer(vColor, 4, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(vColor);

    render(gl.TRIANGLE_STRIP, 0, 4);

    // Draw Sun =====================================================================================
    var sunBufferId = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, sunBufferId);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(sun), gl.STATIC_DRAW);

    var vOffset = gl.getUniformLocation(program, "vOffset");
    gl.uniform4fv(vOffset, [0, -1.1, 0, 0]);

    gl.vertexAttribPointer(vPosition, 2, gl.FLOAT, false, 0, 0);
    gl.vertexAttrib4f(vColor, 1.0, 0.3, 0.0, 0.9);
    gl.enableVertexAttribArray(vPosition);
    gl.disableVertexAttribArray(vColor);
    render(gl.TRIANGLE_FAN, 0, 7);

    // Draw Mountain ===================================================================================
    var MBufferId = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, MBufferId);
    gl.bufferData(gl.ARRAY_BUFFER, mountain, gl.STATIC_DRAW);

    gl.uniform4fv(vOffset, [-0.4, -1, 0, 0]);
    gl.vertexAttribPointer(vPosition, 2, gl.FLOAT, false, 0, 0);
    gl.vertexAttrib4f(vColor, 0.0, 0.6, 0.0, 1.0);
    render(gl.TRIANGLES, 0, 3);

    gl.bufferData(gl.ARRAY_BUFFER, mountain2, gl.STATIC_DRAW);
    gl.uniform4fv(vOffset, [0.5, -1, 0, 0]);
    gl.vertexAttrib4f(vColor, 0.0, 0.6, 0.0, 0.8);
    render(gl.TRIANGLES, 0, 3);

    // Draw Line =====================================================================================
    var lineBufferId = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, lineBufferId);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(line), gl.STATIC_DRAW);

    gl.uniform4fv(vOffset, [-0.5, -0.3, 0, 0]);
    gl.vertexAttribPointer(vPosition, 2, gl.FLOAT, false, 0, 0);
    gl.vertexAttrib4f(vColor, 0.0, 0.0, 0.0, 0.6);
    render(gl.LINES, 0, 3);

    // Draw Flag =====================================================================================
    gl.bufferData(gl.ARRAY_BUFFER, flatten(flag), gl.STATIC_DRAW);
    gl.uniform4fv(vOffset, [-0.4, -0.1, 0, 0]);
    gl.vertexAttribPointer(vPosition, 2, gl.FLOAT, false, 0, 0);
    gl.vertexAttrib4f(vColor, 0.2, 0.0, 0.7, 0.7);
    render(gl.TRIANGLE_FAN, 0, 4);

    // Draw Cloud =====================================================================================
    gl.bufferData(gl.ARRAY_BUFFER, flatten(cloud), gl.STATIC_DRAW);
    gl.uniform4fv(vOffset, [0.3, 0.1, 0, 0]);
    gl.vertexAttrib4f(vColor, 0.0, 0.0, 0.0, 0.2);
    render(gl.TRIANGLE_FAN, 0, 6);

    gl.uniform4fv(vOffset, [0.2, 0.1, 0, 0]);
    render(gl.TRIANGLE_FAN, 0, 6);

    gl.uniform4fv(vOffset, [0.0, 0.05, 0, 0]);
    render(gl.TRIANGLE_FAN, 0, 6);

    gl.uniform4fv(vOffset, [0.5, 0.05, 0, 0]);
    render(gl.TRIANGLE_FAN, 0, 6);

    gl.uniform4fv(vOffset, [1.5, -0.25, 0, 0]);
    render(gl.TRIANGLE_FAN, 0, 6);

    gl.uniform4fv(vOffset, [1.3, -0.3, 0, 0]);
    render(gl.TRIANGLE_FAN, 0, 6);

    // Draw Star
    gl.bufferData(gl.ARRAY_BUFFER, flatten(star), gl.STATIC_DRAW);
    gl.uniform4fv(vOffset, [0, -0.2, 0, 0]);
    gl.vertexAttrib4f(vColor, 0.0, 0.0, 0.0, 0);
    render(gl.LINE_STRIP, 0, 6);

    gl.uniform4fv(vOffset, [0.6, -0.3, 0, 0]);
    render(gl.LINE_STRIP, 0, 6);

    gl.uniform4fv(vOffset, [1, 0.2, 0, 0]);
    render(gl.LINE_STRIP, 0, 6);

    gl.uniform4fv(vOffset, [1.1, -0.5, 0, 0]);
    render(gl.LINE_STRIP, 0, 6);
};


function render(mode, first, count) {
    gl.drawArrays(mode, first, count);
}