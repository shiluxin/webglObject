//顶点着色器
let VSHADER_SOURCE =
    `attribute vec4 a_Position;\n`+
    `attribute float a_PointSize;\n`+
    `void main() {\n`+
    `   gl_Position = a_Position;\n`+
    `   gl_PointSize = a_PointSize;\n`+
    `}\n`;
//片元着色器
let FSHADER_SOURCE =
    `void main() {\n`+
    `   gl_FragColor = vec4(0.5, 0.5, 0.0, 1.0);\n`+
    `}\n`;

function main() {
    //获取canvas元素
    let canvas = document.getElementById("size_canvas");

    //获取webgl
    let gl = getWebGLContext(canvas);

    //初始化webgl
    if(!initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE)) return;

    let n = initvertexBuffers(gl);
    if(n < 0) return;

    //绘制背景色
    gl.clearColor(0.5, 0.0, 1.0, 1.0);

    //清理canvas
    gl.clear(gl.COLOR_BUFFER_BIT);

    //绘制图形
    gl.drawArrays(gl.POINTS, 0, n);
}

function initvertexBuffers(gl) {
    //顶点数据
    let vertices = new Float32Array([
        0.0, 0.5, -0.5, -0.5, 0.5, -0.5
    ]);
    let n = !vertices ? -1 : vertices.length/2;

    //尺寸数据
    let size = new Float32Array([
        10.0, 20.0, 30.0
    ])

    //创建缓存区对象
    let vertexBuffer = gl.createBuffer();
    if(!vertexBuffer) return -1;

    //绑定缓冲区对象
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
    //向缓冲区对象赋值
    gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);
    //将缓冲区对象数据分配给attribute变量
    let a_Position = gl.getAttribLocation(gl.program, "a_Position");
    if(a_Position < 0) return -1;
    gl.vertexAttribPointer(a_Position, 2, gl.FLOAT, false, 0, 0);
    //关联缓冲区对象和attribute变量
    gl.enableVertexAttribArray(a_Position);


    //创建尺寸缓存区对象
    let sizeBuffer = gl.createBuffer();
    if(!sizeBuffer) return -1;
    //绑定
    gl.bindBuffer(gl.ARRAY_BUFFER, sizeBuffer);
    //赋值
    gl.bufferData(gl.ARRAY_BUFFER, size, gl.STATIC_DRAW);
    //分配数据
    let a_PointSize = gl.getAttribLocation(gl.program, "a_PointSize");
    if(a_PointSize < 0) return -1;
    gl.vertexAttribPointer(a_PointSize, 1, gl.FLOAT, false, 0, 0);
    //关联
    gl.enableVertexAttribArray(a_PointSize);

    return n;
}