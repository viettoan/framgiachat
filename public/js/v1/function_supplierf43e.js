$.base64.utf8decode = true;
var sound_new_vistor		= 0;
sound_new_vistor			= parseInt($.cookie('st_sound_online')) || 0;

var array_productview_id_queue = new Array();

/*
	array này thể hiện rằng máy này là máy đầu tiên click vào chát vs khách hàng
	vì: khi nhận event remove feed nó sẽ kiểm tra trong array này có id này thì sẽ không xóa ở panel nữa
	còn nếu không có trong này thì nó sẽ xóa ở panel đi luôn
	array này kiểm tra lúc nhận, nếu id không có trong array này thì xóa luôn ở pnel và ở trong trang supplier (khách chờ)
*/
var array_feed_owner			 = new Array();

var array_user_remove_Feed	 = new Array();
var array_folow_user_feed	 = new Array(); /*List customer folow by admin*/
var array_folow_city_feed	 = new Array(); /*List city folow by admin*/

var check_user_online_realtime = [];

function show_notification_ontracking(tgname, test){
	
   var _test = test || 0;
   var _cc_target_sound = parseInt($.cookie('target_sound'));
   var _cc_target_notification = parseInt($.cookie('target_notification'));
   if(isNaN(_cc_target_sound)) _cc_target_sound = 1;
   if(isNaN(_cc_target_notification)) _cc_target_notification = 1;
   
   if(_test==1){
      _cc_target_sound = 1;
      _cc_target_notification = 1;
   }
   
   var _title  = 'Mục tiêu: '+tgname;
	var _msg    = 'Bạn có khách hàng mục tiêu ' + tgname + ' trong mục khách online';
   var _msg_text = _msg;
	var _icon   = 'images/target.png';
	if(_cc_target_notification == 1){
	  var _notifi = new Notification(
   								_title,
   								{
   									body: _msg_text
   									,icon: _icon
            						,tag: 'remove'
   								}
   							);
   	//_notifi.close();
   	_notifi.onshow  = function(){
   		setTimeout(function(){
   		   _notifi.close();
   		}, 10000);
   	};
   	_notifi.onclick = function () {
   		window.focus();
     	}
	}
   
   if(_cc_target_sound == 1){
      var vgc_audio = $('#vgc_audio_target');
      vgc_audio[0].play();
   }
      
   
   
      
}


