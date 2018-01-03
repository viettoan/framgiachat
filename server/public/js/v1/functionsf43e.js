/* Kiểm tra trình duyệt */
var vgc_ua = navigator.userAgent.toLowerCase();
var vgc_isIE       = (vgc_ua.indexOf('msie')     >= 0) ? true : false;
var vgc_isIE6      = (vgc_ua.indexOf('msie 6.0') >= 0) ? true : false;
var vgc_isIE7      = (vgc_ua.indexOf('msie 7.0') >= 0) ? true : false;
var vgc_isIE8      = (vgc_ua.indexOf('msie 8.0') >= 0) ? true : false;
var vgc_isIE9      = (vgc_ua.indexOf('msie 9.0') >= 0) ? true : false;
var vgc_isIE10     = (vgc_ua.indexOf('msie 10.0') >= 0) ? true : false;
var vgc_isOpera    = (vgc_ua.indexOf('opera')    >= 0) ? true : false;
var vgc_isFirefox  = (vgc_ua.indexOf('firefox')  >= 0) ? true : false;
var vgc_isChrome   = (vgc_ua.indexOf("chrome")   >= 0) ? true : false;

/* Kiểm tra xem flash có được cài hay không */
flashInstalled = false;
if (navigator.plugins && navigator.plugins.length) {
   for (n = 0; n < navigator.plugins.length; n++) {
      if (navigator.plugins[n].name.indexOf('Shockwave Flash') != -1) {
         flashInstalled = true;
         break;
      }
   }
}

/**
 * function play : Play audio
 */
function play_audio(_this) {
   if(!isset(typeof $(_this)[0])) return;
   $(_this)[0].play();
} /* End function play */

/**
 * function check_msg_offline : Xu ly message offline tren top
 */
function check_msg_offline(_this, obj){
   $(obj).parents('tr').css('background-color', '#FFFFBF');
   var count_msg_offline = parseInt($(_this).find('span').text().replace('(', '').replace(')', '').trim()) || 0;
   var total_chat_offline = parseInt($('#total_chat_offline').text().trim()) || 0;
   total_chat_offline = total_chat_offline - count_msg_offline;

   if(total_chat_offline <= 0) $('#total_chat_offline').remove();

   $(_this).find('span').remove();
   $('#total_chat_offline').text(total_chat_offline);

} /* End function checkGetcode */

/**
 * function checkGetcode : Kiem tra getcode
 */
function checkGetcode(_this) {
   domain_check = $('#domain_check');
   domain_check_val = domain_check.val();

   if(domain_check_val == ''){
      alert('Bạn chưa nhập website cần kiểm tra');
      domain_check.focus();
      return;
   }

   domain_hash = $('#domain_hash');
   domain_hash_val = domain_hash.val();

   $.ajax({
      url: '/ajax_v1/ajax_check_getcode.php',
      type: 'POST',
      data: {
         'domain_check': domain_check_val,
         'domain_hash': domain_hash_val
      },
      beforeSend: function () {
         $(_this).button('loading');
         $(_this).removeClass('btn-success').addClass('btn-primary');
      },
      success: function (data) {
         $('#domain_check_alert').html(data.msg);

         $(_this).removeClass('btn-primary').addClass('btn-success');
         $(_this).button('reset');

         if($('.modal').text() != ''){
            $('.modal').animate({scrollTop:$('#domain_check_alert').position().top}, 'slow');
         }else{
            $('html, body').animate({scrollTop:$('#domain_check_alert').position().top}, 'slow');
         }
      },
      dataType: "json"
   });
} /* End function checkGetcode */

/**
 * function copyToClipboard
 */
function copyToClipboard (text) {
   window.prompt ("Copy to clipboard: Ctrl+C, Enter", text);
} /* End function copyToClipboard */

/**
 * function getCode : Lay noi dung khi click button
 */
function getCode(get_btn, get_area){

   var text_copy    = $('#'+get_area).text();

   if(flashInstalled == true){
      var clip = new ZeroClipboard.Client();
      clip.setHandCursor( true );
      clip.setText('');
      clip.glue(get_btn);

      var btn = $('#'+get_btn);

      clip.addEventListener('mouseDown', function(client) {
         btn.button('loading');
         btn.removeClass('btn-primary').addClass('btn-success');

         clip.setText( text_copy );
      });

   	clip.addEventListener('complete', function (client, text) {
         setTimeout(function(){
            btn.removeClass('btn-success').addClass('btn-primary');
            btn.button('reset');
         }, 500);
   	});

      clip.addEventListener('mouseout', function() {
         clip.destroy();
      });
   }

} /* End function getCode */

/**
 * function getCodeThis : Lay noi dung khi click element
 */
function getCodeThis(get_id){

   var text_copy    = $(get_id).text();

   if(flashInstalled == true){
      var clip = new ZeroClipboard.Client();
      clip.setHandCursor( true );
      clip.setText('');
      clip.glue(get_id);

      clip.addEventListener('mouseDown', function(client) {
         clip.setText(text_copy);
      });

      clip.addEventListener('complete', function (client, text) {
         elementContentSelect(get_id);
   	});

      clip.addEventListener('mouseout', function() {
         clip.destroy();
      });
   }

} /* End getCodeThis */

/**
 * function elementContentSelect : Select element content
 */
function elementContentSelect(id) {
   elementContentUnselect();
   if(document.selection) { /* IE < 9 */
      var range = document.body.createTextRange();
      range.moveToElementText(id);
      range.select();
   } else if(window.getSelection) { /* IE 9 and non-IE */
      var range = document.createRange();
      range.selectNode(id);
      window.getSelection().addRange(range);
   }

} /* End function elementContentSelect */

function elementContentUnselect() {
   if (document.selection) { document.selection.empty(); }
   else if (window.getSelection) { window.getSelection().removeAllRanges(); }
} /* End function elementContentUnselect */

/**
 * function randomInt : Lấy ra 1 số ngẫu nhiên trong 1 khoảng
 */
function randomInt(min,max) {
    return Math.floor(Math.random()*(max-(min+1))+(min+1));
} /* End function randomInt */

/**
 * function IsEmail : Kiem tra email hop le
 */
function IsEmail(email) {
  var regex = /^([a-zA-Z0-9_.+-])+\@(([a-zA-Z0-9-])+\.)+([a-zA-Z0-9]{2,4})+$/;
  return regex.test(email);
} /* End function IsEmail */

/*
 * Stop Event
 */
function stopEvent(e) {
	if (!e) var e = window.event;

	/* e.cancelBubble is supported by IE - this will kill the bubbling process. */
	e.cancelBubble = true;
	e.returnValue = false;

	/* e.stopPropagation works only in Firefox. */
	if (e.stopPropagation) e.stopPropagation();
	if (e.preventDefault) e.preventDefault();

	return false;
} /* End function stopEvent */

function stopScroll(_this) {
   $(_this).smoothDivScroll("stopAutoScrolling")
}
function startScroll(_this) {
   $(_this).smoothDivScroll("startAutoScrolling")
}

/* Function show - hide folow customer */
function show_hide_folow_customer(){
	$('#folow_customer').toggle();
	if($('#folow_customer').css('display') == 'none'){
		$('#folow_btn').addClass('icon_ghim_ac').removeClass('icon_ghim');
	}else{
		$('#folow_tab li .cus_content').hide();
		$('#folow_tab li .cus_content').first().removeClass('hide')
															.show();
		$('#folow_tab li .cus_name').first().addClass('ac');
  		$('#folow_btn').addClass('icon_ghim').removeClass('icon_ghim_ac');
	}


}

/* Function push customer to array folow */
function push_custormer_to_array_folow(obj){
	var to_id		= parseInt(obj.uid) || 0;
	var send_id		= obj.user_id	|| 0;
	var pname 		= urldecode(obj.pname);
	var uname 		= obj.uname ? obj.uname : 'Khách ' + obj.uid;
	var link 		= urldecode(obj.url);
	if(link.indexOf("http://" + obj.source) < 0){
		link = "http://" + obj.source + urldecode(obj.url);
	}
	var d1 = obj.time ? new Date(parseInt(obj.time)) : new Date();
	var time = d1.getHours() + ":" + (d1.getMinutes() < 10 ? '0' : '') + d1.getMinutes() + ":" + d1.getSeconds();
	if(array_folow_user_feed){
		if(jQuery.inArray(to_id, array_folow_user_feed) == -1){
			if(array_folow_user_feed.length < 5){
				array_folow_user_feed.push(to_id);
				alert('Bạn vừa theo dõi '+uname);

				/* create element li container id */
				var html_folow	= '';
				html_folow	+= '<li id="cus_'+to_id+'" >';
					html_folow	+= '<span data-cus="'+to_id+'" onClick="show_detail_folow('+to_id+');" class="cus_name">'+uname+'<i class="ic_chat follow_cus_icon" onClick="delete_customer_to_array_follo('+to_id+');"></i></span>';
					html_folow	+= '<div id="content_cus_'+to_id+'" class="cus_content hide"><p><span class="btn_yellow" onclick="create_chat_box({id:'+to_id+',iPro:0,send_id:'+send_id+'})">Chat với khách hàng '+to_id+'</span></p>';
					html_folow	+= '<p>Time: '+time+' : <a target="_blank" href="'+ link +'" title="'+ pname +'">'+ pname +'</a></p>';
					html_folow	+= '</div>';
				html_folow	+= '</li>';
				$('#folow_tab').append(html_folow);
			}else{
				alert('Chúng tôi chỉ hỗ trợ theo dõi 5 khách hàng cùng lúc');
				return false;
			}
		}
	}
}

/* Function delete customer array follow customer */
function delete_customer_to_array_follo(id){
	var id	= parseInt(id);
	if(array_folow_user_feed.length > 0){
		var _index		= jQuery.inArray(id, array_folow_user_feed);
		if(_index >= 0){
			array_folow_user_feed.splice(_index, 1);
			$('#cus_'+id).remove();
			if(array_folow_user_feed.length <= 0){
				show_hide_folow_customer();
			}
		}
	}
}

/* Function show detail follow customer */
function show_detail_folow(id){
	$('#folow_tab li .cus_content').hide();
	$('#content_cus_'+id).removeClass('hide ac');
	$('.cus_name').removeClass('ac');
	$('#cus_'+id+' .cus_name').addClass('ac');
	$('#content_cus_'+id).show();
}

/* Function add follow city */
function  follow_city(obj){
	var _city_id	= $(obj).attr('id').trim();
	var _city_name	= $(obj).data('name').trim() || '';
	if($('#follow_city').hasClass('hide')) $('#follow_city').removeClass('hide');
	if(_city_id != '' && _city_name != ''){
		var _index	= jQuery.inArray(_city_id, array_folow_city_feed);
  		if(_index == -1){
  			if(array_folow_city_feed.length <= 3){
  				array_folow_city_feed.push(_city_id);
  				$('#follow_city #listcity').append('<span>'+ _city_name +'<i data-id="'+ _city_id +'" onclick="vgc_close_follow_city(this);" title="Tắt theo dõi tại đây">x</i></span>');

			  	/*reset lại array quere*/
				var array_productview_id_queue = new Array();
  			}
  		}
	}
}

