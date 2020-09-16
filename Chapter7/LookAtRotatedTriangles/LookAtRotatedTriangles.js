//顶点着色器
let VSHDAER_SOURCE =
    `attribute vec4 a_Position;\n`+
    `attribute vec4 a_Color;\n`+
    // `uniform mat4 u_ViewMatrix;\n`+
    // `uniform mat4 u_ModelMatrix;\n`+
    `uniform mat4 u_ModelViewMatrix;\n`+
    `varying vec4 v_Color;\n`+
    `void main(){\n`+
    // `   gl_Position = u_ViewMatrix * u_ModelMatrix * a_Position;\n`+
    `   gl_Position = u_ModelViewMatrix * a_Position;\n`+
    `   v_Color = a_Color;\n`+
    `}\n`;
//片元着色器
let FSHADER_SOURCE =
    `precision mediump float;\n`+
    `varying vec4 v_Color;\n`+
    `void main(){\n`+
    `   gl_FragColor = v_Color;\n`+
    `}\n`;
function main() {
    //获取canvas元素
    let canvas = document.getElementById("lookR_canvas");
    if(!canvas) return;

    //获取webgl
    let gl = getWebGLContext(canvas);
    if(!gl) return;

    //初始化
    if(!initShaders(gl, VSHDAER_SOURCE, FSHADER_SOURCE)) return;

    let n = initVertexBuffers(gl);
    if(n < 0) return;

    // modelViewMatrix1(gl);
    modelViewMatrix2(gl);
    // modelViewMatrix3(gl);
    //绘制背景色
    gl.clearColor(0.7, 0.3, 0.8, 1.0);
    //清除canvas
    gl.clear(gl.COLOR_BUFFER_BIT);
    //绘制图形
    gl.drawArrays(gl.TRIANGLES, 0, n);
}
function initVertexBuffers(gl) {
    //顶点数据
    let verticesColor = new Float32Array([
        //顶点数据和颜色
        0.0, 0.5, -0.4, 0.4, 1.0, 0.4, //绿色三角形在最后面
        -0.5, -0.5, -0.4, 0.4, 1.0, 0.4,
        0.5, -0.5, -0.4, 1.0, 0.4, 0.4,

        0.5, 0.4, -0.2, 1.0, 0.4, 0.4,//黄色三角形在中间
        -0.5, 0.4, -0.2, 1.0, 1.0, 0.4,
        0.0, -0.6, -0.2, 1.0, 1.0, 0.4,

        0.0, 0.5, 0.0, 0.4, 0.4, 1.0, //蓝色三角形在最前面
        -0.5, -0.5, 0.0, 0.4, 0.4, 1.0,
        0.5, -0.5, 0.0, 1.0, 0.4, 0.4
    ]);
    let n = 9;

    //创建缓冲区对象
    let vertexColorBuffer = gl.createBuffer();

    //绑定缓冲区对象
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexColorBuffer);

    //向缓冲区对象写入数据
    gl.bufferData(gl.ARRAY_BUFFER, verticesColor, gl.STATIC_DRAW);

    let F_SIZE = verticesColor.BYTES_PER_ELEMENT;
    //获取a_Position的存储位置,分配缓存区并开启
    let a_Position = gl.getAttribLocation(gl.program, 'a_Position');
    if(a_Position < 0) return -1;
    gl.vertexAttribPointer(a_Position, 3, gl.FLOAT, false, F_SIZE*6, 0);
    gl.enableVertexAttribArray(a_Position);
    //获取a_Color的存储位置,分配缓存区并开启
    let a_Color = gl.getAttribLocation(gl.program, 'a_Color');
    if(a_Color < 0) return -1;
    gl.vertexAttribPointer(a_Color, 3, gl.FLOAT, false, F_SIZE*6, F_SIZE*3);
    gl.enableVertexAttribArray(a_Color);

    return n;
}
function modelViewMatrix1(gl) {
    //获取u_ViewMatrix存储位置
    let u_ViewMatrix = gl.getUniformLocation(gl.program, 'u_ViewMatrix');
    if(u_ViewMatrix == null) return;
    //设置视点 视线 上方向
    let viewMatrix = new Matrix4();
    viewMatrix.setLookAt(0.20, 0.25, 0.25, 0.0, 0.0, 0.0, 0.0, 1.0, 0.0);
    //将视图矩阵传递给u_ViewMatrix变量
    gl.uniformMatrix4fv(u_ViewMatrix, false, viewMatrix.elements);

    //获取u_ModelMatrix存储位置
    let u_ModelMatrix = gl.getUniformLocation(gl.program, 'u_ModelMatrix');
    if(u_ModelMatrix == null) return;
    //计算旋转矩阵
    let modelMatrix = new Matrix4();
    modelMatrix.setRotate(-90.0, 0.0, 0.0, 1.0);
    //将模型矩阵传递给u_ModelMatrix变量
    gl.uniformMatrix4fv(u_ModelMatrix, false, modelMatrix.elements);
}
function modelViewMatrix2(gl) {
    //获取u_ModelViewMatrix存储位置
    let u_ModelViewMatrix = gl.getUniformLocation(gl.program, 'u_ModelViewMatrix');
    if(u_ModelViewMatrix == null) return;
    //设置视点 视线 上方向
    let viewMatrix = new Matrix4();
    viewMatrix.setLookAt(0.20, 0.25, 0.25, 0.0, 0.0, 0.0, 0.0, 1.0, 0.0);
    //计算旋转矩阵
    let modelMatrix = new Matrix4();
    modelMatrix.setRotate(-90.0, 0.0, 0.0, 1.0);

    //viewMatrix和modelMatrix两个矩阵相乘
    let moduleViewMatrix = viewMatrix.multiply(modelMatrix);
    //将模型矩阵传递给u_ModelViewMatrix变量
    gl.uniformMatrix4fv(u_ModelViewMatrix, false, moduleViewMatrix.elements);
}
function modelViewMatrix3(gl) {
    //获取u_ModelViewMatrix存储位置
    let u_ModelViewMatrix = gl.getUniformLocation(gl.program, 'u_ModelViewMatrix');
    if(u_ModelViewMatrix == null) return;
    let modelViewMatrix = new Matrix4();
    modelViewMatrix.setLookAt(0.20, 0.25, 0.25, 0.0, 0.0, 0.0, 0.0, 1.0, 0.0).rotate(-10.0, 0.0, 1.0);
    //将模型矩阵传递给u_ModelMatrix变量
    gl.uniformMatrix4fv(u_ModelViewMatrix, false, modelViewMatrix.elements);
}