/* function show khách online trên website */
function fn_raw_supplier(data, time, user_id){
	sound_new_vistor			= parseInt($.cookie('st_sound_online')) || 0;
	var html  = '';
   console.log(data);
   /*thông tin có phải sản phẩm đấu giá boxchat trên vatgia hay không*/
   var is_auction     = 0;
   
   /*thông tin những id đã đấu giá sản phẩm này*/
   var array_auction    = [];
   
   if(typeof data.is_auction != 'undefined'){
      if(data.is_auction == true){
         is_auction = 1;
      }
   }
   
   if(typeof data.allow_id != 'undefined'){
      array_auction = data.allow_id;
   }
   
   var ref = '';
   if(typeof data.ref != 'undefined'){
      var _send_id = parseInt(data.send_id) || 0;
      ref = data.ref;
      
      if(ref != '' && _send_id > 0){
         if($('#user_id_online_'+_send_id).length){
            if($('#user_id_online_'+_send_id).find('.source').text() == ''){
               $('#user_id_online_'+_send_id).find('.source').text(ref);
               
               var ss = sessionStorage;
               var ss_ref = ss.getItem('ref_'+_send_id);
               
               var ls = localStorage;
               var sref = ls.getItem('ref_'+_send_id);
               
               if(ss_ref == null){
                  ss.setItem('ref_'+_send_id, ref);
                  $('#user_id_online_'+_send_id).data('ref', ref);
               }
               if(sref == null){
                  ls.setItem('ref_'+_send_id, ref);
               }
               
            }
         }
      }      
      return;
   }
   
   
   /* kiểm tra nếu admin id đã đấu giá sản phẩm này rồi thì thôi */
   if(array_auction.length > 0){
      for(i = 0;i<array_auction.length;i++){
         if(array_auction[i] == vgc_ad_id){
            is_auction = 0;
            break;
         }
      }
   }
   
	// check nếu customer_online display = block thì mới làm
	//if($('#customer_online').css('display') != 'block') return;

	var d1 = data.time ? new Date(parseInt(data.time)) : new Date();
	var _time = d1.getHours() + ":" + (d1.getMinutes() < 10 ? '0' : '') + d1.getMinutes() + ":" + d1.getSeconds();

	// khai báo biến
	var _id 		= parseInt(data.uid);
	var _ip 		= data.ip;
	var _temlink	= data.url;
	var _link		= _temlink;
	var _name	= data.pname;
	if(_name == '' || _name == 'undefined') _name = 'Không lấy được tiêu đề';
	var _source	= data.source;
   var pro_id     = parseInt(data.pid) || 0;

	if(_temlink.indexOf(_source) == -1){
		_link = 'http://'+_source + _temlink;
	}
   
   /**
      Tracking url
   */
   var tracking_icon = '';
   var tru_name   = '';
   if(typeof(vgc_tracking) == 'object'){
      var _is_tracking = 0;
      if(vgc_tracking.length > 0){
         for(i in vgc_tracking){
            if(_is_tracking == 0){
               var tru_type =  vgc_tracking[i].tru_compare || 0;
               var tru_url  = vgc_tracking[i].tru_url || '';
               tru_name = vgc_tracking[i].tru_name || '';
               
               if((tru_type >= 0 && tru_type <= 1) && tru_url != ''){
                  if(tru_type == 0){
                     if(_link == tru_url){
                        tracking_icon = '<img style="float:left; margin-right:5px;" src="images/tracking_1.png" />';
                        _is_tracking =1;
                     }
                  }else{
                     if(_link.indexOf(tru_url) >= 0){
                        tracking_icon = '<img style="float:left; margin-right:5px;" src="images/tracking_1.png" />';
                        _is_tracking =1;
                     }
                  }
               }
            }
         }
      }
   }
   if(tracking_icon != ''){
      show_notification_ontracking(tru_name);
   }

	//*
	// lưu storage conten link
	var storerage	= sessionStorage;
	var key_id		= storerage.getItem('key_id') || '';
	var array_key	= new Array; // mảng những key được phép lưu storage
	if(key_id != ''){
		array_key	= key_id.split(',').map(Number);
      if(array_key.length > 40){
         var rmid = parseInt(array_key[0]);
         array_key.splice(0,1);
         storerage.removeItem('cus_'+rmid);
      }
	}
   
   var _date = new Date();
   var _gethour = (_date.getHours() < 10)? '0'+_date.getHours() : _date.getHours();
   var _getminute = (_date.getMinutes() < 10)? '0'+_date.getMinutes() : _date.getMinutes();
   var _getsecond = (_date.getSeconds() < 10)? '0'+_date.getSeconds() : _date.getSeconds();
   var _cus_time = _gethour +':'+_getminute+':'+_getsecond;
   if(localStorage){
      var ls = localStorage;      
      ls.setItem('cus_time_'+_id, _cus_time);    
   }
   
   
	if(jQuery.inArray(_id, array_key) != -1){
		// lấy giá trị đã được lưu trước đó
		var key_value		= storerage.getItem('cus_'+_id) || '';
		var array_value	= new Array; // mảng lưu giá trị của khách hàng này
		if(key_value != ''){
			array_value	= JSON.parse(key_value);
			var new_value	= {
				'link' : _link,
				'name' : _name,
				'time' : _time,
            'source' : _source,
            'ip' : _ip,
            'auction' : is_auction,
            'pro_id' : pro_id
			};
			array_value.push(new_value);
		}else{
			var new_value	= {
				'link' : _link,
				'name' : _name,
				'time' : _time,
            'source' : _source,
            'ip' : _ip,
            'auction' : is_auction,
            'pro_id' : pro_id
			};
			array_value.push(new_value);
		}
		if(array_value.length){
			var str_vl	= JSON.stringify(array_value);
			storerage.setItem('cus_'+_id, str_vl);
		}
	}else{
	  array_key.push(_id);
     storerage.setItem('key_id', array_key.join(','));
     
     var array_value	= new Array;
     var new_value	= {
			'link' : _link,
			'name' : _name,
			'time' : _time,
         'source' : _source,
         'ip' : _ip,
         'auction' : is_auction,
         'pro_id' : pro_id
		};
		array_value.push(new_value);
      var str_vl	= JSON.stringify(array_value);
		storerage.setItem('cus_'+_id, str_vl);
	}
	//*/

	var _dlink	= '<p class="vgc_row_link"><span> - '+_time+'</span><a data-time="'+ _time +'" href="'+_link+'" target="_blank">'+ _name+'</a></p>';

	// check xem đã mở phần show chi tiết link xem của user chưa
	/*
	if($('#vgc_list_link_'+_id).length){
		$('#vgc_list_link_'+_id).append(_dlink);
	}
	*/

	// check xem boxchat của user này đã có hay chưa, có thì xem có link chưam chưa có thì thêm vào, có rồi thì thay lại link
	if($('#box_support_'+_id).length){

		var _item_link	= $('.template_br_link');

		// check xem có dòng link xem chưa
		if(_item_link.length && _link != ''){
			_item_link.prepend('<p><a class="sp_his_link" target="_blank" href="'+_link+'">'+_name+'</a><span>Vài giây trước</span></p>');
		}

		// append link vào trong ô chat
		$('#box_support_'+_id).append('<div class="vgc_realtime_link">khách xem: <a href="'+_link+'" target="_blank">'+_name+'</a></div>')
	}


	// nếu đã tồn tại dòng user này thì chỉ càn thay link lại là được
	if($('#user_id_online_'+_id).length){

		var repair_link	= '<a target="_blank" href="'+_link+'" class="linkwebsite" title="'+_link+'" >'+ tracking_icon+_name +'</a>';
		$('#user_link_'+_id).html(repair_link);
		var vgc_total_view	= parseInt($('#vgc_total_view_'+_id).data('view')) || 1;
		$('#vgc_total_view_'+_id).text(vgc_total_view + 1)
												.data('view', vgc_total_view + 1);
		$('#vgc_data_link_'+_id).append(_dlink);
      
      $('#user_id_online_'+_id+' .sourcetime').text(_cus_time);
      
      /* nếu link tiếp theo mà không phải đấu giá thì bỏ đi */
      $('#user_id_online_'+_id).data('auction', is_auction);
      if(is_auction){
         $('#user_id_online_'+_id).addClass('class_auction');
      }else{
         $('#user_id_online_'+_id).removeClass('class_auction');
      }
	}
	// chưa tồn tại dòng user này thì thay ngược lại
	else{

		var js_click	= 'onclick="active_tr(this); getboxchat({id:'+_id+',pro_id : '+pro_id+',ip:\''+ _ip +'\',pname : \''+ _name.replace("'", '') +'\', link : \''+ _link.replace("'", '') +'\'});"';
		if(isset(typeof vgc_permission_pk) && isset(typeof vgc_permission_pk.customer_online)){
			if(vgc_permission_pk.customer_online == 0) js_click = "onclick='vgc_not_permisstion()'";
		}

		//var js_click	= 'onclick="vgc_detail_customer_online(this);"';
		html += '<tr '+js_click+' data-ip="'+_ip+'" data-auction="'+is_auction+'"  data-source="'+_source+'" id="user_id_online_'+ _id +'" class="feed_row '+ ((is_auction==1)? 'class_auction' : '') +'">';
      	html += '<td nowrap="nowrap"><div title="Xem IP" onmouseover="vgc_show_ip({ip:\''+_ip+'\',id:'+_id+'});" class="lol lolip">'+ _ip +'<div class="vgc_show_ip" id="vgc_info_ip_'+_id+'" ></div></div><div class="vgc_hide" id="vgc_data_link_'+ _id +'">'+_dlink+'</div></td>';
      	html += '<td width="30" nowrap="nowrap"><span class="vgc_total_view" data-view="1" id="vgc_total_view_'+ _id +'">1</span></td>';
      	html += '<td nowrap="nowrap"><span class="source"></span></td>';
         html += '<td nowrap="nowrap"><span class="sourcetime">'+ _cus_time +'</span></td>';
			html += '<td><div class="vgc_link" id="user_link_'+ _id +'"><a target="_blank" href="'+_link+'" title="'+_link+'" class="linkwebsite" >'+tracking_icon+_name+'</a></div></td>';
	   html += '</tr>';

	   vgc_user_online(html);
	}

}
/*
 * Function xu ly khi user xem websie co ket noi supplier
 * @params data : object
   + ip: "118.70.233.71"
   + pid: "2945421"
   + pname: "Samsung Galaxy S4 (Galaxy S IV / I9500) 64GB White Frost"
   + source: "dev.touch.vatgia.com"
   + src: "kit928115.jpg"
   + time: 123456789
   + uid: 1000000025
   + url: "/438/2945421/samsung-galaxy-s4-galaxy-s-iv-i9500-64gb-white-frost.html"
   + user_id: 105755
 * @params time : interger
 * @params user_id : interger
 */