/* function close follow city */
function vgc_close_follow_city(obj){
	var _city_id	= $(obj).data('id') || '';
	if(_city_id != ''){
		var _index	= jQuery.inArray(_city_id, array_folow_city_feed);
		if(_index > -1){
			array_folow_city_feed.splice(_index, 1);
			$(obj).parent().remove();
			if(array_folow_city_feed.length <= 0){
				if(!$('#follow_city').hasClass('hide')) $('#follow_city').addClass('hide');
			}
		}
	}
}

/**
 * Carousel Magic - Slide trang chủ
 */
function doMagicTemplate(caption_title, caption_content, carousel_image, carousel_this, carousel_interval, effect_type){

   switch(effect_type.type) {
      case 'in':
         switch(effect_type.type_case) {
            default:
            case 1:
               data_effect = {title:'fadeInLeft', content:'fadeInUp', image:'fadeInRight', title1:['flipInY', 'tada']};
            break;
            case 2:
               data_effect = {title:'bounceInUp', content:'bounceInLeft', image:'bounceInDown', title1:['flash']};
            break;
            case 3:
               data_effect = {title:'rollIn', content:'fadeInRightBig', image:'fadeInLeftBig', title1:['pulse']};
            break;
            case 4:
               data_effect = {title:'rotateIn', content:'rotateInDownRight', image:'rotateInUpRight', title1:['flash']};
            break;
            case 5:
               data_effect = {title:'lightSpeedIn', content:'flip', image:'flipInX', title1:['rubberBand']};
            break;
         }
      break;

      case 'out':
         switch(effect_type.type_case) {
            default:
            case 1:
               data_effect = {title:'fadeOutLeft', content:'fadeOutDown', image:'fadeOutRight'};
            break;
            case 2:
               data_effect = {title:'bounceOutUp', content:'bounceOutLeft', image:'bounceOutDown'};
            break;
            case 3:
               data_effect = {title:'rollOut', content:'fadeOutRightBig', image:'fadeOutLeftBig'};
            break;
            case 4:
               data_effect = {title:'rotateOut', content:'rotateOutUpRight', image:'rotateOutDownRight'};
            break;
            case 5:
               data_effect = {title:'lightSpeedOut', content:'flipOutX', image:'flipOutY'};
            break;
         }
      break;
   }

   caption_title.css({'visibility':'visible'}).animo({animation: data_effect.title, duration: 0.5, keep: true}, function() {
		caption_content.css({'visibility':'visible'}).animo({animation: data_effect.content, duration: 0.5, keep: true}, function() {
         carousel_image.css({'visibility':'visible'}).animo({animation: data_effect.image, duration: 0.5, keep: true}, function() {
            if(effect_type.type == 'in'){
               caption_title.animo({ animation: data_effect.title1 }, function() {
                  setTimeout(function(){
      			      doMagicTemplate(caption_title, caption_content, carousel_image, carousel_this, carousel_interval, {type:'out', type_case:effect_type.type_case});
      			   }, carousel_interval)
               });
            }else if(effect_type.type == 'out'){
               carousel_this.carousel('next');
            }
         });
		});
	});

} /* End doMagicTemplate */

function homeCarouselSlide(){

   $('.caption-title, .caption-content, .banner-carousel-image').animo('cleanse').css({'visibility':'hidden'});

} /* End function homeCarouselSlide */

function homeCarouselSlid(){
   var   carousel_home = $("#home-carousel"),
         active 	= carousel_home.find('.carousel-inner .active'),
         all = carousel_home.find('.carousel-inner .item'),
         slidTo 	= all.index(active)+1;

   var caption_title = active.find('.caption-title');
   var caption_content = active.find('.caption-content');
   var carousel_image = active.find('.banner-carousel-image');

   if(vgc_isIE6 || vgc_isIE7 || vgc_isIE8 || vgc_isIE9){
      caption_title.css({'visibility':'visible'});
      caption_content.css({'visibility':'visible'});
      carousel_image.css({'visibility':'visible'});
   }else{
      $('.caption-title, .caption-content, .banner-carousel-image').animo('cleanse').css({'visibility':'hidden'});
      doMagicTemplate(caption_title, caption_content, carousel_image, carousel_home, 6000, {type:'in', type_case:slidTo});
   }

} /* End function homeCarouselSlid */



/* delete tags */
function delete_tags(tags_id){
	if(parseInt(tags_id) > 0){
		$.post(
			"https://vchat.vn/ajax_v1/ajax_delete_tags.php",
			{tags_id : tags_id},
			function(data){
				if(data.status == 1){
					window.location.reload();
				}
				else{
					alert(data.error);
					return false;
				}
			},'json'
		);
	}
	else{
		alert('Dữ liệu không đúng');
		return false;
	}
}

/* delete label */
function delete_label(label_id){
	if(parseInt(label_id) > 0){
		$.post(
			"https://vchat.vn/ajax_v1/ajax_delete_label.php",
			{label_id : label_id},
			function(data){
				if(data.status == 1){
					window.location.reload();
				}
				else{
					alert(data.error);
					return false;
				}
			},'json'
		);
	}
	else{
		alert('Dữ liệu không đúng');
		return false;
	}
}

$(document).ready(function () {

   /* Cai dat chat */
   var iframes		= $('#vgc_setting_boxchat');
	if(typeof iframes != undefined && typeof iframes != 'undefined' && typeof iframes != null){

    	/* Cập nhật thay đổi text */
      $('.vgctexting').on('keyup change focus', function() {
   		var _tname		= $(this).data('name');
   		var txt			= $(this).val();
   		updateText(_tname, txt);
      });

      $('.vgctexting').blur(function(){
         $('.arrow_swing').hide();
      })



      /* Chọn mầu */
      /*
      $('.default_color').click(function(){
      	var _dcolor	= $(this).data('color') || '';
      	if(_dcolor	!= ''){
   			$('#pickering').val(_dcolor);
            $('#template_vgchat', iframes.contents()).css('background-color', _dcolor);
            $('#panel_history_vgchat', iframes.contents()).css('border-bottom', '5px solid ' + _dcolor);
            // post sang ajax lấy mầu đậm hơn làm mầu border
            $.post("/ajax_v1/ajax_convert_border_color.php", {color : _dcolor},
					function(data){
						if(data.error == ''){
							$('#template_vgchat', iframes.contents()).css('border', '1px solid ' + data.color);
							$('#panel_content_vgchat', iframes.contents()).css('border', '1px solid ' + data.color);
						}
					},'json');
      	}
      });
      */
	} /* End if(typeof iframes != undefined && typeof iframes != 'undefined' && typeof iframes != null) */

   /* Max length */
   //$('input[maxlength]').maxlength();

   /* Arrow */
   //$('.arrow, [class^=arrow-]').bootstrapArrows();


   /* Tooltip */
   /*
   $('[data-toggle=tooltip]').tooltip({
      animation : false,
      html : true
   })
   */

   /* Popover */
   /*
   $('[data-toggle=popover]').popover({
      html : true,
      trigger : 'click',
      content: function() {
         id = $(this).attr('id')
         return $('.popover_'+id).html();
      }
   })
   */

   /* Switch */
   //$('[data-toggle=switch]').bootstrapSwitch();
	/*
   $('input[name="check_sound_feed"]').bootstrapSwitch({
      size: "small",
      onLabel: "<i class='icon icon-volume-up'></i>",
      offLabel: "<i class='icon icon-volume-off'></i>",
      onSwitchChange: function() {
         var check_sound_feed =  $.cookie('check_sound_feed') || 1;
         $.cookie('check_sound_feed', 1 - check_sound_feed, { expires: 365 });
      }
   });

   $('input[name="toggle_chart_realtime"]').bootstrapSwitch({
      size: "small",
      onLabel: "<i class='icon icon-chart-bar-2'></i>",
      offLabel: "<i class='icon icon-chart-bar-2'></i>",
      onSwitchChange: function(event, state) {
         var toggle_chart_realtime =  $.cookie('toggle_chart_realtime') || 0;
         $.cookie('toggle_chart_realtime', 1 - toggle_chart_realtime, { expires: 365 });

         if(state == false){
            $('#container_supplier_chart').hide();
         }else{
            $('#container_supplier_chart').show();
            $('#containerHighStockRtMinute').highcharts().reflow();
            $('#containerHighStockRtSecond').highcharts().reflow();
         }
      }
   });
   */

   /* Footer Slide */
   /*
   $("#footer_slide").smoothDivScroll({
      autoScrollDirection: "endlessLoopRight",
      autoScrollingInterval: 30,
      autoScrollStep: 1,
      mousewheelScrolling: "allDirections",
      manualContinuousScrolling: true,
      autoScrollingMode: "onStart"
   })
   */

   /* Ads Fixed bottom Left */
   /*/
   var animateClasses =
   'flash bounce shake tada swing wobble pulse ' + //0
   'flip flipInX flipInY flipOutX flipOutY ' + //7
   'fadeIn fadeInUp fadeInDown fadeInLeft fadeInRight fadeInUpBig fadeInDownBig fadeInLeftBig fadeInRightBig ' + //12
   'fadeOut fadeOutUp fadeOutDown fadeOutLeft fadeOutRight fadeOutUpBig fadeOutDownBig fadeOutLeftBig fadeOutRightBig ' + //21
   'bounceIn bounceInDown bounceInUp bounceInLeft bounceInRight ' + //30
   'bounceOut bounceOutDown bounceOutUp bounceOutLeft bounceOutRight ' + //35
   'rotateIn rotateInDownLeft rotateInDownRight rotateInUpLeft rotateInUpRight ' + //40
   'rotateOut rotateOutDownLeft rotateOutDownRight rotateOutUpLeft rotateOutUpRight ' + //45
   'rollIn rollOut hinge'; //50

   var animateTextillate = [];
   $.each(animateClasses.split(' '), function (i, value) {
      animateTextillate[i] = value;
   });
   //*/

	/*
   $('.ads_fixed_bl .ads_tlt').textillate({
      loop: true,
      in: { effect: 'bounceInLeft' },
      out: { effect: 'flash' },
   });

   if(!$.cookie('check_ads_fixed_bottom_left')){
      $.cookie('check_ads_fixed_bottom_left', 1, { expires: 365, path: '/' });
      $('#ads_fbl_content').addClass('in');
   }
   */

   /* Home Carousel Slide */
   /*
   $(document).on('slide.bs.carousel', '#home-carousel', function (e) {
      homeCarouselSlide();
   })

   $(document).on('slid.bs.carousel', '#home-carousel', function (e) {
      homeCarouselSlid();
   })

   homeCarouselSlid();
   */

   /* Get code with no flash */
   if(flashInstalled == false){
      $('#btn_get_code, #get_code_content').click(function(){
         var text_copy    = $('#get_code_content').text();
         copyToClipboard(text_copy);
      })
   }

   /* Modal effect Special */
   /*
   $('[data-toggle="modal"]').click( function() {

      if($(this).hasClass('md-setperspective')) {
         $('html').addClass('md-perspective');
      }

      $('.md-overlay').click(function() {
         $('html').removeClass('md-perspective');
      });

	});
   */

   /* Validate form dang ky website */
   /*
   $('#checkSubmitFormWebRegister').bootstrapValidator({
      fields: {
         csp_web_name: {
            validators: {
               notEmpty: {
                  message: 'Bạn chưa nhập địa chỉ website'
               },
               uri: {
                  message: 'Website bạn nhập vào không đúng'
               }
            }
         },
      }
   });
	*/
   /* Validate form phan quyen quan tri */
   /*
   $('#checkSubmitFormSupRight').bootstrapValidator({
      fields: {
         supplier_email: {
            validators: {
               notEmpty: {
                  message: 'Bạn chưa nhập email'
               },
               emailAddress: {
                  message: 'Email bạn nhập vào không đúng'
               }
            }
         },
      }
   });
   */

   /* Validate form khảo sát */
   /*
   $('#formPolls').bootstrapValidator({
      fields: {
         pol_question: {
            validators: {
               notEmpty: {
                  message: 'Bạn chưa nhập câu hỏi'
               }
            }
         },
         pol_answer_1: {
            validators: {
               notEmpty: {
                  message: 'Bạn chưa nhập câu trả lời'
               }
            }
         },
      }
   });
   */

   /* Validate form login */
   /*
   $('#loginForm').bootstrapValidator({
      fields: {
         loginname: {
            validators: {
               notEmpty: {
                  message: 'Bạn chưa nhập Tài khoản / Email trên Vatgia.com'
               }
            }
         },
         password: {
            validators: {
               notEmpty: {
                  message: 'Bạn chưa nhập mật khẩu'
               }
            }
         },
      }
   });
   */

	
	var rm_panelchat = setInterval(function(){
		if($('#hide_panel_vgchat').length){
			$('#hide_panel_vgchat').remove();

			clearInterval(rm_panelchat);
		}
	}, 1000);
	

});


