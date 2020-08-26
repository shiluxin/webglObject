//顶点着色器
let VSHADER_SOURCE =
    `attribute vec4 a_Position;\n`+
    `attribute vec2 a_TexCoord;\n`+
    `varying vec2 v_TexCoord;\n`+
    `void main() {\n`+
    `   gl_Position = a_Position;\n`+
    `   v_TexCoord = a_TexCoord;\n`+
    `}\n`;
//片元着色器
let FSHADER_SOURCE =
    `precision mediump float;\n`+
    `varying vec2 v_TexCoord;\n`+
    `uniform sampler2D u_Sampler;\n`+
    `void main() {\n`+
    `   gl_FragColor = texture2D(u_Sampler, v_TexCoord);\n`+
    `}\n`;

function main() {
    let canvas = document.getElementById("repeat_canvas");
    if(!canvas) return;

    let gl = getWebGLContext(canvas);
    if(!gl) return;

    if(!initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE)) return;

    let n = initVertexShaders(gl);
    if(n < 0) return;

    if(!initTexture(gl, n)){

    }
}
function initVertexShaders(gl) {
    //顶点数据
    let verticesTexCoords = new Float32Array([
        //顶点坐标, 纹理坐标
        -0.5, 0.5, -0.3, 1.7,
        -0.5, -0.5, -0.3, -0.2,
        0.5, 0.5, 1.7, 1.7,
        0.5, -0.5, 1.7, -0.2
    ]);
    let n = !verticesTexCoords ? -1 : verticesTexCoords.length/4;


    let vertexTexCoordBuffer = gl.createBuffer();
    if(!vertexTexCoordBuffer) return -1;

    gl.bindBuffer(gl.ARRAY_BUFFER, vertexTexCoordBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, verticesTexCoords, gl.STATIC_DRAW);

    let F_SIZE = verticesTexCoords.BYTES_PER_ELEMENT;

    let a_Position = gl.getAttribLocation(gl.program, "a_Position");
    if(a_Position < 0) return -1;
    gl.vertexAttribPointer(a_Position, 2, gl.FLOAT, false, F_SIZE*4, 0);
    gl.enableVertexAttribArray(a_Position);

    let a_TexCoord = gl.getAttribLocation(gl.program, "a_TexCoord");
    if(a_TexCoord < 0) return -1;
    gl.vertexAttribPointer(a_TexCoord, 2, gl.FLOAT, false, F_SIZE * 4, F_SIZE * 2);
    gl.enableVertexAttribArray(a_TexCoord);

    return n;
}

function initTexture(gl, n) {
    //创建纹理对象
    let texture = gl.createTexture();
    if(!texture) return false;

    //获取u_Sampler存储位置
    let u_Sampler = gl.getUniformLocation(gl.program, "u_Sampler");
    if(!u_Sampler) return false;

    //创建一个Image对象
    let image = new Image();
    if(!image) return false;

    //注册image的onload事件
    image.onload = () => {
        loadTexture(gl, n, texture, u_Sampler, image);
    }
    image.src = "../Resources/egg.jpg";

    return true;
}
function loadTexture(gl, n, texture, u_Sampler, image) {
    //对纹理图像进行y轴翻转
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1);
    //开启0号纹理单元
    gl.activeTexture(gl.TEXTURE0);
    //向target绑定纹理对象
    gl.bindTexture(gl.TEXTURE_2D, texture);

    //配置纹理参数
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    //配置纹理图像
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, image);

    //将0号纹理单元传递给uniform变量
    gl.uniform1i(u_Sampler, 0);

    //绘制背景色
    gl.clearColor(0.5, 0.0, 1.0, 1.0);
    //清除canvas
    gl.clear(gl.COLOR_BUFFER_BIT);
    //绘制图案
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, n);

}