function fn_raw_supplier_s(data, time, user_id){
	//console.log(data);

   /* Dung script neu khong thoa man */
   // if(data.uid <= 0 || data.url == '') return;

   if(jQuery.inArray(data.uid, array_user_remove_Feed) > -1){
		return;
	}

	/* Kiểm tra xem id có trong array folow không có thì add vào */
	if(jQuery.inArray(data.uid, array_folow_user_feed) > -1){
		if($('#content_cus_'+data.uid).length > 0){
			var html_folow_content	= '';
			var d1 = data.time ? new Date(parseInt(data.time)) : new Date();
			var time = d1.getHours() + ":" + (d1.getMinutes() < 10 ? '0' : '') + d1.getMinutes() + ":" + d1.getSeconds();
			html_folow_content	+= '<p>Time: '+time+' : <a target="_blank" href="'+ data.url +'" title="'+ data.pname +'">'+ data.pname +'</a></p>';
			$('#content_cus_'+data.uid).append(html_folow_content);
			delete html_folow_content;
		}
	}

   /* Md5 data.url tạo urlmd5 thêm vào data */
   data.urlmd5 = $.md5(data.url);

   /* Base64 decode data.city */
   data.city   = data.city || '';

   var pro_id = data.pid || 0;
   var url_md5 = data.urlmd5;
   var uid = data.uid;
   var uname = data.uname ? data.uname.replace('Khách', '').replace(' - ', '') : "" + uid;
   var ip = urldecode(data.ip);
 	ip = data.city || ip;

 	/* Group city in supplier */
 	var cityMD5		= '';
 	var cityElm		= '';
 	var cityCount	= 0;
 	if(data.city	!= '' && data.city != undefined){
 		cityMD5		= $.md5(data.city);
 		cityElm		= $('#'+cityMD5);
 		if( cityElm.length > 0 ){
			cityCount	= parseInt( cityElm.find('i').text() ) || 0;
			cityCount++;
			cityElm.find('i').text(cityCount);
		}else{
			$('#group_city').append('<span title="Chỉ theo dõi tỉnh thành '+data.city+'" onClick="follow_city(this);" data-name="'+ data.city +'" class="cityname" id="'+cityMD5+'">'+ data.city +' <i style="color: #f00;">1</i></span>');
		}
 	}

   var toggle_chart_realtime =  $.cookie('toggle_chart_realtime') || 0;
   var check_highcharts		= $('#containerHighStockRtMinute').highcharts();
	if(typeof check_highcharts != undefined && typeof check_highcharts != 'undefined' && typeof check_highcharts != null && toggle_chart_realtime == 1){

      /* Chart Real time */
      var time_now = (new Date()).getTime();
      var second = 1000;
      var minute = 60 * second;
      var time_for_minute = Math.round(time_now / minute) * minute;
      var time_for_second = Math.round(time_now / second) * second;


      /* Chart Real time Minute */
      var m_chart = $('#containerHighStockRtMinute').highcharts(),
         m_series = m_chart.series[0],
         m_axis_data_length = (m_series.data.length - 1),
         m_x_max = m_series.data[m_axis_data_length].x,
         m_y_max = m_series.data[m_axis_data_length].y,
         x = time_for_minute,
         y = 1;

      if(time_for_minute - m_x_max >= 60*1000){
         if(m_axis_data_length < 30){
            m_series.addPoint({x: x, y: y});
         }else{
            m_series.addPoint({x: x, y: y}, true, true);
         }
      }else{
         m_series.data[m_axis_data_length].update(m_y_max += 1);
      }

      /* Chart Real time Second */
      var s_chart = $('#containerHighStockRtSecond').highcharts(),
         s_series = s_chart.series[0],
         s_axis_data_length = (s_series.data.length - 1),
         s_x_max = s_series.data[s_axis_data_length].x,
         s_y_max = s_series.data[s_axis_data_length].y,
         x = time_for_second,
         y = 1;

      s_series.data[s_axis_data_length].update(s_y_max += 1);

      /* Count user real time */
      var $a_use = $('#user_online_'+uid);
      /* Thêm user vào list và xóa trong khoảng thời gian nhất định */
      if($a_use.length <= 0){
         var $element_i = $('<a id="user_online_' + uid + '" class="user_online" onclick="create_chat_box({id:'+uid+',iPro:'+pro_id+',send_id:'+user_id+'})" href="javascript:;" data-toggle="tooltip" data-placement="top" title="Click để chat với khách '+ uname +'">');
         $element_i.text('Khách ' + uname + '');
         $element_i.flash("#d9edf7",3000);
         $('#list_user_online .modal-body').prepend($element_i);
         check_user_online_realtime[$element_i.index()] = setTimeout(function() {
            $element_i.remove();
            check_user_online_realtime.splice($element_i.index(), 1);
         }, 3*60*1000);

         /* Cập nhật lại số người online */
         $('#user_realtime_count').text(function(){
            var count_online = $('#list_user_online .user_online').length;
            $(this).text(count_online);
         })
      } /* End if($a_use.length <= 0) */

   } // End if(typeof check_highcharts != undefined && typeof check_highcharts != 'undefined' && typeof check_highcharts != null)

   /* Xem san pham nay la co trong list chua - neu co roi thi bo qua neu chua co kiem tra tiep ve user */
   $div_pro = $('#'+url_md5);

	if($div_pro.length > 0){
      /* Xem user nay da co trong list xem san pham chua - neu chua co thi them vao */
		$a_use = $('#user_'+uid);

		if($a_use.length <= 0){

         $list_user = $('#list_user_'+url_md5);

         $div_pro.flash("#d9edf7",3000);
			if($('#customer_online').length){
				$list_user.prepend('<a class="sp_customer_ol" id="user_'+uid+'" onclick="create_chat_box({id:'+uid+',iPro:'+pro_id+',send_id:'+user_id+'})" href="javascript:;" data-toggle="tooltip" data-placement="top" title="Click để chat với khách '+ uname +'">' + uname + '</a>');
			}else{
				$list_user.prepend('<a id="user_'+uid+'" onclick="create_chat_box({id:'+uid+',iPro:'+pro_id+',send_id:'+user_id+'})" href="javascript:;" data-toggle="tooltip" data-placement="top" title="Click để chat với khách '+ uname +'"><i class="icon icon-right-hand"></i> Chat với ' + uname + '</a>');
			}

			$('#userip_'+url_md5).html('<a href="http://whois.domaintools.com/'+ip+'" target="_blank">'+ip+'</a>');
		}
		return true;
	}

   /* Them san pham nay vao array cho xuat ra */
   data.time 	 = time;
	data.user_id = user_id;
	if(array_productview_id_queue.length > 40){
		array_productview_id_queue	= new Array;
	}

	if(array_folow_city_feed.length > 0){
		if(jQuery.inArray(cityMD5, array_folow_city_feed) != -1){
			array_productview_id_queue.push(data);
		}
	}else{
		if(jQuery.inArray(data.mid, array_productview_id_queue) == -1){
			array_productview_id_queue.push(data);
		}
	}


	//var html = $("#listProduct").html();
	//$("#listProduct").html(tplShowProduct(data, user_id) + html);

} /* End function fn_raw_supplier */

