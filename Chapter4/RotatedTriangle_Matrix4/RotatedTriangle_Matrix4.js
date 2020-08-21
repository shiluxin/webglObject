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
    let canvas = document.getElementById("matrix4_canvas");
    if(!canvas) return;

    //获取webgl
    let gl = getWebGLContext(canvas);
    if(!gl) return;

    //初始化webgl
    if(!initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE)) return;

    //生成绘制顶点
    let n = initvertexBuffers(gl);
    if(n < 0) return;

    let xformMatrix = new Matrix4();

    // Matrix4RotationFun(xformMatrix);
    // Matrix4TranslationFun(xformMatrix);
    Matrix4ScalingFun(xformMatrix);
    let u_xformMatrix = gl.getUniformLocation(gl.program, "u_xformMatrix");
    if(u_xformMatrix == null) return;
    gl.uniformMatrix4fv(u_xformMatrix, false, xformMatrix.elements);

    //绘制背景色
    gl.clearColor(0.5, 0.0, 1.0, 1.0);

    //清空canvas
    gl.clear(gl.COLOR_BUFFER_BIT);

    //绘制图案
    gl.drawArrays(gl.TRIANGLES, 0, n);
}
function initvertexBuffers(gl) {
    //顶点数据
    let vertices = new Float32Array([
        0.0, 0.5, -0.5, -0.5, 0.5, -0.5
    ])
    let n = !vertices ? -1 : vertices.length/2;

    //创建缓冲区对象
    let vertexBuffer = gl.createBuffer();
    if(!vertexBuffer) return -1;

    //绑定缓冲区对象
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);

    //向缓冲区对象赋值
    gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);

    //将缓冲区对象的数据传递给attribute变量
    let a_Position = gl.getAttribLocation(gl.program, "a_Position");
    if(a_Position < 0) return -1;
    gl.vertexAttribPointer(a_Position, 2, gl.FLOAT, false, 0, 0);

    //关联attribute变量和分配给它的缓冲区对象
    gl.enableVertexAttribArray(a_Position);

    return n;
}
function Matrix4RotationFun(xformMatrix) {
    let ANGLE = 90.0;
    //将xformMatrix设置为旋转矩阵
    xformMatrix.setRotate(ANGLE, 0, 0, 1);
    return xformMatrix;
}
function Matrix4TranslationFun(xformMatrix) {
    //将xformMatrix设置为平移矩阵
    xformMatrix.setTranslate(0.5, 0.5, 0.0);
    return xformMatrix;
}
function Matrix4ScalingFun(xformMatrix) {
    //将xformMatrix设置为缩放矩阵
    xformMatrix.setScale(0.5, 0.5, 1.0);
    return xformMatrix;
}