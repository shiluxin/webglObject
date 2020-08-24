//顶点着色器
let VSHADER_SOURCE =
    `attribute vec4 a_Position;\n`+
    `void main() {\n`+
    `   gl_Position = a_Position;\n`+
    `}\n`;
let FSHADER_SOURCE =
    `precision mediump float;\n`+
    `uniform float u_Width;\n`+
    `uniform float u_Height;\n`+
    `void main() {\n`+
    `   gl_FragColor = vec4(gl_FragCoord.x/u_Width, 0.0, gl_FragCoord.y/u_Height, 1.0);\n`+
    `}\n`;

function main() {
    //获取canvas
    let canvas = document.getElementById("frag_canvas");
    if(!canvas) return;

    //获取webgl
    let gl = getWebGLContext(canvas);
    if(!gl) return;

    //初始化webgl
    if(!initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE)) return;

    let n = initVertexBuffers(gl);
    if(n < 0) return;

    //获取uniform变量并赋值
    let u_Width = gl.getUniformLocation(gl.program, "u_Width");
    if(!u_Width) return;
    gl.uniform1f(u_Width, gl.drawingBufferWidth);
    let u_Height = gl.getUniformLocation(gl.program, "u_Height");
    if(!u_Height) return;
    gl.uniform1f(u_Height, gl.drawingBufferHeight);


    //绘制背景
    gl.clearColor(0.5, 0.0, 1.0, 1.0);

    //清除canvas
    gl.clear(gl.COLOR_BUFFER_BIT);

    //绘制图案
    gl.drawArrays(gl.TRIANGLES, 0, n);
}

function initVertexBuffers(gl) {
    //顶点数据
    let vertices = new Float32Array([
        0.0, 0.5, -0.5, -0.5, 0.5, -0.5
    ])
    let n = !vertices ? -1 : vertices.length/2;

    //创建缓冲区对象
    let vertexBuffer = gl.createBuffer();
    //绑定缓冲区对象
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
    //向缓冲区对象赋值
    gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);

    ///获取a_Position的存储位置,分配缓存区并开启
    let a_Position = gl.getAttribLocation(gl.program, "a_Position");
    if(a_Position < 0) return -1;
    gl.vertexAttribPointer(a_Position, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(a_Position);

    return n;
}