/* Function remove feed */
function fn_raw_add_feed( obj ){
	/* console.log(obj); */
	var feed_id		= parseInt(obj.listid) || 0;
	if( jQuery.inArray( feed_id, array_feed_owner ) == -1 ){
		if(jQuery.inArray( feed_id, array_user_remove_Feed ) == -1){
			array_user_remove_Feed.push( feed_id );
			/* Xóa user trong panel chat nếu có */
			if($('#VgChatListOnline li.friend_'+feed_id).length > 0){
				$('#VgChatListOnline li.friend_'+feed_id).remove();
			}
		}
		/* xóa luôn trong phần khách chờ của các user thành viên khác */
		if($('#standby_user_'+feed_id).length > 0){
			$('#standby_user_'+feed_id).remove();
		}

		/* Nếu hết user chờ thì ẩn luôn list chat */
		if($('#vgc_list_standby_user').text() == ''){
			$('#vgc_list_standby_user').hide();
		}
	}
}

/* Function remove feed */
function fn_raw_remove_feed( obj ){
	/*console.log(obj);*/
	var feed_id		= parseInt(obj.listid) || 0;
	var arrIndex	= 0;
	if(jQuery.inArray( feed_id, array_user_remove_Feed ) > -1){
		arrIndex		= jQuery.inArray( feed_id, array_user_remove_Feed );
		array_user_remove_Feed.splice( arrIndex, 1 );
	}
}

