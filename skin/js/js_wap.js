$(document).ready(function() {
		$(window).scroll(function(){
			$(window).scrollTop() > 300 ?  $(".top").addClass("add") : $(".top").removeClass("add");
		})

});
	var menuState = false
	function MM_channelMenu() {
		if (menuState) {
			$("html").removeClass("MM_channelMenu_move");
			menuState = false;
		}
		else {
			$("html").addClass("MM_channelMenu_move");
			menuState = true;
		}
	}
	
	function MM_tiaozhuan(this1,obj) {
	var navTop1 = $(".pp").offset().top - $(".top").height() + "px";
	var navTop2 = $(".pp2").offset().top - $(".top").height() + "px";
	var navTop3 = $(".about").offset().top - $(".top").height() + "px";
	var navTop4 = $(".lx").offset().top - $(".top").height() + "px";
		$(window).scroll(function(){
			var navTop1 = $(".pp").offset().top + $(".top").height();
			var navTop2 = $(".pp2").offset().top + $(".top").height();
			var navTop3 = $(".about").offset().top + $(".top").height();
			var navTop4 = $(".lx").offset().top + $(".top").height();
		})
		if (obj==0) {
			$("body").animate({scrollTop: "0px"}, 500);
			MM_channelMenu();
		}else if(obj==1){
			$("body").animate({scrollTop: navTop1}, 500);
			MM_channelMenu();
		}else if(obj==2){
			$("body").animate({scrollTop: navTop2}, 500);
			MM_channelMenu();
		}else if(obj==3){
			$("body").animate({scrollTop: navTop3}, 500);
			MM_channelMenu();
		}else if(obj==4){
			$("body").animate({scrollTop: navTop4}, 500);
			MM_channelMenu();
		}
		$(".leftmenu ul li").removeClass("on");
		$(this1).addClass("on");
	}	
	
	var menuState1 = false
	function MM_tanchu() {
		if (menuState1) {
			$("html").removeClass("MM_tanchu");
			menuState1 = false;
		}
		else {
			$("html").addClass("MM_tanchu");
			menuState1 = true;
		}
	}
	
	
	
	
	
	