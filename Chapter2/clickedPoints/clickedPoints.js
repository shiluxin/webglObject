//顶点着色器
const VSHADER_SOURCE =
	`attribute vec4 a_Position;\n`+
	`void main () {\n`+
	`	gl_Position = a_Position;\n`+
	`	gl_PointSize = 10.0;\n`+
	`}\n`;
const FSHADER_SOURCE = 
	`void main () {\n`+
	`	gl_FragColor = vec4(0.0, 1.0, 1.0, 1.0);\n`+
	`}\n`;
function main(){
	//获取canvas元素
	const canvas = document.getElementById('clicked_canvas');
	if(!canvas){
		return;
	}
	
	//获取WebGL上下文
	let gl = getWebGLContext(canvas);
	if(!gl){
		return;
	}
	
	//初始化web GL
	if(!initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE)){
		return;
	}
	
	//获取attribute变量a_Position的存储位置
	let a_Position = gl.getAttribLocation(gl.program, 'a_Position');
	if(a_Position < 0){	
		return;
	}
	
	canvas.onmousedown = function (ev) { click(ev, gl, canvas, a_Position);};
	//绘制canvas背景色
	gl.clearColor(0.5, 0.0, 1.0, 1.0);
	//清空canvas
	gl.clear(gl.COLOR_BUFFER_BIT);
}

let g_position = [];//鼠标点击位置数组
function click (ev, gl, canvas, a_Position) {
	let x = ev.clientX;//鼠标点击处的x坐标
	let y = ev.clientY;//鼠标点击处的y坐标
	let rect = ev.target.getBoundingClientRect();
	
	x = ((x - rect.left) - canvas.height/2)/(canvas.height/2);
	y = (canvas.width/2 - (y - rect.top))/(canvas.width/2);
	//将坐标存储在g_points数组中
	g_position.push(x); g_position.push(y);
	
	//清除canvas
	gl.clear(gl.COLOR_BUFFER_BIT);
	
	let len = g_position.length;
	for(let i = 0; i < len; i+=2){
		//将点的位置传递到变量中a_Position
		gl.vertexAttrib3f(a_Position, g_position[i], g_position[i+1], 0.0);
		//绘制点
		gl.drawArrays(gl.POINTS, 0, 1);
	}
}