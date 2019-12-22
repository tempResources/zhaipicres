(function (factory) {
	if (typeof define === 'function' && define.amd) {
		// AMD
		define(['jquery'], factory);
	} else if (typeof exports === 'object') {
		// CommonJS
		factory(require('jquery'));
	} else {
		// Browser globals
		factory(jQuery);
	}
}(function ($) {

	var pluses = /\+/g;

	function encode(s) {
		return config.raw ? s : encodeURIComponent(s);
	}

	function decode(s) {
		return config.raw ? s : decodeURIComponent(s);
	}

	function stringifyCookieValue(value) {
		return encode(config.json ? JSON.stringify(value) : String(value));
	}

	function parseCookieValue(s) {
		if (s.indexOf('"') === 0) {
			// This is a quoted cookie as according to RFC2068, unescape...
			s = s.slice(1, -1).replace(/\\"/g, '"').replace(/\\\\/g, '\\');
		}

		try {
			// Replace server-side written pluses with spaces.
			// If we can't decode the cookie, ignore it, it's unusable.
			// If we can't parse the cookie, ignore it, it's unusable.
			s = decodeURIComponent(s.replace(pluses, ' '));
			return config.json ? JSON.parse(s) : s;
		} catch(e) {}
	}

	function read(s, converter) {
		var value = config.raw ? s : parseCookieValue(s);
		return $.isFunction(converter) ? converter(value) : value;
	}

	var config = $.cookie = function (key, value, options) {

		// Write

		if (value !== undefined && !$.isFunction(value)) {
			options = $.extend({}, config.defaults, options);

			if (typeof options.expires === 'number') {
				var days = options.expires, t = options.expires = new Date();
				t.setTime(+t + days * 864e+5);
			}

			return (document.cookie = [
				encode(key), '=', stringifyCookieValue(value),
				options.expires ? '; expires=' + options.expires.toUTCString() : '', // use expires attribute, max-age is not supported by IE
				options.path    ? '; path=' + options.path : '',
				options.domain  ? '; domain=' + options.domain : '',
				options.secure  ? '; secure' : ''
			].join(''));
		}

		// Read

		var result = key ? undefined : {};

		// To prevent the for loop in the first place assign an empty array
		// in case there are no cookies at all. Also prevents odd result when
		// calling $.cookie().
		var cookies = document.cookie ? document.cookie.split('; ') : [];

		for (var i = 0, l = cookies.length; i < l; i++) {
			var parts = cookies[i].split('=');
			var name = decode(parts.shift());
			var cookie = parts.join('=');

			if (key && key === name) {
				// If second argument (value) is a function it's a converter...
				result = read(cookie, value);
				break;
			}

			// Prevent storing a cookie that we couldn't decode.
			if (!key && (cookie = read(cookie)) !== undefined) {
				result[name] = cookie;
			}
		}

		return result;
	};

	config.defaults = {};

	$.removeCookie = function (key, options) {
		if ($.cookie(key) === undefined) {
			return false;
		}

		// Must not alter options, thus extending a fresh object...
		$.cookie(key, '', $.extend({}, options, { expires: -1 }));
		return !$.cookie(key);
	};

}));

$(function() {

	$(window).scroll(function() {
		if ($(window).scrollTop() > 200) {
			if (!$('.search-fix').is('.search-fix-on')) {
				$('.search-fix').addClass('search-fix-on');
				$('.search-header #shelper').hide();
			}
		} else {
			if ($('.search-fix').is('.search-fix-on')) {
				$('.search-fix').removeClass('search-fix-on');
				$('.search-fix .text').blur();
			}
		}
	});

	

	$('.nav-list').hover(
			function() {
				$(this).children('.ztfl-a').css('color', "#ff630e");
				$(this).children('.ztfl-a').children('.iconfont').attr("class",
						'iconfont icon-xiangshangshouqi');
				$(this).children('.dorpdown-layer').css("display", 'block');
			},
			function() {
				$(this).children('.ztfl-a').children('.iconfont').attr("class",
						'iconfont icon-xiangxiazhankai');
				$(this).children('.dorpdown-layer').css("display", 'none');
				$(this).children('.ztfl-a').css('color', "#666");
			})

	$('.search-header #searchInput')
			.keyup(
					function(event) {

						if (event.keyCode == 13) {// 回车
							if ($('.search-header #searchInput').val() != '') {
								window.location = "http://search.zhaipic.com:8083/search?kw="
										+ $('.search-header #searchInput')
												.val();
							}
						} else if (event.keyCode == 38) {// 按键↑

							if (search_tip_sum == 0) {
								return;
							}

							$(
									$('.search-header #shelper').children('li')
											.get(search_tip_cur - 1))
									.removeClass('liOn');
							search_tip_cur -= 1;
							if (search_tip_cur <= 0) {
								$(
										$('.search-header #shelper').children(
												'li').get(0)).removeClass(
										'liOn');
								search_tip_cur = search_tip_sum;
							}

							$('.search-header #searchInput')
									.val(
											$(
													$('.search-header #shelper')
															.children('li')
															.get(
																	search_tip_cur - 1))
													.text());
							$(
									$('.search-header #shelper').children('li')
											.get(search_tip_cur - 1)).addClass(
									'liOn');

						} else if (event.keyCode == 40) {// 按键↓

							if (search_tip_sum == 0) {
								return;
							}

							if (search_tip_sum <= search_tip_cur) {
								$(
										$('.search-header #shelper').children(
												'li').get(search_tip_cur - 1))
										.removeClass('liOn');
								search_tip_cur = 0;
							}

							if (search_tip_cur == 0) {
								$(
										$('.search-header #shelper').children(
												'li').get(0)).removeClass(
										'liOn');
							} else {
								$(
										$('.search-header #shelper').children(
												'li').get(search_tip_cur - 1))
										.removeClass('liOn');
							}

							search_tip_cur += 1;

							$(
									$('.search-header #shelper').children('li')
											.get(search_tip_cur - 1)).addClass(
									'liOn');
							$('.search-header #searchInput')
									.val(
											$(
													$('.search-header #shelper')
															.children('li')
															.get(
																	search_tip_cur - 1))
													.text());

						} else {

							var new_search_value = $(
									'.search-header #searchInput').val();
							if (new_search_value.length == 0) {
								old_search_value = '';
								$('.search-header #shelper')
								.hide();
								$('.search-header #shelper').html('');
								return;
							}

							if (new_search_value == old_search_value) {
								return;
							}

							if (search_tip_xhr != null) {
								search_tip_xhr.abort();
							}

						//	$('.search-header #shelper').html('');
							old_search_value = new_search_value;

							search_tip_xhr = $
									.ajax({
										url : "http://search.zhaipic.com:8083/ajaxSearch?kw="
												+ new_search_value,
										dataType : "jsonp",
										type : "GET",
										success : function(data) {
											var r = '';
											search_tip_sum = data.length;
											search_tip_cur = 0;
											for (var i = 0; i < data.length; i++) {
												r += '<li onclick="keyitem(this)"  "data-id="'
														+ i
														+ '" ><div class="search-item">'
														+ data[i]
														+ '</div></li>'
											}
											$('.search-header #shelper')
													.html(r);
											if (data.length > 0) {
												$('.search-header #shelper')
														.show();
											} else {
												$('.search-header #shelper')
														.hide();
											}
										}
									});

						}

					});

	$('.search-header #searchInput').focus(function() {
		clearTimeout(search_tip_time);
	}).blur(function() {
		if (search_tip_xhr != null) {
			search_tip_xhr.abort();
		}
		if($('.search-header #shelper:hover').length < 1){
			$('.search-header #shelper').hide();
		}else{
			search_tip_time = setTimeout("hideTip($('.search-header #shelper'))", 3000);
		}
	});

	$('.search-fix #searchInput')
			.keyup(
					function(event) {

						if (event.keyCode == 13) {// 回车

							if ($('.search-fix #searchInput').val() != '') {
								window.location = "http://search.zhaipic.com:8083/search?kw="
										+ $('.search-fix #searchInput').val();
							}

						} else if (event.keyCode == 38) {// 按键↑

							if (search_tip_sum_fix == 0) {
								return;
							}

							$(
									$('.search-fix #shelper').children('li')
											.get(search_tip_cur_fix - 1))
									.removeClass('liOn');
							search_tip_cur_fix -= 1;
							if (search_tip_cur_fix <= 0) {
								$(
										$('.search-fix #shelper')
												.children('li').get(0))
										.removeClass('liOn');
								search_tip_cur_fix = search_tip_sum_fix;
							}

							$('.search-fix #searchInput').val(
									$(
											$('.search-fix #shelper').children(
													'li').get(
													search_tip_cur_fix - 1))
											.text());
							$(
									$('.search-fix #shelper').children('li')
											.get(search_tip_cur_fix - 1))
									.addClass('liOn');

						} else if (event.keyCode == 40) {// 按键↓

							if (search_tip_sum_fix == 0) {
								return;
							}

							if (search_tip_sum_fix <= search_tip_cur_fix) {
								$(
										$('.search-fix #shelper')
												.children('li').get(
														search_tip_cur_fix - 1))
										.removeClass('liOn');
								search_tip_cur_fix = 0;
							}

							if (search_tip_cur_fix == 0) {
								$(
										$('.search-fix #shelper')
												.children('li').get(0))
										.removeClass('liOn');
							} else {
								$(
										$('.search-fix #shelper')
												.children('li').get(
														search_tip_cur_fix - 1))
										.removeClass('liOn');
							}

							search_tip_cur_fix += 1;

							$(
									$('.search-fix #shelper').children('li')
											.get(search_tip_cur_fix - 1))
									.addClass('liOn');
							$('.search-fix #searchInput').val(
									$(
											$('.search-fix #shelper').children(
													'li').get(
													search_tip_cur_fix - 1))
											.text());

						} else {

							var new_search_value = $('.search-fix #searchInput')
									.val();
							if (new_search_value.length == 0) {
								old_search_value_fix = '';
								$('.search-fix #shelper').html('');
								$('.search-fix #shelper')
								.hide();
								return;
							}

							if (new_search_value == old_search_value_fix) {
								return;
							}

							if (search_tip_xhr_fix != null) {
								search_tip_xhr_fix.abort();
							}

						//	$('.search-fix #shelper').html('');
							old_search_value_fix = new_search_value;

							search_tip_xhr_fix = $
									.ajax({
										url : "http://search.zhaipic.com:8083/ajaxSearch?kw="
												+ new_search_value,
										dataType : "jsonp",
										type : "GET",
										success : function(data) {
											var r = '';
											search_tip_sum_fix = data.length;
											search_tip_cur_fix = 0;
											for (var i = 0; i < data.length; i++) {
												r += '<li onclick="keyitem_fix(this)" "data-id="'
														+ i
														+ '" ><div class="search-item">'
														+ data[i]
														+ '</div></li>'
											}
											$('.search-fix #shelper').html(r);
											if (data.length > 0) {
												$('.search-fix #shelper')
														.show();
											} else {
												$('.search-fix #shelper')
														.hide();
											}
										}
									});

						}

					});

	$('.search-fix #searchInput').focus(function() {
		clearTimeout(search_tip_time_fix);
	}).blur(function() {
		if (search_tip_xhr_fix != null) {
			search_tip_xhr_fix.abort();
		}
		if($('.search-fix #shelper:hover').length < 1){
			$('.search-fix #shelper').hide();
		}else{
			search_tip_time_fix = setTimeout("hideTip($('.search-fix #shelper'))", 3000);
		}
	});
	

	var _ticket =  $.cookie("auth_id");
	if(!_ticket){
		return ;
	}
	$.ajax({
		url : "http://sso.zhaipic.com:8084/user/token/" + _ticket,
		dataType : "jsonp",
		type : "GET",
		success : function(data){
			if(data.status == 200){
				var h;
				if(data.data.is_signin == 0){
					h = '<div class="o-qiandao fl" ><span class="icofont h-ico"></span> <span class="h-txt">签到</span><div class="q-hop"><i style="right:43px"></i><div style="padding:20px;text-align:center"><p style="font-size:14px;margin-bottom:20px;color:#666" id="qiandaomsg">您今天尚未签到哦~</p><a href="javascript:;" onclick="z2qd(this)" class="ztqdbtn" id="qiandao">立即签到</a></div><div class="checkin-rewards"><a href="javascript:;" class="query v-middle">!</a><div class="text-ctnr"><span class="today-rewards">每日签到</span> <span class="future-rewards">签到后可以获得2次免费下载的机会</span></div></div></div></div>';
				}else{
					var curDate = new Date();
					var curt = curDate.getFullYear() + '-' + (curDate.getMonth() + 1) + '-' + curDate.getDate();
					h = '<div class="o-qiandao fl" ><span class="icofont h-ico"></span> <span class="h-txt">签到</span><div class="q-hop"><i style="right:43px"></i><div style="padding:20px;text-align:center"><p style="font-size:14px;margin-bottom:20px;color:#666" id="qiandaomsg">'+ curt +'，签到成功！</p><a href="javascript:;" class="ztqddisable" id="qiandao">已签到</a></div><div class="checkin-rewards"><a href="javascript:;" class="query v-middle">!</a><div class="text-ctnr"><span class="today-rewards">每日签到</span> <span class="future-rewards">签到后可以获得2次免费下载的机会</span></div></div></div></div>';
				}
				
				h+= '<div class="login-after fl" ><a href="#" id="a-login-a"><span class="l-pic"><img src="'+ data.data.faceurl +'"></span> <span class="l-txt">'+ data.data.name +'</span></a> <i></i> <b class="umes-icon" ';
				if(data.data.msg_num > 0){
					h+= '>' + data.data.msg_num + '</b><div class="l-menu"><i class="lmsj-top" style="right:81px"></i><div class="uinfo-dropmenu"><div class="box1 chat-member"><div class="chat-mem-con clearfix"><div class="mem-pic"><a href="#" target="_blank"><img src="'+ data.data.faceurl +'"></a></div><div class="logname"><a class="name" href="#" target="_blank" >'+ data.data.name +'</a></div><div class="authenticate"><a class="uname-aut" href="javascript:;" target="_blank" title="实名认证"><i></i></a> <a class="mobile-aut" href="javascript:;" target="_blank" title="绑定手机"><i></i></a> <a class="email-aut" href="javascript:;" target="_blank" title="绑定邮箱"><i></i></a></div><a class="logout" href="http://sso.zhaipic.com:8084/user/logout"><i class="iconfont icon-login-out logoutico" style="font-size:20px"></i>登出</a></div></div><div class="box4 wallet"><div class="wallet-con clearfix"><div class="fl"><h2 class="title">我的钱包</h2><div class="m-wealth"><span title="签到可以获得共享分">共享分 '+ data.data.score +'</span></div></div><a class="r-com-btn getYc fr" href="#" target="_blank">充值</a></div></div><div class="box6 uim-foot"><ul class="clearfix"><li class="personal-center"><a href="#" class="pc-a" target="_blank"><i></i><p>个人中心</p><b class="person-icon"></b></a></li><li class="focus"><a href="#" class="focus-a" target="_blank"><i></i><p>我的收藏</p></a></li><li class="message"><a href="#" class="message-a" target="_blank"><i></i><p>系统通知</p><b class="mes-icon" style="display:block;" >'+ data.data.msg_num +'</b></a></li><li class="live-set"><a href="#" class="live-set-a" target="_blank"><i></i><p>我要投稿</p></a></li></ul></div></div></div></div>';
				}else{
					h+= ' style="display:none;" >' + data.data.msg_num + '</b><div class="l-menu"><i class="lmsj-top" style="right:81px"></i><div class="uinfo-dropmenu"><div class="box1 chat-member"><div class="chat-mem-con clearfix"><div class="mem-pic"><a href="#" target="_blank"><img src="'+ data.data.faceurl +'"></a></div><div class="logname"><a class="name" href="#" target="_blank" >'+ data.data.name +'</a></div><div class="authenticate"><a class="uname-aut" href="javascript:;" target="_blank" title="实名认证"><i></i></a> <a class="mobile-aut" href="javascript:;" target="_blank" title="绑定手机"><i></i></a> <a class="email-aut" href="javascript:;" target="_blank" title="绑定邮箱"><i></i></a></div><a class="logout" href="http://sso.zhaipic.com:8084/user/logout"><i class="iconfont icon-login-out logoutico" style="font-size:20px"></i>登出</a></div></div><div class="box4 wallet"><div class="wallet-con clearfix"><div class="fl"><h2 class="title">我的钱包</h2><div class="m-wealth"><span title="签到可以获得共享分">共享分 '+ data.data.score +'</span></div></div><a class="r-com-btn getYc fr" href="#" target="_blank">充值</a></div></div><div class="box6 uim-foot"><ul class="clearfix"><li class="personal-center"><a href="#" class="pc-a" target="_blank"><i></i><p>个人中心</p><b class="person-icon"></b></a></li><li class="focus"><a href="#" class="focus-a" target="_blank"><i></i><p>我的收藏</p></a></li><li class="message"><a href="#" class="message-a" target="_blank"><i></i><p>系统通知</p><b class="mes-icon" style="display:none;" >'+ data.data.msg_num +'</b></a></li><li class="live-set"><a href="#" class="live-set-a" target="_blank"><i></i><p>我要投稿</p></a></li></ul></div></div></div></div>';
				}
				
				$('.header-r').html(h);
				
				$('.login-after').hover(function() {
					$('.l-menu').fadeIn("300");
					$(this).addClass('open');
				}, function() {
					$('.l-menu').attr("style", "display: none;");
					$(this).removeClass('open');
				})

				$('.o-qiandao').hover(function() {
					$('.q-hop').fadeIn("300");
					$(this).addClass('open');
				}, function() {
					$('.q-hop').css("display", "none");
					$(this).removeClass('open');
				})

			}
		}
	});

	
});

function z2qd(obj){
	var _ticket =  $.cookie("auth_id");
	if(!_ticket){
		return ;
	}
	$.ajax({
		url : "http://sso.zhaipic.com:8084/user/signin/" + _ticket,
		dataType : "jsonp",
		type : "GET",
		success : function(data){
			if(data.status == 200){
				$(obj).attr("class", "ztqddisable");
				$(obj).attr("onclick", "javascript:;");
				$(obj).text("已签到");
				var curDate = new Date();
				var curt = curDate.getFullYear() + '-' + (curDate.getMonth() + 1) + '-' + curDate.getDate();
				$('#qiandaomsg').html( curt + '，签到成功！');
			}
		}
	});

}

function hideTip(obj) {
	obj.hide();
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

function keyitem(obj) {
	$('.search-header #searchInput').val($(obj).text());
	$('.search-header #shelper').hide();
}

function keyitem_fix(obj) {
	$('.search-fix #searchInput').val($(obj).text());
	$('.search-fix #shelper').hide();
}


function addFavorite() {
	var name = $('#fav-name').val();
	$.ajax({
		url : "http://home.zhaipic.com:8085/home/favorite/create?name=" + name,
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
	}
	$.ajax({
		url : "http://home.zhaipic.com:8085/home/favorite/add?fid=" + $('#fav_form input:checked').val() + '&sid=' + $('#pid').val(),
		dataType : "jsonp",
		type : "GET",
		success : function(data){
			if(data.status == 200){
				$('.report-win').attr("style","display: none;");
				showToast('收藏成功(ง •̀_•́)ง');
				$('#ztscbtn').html('<i class="icon-fav" style="background-position: -305px -94px;"></i>&nbsp;已收藏');
			}else{
				showToast(data.msg);
			}
		}
	});

}


function showFavorite() {
	$.ajax({
		url : "http://home.zhaipic.com:8085/home/favorite/list",
		dataType : "jsonp",
		type : "GET",
		success : function(data){
			if(data.status == 200){
				var html = '';
				if(data.data.length>0){
					for(var i=0;i<data.data.length;i++){
						if(i == 0){
							html+='<p class="radio-inline"><input type="radio" name="fid" checked id="fav'+ i +'" value="'+ data.data[i].id +'"><label for="fav'+ i +'" >'+ data.data[i].name +'</label></p>';
						}else{
							html+='<p class="radio-inline"><input type="radio" name="fid" id="fav'+ i +'" value="'+ data.data[i].id +'"><label for="fav'+ i +'" >'+ data.data[i].name +'</label></p>';
						}
				}
				}else{
					html = '<p class="radio-inline" style="font-size: 14px;">您还未创建收藏夹，点击创建增加新收藏夹吧！</p>';
				}
				$('#fav_form').html(html);
			}
		}
	});
}

function showToast(msg) {
	clearTimeout(toast_handler);
	$('.be-toast').text(msg);
	$('.be-toast').css('display','block');
	toast_handler = setTimeout("$('.be-toast').css('display','none')", "3000");
}



var toast_handler = null;

var search_tip_cur = 0;
var search_tip_sum = 0;
var search_tip_xhr = null;
var search_tip_time = null;
var old_search_value = '';

var search_tip_cur_fix = 0;
var search_tip_sum_fix = 0;
var search_tip_xhr_fix = null;
var search_tip_time_fix = null;
var old_search_value_fix = '';