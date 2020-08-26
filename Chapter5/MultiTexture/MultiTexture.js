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
    `uniform sampler2D u_Sampler0;\n`+
    `uniform sampler2D u_Sampler1;\n`+
    `void main() {\n`+
    `   vec4 color0 = texture2D(u_Sampler0, v_TexCoord);\n`+
    `   vec4 color1 = texture2D(u_Sampler1, v_TexCoord);\n`+
    `   gl_FragColor = color0 * color1;\n`+
    `}\n`;
function main() {
    let canvas = document.getElementById("muli_texture");
    if(!canvas) return;

    let gl = getWebGLContext(canvas);
    if(!gl) return;

    if(!initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE)) return;

    let n = initVertexShaders(gl);
    if(n < 0) return;

    if(!initTextures(gl, n)){

    }
}
function initVertexShaders(gl) {
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
    let vertexTexBuffer = gl.createBuffer();
    //绑定缓冲区对象
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexTexBuffer);
    //向缓冲区对象写入数据
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
    let texture0 = gl.createTexture();
    let texture1 = gl.createTexture();
    if(!texture0) return false;
    if(!texture1) return false;

    //获取u_Sampler0/u_Sampler1的存储位置
    let u_Sampler0 = gl.getUniformLocation(gl.program, "u_Sampler0");
    let u_Sampler1 = gl.getUniformLocation(gl.program, "u_Sampler1");
    if(!u_Sampler0) return false;
    if(!u_Sampler1) return false;

    //创建Image
    let image0 = new Image();
    let image1 = new Image();
    if(!image0 && !image1) return false;

    image0.onload = ()=>{
        loadTexture(gl, n, texture0, u_Sampler0, image0, 0);
    }
    image0.src = "../Resources/egg.jpg";

    image1.onload = ()=>{
        loadTexture(gl, n, texture1, u_Sampler1, image1, 1);
    }
    image1.src = "../Resources/circle.gif";

    return true;
}
let g_texUnit0 = false, g_texUnit1 = false;
function loadTexture(gl, n, texture, u_Sampler, image, texUnit) {
    //对纹理图像进行y轴反转
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1);
    //激活纹理
    if(texUnit === 0){
        gl.activeTexture(gl.TEXTURE0);
        g_texUnit0 = true;
    }
    else if(texUnit === 1){
        gl.activeTexture(gl.TEXTURE1);
        g_texUnit1 = true;
    }
    //绑定纹理对象到目标上
    gl.bindTexture(gl.TEXTURE_2D, texture);

    //配置纹理参数
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    //配置纹理图像
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, image);
    //将纹理单元编号传递给取样器
    gl.uniform1i(u_Sampler, texUnit);

    if(g_texUnit0 && g_texUnit1){
        //绘制背景色
        gl.clearColor(0.5, 0.0, 1.0, 1.0);
        //清除canvas
        gl.clear(gl.COLOR_BUFFER_BIT);
        //绘制图形
        gl.drawArrays(gl.TRIANGLE_STRIP, 0, n);
    }
}