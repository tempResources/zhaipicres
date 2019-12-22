var search_tip_data = null;
var search_tip_focus = false;
var search_input_focus = false;
var search_tip_pos = -1;

$(function() {
	$("img.lazy").lazyload({effect: "fadeIn"});
	
	$('#flow .flow-item').wookmark({
		container: $('#flow'),
		offset: 10,
		autoResize: true,
		align:"left"
	});
	
	
	$('.jianyi').click(function(){
		$('#jianyi-win').attr("style","display: block;");
	})
	
	$('.jubao-close').click(function(){
		$('#jianyi-win').attr("style","display: none;");
	})
	
	$(".search-result").hover(
			  function () {
				  search_tip_focus = true;
			  },
			  function () {
				  search_tip_focus = false;
					if(!search_input_focus)
						$('.search-result').hide();
			  }
	);
	$('#searchInput').focus(function() {
		search_input_focus = true;
		$('.search-result').show();
	}).blur(function() {
		search_input_focus = false;
		if(!search_tip_focus)
			$('.search-result').hide();
	});

	
	$('#searchInput')
	.keyup(function (event) {
		if (event.keyCode == 13) {
			window.location = '/search.html?kw=' + $('#searchInput').val();
		}else if(event.keyCode == 38){// 按键↑
			if(search_tip_data){
				search_tip_pos--;
				if(search_tip_pos < 0){
					search_tip_pos = search_tip_data.length - 1;
				}
				$('#searchInput').val(search_tip_data[search_tip_pos]);
				$('.result-list').removeClass('on');
				$($('.result-list').get(search_tip_pos)).addClass('on');
			}
			
		}else if(event.keyCode == 40){// 按键↓
			if(search_tip_data){
				search_tip_pos++;
				if(search_tip_pos >= search_tip_data.length){
					search_tip_pos = 0;
				}
				$('#searchInput').val(search_tip_data[search_tip_pos]);
				$('.result-list').removeClass('on');
				$($('.result-list').get(search_tip_pos)).addClass('on');
			}
		}else{
			var search_value = $('#searchInput')
			.val();
			$
			.ajax({
				url : "/ajaxSearch.html?kw="
						+ search_value,
				dataType : "jsonp",
				type : "GET",
				success : function(data) {
					search_tip_data = data;
					search_tip_pos = -1;
					var r = '';
					for (var i = 0; i < data.length; i++) {
						r += '<dl class="result-list clearfix"><dd class="list-name fl">'+ data[i] +'</dd></dl>';
					}
					$('.result-all').html(r);
					
					$('.result-list').click(function(){
						window.location = '/search.html?kw=' + $(this).text();
					});
				}
			});
			
			
		}
	});

})

function subJianyi(){
	$('#jianyi-win').attr("style","display: none;");
	var contentDesc = $('#contentDesc').val();
	var contentTitle = $('#contentTitle').val();
	$.get("/user/feedback/add.html",{contentDesc:contentDesc,
		contentTitle:contentTitle,
		contentType:'素材建议'
	}, function(data){
		data = jQuery.parseJSON(data);
		  if(data.status == 200){
			  showToast('提交成功！感谢您的建议');
		  }else{
			  showToast(data.msg);
		  }
	});
}

var toast_handler = null;
function showToast(msg) {
	clearTimeout(toast_handler);
	$('.be-toast').text(msg);
	$('.be-toast').css('display','block');
	toast_handler = setTimeout("$('.be-toast').css('display','none')", "3000");
}