/* ===================================== */
/* >>>>>>>> VARIABLES FOR HOME ADS:
	home_ad_duration -> time in ms how long each ad is displayed
	number_of_ads -> don't change, gets updated automatically
	home_ad_stepper -> don't change; used to keep track of which ad is shown
/* ===================================== */
var home_ad_duration = 10000;
var number_of_ads;
var home_ad_stepper = 0;

// var ww: window width;
var ww = $(window).width();
var dh = $(document).height();
var fh = $("body > footer").height();
var wh = $(window).height();
var ly = 0;
var ticking = false;

var scroll_timeout = 2000;
var scroll_int;

$(document).ready(function() {
	
	/* ===================================== */
	/* >>>>>>>> PRODUCT VIEW LIST/GRID
	/* ===================================== */
	$("div#view a").click(function(a) {
		a.preventDefault();
		$("div#view a").removeClass("active").addClass("inactive");
		$(this).removeClass("inactive").addClass("active");
		
		if($(this).hasClass("grid")) {
			$("div.prod_grid").removeClass("list");
		} else {
			$("div.prod_grid").addClass("list");
		}
	});
	
	
	/* ===================================== */
	/* >>>>>>>> ACCOUNT
	/* ===================================== */
	$("a#edit_information, a#cancel_edit").click(function(a) {
		a.preventDefault();
		$("div#edit_information, div#current_info").toggleClass("hidden");
		$("h2 a#edit_information").toggleClass("open");
	});
	
	$("a#edit_account, a#cancel_account").click(function(a) {
		a.preventDefault();
		$("div#edit_account, div#current_account").toggleClass("hidden");
		$("h2 a#edit_account").toggleClass("open");
	});
	
	/* ===================================== */
	/* >>>>>>>> FILTERS
	/* ===================================== */
	$("section#filters ul#categories > li > a").click(function(a) {
		a.preventDefault();
		$(this).parent().toggleClass("open");
	});
	
	$("div#view_opts a#filter").click(function(a) {
		a.preventDefault();
		$("body").addClass("filters_open");
		$("body > header").removeClass("menu_open");
		$("body.filters_open div#blackout").click(function() {
			$("body").removeClass("filters_open");
		});
		
		$("body, html").animate({
			scrollTop: 210
		}, 'slow');
	});
	
	$("section#filters a#close_filter").click(function(a) {
		a.preventDefault();
		$("body").removeClass("filters_open");
	});

	/* ===================================== */
	/* >>>>>>>> FOOTER 'back to top'-LINK
	/* ===================================== */
	$("footer div#back_to_top a").click(function(a) {
		a.preventDefault();
		$("body, html").animate({scrollTop: 0}, 'slow');
	});
	
	/* ===================================== */
	/* >>>>>>>> FANCYBOX
	/* ===================================== */
	$(".various").fancybox({
		maxWidth	: 1280,
		maxHeight	: 720,
		fitToView	: false,
		width		: '90%',
		height		: '70%',
		maxWidth	: 1400,
		autoSize	: false,
		closeClick	: false,
		openEffect	: 'none',
		closeEffect	: 'none'
	});
	
	
	/* ===================================== */
	/* >>>>>>>> ADD TO CART EVENTS
	/* ===================================== */
	
	$("form.add_to_cart button.more").click(function(a) {
		a.preventDefault();
		update_product_amount(1);
	});
	
	$("form.add_to_cart button.less").click(function(a) {
		a.preventDefault();
		update_product_amount(-1);
	});
	
	
	
	/* ===================================== */
	/* >>>>>>>> HEADER MOUSE OVER:
	/* ===================================== */
	$("header nav ul#main a").hover(function() {
		$("header").addClass("open");
	});
	$("header").hover(function() {
		
	}, function() {
		if($("header").hasClass("open")) {
			$("header").removeClass("open").addClass("trans");
			setTimeout(function() {
				$("header").removeClass("trans");
			}, 500);
		}
	});
	
	// Entire shopping bag clickable:
	$("header section#shopping_bag").click(function(a) {
		a.preventDefault();
		window.location = $(this).find("a").attr("href");
	});
	
	// Responsive menu
	
	$("header nav ul#mobile a.menu").click(function(a) {
		a.preventDefault();
		$("body > header").toggleClass("menu_open");
	})
	
	/* ===================================== */
	/* >>>>>>>> PROD VERSIONS HOVER:
	/* ===================================== */

	$("section#versions ul li").each(function() {
		$(this).attr("title", "");
		$(this).tooltip({ content: '<img src="' + $(this).find("img").attr("src") + '" />', tooltipClass: "version_tooltip" });
	});
	
	/* ===================================== */
	/* >>>>>>>> CART & CHECKOUT AUTOMATION
	/* ===================================== */
	
	$("section#cart table td button.info").each(function() {
		$(this).tooltip({content: $(this).parent().find("div.info").html(), tooltipClass: "stock_tooltip" });
	});
	
	$("section#cart table td button.sub_info").each(function() {
		$(this).tooltip({content: $(this).parent().parent().find("div.info").html(), tooltipClass: "stock_tooltip" });
	});
	
	$("section#versions ul li").click(function() {
		$("section#versions li.selected").removeClass("selected");
		$(this).addClass("selected");
		$("span.version").html($(this).find("span").html());	
	});
	
	$("section#cart table button.more").click(function(a) {
		a.preventDefault();
		update_cart_quantity($(this), 1);
	});
	
	$("section#cart table button.less").click(function(a) {
		a.preventDefault();
		update_cart_quantity($(this), -1);
	});
	
	$("input#factuuradres").change(function() {
		if(this.checked) {
			$("div#options div#factuuradres").removeClass("show");
		} else {
			$("div#options div#factuuradres").addClass("show");
		}
	});
	
	$("input#register").change(function() {
		if(!this.checked) {
			$("div#options div#password").removeClass("show");
		} else {
			$("div#options div#password").addClass("show");
		}
	});
	
	$("div#method input[name='method']").change(function() {
		$("div#method label").removeClass("error");
		if($(this).val() == "ideal") {
			$("div#ideal_bank").removeClass("hidden");
		} else {
			$("div#ideal_bank").addClass("hidden");
		}
	});
	
	$("div#ideal_bank select").change(function() {
		if($(this).val() != 0) {
			$("div#ideal_bank").removeClass("error");
		}
	});
	

	if($("div#datepicker").length != 0) {
		var today = new Date();
		$("div#datepicker").datepicker({
			minDate: today,
			maxDate: 7,
			beforeShowDay: function(date) {
		        var day = date.getDay();
		        return [(day != 0), ''];
		    },
		    onSelect: function(dateTxt, inst) {
			    $("input#afleverdag").val(dateTxt);
		    }
		}, $.datepicker.regional['nl']);
		
		$("div#datepicker").datepicker("setDate", 1);
	}

	
	/* ===================================== */
	/* >>>>>>>> PROD DETAIL GALLERY
	/* ===================================== */
	
	$("div#viewport ul#thumbs li img").click(function() {
		$("div#viewport ul#thumbs li.selected").removeClass("selected");
		$(this).parent().addClass("selected");
		$("div#viewport img#main").attr("src", $(this).attr("data-big-image"));
		$("body, html").animate({scrollTop: $("img#main").offset().top - 12 }, 'slow');
	});
	
	/* ===================================== */
	/* >>>>>>>> HOMEPAGE AD SLIDER + TIMER
	/* ===================================== 
	
	update_home_ads();
	home_ad_interval = setInterval(update_home_ads, home_ad_duration); */
	
	$("section#home_ads li a").click(function(a) {
		a.preventDefault();
		jump_to_home_ad($(this).parent().index());
		var img_w = $("section#home_ads article").outerWidth() + 100;
		var tar_left = 'translate3d(' + (($(this).parent().index() - 1) * -img_w) + 'px, 0px, 0px)';
		
		$("section#home_ads div.swiper-wrapper").css({
			transform: tar_left,
			'transition-duration': '1s',
			'-webkit-transition-duration': '1s',
			'-webkit-transform': tar_left
		});
	});
	
	var ads = new Swiper('.swiper-container', {
		speed: 400,
		spaceBetween: 100,
		onSlideChangeEnd: function(a) { update_ads(a.container, a.activeIndex); }
	});
	
	/* ===================================== */
	/* >>>>>>>> WINDOW RESIZE EVENT
	/* ===================================== */
	$(window).resize(function() {
		update_dimensions();
	});
	
	/* ===================================== */
	/* >>>>>>>> WINDOW SCROLL EVENT
	/* ===================================== */
	$(window).scroll(function() {
		requestTick();
	});
	
	update_dimensions();
		
});


