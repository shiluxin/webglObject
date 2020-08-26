/**
 * 加载纹理
 * 步骤:
 *  1.顶点着色器中接收顶点的纹理坐标,光栅化后传递给片元着色器.
 *  2.片元着色器根据片元的纹理坐标,从纹理图像中抽取出纹理颜色,赋给当前片元.
 *  3.设置顶点的纹理坐标(initVertexBuffers()).
 *  4.准备代加载的纹理图像, 令浏览器读取它(initTexture()).
 *  5.监听纹理图像的加载事件,一旦加载完成,就在webgl系统中使用纹理(loadTexture()).
 * @type {string}
 */

//顶点着色器
let VSHADER_SOURCE =
    `attribute vec4 a_Position;\n`+
    `attribute vec2 a_TexCoord;\n`+
    `varying vec2 v_TexCoord;\n`+
    `void main() {\n`+
    `   gl_Position = a_Position;\n`+
    `   v_TexCoord = a_TexCoord;\n`+
    `}\n`;
let FSHADER_SOURCE =
    `precision mediump float;\n`+
    `uniform sampler2D u_Sampler;\n`+
    `varying vec2 v_TexCoord;\n`+
    `void main() {\n`+
    `   gl_FragColor = texture2D(u_Sampler, v_TexCoord);\n`+
    `}\n`;

function main() {
    //获取canvas
    let canvas = document.getElementById("texture_canvas");
    if(!canvas) return;

    //获取webgl
    let gl = getWebGLContext(canvas);
    if(!gl) return;

    //初始化webgl
    if(!initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE)) return;

    //设置顶点信息
    let n = initVertexBuffers(gl);
    if(n < 0) return;

    if(!initTextures(gl, n)){
        console.log("无法配置纹理");
    }
}
function initVertexBuffers(gl) {
    //顶点数据
    let verticesTexCoords = new Float32Array([
        //顶点坐标, 纹理坐标
        -0.5, 0.5, 0.0, 1.0,
        -0.5, -0.5, 0.0, 0.0,
        0.5, 0.5, 1.0, 1.0,
        0.5, -0.5, 1.0, 0.0
    ]);
    let n = !verticesTexCoords ? -1 : verticesTexCoords.length/4;

    //创建缓冲区对象
    let vertexTexCoordBuffer = gl.createBuffer();
    //绑定缓冲区对象
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexTexCoordBuffer);
    //缓冲区对象赋值
    gl.bufferData(gl.ARRAY_BUFFER, verticesTexCoords, gl.STATIC_DRAW);

    let F_SIZE = verticesTexCoords.BYTES_PER_ELEMENT;
    //将顶点坐标分配给a_Position并开启它
    let a_Position = gl.getAttribLocation(gl.program, "a_Position");
    if(a_Position < 0) return -1;
    gl.vertexAttribPointer(a_Position, 2, gl.FLOAT, false, F_SIZE * 4, 0);
    gl.enableVertexAttribArray(a_Position);
    //将纹理坐标分配给a_TexCoord并开启它
    let a_TexCoord = gl.getAttribLocation(gl.program, "a_TexCoord");
    if(a_TexCoord < 0) return -1;
    gl.vertexAttribPointer(a_TexCoord, 2, gl.FLOAT, false, F_SIZE * 4, F_SIZE * 2);
    gl.enableVertexAttribArray(a_TexCoord);

    return n;
}

function initTextures(gl, n) {
    //创建纹理对象
    let texture = gl.createTexture();
    if(!texture) return false;

    //获取u_Sampler的存储位置
    let u_Sampler = gl.getUniformLocation(gl.program, "u_Sampler");
    if(!u_Sampler) return false;

    //创建一个image对象
    let image = new Image();
    if(!image) return false;

    //注册加载事件的响应函数
    image.onload = ()=>{
        loadTexture(gl, n, texture, u_Sampler, image);
    }
    image.src = '../Resources/egg.jpg';

    return true;
}
function loadTexture(gl, n, texture, u_Sampler, image) {
    //对纹理图像进行y轴反转
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1);
    //开启0号纹理单元
    gl.activeTexture(gl.TEXTURE0);
    //向target绑定纹理对象
    gl.bindTexture(gl.TEXTURE_2D, texture);

    //配置纹理参数
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    //配置纹理图像
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, image);

    //将0号纹理传递给着色器
    gl.uniform1i(u_Sampler, 0);

    //绘制背景色
    gl.clearColor(0.5, 0.0, 1.0, 1.0);
    //清除canvas
    gl.clear(gl.COLOR_BUFFER_BIT);
    //绘制图案
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, n);
}