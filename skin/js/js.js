		$(document).ready(function() {
		$('.shubiao a').click(function(e){
				$.fn.fullpage.moveSectionDown();
			}); 
			$('#fullpage').fullpage({
				
				menu: '#myMenu',
				lockAnchors: false,
				anchors:['s1', 's2','s3', 's4'],
				navigation: true,
				navigationPosition: 'left',
				navigationTooltips: ['首页', '奢品回收','回收流程', '关于我们'],
		
				css3: false,
				loopBottom: true,

				
				//Design
				controlArrows:false,
				verticalCentered: false,
				resize : true,
				paddingTop: '6%',
				fixedElements: 'top_nav',
						
				verticalCentered: false
			});
		});
