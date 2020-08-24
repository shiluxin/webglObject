//顶点着色器
let VSHADER_SOURCE =
    `attribute vec4 a_Position;\n`+
    `attribute vec4 a_Color;\n`+
    `varying vec4 v_Color;\n`+
    `void main() {\n`+
    `   gl_Position = a_Position;\n`+
    `   gl_PointSize = 10.0;\n`+
    `   v_Color = a_Color;\n`+
    `}\n`;
let FSHADER_SOURCE =
    `precision mediump float;\n`+
    `varying vec4 v_Color;\n`+
    `void main(){\n`+
    `   gl_FragColor = v_Color;\n`+
    `}\n`;

function main() {
    //获取canvas元素
    let canvas = document.getElementById("multi_color");
    if(!canvas) return;

    //获取webgl
    let gl = getWebGLContext(canvas);
    if(!gl) return;

    //初始化webgl
    if(!initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE)) return;

    let n = initVertexBuffers(gl);
    if(n < 0) return;

    //绘制背景色
    gl.clearColor(0.5, 0.0, 1.0, 1.0);

    //清除canvas
    gl.clear(gl.COLOR_BUFFER_BIT);

    //绘制图形
    // gl.drawArrays(gl.POINTS, 0, n);//三个不同颜色的点
    gl.drawArrays(gl.TRIANGLES, 0, n);//彩色三角形
}

function initVertexBuffers(gl) {
    //顶点颜色数据
    let verticesColor = new Float32Array([
         0.0,  0.5, 1.0, 0.0, 0.0,
        -0.5, -0.5, 0.0, 1.0, 0.0,
         0.5, -0.5, 0.0, 0.0, 1.0
    ]);
    let n = !verticesColor ? -1 : verticesColor.length/5;

    //创建缓存区对象
    let vertexColorBuffer = gl.createBuffer();
    //绑定缓存区对象
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexColorBuffer);
    //向缓存区对象写入数据
    gl.bufferData(gl.ARRAY_BUFFER, verticesColor, gl.STATIC_DRAW);

    let F_SIZE = verticesColor.BYTES_PER_ELEMENT;
    //获取a_Position的存储位置,分配缓存区并开启
    let a_Position = gl.getAttribLocation(gl.program, "a_Position");
    if(a_Position < 0) return -1;
    gl.vertexAttribPointer(a_Position, 2, gl.FLOAT, false, F_SIZE*5, 0);
    gl.enableVertexAttribArray(a_Position);
    //获取a_Color的存储位置,分配缓存区并开启
    let a_Color = gl.getAttribLocation(gl.program, "a_Color");
    if(a_Color < 0) return -1;
    gl.vertexAttribPointer(a_Color, 3, gl.FLOAT, false, F_SIZE*5, F_SIZE*2);
    gl.enableVertexAttribArray(a_Color);

    return n;
}