function showNotificationBrowser(obj){
    try {
        Notification.requestPermission( function(status){});
        execute_notification(obj);
    }
    catch(e) {}
}

function vgc_on_of_tranfer_chat(obj){
	var ovl		= $('.box_sp_overlay');
   if($(obj).hasClass('on_function')){
      $(obj).removeClass('on_function')
            .text('Chức năng');
      ovl.find('.box_sp_function').addClass('hide');
      ovl.hide();
   }else{
   	$('.box_sp_url').addClass('hide');
   	$('.vgc_view_detail').text('Xem chi tiết').removeClass('on_function');

      $(obj).addClass('on_function')
            .text('Thoát');
		ovl.find('.box_sp_function').removeClass('hide');
      ovl.show();
   }
}

function vgc_support_show_detail(obj){
	var ovl		= $('.box_sp_overlay');
	if($(obj).hasClass('on_function')){
      $(obj).removeClass('on_function')
            .text('Xem chi tiết');
      ovl.find('.box_sp_url').addClass('hide');
      ovl.hide();
   }else{
   	$('.box_sp_function').addClass('hide');
   	$('.vgc_tranfer_chat').text('Chức năng').removeClass('on_function');

      $(obj).addClass('on_function')
            .text('Thoát');
      ovl.find('.box_sp_url').removeClass('hide');
      ovl.show();

   }
}

function show_support_function(obj){
	var ovl		= $('.box_sp_overlay');
	if(ovl.css('display') == 'block'){
		$(obj).removeClass('action_active');
		//ovl.sli
	}else{
		$(obj).addClass('action_active');
		// hiển thị function đầu tiên của phần thông tin (thông tin user infomation)
		$('.box_function li.user_history').trigger('click');
	}
	ovl.slideToggle(200);
}

function show_support_v3_function(obj){
   var ovl		= $('#box_sp_overlay');
	if(ovl.css('display') == 'block'){
	  
	}else{
		// hiển thị function đầu tiên của phần thông tin (thông tin user infomation)
		$('.box_function li.user_history').trigger('click');
	}
	ovl.slideToggle(200);
}

function callmap(){
	setTimeout(function(){
		var _ip = $('#temp_ip').data('ip') || '';
		console.log(_ip);
		if(_ip != ''){
			var xmlhttp = new XMLHttpRequest();
			//var url = "//ip-api.com/json/"+_ip;
         var url = "//freegeoip.net/json/"+_ip;

			xmlhttp.onreadystatechange = function() {
				if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
					var 	ip_info	= JSON.parse(xmlhttp.responseText);
					var	html_ip	= '<a href="//maps.google.com/maps?q='+ip_info.latitude+','+ip_info.longitude+'" target="_blank"><img src="https://maps.googleapis.com/maps/api/staticmap?center='+ip_info.latitude+','+ip_info.longitude+'&zoom=12&size=300x100&maptype=roadmap&markers=color:red|label:C|'+ip_info.latitude+','+ip_info.longitude+'" /></a><span class="ipnote">Thông tin trên chỉ mang tính tương đối</span>';
					$('#temp_map').html(html_ip);
				}
			}
			xmlhttp.open("GET.html", url, true);
			xmlhttp.send();
		}
	}, 2000);
}

function box_sp_show_view(obj){
	var _id = $(obj).data('id') || '';
	$('.box_spview').addClass('hide');
	$('.box_function_row').removeClass('spac');
	$(obj).addClass('spac');
	$('#'+_id).removeClass('hide');

	switch(_id){
		case 'user_info':
			var elm = $('#image_location');
			var _load	= parseInt(elm.data('load')) || 0;
			var _ip		= elm.data('ip') || '';

			if(_load == 0 && _ip != ''){
				var xmlhttp = new XMLHttpRequest();
				//var url = "//ip-api.com/json/"+_ip;
            var url = "//freegeoip.net/json/"+_ip;

				xmlhttp.onreadystatechange = function() {
					if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
						var 	ip_info	= JSON.parse(xmlhttp.responseText);
                  
						var	html_ip	= '<a href="//maps.google.com/maps?q='+ip_info.latitude+','+ip_info.longitude+'" target="_blank"><img src="https://maps.googleapis.com/maps/api/staticmap?center='+ip_info.latitude+','+ip_info.longitude+'&zoom=12&size=200x160&maptype=roadmap&markers=color:red|label:C|'+ip_info.latitude+','+ip_info.longitude+'" /></a><span class="ipnote">Thông tin trên chỉ mang tính tương đối</span>';
						elm.html(html_ip).data('load', 1);
					}
				}
				xmlhttp.open("GET.html", url, true);
				xmlhttp.send();
			}
			break;
		case 'user_note':
			var elm_note	= $('#user_note');
			var elm_id		= $('#vgc_sp_to_id').val() || 0;
			if(elm_note.text() == ''){
				$.post('https://vchat.vn/ajax_v1/ajax_get_note.php', {id : elm_id},
				function(respon){
					if(respon.status == 0){
						alert(respon.error);
						return false;
					}else{
						elm_note.html(respon.data);
						return false;
					}
				},'json');
			}
			break;
		case 'user_tranfer':
			if(isset(typeof vgc_permission_pk) && isset(typeof vgc_permission_pk.tranfer)){
				if(vgc_permission_pk.tranfer == 0){
					alert('Bạn không có quyền sử dụng chức năng này');
					return false;
				}
			}

			var admin_id = vgc_ad_id || 0;
		   if(admin_id <= 0) return false;
		   var elm 		= $('#user_tranfer');
		   var data_load	= elm.data('load') || 0;

		   if(data_load == 0){
		   	elm.html('<img src="../themes/v1/images/loading5.gif" />');
		      $.post(
		         'https://vchat.vn/ajax_v1/ajax_load_support.php',
		         {adid : admin_id},
		         function(data){
		            if(data.error != ''){
		               alert(data.error);
		               return false;
		            }else{
		               elm.html(data.html);
		               if(data.online > 0) elm.data('load', 1);
		               return false;
		            }
		         },'json'
		      )
		   }
			break;
		case 'user_history':
   		var storerage	= localStorage;
   		var _id = $('#vgc_sp_to_id').val() || 0;
   		if(_id <= 0) return;
   		var key_value		= storerage.getItem('cus_'+_id) || '';
   		if(key_value != ''){
				array_value	= JSON.parse(key_value);
				$('#user_history ul').html('');
				for(i in array_value){
					$('#user_history ul').prepend('<li class="sp_link_his"><span>'+array_value[i].time+'</span><a target="_blank" href="'+array_value[i].link+'">'+array_value[i].name+'</a></li>');
				}
			}
			break;
	}
}

/* gọi list danh sách user hỗ trợ */
function tranfer_chat(obj){
   var admin_id = vgc_ad_id || 0;
   if(admin_id <= 0) return false;
   var data_load	= $(obj).next('.box_sp_tranfer_list').data('load') || 0;

   if(data_load == 0){
   	$(obj).next('.box_sp_tranfer_list').show();
      $.post(
         'https://vchat.vn/ajax_v1/ajax_load_support.php',
         {adid : admin_id},
         function(data){
            if(data.error != ''){
               alert(data.error);
               return false;
            }else{
               $(obj).next('.box_sp_tranfer_list').html(data.html).data('load', 1);
               return false;
            }
         },'json'
      )
   }else{
      $(obj).next('.box_sp_tranfer_list').toggle();
      return false;
   }
}

/* set user hỗ trợ trả lời thay */
function set_tranfer_chat(new_sp_id){
   var old_support_id   = vgc_support_id || 0;
   var new_support_id   = new_sp_id || 0;
   var admin_id         = vgc_ad_id || 0;
   var custormer_id     = $('#vgc_sp_to_id').val() || 0;

   var data = {};
   data.admin_id  = admin_id;
   data.old_sp    = old_support_id;
   data.new_sp    = new_support_id;
   data.cus_id    = custormer_id;
   $.post(
      "https://vchat.vn/ajax_v1/ajax_tranfer_chat.php",
      data,
      function(response){
         if(response.status != 0){
            $('#req_'+custormer_id).remove();
            $('.vgc_tranfer_chat').trigger('click');
            if($('#box_send_'+custormer_id).length){
               $('#box_send_'+custormer_id).attr({'readonly':'true', 'disabled':'disabled'});
            }
         }
         alert(response.error);
      },
      'json'
   )

}