function update_cart_quantity(target, change) {
	var tar = target.parent().find("input.amount");
	var old_amount = Number(tar.val());
	var new_amount = old_amount + change;
	if(new_amount < 0) {
		new_amount = 0;
	}
	
	if(new_amount == 0) {
		target.parent().find("a.del").addClass("show");
	} else {
		target.parent().find("a.del").removeClass("show");
	}
	
	tar.val(new_amount);
}


function requestTick() {
	if(!ticking) {
		ticking = true;
		requestAnimFrame(update);
	}
}

function update() {
	// magic
	ly = get_scroll_y();
	dh = $(document).height();
	
	if((ly + wh) > dh - fh) {
		// footer is in view!
		$("body").addClass("footer_in_view");
	} else {
		$("body").removeClass("footer_in_view");
	}
	
	$("body").addClass("scrolling");
	clearInterval(scroll_int);
	scroll_int = setInterval(function() {
		$("body").removeClass("scrolling");
	}, scroll_timeout);
	
	ticking = false;
}


function update_product_amount(dif) {
	var old_amount = Number($("form.add_to_cart input.amount").val());
	var new_amount = old_amount + dif;
	if(new_amount < 1) {
		new_amount = 1;
	}
	
	$("form.add_to_cart input.amount").val(new_amount);
}

