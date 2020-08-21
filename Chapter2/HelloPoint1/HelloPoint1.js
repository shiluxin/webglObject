//顶点着色器
let VSHADER_SOURCE = 
	`void main() {\n`+
	` gl_Position = vec4(0.0, 0.0, 0.0, 1.0);\n`+ //设置坐标
	` gl_PointSize = 200.0;\n`+		//设置尺寸
	`}\n`;
//片元着色器
let FSHADER_SOURCE = 
	`void main() {\n`+
	`	gl_FragColor = vec4(0.0, 1.0, 0.0, 1.0);\n`+//设置颜色
	`}\n`;
function main(){
	//获取canvas元素
	let canvas = document.getElementById("point1_canvas");
	
	//获取webGL绘图上下文
	let gl = getWebGLContext(canvas);
	if(!gl){
		console.log("Failed to get the rendering context for WebGL");
		return;
	}
	
	//初始化着色器
	if(!initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE)){
		console.log("Failed to initialize shaders.");
		return;
	}
	
	//设置canvas背景色
	gl.clearColor(0.0, 0.0, 0.0, 1.0);
	
	//清空canvas
	gl.clear(gl.COLOR_BUFFER_BIT);
	
	//绘制一个点
	gl.drawArrays(gl.POINTS, 0, 1);
}