function show_list_online(obj, id){
	var elm		= $(obj);
	if(!elm.hasClass('tab_active')){
		$('.header_left .title').removeClass('tab_active');
		elm.addClass('tab_active');
		elm.find('#tab_hischat_count').addClass('vgc_hide').text(0);
		$('.support_listleft').removeClass('hide').hide();
		$('#'+id).show();
	}

	if(id == 'customer_online'){
		if(isset(typeof vgc_audio_message)){
			vgc_audio_message	= parseInt($.cookie('vgc_audio_message'));
		}
		$('#resizable .ui-resizable-e').attr('title', 'click chuột và kéo để mở rộng khung xem khách online')
												 .addClass('resizecolor');
		setTimeout(function(){
			$('#resizable .ui-resizable-e').removeClass('resizecolor');
		}, 5000);

		/* check không có boxchat thì hiển thị phần icon hướng dẫn xem chi tiết */
		if($('#box_support').length <= 0){
			$('#spr').html('<img class="view_d" src="images/view_detail.png" />');
		}
	}
}

function show_list_order(){
	var estore_id		= isset(typeof vgc_ad_id)? vgc_ad_id : 0;
	if(estore_id 		<= 0) return false;
	var order_tab		= $('#vgc_list_order_tab');
	if(order_tab.css('display') != 'block'){
		order_tab.css('display', 'block');
		$.post(
			"https://vchat.vn/ajax_v1/ajax_load_order.php",
			{estore_id : estore_id},
			function(data){
				if(data.status == 0){
					order_tab.css('display', 'none');
					alert(data.error);
					return false;
				}else{
					order_tab.html(data.html)
								.show();
				}
			},
			'json'
		)
	}else{
		order_tab.css('display', 'none');
	}

}

/**
	function get box chat mới trong trang support
*/
function getboxchat(obj){
   
   if(typeof notifi_ie_close == 'function'){
      notifi_ie_close();
   }
   
	var id			= obj.id || 0;
	var coffline	= obj.coffline || 0;
	var ip			= obj.ip || '';
	var link			= obj.link || '';
	var pname		= obj.pname || '';
   var pro_id		= obj.pro_id || 0;
	var send_id	= $('#vgc_send_id_pn').val() || 0;
	var msg_offline	= $('#VgChatListOnline .friend_'+ id + ' .msg_offline');
   var auction        = obj.auction || 0;
   
	if(id <= 0) return;
   
   /*check auction vatgia*/
   var is_auction = parseInt($('#user_id_online_'+id).data('auction')) || 0;
   if(is_auction == 1){
      if(pro_id > 0){
         $('#ifm_aution').data('id', id);
         show_aution_vatgia(pro_id);         
         return false;
      }
   }
   
	var spr			= $('#spr');
	var elm	= $('#req_'+id);
	if(!isset(typeof elm)){
		alert('Không có dữ liệu');
		return false;
	}

	/* check trường hợp tài khoản miễn phí kiểm tra xem có đang chat vs ai không, đang chat thì báo cho ng ta tắt đi rồi chat tiếp */
	/*
	if(isset(typeof vgc_permission_pk) && isset(typeof vgc_permission_pk.max_chat)){
		if(vgc_permission_pk.max_chat == 1){
			if($('#box_support').length){
				alert('Bạn đang dùng gói [MIẾN PHÍ], bạn chỉ được hỗ trợ 01 người tại 01 thời điểm. Vui lòng dừng cuộc chat hiện tại để có thể tiếp tục hỗ trợ khách hàng khác.');
				return false;
			}
		}
	}
	*/

	/*
		tạo biến trong localstorage để lưu mảng thông tin cần lưu link truy cập
	*/
	var storerage	= localStorage;
	var key_id		= storerage.getItem('key_id') || '';
	var array_key	= new Array;
	if(key_id != ''){
		array_key	= key_id.split(',').map(Number);
		if(array_key.length > 30){
			var first_key	= array_key[0];
			if(first_key > 0) storerage.removeItem('cus_'+first_key);
			array_key.shift();
		}
		if(jQuery.inArray(id, array_key) == -1){
			array_key.push(id);
		}
	}else{
		array_key.push(id);
	}
	if(array_key.length){
		var str_key		= '';
		str_key	= array_key.join(',');
		storerage.setItem('key_id', str_key);
	}
   
   if($('#vgc_helpsupport').length){
		/* kiểm tra có array vgc_array_not_answer không, nếu có thì xem có ký không để xóa */
		var current_not_answer		= $.cookie('vgc_not_answer');
		if(isset(typeof current_not_answer) && current_not_answer != ''){
			var vgc_array_not_answer	= current_not_answer.split('|').map(Number);
			var not_answer_index			= jQuery.inArray( id, vgc_array_not_answer );
			if(jQuery.inArray(id, vgc_array_not_answer) != -1){
				vgc_array_not_answer.splice( not_answer_index, 1 );
				$.cookie('vgc_not_answer', vgc_array_not_answer.join("|"), {expires: 1, path : '/'})
			}
		}
	}

	/*
		kiểm tra trong list bên trái cho user này trong danh sách chưa, chưa thì thêm vào
	*/
	/*
	if($('#req_'+id).length <= 0){
		var new_chat_html	= '<div data-sname="" data-sid="'+ id +'" data-tname="Khách '+ id +'" class="sp_row" data-sso="'+ id +'" id="req_'+ id +'">';
			new_chat_html +=		'<span class="sp_icon_online sonline"></span>';
			new_chat_html +=		'<p class="sinfo" onclick="getboxchat({id:'+ id +'});">';
			new_chat_html +=			'<span class="sname">Khách '+ id +'</span>';
			new_chat_html +=			'<span class="msg">vài giây trước</span>';
			new_chat_html +=		'</p>';
			new_chat_html +=	'</div>';
		$('#hischat_support .spl_req').prepend(new_chat_html);
	}
	*/


   /* ẩn list online */
   //$('#tab_history').trigger('click');

	var data = {};
	data.send_id		= elm.data('sid') || send_id;
	data.to_id			= elm.data('sso') || id;
	data.send_name		= elm.data('sname') || '';
	data.to_name		= elm.data('tname') || '';
	data.support_id	= isset(typeof vgc_support_id)? vgc_support_id : 0;
	data.time			= $('#vgc_box_sp_time_'+send_id).val() || 0;
	data.coffline		= coffline;
	data.ip				= ip; // ip khách đang online
	data.link			= link; // link khách đang online
	data.pname			= pname; // tiêu đề khách đang online
   data.auction          = auction;

	// kiểm tra xem linh != '' && pname != '' thì thêm vào localstorage
	if(link != '' && pname != ''){
		var key_value		= storerage.getItem('cus_'+id) || '';
		var array_value	= new Array; // mảng lưu giá trị của  khách hàng này
		var d1 = data.time ? new Date(parseInt(data.time)) : new Date();
		var data_link		= $('#vgc_data_link_'+id).find('p a');
		if(key_value != ''){
			array_value	= JSON.parse(key_value);
			if(data_link.length){
				for(i = 0; i < data_link.length; i++){
					if(data_link[i].href != '' && data_link[i].innerHTML != ''){
						var new_value = {
							'link' : data_link[i].href,
							'name' : data_link[i].innerHTML,
							'time' : data_link[i].attributes['data-time'].value
						};
						array_value.push(new_value);
					}
				}
			}

		}else{
			if(data_link.length){
				for(i = 0; i < data_link.length; i++){
					if(data_link[i].href != '' && data_link[i].innerHTML != ''){
						var new_value = {
							'link' : data_link[i].href,
							'name' : data_link[i].innerHTML,
							'time' : data_link[i].attributes['data-time'].value
						};
						array_value.push(new_value);
					}
				}
			}
		}

		if(array_value.length){
			var str_vl	= JSON.stringify(array_value);
			storerage.setItem('cus_'+id, str_vl);
		}

		$('#vgc_data_link_'+id).html('');
	}

   if(data.time > 0) $('#vgc_box_sp_time_'+send_id).val(0);
   /*loadding*/
   spr.html('<img style="width: 50px; margin: 150px auto 0;display: block;" src="../themes/v1/images/loading25.gif" >');
   /* xóa tin nhắn offline */
   if(msg_offline.length) msg_offline.remove();
	$.post(
		'https://vchat.vn/ajax_v1/ajax_get_boxchat_support.php',
		data,
		function(res){
			if(res.status == 0){
				spr.html(res.error);
			}else{
				/* nếu online thì để online, không online thì set bên left cũng không online */
				if(res.online == 1){
					$('#req_'+data.to_id).find('.sp_icon_online').removeClass('soffline').removeClass('sonline').addClass('sonline');
				}else{
					$('#req_'+data.to_id).find('.sp_icon_online').removeClass('soffline').removeClass('sonline').addClass('soffline');
				}
				spr.html(res.html);
				elm.find('.sp_count').text('');

				/* nếu là click từ khách đang online thì show luôn thông tin khác ra */
				if(link != '' && pname != ''){
					//$('.box_info span').trigger('click');
				}

				setTimeout(function(){
					var to_id 	= id || 0;
					var elm		=  $('#box_support .box_sp_history');
					if(elm.length > 0){
						elm[0].scrollTop = (elm[0].scrollHeight)+20;
					}
				}, 50);
				/* kiểm tra nếu click mà từ phần new chat thì xóa đi luôn và chuyển xuống phần history */
				if(elm.parents('.item').attr('id') == 'newchat_support'){
					$('#hischat_support .spl_req').prepend(elm[0].outerHTML);
					elm.remove();
				}

				/* bôi mầu cho thẻ được click */
				$('.sp_row').css('background-color', '#fff');
				elm.css('background-color', '#EBF5FC');

				/*focus boxchat*/
				$('#box_send_'+id).focus();
            
			}
		},
		'json'
	)
}



