//顶点着色器
let VSHADER_SOURCE =
	`attribute vec4 a_Position; \n`+
	`void main() { \n`+
	`	gl_Position = a_Position;\n`+
	`   gl_PointSize = 10.0;\n`+
	`}\n`;
//片元着色器
let FSHADER_SOURCE =
	`void main () {\n`+
	`	gl_FragColor = vec4(0.5, 0.5, 0.0, 1.0);\n`+
	`}\n`;
function main(){
	//获取canvas元素
	const canvas = document.getElementById("multi_canvas");
	if(!canvas) { return; }
	
	//获取WebGL上下文
	const gl = getWebGLContext(canvas);
	if(!gl) { return; }
	
	//初始化WebGL
	if(!initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE)){
		return;
	}
	
	//设置顶点位置
	let n = initvertexBuffers(gl);
	if(n < 0){
		return;
	}
	
	//设置canvas背景颜色
	gl.clearColor(0.5, 0.0, 1.0, 1.0);
	
	//清除canvas
	gl.clear(gl.COLOR_BUFFER_BIT);
	
	//绘制n个点
	gl.drawArrays(gl.POINTS, 0, n);
}
function initvertexBuffers (gl) {
	
	let vertices = new Float32Array([
		0.0, 0.5, -0.5, -0.5, 0.5, -0.5
	]);
	let n = !vertices ?  -1 : vertices.length/2;
	//创建缓冲区对象
	let vertexBuffer = gl.createBuffer();
	if(!vertexBuffer) { return -1; }
	
	//将缓冲区对象绑定到目标
	gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
	
	//向缓冲区对象写入数据
	gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);
	  
	//将缓冲区对象数据分配给attribute变量
	let a_Position = gl.getAttribLocation(gl.program, 'a_Position');
	if(a_Position < 0) { return -1; }
	gl.vertexAttribPointer(a_Position, 2, gl.FLOAT, false, 0, 0);
	
	//连接attribute变量和分配给它的缓冲区对象
	gl.enableVertexAttribArray(a_Position);
	return n;
}