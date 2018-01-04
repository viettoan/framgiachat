function responsiveMobileMenu() {
	$('.rmm').each(function() {
		$(this).children('ul').addClass('rmm-main-list'); // mark main menu list
		var $style = $(this).attr('data-menu-style'); // get menu style
		if (typeof $style == 'undefined' || $style == false) {
			$(this).addClass('graphite'); // set graphite style if style is not defined
		} else {
			$(this).addClass($style);
		} /* 	width of menu list (non-toggled) */
		var $width = 0;
		$(this).find('ul li').each(function() {
			$width += $(this).outerWidth();
		});
		// if modern browser
		if ($.support.leadingWhitespace) {
			//$(this).css('max-width', $width * 1.05 + 'px');
		}
		//
		else {
			//$(this).css('width', $width * 1.05 + 'px');
		}
        return;
	});
}

function getMobileMenu() { /* 	build toggled dropdown menu list */
	$('.rmm').each(function() {
		var menutitle = $(this).attr("data-menu-title");
		if (menutitle == "") {
			menutitle = "Menu";
		} else if (menutitle == undefined) {
			menutitle = $('#logo').html();
		}
		var $menulist = $(this).children('.rmm-main-list').html();
		var $menucontrols = "<div class='rmm-toggled-controls'><div class='rmm-toggled-title'>" + menutitle + "</div><div class='rmm-button'><img src='images/icon_show_menu.png' style='width: 40px;' /></div></div>";
		$(this).prepend("<div class='rmm-toggled rmm-closed'  id='open_menu'>" + $menucontrols + "<ul>" + $menulist + "</ul></div>");

        return;
	});
}

function adaptMenu() { /* 	toggle menu on resize */
	$('.rmm').each(function() {
		var $width = $(this).css('max-width');
		$width = $width.replace('px', '');
		if ($(this).parent().width() < $width * 1.05) {
			$(this).children('.rmm-main-list').hide(0);
			$(this).children('.rmm-toggled').show(0);
		} else {
			$(this).children('.rmm-main-list').show(0);
            $('.logo').css('display','block');
			$(this).children('.rmm-toggled').hide(0);
		}
	});
}
$(function() {
	responsiveMobileMenu();
	getMobileMenu();
	adaptMenu(); /* slide down mobile menu on click */
	$('.rmm-toggled-controls .rmm-button').click(function() {
		if ($('.rmm-toggled').is(".rmm-closed")) {
			$('.rmm-toggled').find('ul').stop().show(300);
            //$(this).find('ul').css('display','block');
			$('.rmm-toggled').removeClass("rmm-closed");
            //$(this).find('.rmm-toggled-controls').css('display','none');

		} else {
			$('.rmm-toggled').find('ul').stop().hide(300);
			$('.rmm-toggled').addClass("rmm-closed");
            //$(this).find('ul').css('display','none');
		}
	});
}); /* 	hide mobile menu on resize */
$(window).resize(function() {
	adaptMenu();
});

/*global jQuery */
/*!
* FitText.js 1.2
*
* Copyright 2011, Dave Rupert http://daverupert.com
* Released under the WTFPL license
* http://sam.zoy.org/wtfpl/
*
* Date: Thu May 05 14:23:00 2011 -0600
*/
(function($) {
	$.fn.fitText = function(kompressor, options) {
		// Setup options
		var compressor = kompressor || 1,
			settings = $.extend({
				'minFontSize': Number.NEGATIVE_INFINITY,
				'maxFontSize': Number.POSITIVE_INFINITY
			}, options);
		return this.each(function() {
			// Store the object
			var $this = $(this);
			// Resizer() resizes items based on the object width divided by the compressor * 10
			var resizer = function() {
				$this.css('font-size', Math.max(Math.min($this.width() / (compressor * 10), parseFloat(settings.maxFontSize)), parseFloat(settings.minFontSize)));
			};
			// Call once to set.
			resizer();
			// Call on resize. Opera debounces their resize by default.
			$(window).on('resize.fittext orientationchange.fittext', resizer);
		});
	};
})(jQuery);

function close_accordion_section(elm_title,elm_content) {
    $(elm_title).removeClass('active');
    $(elm_title).find('span').removeClass('minus');
    $(elm_title).find('span').addClass('plus');
    $(elm_content).slideUp(300).removeClass('open');
}

$(document).ready(function($){
	$(window).scroll(function() {
	   if($(window).width() >= 1200){
        	if ($(window).scrollTop() > 82) {
                $(".fix_menu").css({"position": "fixed","top":"0"});
        	}
        	else {
                $(".fix_menu").css({"position": "inherit"});
        	}
        }
        if($(window).width() > 640 && $(window).width() < 1200){
        	if ($(window).scrollTop() > 138) {
                $(".fix_menu_md").css({"position": "fixed","background-color": "white", "width": "100%","z-index": "100","overflow": "hidden"});
        	}
        	else {
                $(".fix_menu_md").css({"position": "inherit"});
        	}
        }
    });
});

function formatNumber(nStr){nStr+='';var x=nStr.split(',');var x1=x[0];var x2='';var x2=x.length>1?','+x[1]:'';var rgx=/(\d+)(\d{3})/;while(rgx.test(x1)){x1=x1.replace(rgx,'$1'+'.' + '$2');}return x1+x2;}

$(function(){
    $('.trial .nav_1 li').each(function() {
        var txt = $(this).html();
        $(this).html('<img src="images/BG.png" style="margin-bottom: 4px;margin-right:10px;" />'+txt);
    });
    
    $('.trial .nav_1 li.active').find('img').remove();
    var txt = $('.trial .nav_1 li.active').html();
    $('.trial .nav_1 li.active').html('<img src="images/BG_01.png" style="margin-bottom: 4px;margin-right:10px;" />'+txt);
    
    $('.trial .nav_1 li').click(function() {
        $('.trial .nav_1 li').removeClass('active');
        $('.trial .nav_1 li').each(function() {
            $(this).find('img').remove();
            var txt = $(this).html();
            $(this).html('<img src="images/BG.png" style="margin-bottom: 4px;margin-right:10px;" />'+txt);
        });
        $(this).find('img').remove();
        $(this).addClass('active');
        var txt = $(this).html();
        $(this).html('<img src="images/BG_01.png" style="margin-bottom: 4px;margin-right:10px;" />'+txt);
    });
})

function round_nghindong(sotien){
	var new_money = 0;
	if(sotien <= 0 || sotien > 100000000000) return new_money;
	new_money	=  Math.round(sotien/1000)*1000;
	return new_money;
}

function pricing(a,b,c,sale){
    $(function(){
        $('#change021').text(formatNumber(round_nghindong(a - (a*c)))  + ' đ');
        $('#change022').text(formatNumber(round_nghindong(b - (b*c)))  + ' đ');
        a = a - (a * sale);
        b = b - (b * sale);

        $('#change01').text(formatNumber(round_nghindong(a - (a*c)))  + ' đ');
        $('#change02').text(formatNumber(round_nghindong(b - (b*c))) + ' đ');
    });
}
