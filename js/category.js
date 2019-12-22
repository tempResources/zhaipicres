$(function() {
	$("img.lazy").lazyload({effect: "fadeIn"});
	
	$('#flow .work-list').wookmark({
		container: $('#flow'),
		offset: 8,
		itemWidth: 230,
		align:"center"
	});


})