function update_ads(container, index) {
	jump_to_home_ad(index + 1);
}

function update_dimensions() {
	ww = $(window).width();
	wh = $(window).height();
	fh = $("body > footer").height();

	if(ww <= 490) {
		$("div.prod_grid").removeClass("list");
	}
	
	/* ===================================== */
	/* >>>>>>>> HOME ADS:
	/* ===================================== */
	if((ww * .96) < 1400) {
		/*
		$("section#home_ads ul").css({
			top: (300 / 1400) * (ww * .96)
		});
		
		$("section#home_ads").css({
			height: (370 / 1400) * (ww * .96)
		});*/
	} else {
		/*
		$("section#home_ads ul").css({
			top: 300
		});
		*/
		$("section#home_ads").css({
			height: 370
		});
	}
}


function update_home_ads() {
	if(number_of_ads === undefined) {
		number_of_ads = $("section#home_ads li:not(#progress)").length;
	}
	var curr = home_ad_stepper % number_of_ads;
	
	jump_to_home_ad(curr + 1);

}

function jump_to_home_ad(i) {
	var tar_w = i * (100 / number_of_ads);
	
	$("li#progress div#bar").css({width: ((i - 1) * (100 / number_of_ads)) + "%"});

	$("section#home_ads li.here").removeClass("here");
	$("section#home_ads ul li:nth-child(" + (i + 1) + ")").addClass("here");
	//$("section#home_ads article:nth-child(" + i + ")").addClass("here");
	$("li#progress div#bar").stop().animate({width: tar_w + "%"}, home_ad_duration);
	
	home_ad_stepper = i;
}

// =======
// = RAF =
// =======
window.requestAnimFrame = (function(){
  return  window.requestAnimationFrame       ||
          window.webkitRequestAnimationFrame ||
          window.mozRequestAnimationFrame    ||
          function( callback ){
            window.setTimeout(callback, 1000 / 60);
          };
})();

function get_scroll_y() {
	var scrOfY = 0;
	if (typeof(window.pageYOffset) == 'number') {
		//Netscape compliant
		scrOfY = window.pageYOffset;
	} else if (document.body && document.body.scrollTop) {
		//DOM compliant
		scrOfY = document.body.scrollTop;
	} else if (document.documentElement && document.documentElement.scrollTop) {
		//IE6 standards compliant mode
		scrOfY = document.documentElement.scrollTop;
	}
	return scrOfY;
}