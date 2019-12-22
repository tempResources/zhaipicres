var slider_handler1;
var slider_handler2;

var b_slider_end = true;
var b_slider_start = true;

function tFun() {
	pFun(1);
}

function sFun() {
	if(b_slider_end && b_slider_start) {
		var new_slider_index = $('.slider_indicator_btn:hover').attr('slider_index');
		if(new_slider_index == undefined) {
			return;
		}
		var slider_index = parseInt($('.slider_indicator_btn_active').attr('slider_index'));
		if(new_slider_index != slider_index) {
			b_slider_end = false;
			b_slider_start = false;
			sliderImg(slider_index, parseInt(new_slider_index));
		}
	}
}

function pFun(t){
	if(b_slider_end && b_slider_start) {
		b_slider_end = false;
		b_slider_start = false;
		var slider_index = parseInt($('.slider_indicator_btn_active').attr('slider_index'));
		var btnCount = $('.slider_indicator_btn').size();
		var new_slider_index;
		if(t == 1){
			new_slider_index = slider_index < (btnCount - 1) ? slider_index + 1 : 0;
		}else{
			new_slider_index = slider_index > 0 ? slider_index - 1 : btnCount - 1;
		}
		sliderImg(slider_index, new_slider_index);
	}
	
}

function sliderImg(i, j) {

	var $slider_item = $('.images>div');

	var $slider_indicator_btn = $('.slider_indicator_btn');
	$($slider_indicator_btn.get(i)).removeClass('slider_indicator_btn_active');
	$($slider_indicator_btn.get(j)).addClass('slider_indicator_btn_active');

	$($slider_item.get(i)).animate({
		opacity: 0,
		"z-index": 0
	}, "200", function() {
		b_slider_end = true;
	});

	$($slider_item.get(j)).animate({
		opacity: 1,
		"z-index": 1
	}, "200", function() {
		b_slider_start = true;
	});

}

$(function() {
	$("img.lazy").lazyload({effect: "fadeIn"});
	

	slider_handler1 = setInterval("tFun()", 4000);

	$('.slider_indicator').mouseenter(function() {
		clearInterval(slider_handler1);
		b_slider_end = true;
		b_slider_start = true;
		slider_handler2 = setInterval("sFun()", 201);
	}).mouseleave(function() {
		clearInterval(slider_handler2);
		slider_handler1 = setInterval("tFun()", 4000);
	});
	
	$('.slider_control_item').hover(function(){
		clearInterval(slider_handler1);
	},function(){
		slider_handler1 = setInterval("tFun()", 4000);
	});


	$('.slider_control_prev').click(function() {
		pFun(-1);
	});

	$('.slider_control_next').click(function() {
		pFun(1);
	});

	
	
	

})