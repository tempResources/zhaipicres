
$(function(){
	
	$('.jubao').click(function(){
		$('#jubao-win').attr("style","display: block;");
	})
	
	$('.jubao-close').click(function(){
		$('.report-win').attr("style","display: none;");
	})

})

<<<<<<< HEAD

function subFankui(){
	var contentTitle = $("input[name='reason']:checked").val();
	var contentDesc = $('#report_reason').val();
	var contentType = '作品反馈';
	
	$('.report-win').attr("style","display: none;");

	$.get("/user/feedback/add.html",{contentDesc:contentDesc,
		contentTitle:contentTitle,
		contentType:contentType
	}, function(data){
		data = jQuery.parseJSON(data);
		  if(data.status == 200){
			  showToast('举报成功！我们会尽快为您处理');
		  }else{
			  showToast(data.msg);
		  }
	});
}
=======
>>>>>>> b2b18fe050d86ef02339d4dfe47232d0f01e8383
