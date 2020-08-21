//顶点着色器
let VSHADER_SOURCE =
    `attribute vec4 a_Position;\n`+
    `uniform mat4 u_ModelMatrix;\n`+
    `void main() {\n`+
    `   gl_Position = u_ModelMatrix * a_Position;\n`+
    `}\n`;
//片元着色器
let FSHADER_SOURCE =
    `void main() {\n`+
    `   gl_FragColor = vec4(1.0, 0.5, 0.0, 1.0);\n`+
    `}\n`;
function main() {
    //获取canvas元素
    let canvas = document.getElementById("rotTran_canvas");
    if(!canvas) return;

    //获取webgl
    let gl = getWebGLContext(canvas);
    if(!gl) return;

    //初始化webgl
    if(!initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE)) return;

    //生成绘制顶点
    let n = initvertexBuffers(gl);
    if(n < 0) return;

    let matrix4 = new Matrix4();
    let ANGLE = 60.0;
    let Tx = 0.5;
    // matrix4.setRotate(ANGLE, 0.0, 0.0, 1.0);//先设置旋转
    // matrix4.translate(Tx, 0.0, 0.0);//再乘以平移
    matrix4.setTranslate(Tx, 0.0, 0.0);
    matrix4.rotate(ANGLE, 0.0, 0.0, 1.0);

    let u_ModelMatrix = gl.getUniformLocation(gl.program, "u_ModelMatrix");
    if(u_ModelMatrix == null) return;
    gl.uniformMatrix4fv(u_ModelMatrix, false, matrix4.elements);

    //绘制背景色
    gl.clearColor(0.5, 0.0, 1.0, 1.0);

    //清理canvas
    gl.clear(gl.COLOR_BUFFER_BIT);

    //绘制图形
    gl.drawArrays(gl.TRIANGLES, 0, n);
}

function initvertexBuffers(gl) {
    //顶点数据
    let vertices = new Float32Array([
        0.0, 0.3, -0.3, -0.3, 0.3, -0.3
    ]);
    let n = !vertices ? -1 : vertices.length/2;

    //创建缓冲区对象
    let vertexBuffer = gl.createBuffer();

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