var cur_index=0;
slideshow();
function slideshow(){
	let x=document.querySelectorAll(".slideshow");
	let x_len=x.length;
	for(let i=0;i<x_len;i++){
		x[i].style.display= "none";
	}
	cur_index++;
	if(cur_index > x_len) cur_index=1;
	x[cur_index-1].style.display = "block";
	setTimeout(slideshow,2500);
}
