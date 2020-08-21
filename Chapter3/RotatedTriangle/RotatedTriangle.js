/**
 * 旋转
 * 示例:绕Z轴, 逆时针旋转β角度
 *
 * 已知:r为从原点到起始点p(x, y, z)的坐标
 * 		α为x轴逆时针旋转到点p的角度
 * 则p点坐标可以表示为:
 * 		x = r * cosα
 * 		y = r * sinα
 * 同理, p'点的坐标可表示为:
 * 		x' = r * cos(α + β)
 * 		y' = r * sin(α + β)
 * 三角函数两角和公式
 * 		x' = r * (cosαcosβ  - sinαsinβ)
 * 		y' = r * (sinαcosβ + cosαsinβ)
 * 消除 r 和 α , 得
 * 		x' = xcosβ - ysinβ
 * 		y' = xsinβ + ycosβ
 * 		z' = z
 * @type {string}
 */
//顶点着色器
let VSHADER_SOURCE =
	`attribute vec4 a_Position;\n`+
	`uniform float u_cosB, u_sinB;\n`+
	`void main() {\n`+
	`	gl_Position.x = a_Position.x * u_cosB - a_Position.y * u_sinB;\n`+
	`	gl_Position.y = a_Position.x * u_sinB + a_Position.y * u_cosB;\n`+
	`	gl_Position.z = a_Position.z;\n`+
	`	gl_Position.w = 1.0;\n`+
	`}\n`;
//片元着色器
let FSHADER_SOURCE =
	`void main() {\n`+
	`	gl_FragColor = vec4(1.0, 0.5, 0.0, 1.0);\n`+
	`}\n`;
let ANGLE = 50.0;
function main()
{
	//获取canvas元素
	const canvas = document.getElementById("rotate_canvas");
	if(!canvas) return;
	
	//获取webgl
	let gl = getWebGLContext(canvas);
	
	//初始化webgl
	if(!initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE)){ return; } 
	
	let n = initvertexBuffers(gl);
	if(n < 0) return;
	
	let radian = Math.PI * ANGLE / 180;	//转换为弧度制
	let sinB = Math.sin(radian);
	let cosB = Math.cos(radian);
	
	let u_cosB = gl.getUniformLocation(gl.program, 'u_cosB');
	let u_sinB = gl.getUniformLocation(gl.program, 'u_sinB');
	if(!u_cosB || !u_sinB) return;
	
	gl.uniform1f(u_cosB, cosB);
	gl.uniform1f(u_sinB, sinB);
	
	
	//绘制背景
	gl.clearColor(0.5, 0.0, 1.0, 1.0);
	
	//清空canvas
	gl.clear(gl.COLOR_BUFFER_BIT);
	
	//绘制图案
	gl.drawArrays(gl.TRIANGLES, 0, n);
}

function initvertexBuffers(gl)
{
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
	let a_Position = gl.getAttribLocation(gl.program, 'a_Position');
	if(a_Position < 0) return -1;
	gl.vertexAttribPointer(a_Position, 2, gl.FLOAT, false, 0, 0);
	
	//关联attribute变量和分配给它的缓冲区对象
	gl.enableVertexAttribArray(a_Position);
	
	return n;
}