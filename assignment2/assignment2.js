var gl;
var direction = true;
var points = [];
var moveX = 0;
var moveY = 0;
var vOffset;
var program;

window.onload = function init() {
    var canvas = document.getElementById("gl-canvas");

    gl = WebGLUtils.setupWebGL(canvas);
    if (!gl) {
        alert("WebGL isn't available");
    }

    //  Configure WebGL
    gl.viewport(0, 0, canvas.width, canvas.height);
    gl.clearColor(1.0, 1.0, 1.0, 1.0);

    //  Load shaders and initialize attribute buffers
    program = initShaders(gl, "vertex-shader", "fragment-shader");
    gl.useProgram(program);
    
    vOffset = gl.getUniformLocation(program, "vOffset");
    // 방향 바꾸는 버튼
    document.getElementById("Direction").onclick = function (event) {
        direction = !direction;
    };

    // 마우스 클릭
    canvas.addEventListener("mousedown", function (event) {
        var vBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, vBuffer);

        //clipping
        x = 2 * event.clientX / canvas.width - 1;
        y = 2 * (canvas.height - event.clientY) / canvas.height - 1;
        points.push(vec2(x, y));
    });

    
    render();

};


function render() {
    setTimeout(function () {
        gl.clear(gl.COLOR_BUFFER_BIT);
        gl.clearColor(0.9, 0.5, 0.2, 0.8);

        
        if (direction === true) {
            if (moveY < -0.24) {    // 해가 끝까지 내려 갔을 때
                direction = !direction;     // 방향 바꾸기
            }
            moveY -= 0.004;

            drawSun(moveY);
        } else if (direction === false) {
            if (moveY > 1) {    // 해가 끝까지 올라 왔을 때
                direction = !direction      // 방향 바꾸기
            }
            moveY += 0.004

            drawSun(moveY);
        }

        draw();

        if (direction === true) {
            if (moveX < -0.6) {     // 구름이 왼쪽 끝까지 움직 였을 때
                direction = !direction      // 방향 바꾸기
            }
            moveX -= 0.01

            drawCloud(moveX);
        } else if (direction === false) {
            if (moveX > 0) {    // 구름이 오른쪽 끝까지 움직 였을 때
                direction = !direction      // 방향 바꾸기
            }
            moveX += 0.01

            drawCloud(moveX);
        }

        for (var i = 0; i < points.length; i++) {       // points 배열의 길이만큼 반복
            drawStar(points[i][0], points[i][1]);      // 별 그리기
            console.log(points[i][0]);
        }

        requestAnimFrame(render);
    }, 100);
}


function draw(){
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

    // Draw Mountain ===================================================================================
    var MBufferId = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, MBufferId);
    gl.bufferData(gl.ARRAY_BUFFER, mountain, gl.STATIC_DRAW);

    var vPosition = gl.getAttribLocation(program, "vPosition");
    gl.vertexAttribPointer(vPosition, 2, gl.FLOAT, false, 0, 0);

    var vColor = gl.getAttribLocation(program, "vColor");
    gl.vertexAttrib4f(vColor, 0.0, 0.6, 0.0, 1.0);

    gl.uniform4fv(vOffset, [-0.4, -1, 0, 0]);
    gl.drawArrays(gl.TRIANGLES, 0, 3);

    gl.bufferData(gl.ARRAY_BUFFER, mountain2, gl.STATIC_DRAW);
    gl.uniform4fv(vOffset, [0.5, -1, 0, 0]);
    gl.vertexAttrib4f(vColor, 0.0, 0.6, 0.0, 0.8);
    gl.drawArrays(gl.TRIANGLES, 0, 3);

    // Draw Line =====================================================================================
    var lineBufferId = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, lineBufferId);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(line), gl.STATIC_DRAW);

    gl.uniform4fv(vOffset, [-0.5, -0.3, 0, 0]);
    gl.vertexAttribPointer(vPosition, 2, gl.FLOAT, false, 0, 0);
    gl.vertexAttrib4f(vColor, 0.0, 0.0, 0.0, 0.6);
    gl.drawArrays(gl.LINES, 0, 3);

    // Draw Flag =====================================================================================
    gl.bufferData(gl.ARRAY_BUFFER, flatten(flag), gl.STATIC_DRAW);
    gl.uniform4fv(vOffset, [-0.4, -0.1, 0, 0]);
    gl.vertexAttribPointer(vPosition, 2, gl.FLOAT, false, 0, 0);
    gl.vertexAttrib4f(vColor, 0.2, 0.0, 0.7, 0.7);
    gl.drawArrays(gl.TRIANGLE_FAN, 0, 4);
}

