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
let ANGLE_STEP = 45.0;//旋转速度(度/秒)
function main() {
    //获取canvas元素
    let canvas = document.getElementById("roting_canvas");
    if(!canvas) return;

    //获取webgl
    let gl = getWebGLContext(canvas);
    if(!gl) return;

    //初始化webgl
    if(!initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE)) return;

    //生成绘制顶点
    let n = initvertexBuffers(gl);
    if(n < 0) return;

    //绘制背景颜色
    gl.clearColor(0.5, 0.0, 1.0, 1.0);

    let u_ModelMatrix = gl.getUniformLocation(gl.program, "u_ModelMatrix");
    if(!u_ModelMatrix) return;

    let currentAngle = 0.0;//当前三角形角度
    let matrix4 = new Matrix4();

    //开始绘制三角形
    let tick = function () {
        currentAngle = animate(currentAngle);//更新旋转角
        draw(gl, n, currentAngle, matrix4, u_ModelMatrix);
        requestAnimationFrame(tick);//请求浏览器调用tick
    }
    tick();

    let upButton = document.getElementById("up_button");
    let downButton = document.getElementById("down_button");
    upButton.onclick = (ev)=> {
        clickEvent(ev);
    };
    downButton.onclick = (ev)=> {
        clickEvent(ev);
    };;
}
function initvertexBuffers(gl) {
    //顶点数据
    let vertices = new Float32Array([
        0.0, 0.5, -0.5, -0.5, 0.5, -0.5
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

function draw(gl, n, currentAngle, modelMatrix, u_ModelMatrix) {
    //设置旋转矩阵
    modelMatrix.setRotate(currentAngle, 0.0, 0.0, 1.0);
    modelMatrix.translate(0.35, 0.0, 0.0);

    //将旋转矩阵传输给顶点着色器
    gl.uniformMatrix4fv(u_ModelMatrix, false, modelMatrix.elements);

    //清除canvas
    gl.clear(gl.COLOR_BUFFER_BIT);

    //绘制图形
    gl.drawArrays(gl.TRIANGLES, 0, n);
}
let g_last = Date.now();
function animate(angle) {
    //计算距离上次调用经过多长时间
    let now = Date.now();
    let elapsed = now - g_last;//毫秒
    g_last = now;
    //根据距离上次调用的时间, 更新当前旋转角度
    let newAngle = angle + (ANGLE_STEP * elapsed)/1000.0;
    return newAngle %= 360;
}
function clickEvent(event) {
    let targ_data = event.target.firstChild.data;
    console.log(targ_data);
    if(targ_data === "up"){
        ANGLE_STEP = ANGLE_STEP >= 360.0 ? ANGLE_STEP : ANGLE_STEP + 5.0;
    }
    else if(targ_data === "down"){
        ANGLE_STEP = ANGLE_STEP <= 1.0 ? 1.0 : ANGLE_STEP - 5.0;
    }
    else {
        ANGLE_STEP = 45.0;
    }
}