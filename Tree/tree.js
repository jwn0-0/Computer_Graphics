
var gl;
var points;

window.onload = function init()
{
    var canvas = document.getElementById( "gl-canvas" );

    gl = WebGLUtils.setupWebGL( canvas );
    if ( !gl ) { alert( "WebGL isn't available" ); }


    //var vertices = new Float32Array([vec2(-1, -1), vec2(0, 1), vec2(1, -1)]);
	  // var vertices = [ vec2(-1,-1), vec2(0,1), vec2(1,-1)];
    //  Configure WebGL
    var vertices = [
        vec2(0,1),
        vec2(-1,0.5),
        vec2(1,0.5),
        vec2(0,0.5),
        vec2(-1,0),
        vec2(1,0),
        vec2(0,0),
        vec2(-1,-0.5),
        vec2(1,-0.5),
    ];

    var stumpvertices = [
        vec2(-0.5,-0.5),
        vec2(-0.5,-1),
        vec2(-0.5,-0.5),
        vec2(0.5,-1),
        vec2(-0.5,-0.5),
        vec2(0.5,-1)
    ];

    gl.viewport( 0, 0, canvas.width, canvas.height );
    gl.clearColor( 1.0, 1.0, 1.0, 1.0 );

    //  Load shaders and initialize attribute buffers

    var program = initShaders( gl, "vertex-shader", "fragment-shader" );
    gl.useProgram( program );

    // Load the data into the GPU

    var bufferId = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, bufferId );

    // Associate vertex data buffer with shader variables

    var vPosition = gl.getAttribLocation( program, "vPosition" );
    gl.vertexAttribPointer( vPosition, 2, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vPosition );

    var uColor = gl.getUniformLocation(program, "uColor");

    gl.clear( gl.COLOR_BUFFER_BIT );

    var all = new Float32Array([
        0,1,-0.5,0.5,0.5,0.5,
        0, 0.5, -0.5, 0, 0.5, 0,
        0, 0, -0.5, -0.5, 0.5, -0.5,
        -0.15, -0.5, 0.15, -0.5, -0.15, -1,
        0.15, -0.5, -0.15, -1, 0.15, -1
    ]);

    gl.bufferData( gl.ARRAY_BUFFER, all, gl.STATIC_DRAW );
    gl.uniform4f(uColor,0.0,1.0,0.0,1.0);
    gl.drawArrays( gl.TRIANGLES, 0, 9 );

    //gl.bufferData( gl.ARRAY_BUFFER,flatten(stumpvertices), gl.STATIC_DRAW );
    gl.uniform4f(uColor,0.5,0.25,0.0,1.0);
    gl.drawArrays( gl.TRIANGLES, 9, 6 );

};