//顶点着色器
let VSHADER_SOURCE =
	`attribute vec4 a_Position;\n`+
	`void main () {\n`+
	`	gl_Position = a_Position;\n`+
	`}\n`;
//片元着色器
let FSHADER_SOURCE =
	`void main () {\n`+
	`	gl_FragColor = vec4(0.5, 1.0, 0.0, 1.0);\n`+
	`}\n`;
function main() {
	//获取canvas元素
	const canvas = document.getElementById('rect_canvas');
	if(!canvas) { return; }
	//获取webgl上下文
	const gl = getWebGLContext(canvas);
	if(!gl) { return; }
	//初始化webgl
	if(!initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE)) { return; }
	
	//获取绘制顶点个数
	let n = initvertexBuffers(gl);
	if(n < 0) { return; }
	
	
	//绘制canvas背景色
	gl.clearColor(1.0, 0.5, 0.0, 1.0);
	
	//清空canvas
	gl.clear(gl.COLOR_BUFFER_BIT);
	
	//绘制图形
	gl.drawArrays(gl.TRIANGLE_FAN, 0, n);
}
function initvertexBuffers(gl) {
	//创建绘制图形顶点数据
	let vertices = new Float32Array([
		-0.5, 0.5, -0.5, -0.5, 0.5, 0.5, 0.5, -0.5
	]);
	let n = !vertices ? -1 : vertices.length/2;
	
	//创建缓冲区对象
	let vertexBuffer = gl.createBuffer();
	if(!vertexBuffer){ return -1; }
	
	//绑定缓冲区
	gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
	
	//向缓冲区对象写入数据
	gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);
	
	//将缓冲区对象的数据赋值给attribute变量
	let a_Position = gl.getAttribLocation(gl.program, 'a_Position');
	gl.vertexAttribPointer(a_Position, 2, gl.FLOAT, false, 0, 0);
	
	//启动attribute变量
	gl.enableVertexAttribArray(a_Position);
	
	return n;
}