/**
	function get box chat mới trong trang support
*/
function getboxchat_v3(obj){
	var id			= obj.id || 0;
	var coffline	= obj.coffline || 0;
	var ip			= obj.ip || '';
	var link			= obj.link || '';
	var pname		= obj.pname || '';
	var send_id	= $('#vgc_send_id_pn').val() || 0;
	var msg_offline	= $('#VgChatListOnline .friend_'+ id + ' .msg_offline');
	if(id <= 0) return;
	var spr			= $('#bodychat');
	var elm	= $('#req_'+id);
	if(!isset(typeof elm)){
		alert('Không có dữ liệu');
		return false;
	}

	/* check trường hợp tài khoản miễn phí kiểm tra xem có đang chat vs ai không, đang chat thì báo cho ng ta tắt đi rồi chat tiếp */
	/*
	if(isset(typeof vgc_permission_pk) && isset(typeof vgc_permission_pk.max_chat)){
		if(vgc_permission_pk.max_chat == 1){
			if($('#box_support').length){
				alert('Bạn đang dùng gói [MIẾN PHÍ], bạn chỉ được hỗ trợ 01 người tại 01 thời điểm. Vui lòng dừng cuộc chat hiện tại để có thể tiếp tục hỗ trợ khách hàng khác.');
				return false;
			}
		}
	}
	*/

	/*
		tạo biến trong localstorage để lưu mảng thông tin cần lưu link truy cập
	*/
	var storerage	= localStorage;
	var key_id		= storerage.getItem('key_id') || '';
	var array_key	= new Array;
	if(key_id != ''){
		array_key	= key_id.split(',').map(Number);
		if(array_key.length > 30){
			var first_key	= array_key[0];
			if(first_key > 0) storerage.removeItem('cus_'+first_key);
			array_key.shift();
		}
		if(jQuery.inArray(id, array_key) == -1){
			array_key.push(id);
		}
	}else{
		array_key.push(id);
	}
	if(array_key.length){
		var str_key		= '';
		str_key	= array_key.join(',');
		storerage.setItem('key_id', str_key);
	}

	/*
		kiểm tra trong list bên trái cho user này trong danh sách chưa, chưa thì thêm vào
	*/
	/*
	if($('#req_'+id).length <= 0){
		var new_chat_html	= '<div data-sname="" data-sid="'+ id +'" data-tname="Khách '+ id +'" class="sp_row" data-sso="'+ id +'" id="req_'+ id +'">';
			new_chat_html +=		'<span class="sp_icon_online sonline"></span>';
			new_chat_html +=		'<p class="sinfo" onclick="getboxchat({id:'+ id +'});">';
			new_chat_html +=			'<span class="sname">Khách '+ id +'</span>';
			new_chat_html +=			'<span class="msg">vài giây trước</span>';
			new_chat_html +=		'</p>';
			new_chat_html +=	'</div>';
		$('#hischat_support .spl_req').prepend(new_chat_html);
	}
	*/


   /* ẩn list online */
   //$('#tab_history').trigger('click');

	var data = {};
	data.send_id		= elm.data('sid') || send_id;
	data.to_id			= elm.data('sso') || id;
	data.send_name		= elm.data('sname') || '';
	data.to_name		= elm.data('tname') || '';
	data.support_id	= isset(typeof vgc_support_id)? vgc_support_id : 0;
	data.time			= $('#vgc_box_sp_time_'+send_id).val() || 0;
	data.coffline		= coffline;
	data.ip				= ip; // ip khách đang online
	data.link			= link; // link khách đang online
	data.pname			= pname; // tiêu đề khách đang online

	// kiểm tra xem linh != '' && pname != '' thì thêm vào localstorage
	if(link != '' && pname != ''){
		var key_value		= storerage.getItem('cus_'+id) || '';
		var array_value	= new Array; // mảng lưu giá trị của  khách hàng này
		var d1 = data.time ? new Date(parseInt(data.time)) : new Date();
		var data_link		= $('#vgc_data_link_'+id).find('p a');
		if(key_value != ''){
			array_value	= JSON.parse(key_value);
			if(data_link.length){
				for(i = 0; i < data_link.length; i++){
					if(data_link[i].href != '' && data_link[i].innerHTML != ''){
						var new_value = {
							'link' : data_link[i].href,
							'name' : data_link[i].innerHTML,
							'time' : data_link[i].attributes['data-time'].value
						};
						array_value.push(new_value);
					}
				}
			}

		}else{
			if(data_link.length){
				for(i = 0; i < data_link.length; i++){
					if(data_link[i].href != '' && data_link[i].innerHTML != ''){
						var new_value = {
							'link' : data_link[i].href,
							'name' : data_link[i].innerHTML,
							'time' : data_link[i].attributes['data-time'].value
						};
						array_value.push(new_value);
					}
				}
			}
		}

		if(array_value.length){
			var str_vl	= JSON.stringify(array_value);
			storerage.setItem('cus_'+id, str_vl);
		}

		$('#vgc_data_link_'+id).html('');
	}

   if(data.time > 0) $('#vgc_box_sp_time_'+send_id).val(0);
   /*loadding*/
   spr.html('<img style="width: 50px; margin: 150px auto 0;display: block;" src="../themes/v1/images/loading25.gif" >');
   /* xóa tin nhắn offline */
   if(msg_offline.length) msg_offline.remove();
	$.post(
		'https://vchat.vn/ajax_v1/ajax_get_boxchat_support_v3.php',
		data,
		function(res){
			if(res.status == 0){
				spr.html(res.error);
			}else{
				/* nếu online thì để online, không online thì set bên left cũng không online */
				if(res.online == 1){
					$('#req_'+data.to_id).find('.sp_icon_online').removeClass('soffline').removeClass('sonline').addClass('sonline');
				}else{
					$('#req_'+data.to_id).find('.sp_icon_online').removeClass('soffline').removeClass('sonline').addClass('soffline');
				}
				spr.html(res.html);
				elm.find('.sp_count').text('');

				/* nếu là click từ khách đang online thì show luôn thông tin khác ra */
				if(link != '' && pname != ''){
					//$('.box_info span').trigger('click');
				}

				setTimeout(function(){
					var to_id 	= id || 0;
					var elm		=  $('#body_msg');
					if(elm.length > 0){
						elm[0].scrollTop = (elm[0].scrollHeight)+20;
					}
				}, 50);
				/* kiểm tra nếu click mà từ phần new chat thì xóa đi luôn và chuyển xuống phần history */
				if(elm.parents('.item').attr('id') == 'newchat_support'){
					$('#hischat_support .spl_req').prepend(elm[0].outerHTML);
					elm.remove();
				}

				/* bôi mầu cho thẻ được click */
				$('.sp_row').css('background-color', '#fff');
				elm.css('background-color', '#f9f9f9');

				/*focus boxchat*/
				$('#box_send_'+id).focus();
			}
		},
		'json'
	)
}

function showOverlay(){
	var ovl	= $('#contentovl');
	var contents	= $('#detailTime');
	if(ovl.length){
		if(ovl.hasClass('hide')){
			ovl.removeClass('hide');
		}else{
			ovl.addClass('hide');
			contents.html('<img style="text-align: center;" src="../themes/v1/images/loading25.gif" />');
		}
	}
}

function closeOverlay(){
	var ovl	= $('#contentovl');
	var contents	= $('#detailTime');
	contents.html('');
	ovl.addClass('hide');
}

/*Function show detail time onlien of user*/
function detailTime(vday, use_id){
	if(use_id > 0 && vday > 0){
		var data = {};
		data.time	= vday;
		data.id		= use_id;
		showOverlay();
		$.post('https://vchat.vn/ajax_v1/ajax_show_detail_time.php', data ,
			function(response){
	   		if(response.status == 1){
					if($('#detailTime').length){
						$('#detailTime').html(response.html);
					}
	   		}
			}, 'json'
		);
	}
}

function isset(myVariable) {
	if (myVariable != "undefined" && myVariable != undefined && myVariable != null){
		return true;
	}else{
		return false;
	}
}


/* function search list user */
function searchListUserHistory(obj){
	var hold_val = $(obj).val();
	if( hold_val != ''){
	//do something
	$('#hischat_support').find(".sp_row").each(function(){
		var search_name = $.trim($(this).find('.sname').text()).toLowerCase();
		var keyword =  $.vn_str_filter(hold_val).toLowerCase();
		if($.vn_str_filter(search_name).match(keyword) != keyword){
			$(this).hide();
		}else{
			$(this).show();
		}
	});

	}else{
		$('#hischat_support').find(".sp_row").show();
	}
}

$.vn_str_filter = function (str){
	if(typeof(str)!="string") return;
	if(str==null) return;
	var mang = new Array();
	var strreplace = new Array("A","D","E","I","O","U","Y","a","d","e","i","o","u","y");

	mang[0]=new Array("Ã€","Ã","áº¢","Ãƒ","áº ","Ã‚","áº¤","áº¦","áº¨","áºª","áº¬","Ä‚","áº®","áº°","áº²","áº´","áº¶");
	mang[1]=new Array("Ä");
	mang[2]=new Array("Ãˆ","Ã‰","áºº","áº¼","áº¸","ÃŠ","á»€","áº¾","á»‚","á»„","á»†");
	mang[3]=new Array("ÃŒ","Ã","á»ˆ","Ä¨","á»Š");
	mang[4]=new Array("Ã’","Ã“","á»Ž","Ã•","á»Œ","Ã”","á»’","á»","á»”","á»–","á»˜","Æ ","á»œ","á»š","á»ž","á» ","á»¢");
	mang[5]=new Array("Ã™","Ãš","á»¦","Å¨","á»¤","Æ¯","á»ª","á»¨","á»¬","á»®","á»°");
	mang[6]=new Array("á»²","Ã","á»¶","á»¸","á»´");

	mang[7]=new Array("Ã ","Ã¡","áº£","Ã£","áº¡","Ã¢","áº¥","áº§","áº©","áº«","áº­","Äƒ","áº¯","áº±","áº·","áº³","áºµ");
	mang[8]=new Array("Ä‘");
	mang[9]=new Array("Ã¨","Ã©","áº»","áº½","áº¹","Ãª","á»","áº¿","á»ƒ","á»…","á»‡");
	mang[10]=new Array("Ã¬","Ã­","á»‰","Ä©","á»‹");
	mang[11]=new Array("Ã²","Ã³","á»","Ãµ","á»","Ã´","á»“","á»‘","á»•","á»—","á»™","Æ¡","á»","á»›","á»Ÿ","á»¡","á»£");
	mang[12]=new Array("Ã¹","Ãº","á»§","Å©","á»¥","Æ°","á»«","á»©","á»­","á»¯","á»±");
	mang[13]=new Array("á»³","Ã½","á»·","á»¹","á»µ");

	for (i=0;i<=mang.length-1;i++)
		for (i1=0;i1<=mang[i].length-1;i1++){
		    var regex = new RegExp(mang[i][i1], 'g');
		  	str=str.replace(regex,strreplace[i]);
		}

	return str;
}

