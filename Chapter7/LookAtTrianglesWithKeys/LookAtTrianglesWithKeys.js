//顶点着色器
let VSHADER_SOURCE =
    `attribute vec4 a_Position;\n`+
    `attribute vec4 a_Color;\n`+
    `uniform mat4 u_ViewMatrix;\n`+
    `varying vec4 v_Color;\n`+
    `void main(){\n`+
    `   gl_Position = u_ViewMatrix * a_Position;\n`+
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
    //获取canvas节点
    let canvas = document.getElementById("look_canvas");
    if(!canvas) return;

    //获取webgl
    let gl = getWebGLContext(canvas);
    if(!gl) return;

    //初始化
    if(!initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE)) return;

    let n = initVertexBuffers(gl);
    if(n < 0) return;

    let u_ViewMatrix = gl.getUniformLocation(gl.program, "u_ViewMatrix");
    if(u_ViewMatrix == null) return;

    //设置视点 视线和上方向
    let viewMatrix = new Matrix4();
    //注册键盘事件响应函数
    document.onkeydown = function (ev) {
        keydown(ev, gl, n, u_ViewMatrix, viewMatrix);
    };
    draw(gl, n, u_ViewMatrix, viewMatrix);
    //设置背景色
    gl.clearColor(0.5, 0.0, 1.0, 1.0);
}
function initVertexBuffers(gl) {
    //顶点数据
    let verticesColors = new Float32Array([
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
    gl.bufferData(gl.ARRAY_BUFFER, verticesColors, gl.STATIC_DRAW);

    let F_SIZE = verticesColors.BYTES_PER_ELEMENT;
    //获取a_Position的存储位置,分配缓存区并开启
    let a_Position = gl.getAttribLocation(gl.program, "a_Position");
    if(a_Position < 0) return -1;
    gl.vertexAttribPointer(a_Position, 3, gl.FLOAT, false, F_SIZE*6, 0);
    gl.enableVertexAttribArray(a_Position);
    //获取a_Color的存储位置,分配缓存区并开启
    let a_Color = gl.getAttribLocation(gl.program, "a_Color");
    if(a_Color < 0) return -1;
    gl.vertexAttribPointer(a_Color, 3, gl.FLOAT, false, F_SIZE*6, F_SIZE*3);
    gl.enableVertexAttribArray(a_Color);
    return n;
}

let g_eyeX = 0.20, g_eyeY = 0.25, g_eyeZ = 0.25; //视点
function keydown(ev, gl, n, u_ViewMatrix, viewMatrix) {
    if(ev.key == 39){
        g_eyeX += 0.01;
    }
    else if(ev.key == 37){
        g_eyeX -= 0.01;
    }
    else {
        return;
    }
    draw(gl, n, u_ViewMatrix, viewMatrix);
}
function draw(gl, n, u_ViewMatrix, viewMatrix) {
    viewMatrix.setLookAt(0.20, 0.25, 0.25, 0.0, 0.0, 0.0, 0.0, 1.0, 0.0);
    //将视图矩阵传给u_ViewMatrix变量
    gl.uniformMatrix4fv(u_ViewMatrix, false, viewMatrix.elements);

    //清除canvas
    gl.clear(gl.COLOR_BUFFER_BIT);
    //绘制图案
    gl.drawArrays(gl.TRIANGLES, 0, n);
}