/**
 * 通过矩阵旋转/平移/缩放
 * @type {string}
 */
//顶点着色器
let VSHADER_SOURCE =
    `attribute vec4 a_Position;\n`+
    `uniform mat4 u_xformMatrix;\n`+
    `void main() {\n`+
    `   gl_Position = u_xformMatrix * a_Position;\n`+
    `}\n`;
//片元着色器
let FSHADER_SOURCE =
    `void main() {\n`+
    `   gl_FragColor = vec4(1.0, 0.5, 0.0, 1.0);\n`+
    `}\n`;
function main() {
    //获取canvas元素
    let canvas = document.getElementById("matrix_canvas");
    if(!canvas) return;

    //获取webgl
    let gl = getWebGLContext(canvas);
    if(!gl) return;

    //初始化webgl
    if(!initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE)) return;

    let n = initvertexBuffers(gl);
    if(n < 0) return;

    // let xformMatrix = RotationFun();//旋转
    // let xformMatrix = TranslationFun();//平移
    let xformMatrix = ScalingFun();    //缩放
    //将矩阵传输给顶点着色器
    let u_xformMatrix = gl.getUniformLocation(gl.program, "u_xformMatrix");
    if(u_xformMatrix == null) return;
    gl.uniformMatrix4fv(u_xformMatrix, false, xformMatrix);

    //绘制背景色
    gl.clearColor(0.5, 0.0, 1.0, 1.0);

    //清空canvas
    gl.clear(gl.COLOR_BUFFER_BIT);

    //绘制图案
    gl.drawArrays(gl.TRIANGLES, 0, n);
}
function initvertexBuffers(gl){
    //创建顶点数据
    let vertices = new Float32Array([
        0.0, 0.5, -0.5, -0.5, 0.5, -0.5
    ]);
    let n = !vertices ? -1 : vertices.length/2;

    //创建缓冲区对象
    let vertexBuffer = gl.createBuffer();
    if(!vertexBuffer) return -1;

    //绑定缓冲区对象
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);

    //向缓冲区对象写入数据
    gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);

    //将缓冲区对象的数据传递给attribute变量
    let a_Position = gl.getAttribLocation(gl.program, "a_Position");
    if(a_Position < 0) return -1;
    gl.vertexAttribPointer(a_Position, 2, gl.FLOAT, false, 0, 0);

    //关联attribute变量和分配给它的缓冲区对象
    gl.enableVertexAttribArray(a_Position);

    return n;
}
function RotationFun() {
    let ANGLE = 90.0;
    //创建旋转矩阵
    let radian = Math.PI * ANGLE / 180.0;//角度转弧度制
    let cosB = Math.cos(radian);
    let sinB = Math.sin(radian);

    //注意webgl中矩阵是列主序的
    return new Float32Array([
        cosB, sinB, 0.0, 0.0,
        -sinB, cosB, 0.0, 0.0,
        0.0, 0.0, 1.0, 0.0,
        0.0, 0.0, 0.0, 1.0
    ]);
}
function TranslationFun() {
    let Tx = 0.5, Ty = 0.5, Tz = 0.0;
    return new Float32Array([
        1.0, 0.0, 0.0, 0.0,
        0.0, 1.0, 0.0, 0.0,
        0.0, 0.0, 1.0, 0.0,
         Tx,  Ty,  Tz, 1.0
    ]);
}
function ScalingFun() {
    let Sx = 1.0, Sy = 1.0, Sz = 1.0;
    return new Float32Array([
         Sx, 0.0, 0.0, 0.0,
        0.0,  Sy, 0.0, 0.0,
        0.0, 0.0,  Sz, 0.0,
        0.0, 0.0, 0.0, 1.0
    ]);
}