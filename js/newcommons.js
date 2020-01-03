var search_tip_data = null;
var search_tip_focus = false;
var search_input_focus = false;
var search_tip_pos = -1;

$(function() {
	
	$(window).scroll(function() {
		if ($(window).scrollTop() > 120) {
			if (!$('.qt-new-header').is('.is-fixed')) {
				$('.qt-new-header').addClass('is-fixed');
			}
		} else {
			if ($('.qt-new-header').is('.is-fixed')) {
				$('.qt-new-header').removeClass('is-fixed');
			}
		}
	});
	
	$(".sug-search-result").hover(
			  function () {
				  search_tip_focus = true;
			  },
			  function () {
				  search_tip_focus = false;
					if(!search_input_focus)
						$('.sug-search-result').hide();
			  }
	);
	$('#searchInput').focus(function() {
		search_input_focus = true;
		$('.sug-search-result').show();
	}).blur(function() {
		search_input_focus = false;
		if(!search_tip_focus)
			$('.sug-search-result').hide();
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
				$('.sug-result-list').removeClass('on');
				$($('.sug-result-list').get(search_tip_pos)).addClass('on');
			}
			
		}else if(event.keyCode == 40){// 按键↓
			if(search_tip_data){
				search_tip_pos++;
				if(search_tip_pos >= search_tip_data.length){
					search_tip_pos = 0;
				}
				$('#searchInput').val(search_tip_data[search_tip_pos]);
				$('.sug-result-list').removeClass('on');
				$($('.sug-result-list').get(search_tip_pos)).addClass('on');
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
						r += '<dl class="sug-result-list clearfix"><dd class="sug-list-name fl">'+ data[i] +'</dd></dl>';
					}
					$('.sug-result-all').html(r);
					
					$('.sug-result-list').click(function(){
						window.location = '/search.html?kw=' + $(this).text();
					});
				}
			});
			
			
		}
	});
	
	
	$('.header-r').hover(function() {
		$('.l-menu').show();
	}, function() {
		$('.l-menu').hide();
	});
	

	
});

var toast_handler = null;
function showToast(msg) {
	clearTimeout(toast_handler);
	$('.be-toast').text(msg);
	$('.be-toast').css('display','block');
	toast_handler = setTimeout("$('.be-toast').css('display','none')", "3000");
}


function gotologin() {
	$('.login-model').css('display', 'none');
	$('.box-linetit').text("登录宅图网");
	$('.logo-qq span').text("QQ登录");
	$('.logo-wechat span').text("微信登录");
	$('.logo-weibo span').text("微博登录");
	$('.login-footer span').html('还没有账号？ <a href="javascript:;" onclick="gotoreg()">立即注册</a>');
	$('.login-model').css('display', 'block');
	
}

function gotoreg() {
	$('.login-model').css('display', 'none');
		$('.box-linetit').text("注册宅图网");
		$('.logo-qq span').text("QQ注册");
		$('.logo-wechat span').text("微信注册");
		$('.logo-weibo span').text("微博注册");
		$('.login-footer span').html('已有账号？<a href="javascript:;" onclick="gotologin()">去登录</a>');
		$('.login-model').css('display', 'block');
}