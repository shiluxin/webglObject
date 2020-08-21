function main(){
	//获取canvas元素
	let canvas = document.getElementById("webgl");
	
	
	//获取webgl绘图上下文
	let gl = getWebGLContext(canvas);
	
	if(!gl){
		console.log("Failed to get the rendering context for WebGL");
		return;
	}
	
	//指定清空canvas的颜色
	gl.clearColor(0, 0, 0, 1.0);
	
	//清空canvas
	gl.clear(gl.COLOR_BUFFER_BIT);
}