/*
 * Function xuat ra nhung gi user xem websie co ket noi supplier - Thuc hien ngam theo timeout chi dinh
 */
function APE_raovat(){

	if(isset(typeof tabsupportOnline)){
		if(tabsupportOnline.css('display') != 'block'){
			return false;
		}
	}

	if(array_productview_id_queue.length > 0){

		/* Lay mes_id dau tien gan vao list */
		var data = array_productview_id_queue[0];

      /* Huy param .length => dieu kien if(array_productview_id_queue.length > 0) return false  */
		array_productview_id_queue.shift();

      /** Xu ly tab **/
      var data_source = data.source;

      /* An thong bao */
      $('.info-title').hide();

      /* Kiem tra xem den tu nguon nao */
      if($('#customer_online').length){
         tab_content_id = 'customer_online';
      }else{
         if(data_source.indexOf("vatgia.com") < 0){
            tab_content_id = 'supplierUserContent';
         }else{
            tab_content_id = 'supplierVatGiaContent';
         }
      }


      /** Xu ly noi dung **/
		APE_raovat_slide(tplShowProduct(data, tab_content_id), tab_content_id);

	} /* End if(array_productview_id_queue.length > 0) */

} /* End function APE_raovat() */

/*
 * function APE_raovat_slide - Chay slide trinh dien san pham dang xem
 */