function drawSun(transf_y){
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

    var sunBufferId = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, sunBufferId);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(sun), gl.STATIC_DRAW);

    var vPosition = gl.getAttribLocation(program, "vPosition");
    gl.vertexAttribPointer(vPosition, 2, gl.FLOAT, false, 0, 0);

    var vColor = gl.getAttribLocation(program, "vColor");
    gl.vertexAttrib4f(vColor, 1.0, 0.3, 0.0, 0.9);

    gl.enableVertexAttribArray(vPosition);
    gl.uniform4fv(vOffset, [0, -1.1 + transf_y, 0, 0]);
    gl.drawArrays(gl.TRIANGLE_FAN, 0, 7);
}

function drawCloud(transf_x){
    var cloud = [
        vec2(-0.4, 0.6),
        vec2(-0.5, 0.7),
        vec2(-0.7, 0.7),
        vec2(-0.8, 0.6),
        vec2(-0.7, 0.5),
        vec2(-0.5, 0.5),
        vec2(-0.4, 0.6)
    ];
    var cloudBufferId = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, cloudBufferId);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(cloud), gl.STATIC_DRAW);

    var vPosition = gl.getAttribLocation(program, "vPosition");
    gl.vertexAttribPointer(vPosition, 2, gl.FLOAT, false, 0, 0);

    var vColor = gl.getAttribLocation(program, "vColor");
    gl.vertexAttrib4f(vColor, 0.0, 0.0, 0.0, 0.2);
    
    gl.uniform4fv(vOffset, [transf_x, 0, 0, 0]);

    //draw Cloud
    gl.uniform4fv(vOffset, [transf_x+0.3, 0.1, 0, 0]);
    gl.drawArrays(gl.TRIANGLE_FAN, 0, 6);

    gl.uniform4fv(vOffset, [transf_x+0.2, 0.1, 0, 0]);
    gl.drawArrays(gl.TRIANGLE_FAN, 0, 6);

    gl.uniform4fv(vOffset, [transf_x+0.0, 0.05, 0, 0]);
    gl.drawArrays(gl.TRIANGLE_FAN, 0, 6);

    gl.uniform4fv(vOffset, [transf_x+0.5, 0.05, 0, 0]);
    gl.drawArrays(gl.TRIANGLE_FAN, 0, 6);

    gl.uniform4fv(vOffset, [transf_x+1.5, -0.25, 0, 0]);
    gl.drawArrays(gl.TRIANGLE_FAN, 0, 6);

    gl.uniform4fv(vOffset, [transf_x+1.3, -0.3, 0, 0]);
    gl.drawArrays(gl.TRIANGLE_FAN, 0, 6);

    gl.uniform4fv(vOffset, [transf_x+1.7, -0.3, 0, 0]);
    gl.drawArrays(gl.TRIANGLE_FAN, 0, 6);
}

function drawStar(x,Y){
    y=Y+0.3;
    var maple = [
        vec2(x, y),
        vec2(x - 0.08, y - 0.02),
        vec2(x - 0.01, y + 0.04),
        vec2(x - 0.1, y + 0.05),
        vec2(x - 0.02, y + 0.04),
        vec2(x, y + 0.1),
        vec2(x + 0.02, y + 0.04),
        vec2(x + 0.1, y + 0.05),
        vec2(x + 0.01, y + 0.04),
        vec2(x + 0.08, y - 0.02),
    ];

    var pointBufferId = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, pointBufferId);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(maple), gl.STATIC_DRAW);

    var vPosition = gl.getAttribLocation(program, "vPosition");
    gl.vertexAttribPointer(vPosition, 2, gl.FLOAT, false, 0, 0);

    var vColor = gl.getAttribLocation(program, "vColor");
    gl.vertexAttrib4f(vColor, 0.9, 0.5, 0.3, 1.0);
    gl.uniform4fv(vOffset, [0, 0, 0, 0]);

    //draw star
    gl.drawArrays(gl.TRIANGLE_FAN, 0, 10);
}