//顶点着色器
const VSHADER_SOURCE = 
	`attribute vec4 a_Position;\n`+
	`attribute float a_PointSize;\n` +
	`void main(){\n`+
	`	gl_Position = a_Position;\n`+
	`	gl_PointSize = a_PointSize;\n`+
	`}\n`;
//片元着色器
const FSHADER_SOURCE =
	`void main(){\n`+
	`	gl_FragColor = vec4(0.0, 1.0, 1.0, 1.0);\n`+
	`}\n`;


function main(){
	//获取canvas元素
	let canvas_node = document.getElementById("point2_canvas");
	if(!canvas_node){
		return;
	}
	
	//获取WebGL绘图上下文
	let gl = getWebGLContext(canvas_node);
	if(!gl){
		console.log("Failed to get the rendering context for WebGL");
		return;
	}
	
	//初始化着色器
	if(!initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE)){
		console.log("Failed to initialize shaders.");
		return;
	}
	
	//获取attribute变量a_Position的存储位置
	let a_Position = gl.getAttribLocation(gl.program, 'a_Position');
	if(a_Position < 0){
		console.log("Failed to get the storage location of a_Position");
		return;
	}
	console.log(a_Position);
	//将顶点位置传输给attribute变量
	this.setVertexAttribFun1(gl, a_Position);
	// this.setVertexAttribFun2(gl, a_Position);
	
	//获取attribute变量a_PointSize的存储位置
	let a_PointSize = gl.getAttribLocation(gl.program, 'a_PointSize');
	if(a_PointSize < 0){
		console.log("Failed to get the storage location of a_PointSize");
		return;
	}
	console.log(a_PointSize);
	//将顶点大小传输给attribute变量
	gl.vertexAttrib1f(a_PointSize, 20.0);
	
	//设置canvas背景色
	gl.clearColor(0.0, 0.0, 0.0, 1.0);
	
	//清空canvas
	gl.clear(gl.COLOR_BUFFER_BIT);
	
	//绘制点
	gl.drawArrays(gl.POINTS, 0, 1);
	
}
function setVertexAttribFun1 (gl, pos) {
	// gl.vertexAttrib1f(pos, 0.5);
	// gl.vertexAttrib2f(pos, 0.5, 0.5);
	// gl.vertexAttrib3f(pos, 0.0, 0.5, 0.0);
	gl.vertexAttrib4f(pos, 0.0, 0.5, 0.0, 1.0);
}
function setVertexAttribFun2 (gl, pos) {
	let _position = new Float32Array([0.5, 0.5, 0.0, 1.0]);
	gl.vertexAttrib4fv(pos, _position);
}