function APE_raovat_slide(data, sel){

   var maxData		= 50;

	sel_tbody   = "#"+sel+" table tbody";
   $sel_tbody  = $(sel_tbody)
	/* append dữ liệu vào table */
   $sel_tbody.prepend(data);
   $sel_tbody.find('tr:first').hide().fadeIn(200);

   /* Neu co nhieu hon so luong ban ghi quy dinh thi xoa bo ban ghi cuoi */
   if($sel_tbody.find('tr').length > maxData) $sel_tbody.find('tr:last').remove();

   /* Chơi audio */
   var check_sound_feed = $.cookie('check_sound_feed');
   if(check_sound_feed != 0) play_audio('#audio_feed');

   $('[data-toggle=tooltip]').tooltip({
      animation : false,
      html : true
   })

   /* tạo âm thanh */
   if(sound_new_vistor == 1){
		var vgc_audio = $('#vgc_audio_visit');
		if(vgc_audio.length){
      	vgc_audio[0].play();
 		}
	}

} /* End function APE_raovat_slide */

/* hàm append user on website */
function vgc_user_online(data){
	var maxData		= 40;
	sel_tbody   = "#customer_online table tbody";
   $sel_tbody  = $(sel_tbody)
	/* append dữ liệu vào table */
   $sel_tbody.prepend(data);
   $sel_tbody.find('tr:first').hide().fadeIn(200);

   /* Neu co nhieu hon so luong ban ghi quy dinh thi xoa bo ban ghi cuoi */
   if($sel_tbody.find('tr').length > maxData) $sel_tbody.find('tr:last').remove();

   /* tạo âm thanh */
   if(sound_new_vistor == 1){
		var vgc_audio = $('#vgc_audio_visit');
		if(vgc_audio.length){
      	vgc_audio[0].play();
 		}
	}
}