/*Function banned user*/
function vgc_banned_user(obj){

	if(isset(typeof vgc_permission_pk) && isset(typeof vgc_permission_pk.baned)){
		if(vgc_permission_pk.baned == 0){
			alert('Bạn không có quyền sử dụng chức năng này');
			return false;
		}
	}
	var _to_id = parseInt(obj.to_id) || 0;
	var _send_id = parseInt(obj.send_id) || 0;
	if(_to_id <= 0 || _send_id <= 0){
		alert('Không có thông tin khách bị Ban');
		return false;
	}else{
		$.post('https://vchat.vn/ajax_v1/ajax_banned_user.php', {to_id : _to_id, send_id : _send_id},
		function(datas){
			if(datas.status == 1){
				alert('Ban user thành công');
            $('#box_support_'+_to_id).append(datas.html);
				return false;
			}else{
				alert(datas.error);
				return false;
			}
		},'json');
	}
}
/**
	Function close boxchat help support
*/
function vgc_support_close(obj){
	/*
	if(isset(typeof vgc_permission_pk) && isset(typeof vgc_permission_pk.max_chat)){
		if(vgc_permission_pk.max_chat == 1){
			var to_id	= parseInt($('#vgc_sp_to_id').val()) || 0;
			var send_id	= parseInt($('#vgc_sp_send_id').val()) || 0;
			var hash		= $('#vgc_sp_hash').val() || '';
			var quere	= send_id +':'+ to_id;
			var data_post = {send_id : send_id, to_id : to_id, hash : hash, quere : quere};
			$.ajax({
		      url: url_server_chat + 'ajax_close_quere.php',
		      method: 'post',
		      type: 'json',
		      crossOrigin: true,
		      data: data_post,
		      error: function(err) {},
		      success: function(res) {
					if(res.status	== 0){
						alert(res.error);
						return false;
					}
		      }
		   });
		}
	}
	*/

	$(obj).parent().remove();
}


function vgc_support_v3_close(obj){
   $(obj).parents('#box_support').remove();
}


/* change version */
function change_version(){
	var vchat_version =  parseInt($.cookie('vchat_version')) || 0;
	if(vchat_version == 1){
		$.cookie('vchat_version', 0, { expires: 365 });
		window.location.href	= 'support_v2.html';
	}else{
		$.cookie('vchat_version', 1, { expires: 365 });
		window.location.href	= 'type98cc.html?module=supplier';
	}

}

/* hàm chuyển tab thông tin khách hàng và ghi chú trong phần chat support */
function sp_change_tab(obj){
	var elm	= $(obj);
	var elm_cus		= $('#sp_if_customer');
	var elm_note	= $('#sp_if_note');
	var elm_id		= $('#vgc_sp_to_id').val() || 0;
	var elm_ac		= $('.sp_ac_ac');

	var name_tab	= elm.data('tab') || '';
	if(name_tab != ''){
		switch(name_tab){
			case 'ifcus':
				elm_cus.removeClass('hide');
				elm_note.addClass('hide');
				elm_ac.removeClass('sp_if_ac');
				elm.addClass('sp_if_ac');
				break;
			case 'ifnote':
				elm_cus.addClass('hide');
				elm_note.removeClass('hide');
				elm_ac.removeClass('sp_if_ac');
				elm.addClass('sp_if_ac');
				if(elm_note.text() == ''){
					$.post('https://vchat.vn/ajax_v1/ajax_get_note.php', {id : elm_id},
					function(respon){
						if(respon.status == 0){
							alert(respon.error);
							return false;
						}else{
							elm_note.html(respon.data);
							return false;
						}
					},'json');
				}
				break;
		}
	}
}

function create_note(){
	var _note	= $('#sp_not_text').val();
	if(_note.trim() != ''){
		var admin_id	= $('#vgc_sp_send_id').val();
		var support_id	= $('#vgc_sp_support_id').val();
		var guest_id	= $('#vgc_sp_to_id').val();
		var hash			= $('#vgc_sp_hash').val();

		if(admin_id > 0){
			$.post('https://vchat.vn/ajax_v1/ajax_create_note.php',
				{admin_id : admin_id, support_id : support_id, guest_id : guest_id, note : _note, hash : hash},
				function(data){
					if(data.status == 0){
						alert(data.error);
						return false;
					}else{
						$('.sp_list_note').prepend(data.html);
						$('#sp_not_text').val('');
					}
				}, 'json'
			)
		}
	}else{

	}
}

/* Hàm mở thông tin user đang online và cho xem lịch sử để có thể chat */
function vgc_detail_customer_online(obj){
	var _id	= $(obj).data('id') || 0;
	var _ip	= $(obj).data('ip') || '';
	var _source	= $(obj).data('source') || '';
	var _link	= $('#vgc_data_link_'+_id).html();

	$(obj).addClass('vgc_rowselect');

	var _html = '<div class="vgc_v_d_c_o">';
			_html	+= '<h3>IP: '+_ip+'</h3>';
			_html	+= '<div class="vgc_btn_chat"><span class="btn_yellow" onclick="create_chat_box({id:'+_id+'})">Chat với khách</span></div>';
			_html += '<div class="vgc_list_link" id="vgc_list_link_'+_id+'">';
				_html += _link;
			_html += '</div>';
			_html += '<span class="vgc_source">Nguồn: <a href="http://'+_source+'" target="_blank">'+_source+'</a></span>' ;
		_html	+=	'</div>';

	$('#spr').html(_html);
}

/* hàm show info ip when hover ip */
function vgc_show_ip(obj){
	var _ip = obj.ip || '';
	var _id = obj.id || 0;
	if(_ip == '' || _id == 0) return;
	if($('#vgc_info_ip_'+_id).html() != ''){
		return;
	}
	var xmlhttp = new XMLHttpRequest();
	//var url = "//ip-api.com/json/"+_ip;
   var url = "//freegeoip.net/json/"+_ip;

	xmlhttp.onreadystatechange = function() {
		if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
			if($('#vgc_info_ip_'+_id).html() != '') return;
			var 	ip_info	= JSON.parse(xmlhttp.responseText);
         
			var	html_ip	= '<p>Chi tiết Ip: '+_ip+'</p><ul>';
						html_ip	+= '<li>Tình thành: <span>'+ip_info.region_name+', '+ip_info.country_name+'</span></li>';
						html_ip	+= '<li>Nhà mạng: <span>'+ip_info.country_code+'</span></li>';
						html_ip	+= '<li><a href="//maps.google.com/maps?q='+ip_info.latitude+','+ip_info.longitude+'" target="_blank"><img src="https://maps.googleapis.com/maps/api/staticmap?center='+ip_info.latitude+','+ip_info.longitude+'&zoom=13&size=300x150&maptype=roadmap&markers=color:red|label:C|'+ip_info.latitude+','+ip_info.longitude+'" /></a></li>';
					html_ip	+= '</ul>';
					html_ip	+= '<span class="ipnote">Thông tin vị trí được lấy từ trang web: //ipinfo.io <br>Thông tin trên chỉ mang tính tương đối</span>';
			$('#vgc_info_ip_'+_id).append(html_ip);
		}
	}
	xmlhttp.open("GET.html", url, true);
	xmlhttp.send();
}


function show_ip_boxchat_support(obj){
	var _ip = obj.ip || '';
	if(_ip == '') return;
	var xmlhttp = new XMLHttpRequest();
	//var url = "//ip-api.com/json/"+_ip;
   var url = "//freegeoip.net/json/"+_ip;
	if($('#ovloadingcontent').html() != ''){
		return;
	}
	xmlhttp.onreadystatechange = function() {
		if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
			var 	ip_info	= JSON.parse(xmlhttp.responseText);
         
			var	html_ip	= '<p>Chi tiết Ip: '+_ip+'</p><ul>'
						html_ip	+= '<li>Tình thành: <span>'+ip_info.region_name+', '+ip_info.country_name+'</span></li>';
						html_ip	+= '<li>Nhà mạng: <span>'+ip_info.country_code+'</span></li>';
						html_ip	+= '<li><a href="//maps.google.com/maps?q='+ip_info.latitude+','+ip_info.longitude+'" target="_blank"><img src="https://maps.googleapis.com/maps/api/staticmap?center='+ip_info.latitude+','+ip_info.longitude+'&zoom=13&size=250x150&maptype=roadmap&markers=color:red|label:C|'+ip_info.latitude+','+ip_info.longitude+'" /></a></li>';
					html_ip	+= '</ul>';
					html_ip	+= '<span class="ipnote">Thông tin vị trí được lấy từ trang web: //ipinfo.io <br> Thông tin trên chỉ mang tính tương đối</span>';
			$('#ovloadingcontent').html(html_ip);
		}
	}
	xmlhttp.open("GET.html", url, true);
	xmlhttp.send();
}

// hàm hủy local storage
function destruct_localstorage(){
   var d = new Date();
   var _day = d.getDate();
   
   if (localStorage) {
      // LocalStorage is supported
      var ls = localStorage;
      var kd = parseInt(ls.getItem('keyday')) || 0;
      
      if(kd == 0){
         ls.setItem('keyday', _day);         
      }else{
         if(_day != kd){
            ls.clear();
         }
      }
   }
   
}


// hàm xử lý ip cho ra thông tin
function processIp(ip){
   if(ip == '') return;
   
   // kiểm tra ip có trong lc chứa
   var dataip = '';
   if (localStorage) {
      
      var ls = localStorage;
      
      dataip = ls.getItem(ip) || "";
      
   }
   
   
   // nếu lấy được từ ls
   if(dataip != ''){
      console.log('local');
      var objdataip = JSON.parse(dataip);
      var user_image = '//maps.googleapis.com/maps/api/staticmap?center='+objdataip.lat+','+objdataip.lon+'&zoom=12&size=150x150&maptype=roadmap&markers=color:red|label:C|'+objdataip.lat+','+objdataip.lon;
      $('#user_image_location').html('<img src="'+user_image+'" />');
      var _link_flag = '../../ipdata.co/flags/vn.png';
      if(objdataip.country_code != '') _link_flag = '//ipdata.co/flags/'+objdataip.country_code+'.png';
      var user_location = '<img src="'+_link_flag+'" /> - <span>'+objdataip.city_name+', '+objdataip.country_name+'</span>';
      $('#user_location_ip').html(user_location);
      
   }else{
      
      var arrUrl = ['//ip-api.com/json/', '//freegeoip.net/json/'];
      
      var d = new Date();
      var _day = d.getHours();
      var _index = _day % 2;
      
      var url = '//freegeoip.net/json/' + ip;
      
      var objdataip = {};
      
      // tự lấy lần đầu vào lưu vào ls
      var xmlhttp = new XMLHttpRequest();   	
   	xmlhttp.onreadystatechange = function() {
   		if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
   			var 	ip_info	= JSON.parse(xmlhttp.responseText);
            
            //if(_index == 1){
               objdataip = {
                  city_name : ip_info.region_name,
                  country_name : ip_info.country_name,
                  country_code : ip_info.country_code.toLowerCase(),
                  ip : ip,
                  lat : ip_info.latitude,
                  lon : ip_info.longitude
               };
               /*
            }else{
               objdataip = {
                  city_name : ip_info.regionName,
                  country_name : ip_info.country,
                  country_code : ip_info.countryCode.toLowerCase(),
                  ip : ip,
                  lat : ip_info.lat,
                  lon : ip_info.lon
               };
            }
            */
            console.log('direct',objdataip);
            var dataip = JSON.stringify(objdataip);
            var user_image = 'http://maps.googleapis.com/maps/api/staticmap?center='+objdataip.lat+','+objdataip.lon+'&zoom=12&size=150x150&maptype=roadmap&markers=color:red|label:C|'+objdataip.lat+','+objdataip.lon;
            $('#user_image_location').html('<img src="'+user_image+'" />');
            var _link_flag = '../../ipdata.co/flags/vn.png';
            if(objdataip.country_code != '') _link_flag = '//ipdata.co/flags/'+objdataip.country_code+'.png';
            var user_location = '<img src="'+_link_flag+'" /> - <span>'+objdataip.city_name+', '+objdataip.country_name+'</span>';
            $('#user_location_ip').html(user_location);
            if (localStorage) {
               
               var ls = localStorage;               
               ls.setItem(ip, dataip);
               
            }
            
   		}
   	}
   	xmlhttp.open("GET.html", url, true);
   	xmlhttp.send();
   }   
}


