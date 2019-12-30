$(function(){
	
	$("img.lazy").lazyload({effect: "fadeIn",threshold : 100});
	
	$('.detail-img').click(function(){
		$('.big-pic-model').attr("style","display: block;");
		$(window).scrollTop(0);
	});
	$('.close-bgm').click(function(){
		$('.big-pic-model').attr("style","display: none;");
	})
	$('.bg').click(function(){
		$('.big-pic-model').attr("style","display: none;");
	})
	
	$('.jubao').click(function(){
		if($('#login-user-div').length < 1){
			gotologin();
			return;
		}
		$('#jubao-win').attr("style","display: block;");
	})
	
	$('.jubao-close').click(function(){
		$('.report-win').attr("style","display: none;");
	})
	
	$('.report-bg').click(function(){
		$('.report-win').attr("style","display: none;");
	})
	
	$('#ztscbtn').click(function() {
		showFavorite();
	});
	$('.ztdwbtn').click(function() {
		showDownload();
	});
	
	$('.fav-new-placeholder').click(function() {
		$('.report-win').attr("style","display: none;");
		$('#new-fav-win').css("display","block");
	});
	
	$(".eutf8").each(function(){
		$(this).attr('href',encodeURI($(this).attr('href')));
	});



	
	var fav_ids =  $.cookie("fav_ids");
	console.info(fav_ids);
	if(fav_ids){
		if(fav_ids.indexOf(','+$('#pid').val()+',') > -1){
			$('#ztscbtn').html('<i class="icon-fav" style="background-position: -305px -94px;"></i>&nbsp;已收藏');
		}
	}
	
	var fol_ids =  $.cookie("fol_ids");
	console.info(fol_ids);
	if(fol_ids){
		if(fol_ids.indexOf(','+$('#authorID').val()+',') > -1){
			$('.js-gz').text('已关注');
			$('.js-gz').toggleClass('guanzhu');
			$('.js-gz').attr("onclick","deleteFollow()");
		}
	}
	
});


function addFollow(){
	if($('#login-user-div').length < 1){
		gotologin();
		return;
	}
	var authorID = $('#authorID').val();
	$.ajax({
		url : "/home/follow/add.html?authorID=" + authorID,
		dataType : "jsonp",
		type : "GET",
		success : function(data){
			if(data.status == 200){
				showToast('关注成功(ง •̀_•́)ง');
				$('.js-gz').text('已关注');
				$('.js-gz').toggleClass('guanzhu');
				$('.js-gz').attr("onclick","deleteFollow()");
				
				var fol_ids = $.cookie('fol_ids');
				if(!fol_ids){
					fol_ids = ',' + $('#authorID').val() + ',';
				}else{
					if(fol_ids.length > 60){
						fol_ids = fol_ids.substring(fol_ids.indexOf(',')+1,fol_ids.length);
						fol_ids = fol_ids.substring(fol_ids.indexOf(',')+1,fol_ids.length);
					}
					fol_ids = fol_ids + ',' + $('#authorID').val() + ',';
				}
				$.cookie('fol_ids', fol_ids, { expires: 365, path: '/',domain:'.zhaipic.com' });
				
			}else{
				showToast(data.msg);
			}
		}
	});
}

function deleteFollow(){
	if($('#login-user-div').length < 1){
		gotologin();
		return;
	}
	var authorID = $('#authorID').val();
	$.ajax({
		url : "/home/follow/delete.html?authorID=" + authorID,
		dataType : "jsonp",
		type : "GET",
		success : function(data){
			if(data.status == 200){
				showToast('取消关注成功！');
				$('.js-gz').html('<i class="tag-add"></i>关注');
				$('.js-gz').toggleClass('guanzhu');
				$('.js-gz').attr("onclick","addFollow()");
			}
		}
	});
}


function addFavorite() {
	var name = $('#fav-name').val();
	$.ajax({
		url : "/home/favorite/create.html?name=" + name,
		dataType : "jsonp",
		type : "GET",
		success : function(data){
			$('#fav-name').val('');
			if(data.status == 200){
				$('.report-win').attr("style","display: none;");
				showFavorite();
				$('#fav-win').css("display","block");
				showToast('创建成功(ง •̀_•́)ง');
			}else{
				$('.report-win').attr("style","display: none;");
				$('#fav-win').css("display","block");
				showToast(data.msg);
			}
		}
	});
}

function addFavoriteItem(){
	if($('#fav_form input:checked').val() == null){
		showToast("请选择一个收藏夹");
		return;
	}
	$.ajax({
		url : "/home/favorite/add.html?fid=" + $('#fav_form input:checked').val() + '&sid=' + $('#pid').val(),
		dataType : "jsonp",
		type : "GET",
		success : function(data){
			if(data.status == 200){
				$('.report-win').attr("style","display: none;");
				showToast('收藏成功(ง •̀_•́)ง');
				$('#ztscbtn').html('<i class="icon-fav" style="background-position: -305px -94px;"></i>&nbsp;已收藏');
				
				var fav_ids = $.cookie('fav_ids');
				if(!fav_ids){
					fav_ids = ',' + $('#pid').val() + ',';
				}else{
					if(fav_ids.length > 60){
						fav_ids = fav_ids.substring(fav_ids.indexOf(',')+1,fav_ids.length);
						fav_ids = fav_ids.substring(fav_ids.indexOf(',')+1,fav_ids.length);
					}
					fav_ids = fav_ids + ',' + $('#pid').val() + ',';
				}
				$.cookie('fav_ids', fav_ids, { expires: 365, path: '/',domain:'.zhaipic.com' });
			}else{
				showToast(data.msg);
			}
		}
	});

}
function showDownload(){
	if($('#login-user-div').length < 1){
		gotologin();
		return;
	}
	window.open('/download/'+ $('#pid').val() +'.html');
}

function showFavorite() {
	if($('#login-user-div').length < 1){
		gotologin();
		return;
	}
	$('#fav-win').css("display","block");
	$.ajax({
		url : "/home/favorite/list.html",
		dataType : "jsonp",
		type : "GET",
		success : function(data){
			if(data.status == 200){
				var html = '';
				if(data.data.length>0){
					for(var i=0;i<data.data.length;i++){
//						if(i == 0){
//							html+='<div class="radio-div"><p class="radio-inline"><input type="radio" name="fid" checked id="fav'+ i +'" value="'+ data.data[i].id +'"><label for="fav'+ i +'" >'+ data.data[i].name +'</label></p></div>';
//						}else{
						var f1 = i==0?'active':'';
						var f2 = i==0?'checked':'';
							html+='<div class="radio-div '+ f1 +'"  data-id="fav'+ i +'"><p class="radio-inline"><input type="radio"  '+ f2 +' name="fid" id="fav'+ i +'" value="'+ data.data[i].id +'"><label for="fav'+ i +'" >'+ data.data[i].name +'</label></p></div>';
					//	}
					}
					
				}else{
					html = '<p class="radio-inline" style="font-size: 14px;padding-left: 28px;">您还未创建收藏夹，点击创建增加新收藏夹吧！</p>';
				}
				$('#fav_form').html(html);
				$('.radio-div').click(function() {
					$('.radio-div').removeClass('active');
					$(this).addClass('active');
					$('#'+$(this).attr('data-id')).prop('checked',true);
				});
			}
		}
	});
}

function subJubao(){

	var contentTitle = $("input[name='reason']:checked").val();
	var contentDesc = $('#report_reason').val();
	var contentType = '作品举报-' + $('#pid').val();
	
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