/*
 * function tplShowProduct - tao Template cho product
 */
var data_all	=	[];
var key_all		=	0;
function tplShowProduct(data, sel){
	//console.log(data);
	var user_id  = data.user_id;
	var link = urldecode(data.url);
	if(link.indexOf("http://" + data.source) < 0){
		link = "http://" + data.source + urldecode(data.url);
	}

   /* Base64 decode data.city */
   data.city      = data.city || '';
   data.distric   = data.distric || '';

	var uname = data.uname ? data.uname.replace('Khách', '').replace(' - ', '') : "" + data.uid;
	uname 	= parseInt(uname.replace('khách ', ''));
	var pro_id = data.pid || 0;
	var d1 = data.time ? new Date(parseInt(data.time)) : new Date();
	var time = d1.getHours() + ":" + (d1.getMinutes() < 10 ? '0' : '') + d1.getMinutes() + ":" + d1.getSeconds();
   var url_md5 = data.urlmd5;
   var class_name	= uname+'_'+url_md5;
   if($(class_name).length) return false;

   var ip;
   if(data.distric) ip = data.distric;
   else if(data.city) ip = data.city;
   else ip = data.ip;
   ip = urldecode(ip);

   var url_ip;
   if(data.distric) url_ip = 'http://maps.googleapis.com/maps/api/staticmap?center=' + data.distric + '&zoom=16&markers=size:mid|color:red|' + data.distric + '&size=640x640';
   else url_ip = 'http://whois.domaintools.com/';

   var uid = data.uid;
   var pname = urldecode(data.pname);
   var check_is_not_vatgia	= 0;




	/* Cập nhật lại tên website */
	if(data.source.indexOf('vatgia.com') < 0){
		if($('#website_name').length > 0){
			var linkweb		= document.createElement('a');
			linkweb.href	= data.url;
	 		$('#website_name').html('( ' + linkweb.hostname +' )');
	 		check_is_not_vatgia	= 1;
	 	}
 	}

   sel_tbody   = "#"+sel+" table tbody";
   $sel_tbody  = $(sel_tbody);
   key_all++;
	data_all[key_all]	=	data;
   //var stt = parseInt($sel_tbody.find('tr:first').find('td:first').text())  || 0;
   //stt = stt + 1;
   html  = '';
   html += '<tr id="'+url_md5+'" class="feed_row '+class_name+'">';

   	if(sel != 'customer_online'){
      	//html += '<td nowrap="nowrap">'+stt+'</td>';
      	html += '<td nowrap="nowrap"><div><a href="'+link+'" target="_blank">'+pname+'</a></div></td>';
      	if(check_is_not_vatgia){
      		html += '<td nowrap="nowrap"><div><a href="'+link+'" target="_blank">'+data.source.replace('www.', '')+'</a></div></td>';
      	}
      	html += '<td nowrap="nowrap"><span class="folow_customer" onclick="push_custormer_to_array_folow(data_all[' + key_all + ']);">Theo dõi</span></td>';
      	html += '<td><div id="list_user_'+url_md5+'" class="list_user"><a id="user_'+uid+'" onclick="create_chat_box({id:'+uid+',iPro:'+pro_id+',send_id:'+user_id+',msg:\''+ vgc_msg_default +'\'})" href="javascript:;" data-toggle="tooltip" data-placement="top" title="Click để chat với khách '+ uname +'"><i class="icon icon-right-hand"></i> Chat với '+uname+'</a></div></td>';
      	html += '<td nowrap="nowrap"><div id="userip_'+url_md5+'"><a href="'+url_ip+ip+'" target="_blank">'+ip+'</a></div></td>';
      	html += '<td nowrap="nowrap"><div>'+time+'</div></td>';
      }else{
      	html += '<td><div id="list_user_'+url_md5+'" class="list_user"><a class="sp_customer_ol" id="user_'+uid+'" onclick="create_chat_box({id:'+uid+',iPro:'+pro_id+',send_id:'+user_id+',msg:\''+ vgc_msg_default +'\'})" href="javascript:;" data-toggle="tooltip" data-placement="top" title="Click để chat với khách '+ uid +'">'+uid+'</a></div></td>';
      	html += '<td nowrap="nowrap"><span class="source"></span></td>';
      	html += '<td nowrap="nowrap" align="center"><span class="sp_ic icon_ghim" onclick="push_custormer_to_array_folow(data_all[' + key_all + ']);" title="Theo dõi khách này"></span></td>';
      	html += '<td><div><a class="linkwebsite" href="'+link+'" target="_blank">'+pname+'</a></div></td>';
      	html += '<td nowrap="nowrap"><a target="_blank" href="http://whatismyipaddress.com/ip/'+ip+'" class="lol lolip">'+ip+'</a><span class="lol">'+time+'</span></td>';
      }
   html += '</tr>';

 	return html;

} /* End function tplShowProduct */