function show_overlay(){
	$('#backgroup_black').css('display', 'block');
	$('#ovcontent').css('display', 'table-cell');
}
function hide_overlay(){
	$('#backgroup_black').css('display', 'none');
	$('#ovcontent').css('display', 'none');
}

/* function close */
function vgc_close_functions(obj){
	$(obj).parent().remove();
}

function VatGiaChatCreateCookie(name, value, days){
	if (days){
		var date = new Date();
		date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
		var expires = "; expires=" + date.toGMTString();
	}
	else var expires = "";
	document.cookie = name + "=" + value + expires + "; path=/";
}
function VatGiaChatReadCookie(name) {
	var nameEQ = name + "=";
	var ca = document.cookie.split(";");
	for (var i = 0; i < ca.length; i++){
		var c = ca[i];
		while (c.charAt(0) == " ") c = c.substring(1, c.length);
		if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length, c.length);
	}
	return 0;
}

function sprintf() {
  //  discuss at: http://phpjs.org/functions/sprintf/
  // original by: Ash Searle (http://hexmen.com/blog/)
  // improved by: Michael White (http://getsprink.com)
  // improved by: Jack
  // improved by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
  // improved by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
  // improved by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
  // improved by: Dj
  // improved by: Allidylls
  //    input by: Paulo Freitas
  //    input by: Brett Zamir (http://brett-zamir.me)
  //   example 1: sprintf("%01.2f", 123.1);
  //   returns 1: 123.10
  //   example 2: sprintf("[%10s]", 'monkey');
  //   returns 2: '[    monkey]'
  //   example 3: sprintf("[%'#10s]", 'monkey');
  //   returns 3: '[####monkey]'
  //   example 4: sprintf("%d", 123456789012345);
  //   returns 4: '123456789012345'
  //   example 5: sprintf('%-03s', 'E');
  //   returns 5: 'E00'

  var regex = /%%|%(\d+\$)?([-+\'#0 ]*)(\*\d+\$|\*|\d+)?(\.(\*\d+\$|\*|\d+))?([scboxXuideEfFgG])/g;
  var a = arguments;
  var i = 0;
  var format = a[i++];

  // pad()
  var pad = function (str, len, chr, leftJustify) {
    if (!chr) {
      chr = ' ';
    }
    var padding = (str.length >= len) ? '' : new Array(1 + len - str.length >>> 0)
      .join(chr);
    return leftJustify ? str + padding : padding + str;
  };

  // justify()
  var justify = function (value, prefix, leftJustify, minWidth, zeroPad, customPadChar) {
    var diff = minWidth - value.length;
    if (diff > 0) {
      if (leftJustify || !zeroPad) {
        value = pad(value, minWidth, customPadChar, leftJustify);
      } else {
        value = value.slice(0, prefix.length) + pad('', diff, '0', true) + value.slice(prefix.length);
      }
    }
    return value;
  };

  // formatBaseX()
  var formatBaseX = function (value, base, prefix, leftJustify, minWidth, precision, zeroPad) {
    // Note: casts negative numbers to positive ones
    var number = value >>> 0;
    prefix = prefix && number && {
      '2': '0b',
      '8': '0',
      '16': '0x'
    }[base] || '';
    value = prefix + pad(number.toString(base), precision || 0, '0', false);
    return justify(value, prefix, leftJustify, minWidth, zeroPad);
  };

  // formatString()
  var formatString = function (value, leftJustify, minWidth, precision, zeroPad, customPadChar) {
    if (precision != null) {
      value = value.slice(0, precision);
    }
    return justify(value, '', leftJustify, minWidth, zeroPad, customPadChar);
  };

  // doFormat()
  var doFormat = function (substring, valueIndex, flags, minWidth, _, precision, type) {
    var number, prefix, method, textTransform, value;

    if (substring === '%%') {
      return '%';
    }

    // parse flags
    var leftJustify = false;
    var positivePrefix = '';
    var zeroPad = false;
    var prefixBaseX = false;
    var customPadChar = ' ';
    var flagsl = flags.length;
    for (var j = 0; flags && j < flagsl; j++) {
      switch (flags.charAt(j)) {
      case ' ':
        positivePrefix = ' ';
        break;
      case '+':
        positivePrefix = '+';
        break;
      case '-':
        leftJustify = true;
        break;
      case "'":
        customPadChar = flags.charAt(j + 1);
        break;
      case '0':
        zeroPad = true;
        customPadChar = '0';
        break;
      case '#':
        prefixBaseX = true;
        break;
      }
    }

    // parameters may be null, undefined, empty-string or real valued
    // we want to ignore null, undefined and empty-string values
    if (!minWidth) {
      minWidth = 0;
    } else if (minWidth === '*') {
      minWidth = +a[i++];
    } else if (minWidth.charAt(0) == '*') {
      minWidth = +a[minWidth.slice(1, -1)];
    } else {
      minWidth = +minWidth;
    }

    // Note: undocumented perl feature:
    if (minWidth < 0) {
      minWidth = -minWidth;
      leftJustify = true;
    }

    if (!isFinite(minWidth)) {
      throw new Error('sprintf: (minimum-)width must be finite');
    }

    if (!precision) {
      precision = 'fFeE'.indexOf(type) > -1 ? 6 : (type === 'd') ? 0 : undefined;
    } else if (precision === '*') {
      precision = +a[i++];
    } else if (precision.charAt(0) == '*') {
      precision = +a[precision.slice(1, -1)];
    } else {
      precision = +precision;
    }

    // grab value using valueIndex if required?
    value = valueIndex ? a[valueIndex.slice(0, -1)] : a[i++];

    switch (type) {
    case 's':
      return formatString(String(value), leftJustify, minWidth, precision, zeroPad, customPadChar);
    case 'c':
      return formatString(String.fromCharCode(+value), leftJustify, minWidth, precision, zeroPad);
    case 'b':
      return formatBaseX(value, 2, prefixBaseX, leftJustify, minWidth, precision, zeroPad);
    case 'o':
      return formatBaseX(value, 8, prefixBaseX, leftJustify, minWidth, precision, zeroPad);
    case 'x':
      return formatBaseX(value, 16, prefixBaseX, leftJustify, minWidth, precision, zeroPad);
    case 'X':
      return formatBaseX(value, 16, prefixBaseX, leftJustify, minWidth, precision, zeroPad)
        .toUpperCase();
    case 'u':
      return formatBaseX(value, 10, prefixBaseX, leftJustify, minWidth, precision, zeroPad);
    case 'i':
    case 'd':
      number = +value || 0;
      // Plain Math.round doesn't just truncate
      number = Math.round(number - number % 1);
      prefix = number < 0 ? '-' : positivePrefix;
      value = prefix + pad(String(Math.abs(number)), precision, '0', false);
      return justify(value, prefix, leftJustify, minWidth, zeroPad);
    case 'e':
    case 'E':
    case 'f': // Should handle locales (as per setlocale)
    case 'F':
    case 'g':
    case 'G':
      number = +value;
      prefix = number < 0 ? '-' : positivePrefix;
      method = ['toExponential', 'toFixed', 'toPrecision']['efg'.indexOf(type.toLowerCase())];
      textTransform = ['toString', 'toUpperCase']['eEfFgG'.indexOf(type) % 2];
      value = prefix + Math.abs(number)[method](precision);
      return justify(value, prefix, leftJustify, minWidth, zeroPad)[textTransform]();
    default:
      return substring;
    }
  };

  return format.replace(regex, doFormat);
}



/*
boxchat support thay đổi thông tin khách hàng
*/
function change_info_customer(obj){
	var elm = $(obj);
	$('.sp_close').trigger('click');
	elm.next('p').removeClass('hide');
	elm.removeClass('sp_hover_text');
   elm.select();
}

/*
boxchat support lưu thông tin khách hàng
*/
function save_info_customer(obj){
	var elm = $(obj);
	var _input	= elm.parent().prev('input');
	if(_input){
		var _vl	= _input.val().trim() || '';
		var _id	= $('#vgc_sp_to_id').val() || 0;
		var _send_id	= $('#vgc_sp_send_id').val() || 0;
		var _hash		= $('#vgc_sp_hash').val() || '';
		var _field		= elm.data('field') || '';
		if(_vl !== '' && _id > 0 && _send_id > 0 && _hash !== '' && _field != ''){

			var data_port	= {
				vl : _vl,
				id : _id,
				send_id : _send_id,
				field : _field,
				hash : _hash
			};

			elm.next('img').removeClass('hide');
			$.post(
				'https://vchat.vn/ajax_v1/ajax_change_info_customer.php',
				data_port,
				function(data){
					if(data.status == 0){
                  if(data.error != ''){				        
						   alert(data.error);
                  }
						return;
					}else{
					   alert('Cập nhật thành công'); 
						elm.next().trigger('click');
						return;
					}
				},
				'json'
			)
		}else{
			alert('Bạn chưa nhập thông tin');
			return;
		}
	}
}


function vgc_update_info(obj){
   
   var _data = $(obj).data('info') || '';   
   if(_data != ''){
      if(typeof _data == 'string'){
         if(_data.indexOf('@') > 0){
            $('#sp_info_email').val(_data);
            $('#sp_info_email').parent().find('.sp_save').trigger('onclick');
         }else{
            $('#sp_info_phone').val(_data);
            $('#sp_info_phone').parent().find('.sp_save').trigger('onclick');
         }
      }else{
         $('#sp_info_phone').val(_data);
         $('#sp_info_phone').parent().find('.sp_save').trigger('onclick');
      }   
   }  
}

/*
boxchat support hủy lưu thông tin khách hàng
*/
function close_info_customer(obj){
	var elm = $(obj);
	elm.parent().addClass('hide');
	elm.parent().prev('input').addClass('sp_hover_text');
	elm.next('img').addClass('hide');
}

/*
function add class vào thẻ tr của phần khách đang online
*/
function active_tr(obj){
   
	$('.feed_row').removeClass('active_tr_on');
	$(obj).addClass('active_tr_on');
}

/* hỏi vị trí của người đang chat với mình */
function ask_location(){
	$('#vgc_ask_location').val(1);
	$('.sp_send_text').val('Bạn đã yêu cầu người chat chia sẻ vị trí của họ.');
	var event = {keyCode : 13};
   var id	 = $('#vgc_sp_to_id').val() || 0;
   send_chat_js(event, 'submit', id);
}

/* hàm callback khi click vào nút chat hoặc nhắn tin trong phần lịch sử chat và liên hệ thì hiển thị loading */
function vchat_showloading(){
	$('#vchat_loading').removeClass('hide').fadeIn(500);
}
function vchat_hideloading(){
	$('#vchat_loading').addClass('hide').fadeOut(200);
}

/* hàm cập nhật số lượng click vào gửi sms hoặc email */
function update_count_marketing(obj){
	var _count		= parseInt($('.count_send_marketing').data('val')) || 0;
	if($(obj).is(':checked')) _count += 1;
	if(!$(obj).is(':checked')) _count -= 1;

	$('.count_send_marketing').data('val', _count).text(_count);
}

/* hàm lấy thông tin user để gửi sms hoặc email */
function send_marketing(obj){
	var ob_type	= obj.type || '';
	if(ob_type.trim() == '') return;

	var data = $('#frm_content').serialize();
	console.log(data);
}

function close_show_tags_list(){
	$('.vgc_tags_user').find('.ic_close_list_sp').click();
}

function show_list_tags(obj){
	var _to_id	= $('#vgc_sp_to_id').val() || 0;
	var _send_id	= $('#vgc_sp_send_id').val() || 0;
	var _hash	= $('#vgc_sp_hash').val() || '';

	if(_to_id <= 0 || _send_id <= 0){
		alert('Thông tin không đúng');
		return;
	}

	close_show_tags_list();

	if($('#tags_list_support').length){
		if($('#tags_list_support').html() != ''){
			$('#tags_list_support').removeClass('vgc_hide');
			$(obj).parent().find('.ic_close_list_sp').removeClass('vgc_hide');
			return;
		}
	}

	$.post(
		'https://vchat.vn/ajax_v1/ajax_load_tags_list.php',
		{to_id : _to_id, send_id : _send_id, hash : _hash},
		function( data ){
			if(data.status == 0){
				alert(data.error);
				return;
			}
			$('#vgc_tags_user').append(data.html);
			$('#tags_list_support').show();
			$(obj).parent().find('.ic_close_list_sp').removeClass('vgc_hide');
		},
		'json'
	)
}

/* hiển thị list label (nhãn khách hàng) */
function show_label(obj){
	var _to_id		= $('#vgc_sp_to_id').val() || 0;
	var _send_id	= $('#vgc_sp_send_id').val() || 0;
	var _hash		= $('#vgc_sp_hash').val() || '';

	if(_to_id <= 0 || _send_id <= 0){
		alert('Thông tin không đúng');
		return;
	}

	close_show_tags_list();

	if($('#label_list_support').length){
		if($('#label_list_support').html() != ''){
			$('#label_list_support').removeClass('vgc_hide');
			$(obj).parent().find('.ic_close_list_sp').removeClass('vgc_hide');
			return;
		}
	}

	$.post(
		'https://vchat.vn/ajax_v1/ajax_show_label.php',
		{to_id : _to_id, send_id : _send_id, hash : _hash},
		function( data ){
			if(data.status == 0){
				alert(data.error);
				return;
			}
			$('#vgc_label').append(data.html);
			$('#label_list_support').show();
			$(obj).parent().find('.ic_close_list_sp').removeClass('vgc_hide');
		},
		'json'
	)
}

function close_list_sp(obj){
	$(obj).parent().find('.function_list_sp').addClass('vgc_hide');
	$(obj).addClass('vgc_hide');
}

function vgc_not_permisstion(){
	alert('Tài khoản miễn phí không được quyền sử dụng chức năng này.');
	return false;
}

function show_payment_alert(){
	$('#bg_payment_alert').addClass('showpayment_bg').removeClass('hide');
	$('#payment_account_alert').removeClass('hide');
}
function hide_payment_alert(){
	$('#bg_payment_alert').removeClass('showpayment_bg').addClass('hide');
	$('#payment_account_alert').addClass('hide');
}

function alert_payment(){
	if($('#payment_account_alert').length){
		show_payment_alert();
	}else{
		alert('Tài khoản của bạn không phải là tài khoản chính. Vui lòng thông báo đến tài khoản chính để Gia hạn hoặc Nâng cấp gói sử dụng');
		return false;
	}
}

function vgc_select_label(obj){
	var _tid			= $(obj).data('id') || 0;
	var _to_id		= $('#vgc_sp_to_id').val() || 0;
	var _send_id	= $('#vgc_sp_send_id').val() || 0;
	var _hash		= $('#vgc_sp_hash').val() || '';
	var _type		= $(obj).data('type') || '';

	if(_to_id <= 0 || _send_id <= 0){
		alert('Thông tin không đúng');
		return;
	}

	close_show_tags_list();

	$.post(
		'https://vchat.vn/ajax_v1/ajax_set_label.php',
		{to_id : _to_id, send_id : _send_id, hash : _hash, t_id : _tid, type : _type},
		function( data ){
			if(data.status == 0){
				alert(data.error);
				return;
			}
			if(_type == 'del'){
				$('#sp_label').html('');
				return;
			}
			$('#sp_label').html(data.html);
		},
		'json'
	)
}


function get_source_customer(id){
   if(id <= 0) return '';
   var ss = localStorage;
   var _ref = ss.getItem('ref_'+id);
   if(_ref != null){
      $('#info_more').append('Đến từ: <span class="source_customer"><b>'+_ref+'</b></span>');
   }
   
   var _cus_time = ss.getItem('cus_time_'+id);
   if(_cus_time != null){
      $('#user_time').html('<span>Truy cập gần nhất: <b>'+_cus_time+'</b></span>');
   }
   
   var storerage	= sessionStorage;
	var key_value		= storerage.getItem('cus_'+id) || '';
	if(key_value != ''){
		array_value	= JSON.parse(key_value);
		$('.template_br_link').html('');
		for(i in array_value){
			$('.template_br_link').prepend('<p><a href="'+array_value[i].link+'" target="_blank" class="sp_his_link">'+array_value[i].name+'</a><span>'+array_value[i].time+'</span></p>');
		}
	}
   
}

function require_info(obj){
	var elm = $(obj);
	var vl = parseInt(elm.data('value')) || 0;
	var key = elm.data('key') || '';
	var name	= elm.data('name') || '';

	// 0: đang không bắt nhập. 1: đang bắt nhập
	if(vl == 0){
		elm.parent().find('.req').text('*');
		elm.text('Không cần nhập').data('value', 1);
		$('#'+key).val(1);
		if(!$('#'+name).is(':checked')) $('#'+name).attr('checked', true);
	}else{
		elm.parent().find('.req').text('');
		elm.text('Bắt phải nhập').data('value', 0);
		$('#'+key).val(0);
	}
}

function load_note(id){
   $.post('https://vchat.vn/ajax_v1/ajax_get_note.php', {id : id},
		function(respon){
			if(respon.status == 0){
				alert(respon.error);
				return false;
			}else{
				$('#user_note_right').html(respon.data);
				return false;
			}
		},'json'
   );
}

function formatNumber(nStr){nStr+='';var x=nStr.split(',');var x1=x[0];var x2='';var x2=x.length>1?','+x[1]:'';var rgx=/(\d+)(\d{3})/;while(rgx.test(x1)){x1=x1.replace(rgx,'$1'+'.' + '$2');}return x1+x2;}


function send_erp(obj){
   var gid = $(obj).data('id') || 0;
   var campaign =  $('#sp_info_campain').val() || '';
   if(gid > 0 && campaign != ''){
      $.post(
         'https://vchat.vn/ajax_v1/send_erp.php',
         {gid : gid, campaign : campaign},
         function(res){
            if(res.status == 1){
               alert('Thành công');
               return;
            }else{
               alert(res.error);
               return;
            }
         },'json'
      )
   }else{
      alert('Kiểm tra lại thông tin và Campaign code của bạn');
      return false;
   }
}

// show popup create account goship
function show_modal_account_goship(){
   $('#goship_ovl').removeClass('hide');
   $('#goship').removeClass('hide');
}

// hide popup create account goship
function hide_modal_account_goship(){
   $('#goship_ovl').addClass('hide');
   $('#goship').addClass('hide');
}

// create account goship
function create_account_goship(){
   var _error = 0;
   var data_post  = {};
   $('.gs_field').find('input').each(function(){
      var _vl = $(this).val() || '';
      var _type = $(this).data('type') || 'str';
      var _name   = $(this).data('name') || '';
      if(_vl.trim() == ''){
         $(this).css('border-color', '#f00');
         _error++;
      }else{
         switch(_type){
            case 'email':
					var regular_email = /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i;
					if(!regular_email.test(_vl)){
						_error++;
                  $(this).css('border-color', '#f00');
					}else{
                  $(this).css('border-color', '#ccc');					 
					}
					break;
				case 'phone':
					var regular_phone = /[0-9 -()+]+$/;
					if(_vl.length < 9 || !regular_phone.test(_vl)){
						_error++;
                  $(this).css('border-color', '#f00');
					}else{
                  $(this).css('border-color', '#ccc');						     
					}
					break;
            case 'str':
               $(this).css('border-color', '#ccc');
               break;
         }
         
         data_post[_name] = _vl;
         
      }
   });
   
   if(_error > 0){
      $('#gs_error').text('Vui lòng kiểm tra lại định dạng dữ liệu và điền đủ thông tin vào những ô mầu đỏ');
      return false;
   }else{
      $.post(
         'https://vchat.vn/ajax_v1/ajax_create_account_goship.php',
         data_post,
         function(res){
            if(res.status == 0){
               $('#gs_error').html(res.error);
               return false;
            }else{
               var access_token = res.access_token || '';
               vgc_goship.account = 1;
               vgc_goship.token = res.access_token;
               var url = 'https://shop.goship.io/login'+access_token;
               window.open(url);
               hide_modal_account_goship();
               return false;
            }
         },
         'json'
      )
      
      $('#gs_error').text('');
      $('#gs_loading').removeClass('hide');
   }
   
}

// show goship
function goship(){
   if(vgc_goship.account == 0){
      show_modal_account_goship();
   }else{
      var access_token = vgc_goship.token || '';
      if(access_token != ''){
         var url = 'https://shop.goship.io/login'+access_token;
         window.open(url);
         return false;
      }else{
         alert('Hệ thống chưa cập nhật tài khoản Goship của bạn');
         return false;
      }
   }
}