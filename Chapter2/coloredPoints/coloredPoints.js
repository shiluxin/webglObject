//顶点着色器
const VSHADER_SOURCE =
	`attribute vec4 a_Position;\n`+
	`void main () {\n`+
	`	gl_Position = a_Position;\n`+
	`	gl_PointSize = 10.0;\n`+
	`}\n`;
const FSHADER_SOURCE =
	`precision mediump float;\n`+
	`uniform vec4 u_FragColor;\n`+
	`void main () {\n`+
	`	gl_FragColor = u_FragColor;\n`+
	`}\n`;
function main(){
	//获取canvas元素
	let canvas = document.getElementById("color_canvas");
	if(!canvas) { return; }
	//获取WebGL上下文
	const gl = getWebGLContext(canvas);
	if(!gl){ return; } 
	
	//初始化WebGL
	if(!initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE)) { return; }
	
	//获取attribute变量a_Position的存储位置
	let a_Position = gl.getAttribLocation(gl.program, 'a_Position');
	if( a_Position < 0 ) { return; }
	
	//获取uniform变量u_FragColor的存储位置
	let u_FragColor = gl.getUniformLocation(gl.program, 'u_FragColor');
	if( u_FragColor == null) { return; }
	
	//注册鼠标点击事件
	canvas.onmousedown = function (ev) { clicked(ev, gl, canvas, a_Position, u_FragColor); };
	
	//绘制canvas背景色
	gl.clearColor(0.5, 0.0, 1.0, 1.0);
	
	//清理canvas
	gl.clear(gl.COLOR_BUFFER_BIT);
}

let g_points = [];//鼠标点击位置数组
let g_colors = [];//存储点颜色数组
function clicked (ev, gl, canvas, a_Position, u_FragColor) {
	let x = ev.clientX;//鼠标点击处的x坐标
	let y = ev.clientY;//鼠标点击处的y坐标
	let rect = ev.target.getBoundingClientRect();
	
	x = ((x - rect.left) - canvas.height/2)/(canvas.height/2);
	y = (canvas.width/2 - (y - rect.top))/(canvas.width/2);
	//将坐标存储在g_points数组中
	g_points.push([x, y]);
	if(x > 0.0 && y > 0.0){//第一象限
		g_colors.push([1.0, 0.0, 0.0, 1.0]);
	}else if(x < 0.0 && y < 0.0){//第三象限
		g_colors.push([0.0, 0.0, 1.0, 1.0]);
	} else {
		g_colors.push([0.0, 1.0, 0.0, 1.0]);
	}
	
	//清除canvas
	gl.clear(gl.COLOR_BUFFER_BIT);
	
	let len = g_points.length;
	for(let i = 0; i < len; i++){
		let point_i = g_points[i];
		let rgba = g_colors[i];
		
		gl.vertexAttrib2f(a_Position, point_i[0], point_i[1]);
		gl.uniform4f(u_FragColor, rgba[0], rgba[1], rgba[2], rgba[3]);
		gl.drawArrays(gl.POINTS, 0, 1);
	}
}