function show_aution_vatgia(pro_id){
   $('#ovl_aution').removeClass('hide');
   $('#ifm_aution').removeClass('hide');
   $('#ifvatgia').attr('src', 'http://vatgia.com/ajax_v5/chat_ppc.php?check_top=1&amp;iData='+pro_id);
}

function vgCloseChatPPC(){
   $('#ovl_aution').addClass('hide');
   $('#ifm_aution').addClass('hide');
   $('#ifm_aution').data('id', 0);
}

function vgConfirmChatPPC(){
   
   var cus_id = parseInt($('#ifm_aution').data('id')) || 0;
   if(cus_id <= 0){  
      vgCloseChatPPC();
      return false;
   }else{
      $('#user_id_online_'+cus_id).data('auction', 0);
      
      // set lại là đã đấu giá
      var data_key   = sessionStorage.getItem('cus_'+cus_id) || '';
      if(data_key != ''){
         var datavl = JSON.parse(data_key);
         if(typeof datavl == 'object'){
            
            var sub_len = datavl.length;
            if(sub_len > 0){
               
               var array_value	= new Array;
               
               for(j = 0; j < sub_len;j++){
                  var _link   = datavl[j].link || '';
                  var _name   = datavl[j].name || '';
                  var _time   = datavl[j].time || '';
                  var _source   = datavl[j].source || '';
                  var _ip   = datavl[j].ip || '';
                  var _is_auction   = parseInt(datavl[j].auction) || 0;
                  var _pro_id    = parseInt(datavl[j].pro_id) || 0;
                  
                  var new_value	= {
                  	'link' : _link,
                  	'name' : _name,
                  	'time' : _time,
                     'source' : _source,
                     'ip' : _ip,
                     'auction' : 0,
                     'pro_id' : _pro_id
                  };
                  array_value.push(new_value);
               }   
               
               
               
               var str_vl	= JSON.stringify(array_value);
               sessionStorage.setItem('cus_'+cus_id, str_vl);            
               
            }
            
            
         }
         
                     
      }
      
      getboxchat({id:cus_id,auction : 1});
      vgCloseChatPPC();
   }
}

/*
 * Function urldecode
 */
function urldecode(str) {
   return str; //decodeURIComponent((str+'').replace(/\+/g, '%20'));
} /* End function urldecode */

/* Change background with jquery color */
jQuery.fn.flash = function (color, duration) {
   var current = this.css('backgroundColor');
   this.animate({ backgroundColor: color }, duration / 2).animate({ backgroundColor: current }, duration / 2);
};

