(function($){

var apiPageUrl, top;

var apiKey = '66pk28q9qc8gs5w84yud6ku6',
	count = 12,
	search = 'burgerking',
	offset   = 0,
	isModal  = true,
	isFirstLoad = true,
	end = false,
	multiplier = 0,
	topContainer = 0;

var viddy = {

	el: {
		$container: $('#container'),
		$up: $('#up'),
		$down: $('#down'),
		$close: $('#close'),
		$modal: $('#modal'),
		$modalOverlay: $('#modalOverlay'),
		$items: $('.items')
	},
	init: function() {
		viddy.getData();
		viddy.events();
		viddy.el.$up.css('background-color', 'grey');
	},
	getData: function() {

		if (isFirstLoad) {
			apiPageUrl = 'http://api.viddy.com/v1/media/search?q=' + search + '&count=' + count + '&offset=' + offset + '&apikey=' + apiKey;
			//console.log(apiPageUrl);
			isFirstLoad = false;
		}

		$.ajax({
		    type: 'GET',
		    url : apiPageUrl,
		    dataType: 'jsonp',
		    success: function(data) {
		    	console.log(data);
		    	viddy.setData(data);
   			}	
		});
	},
	setData: function(data) {
		var yPos, items, caption; 

		if(data.medias.length < 12) {
			end = true;
		}
		
		$.each(data.medias, function(i, posts) {
			var imgUrl     	= this.thumbnail.url,
				captionText = this.description,
				url 	   	= this.short_url,
				viddyVideo 	= this.source,
				name 	   	= this.user.username;

		if (isModal === true) {
				items = "<div class = 'items' data-caption-text='" + captionText + "' data-video-url=" + viddyVideo + "><img src=" + imgUrl + ">" 
			} else {
				items = "<div class='items'><a href=" + url+ "target='_blank'><img src=" + imgUrl + "></a>" + "<div class='meta'>By " + name + " via <a href=" + url+ " target='_blank'>viddy</a></div><div>";
			}

			viddy.el.$container.append(items);
		
		});

		viddy.el.$down.text('down');
	},
	events: function() {
		$(window).scroll(function(){
			var $this = $(this),
				  top = $this.scrollTop();
		});

		viddy.el.$down.on('click', function() {
			viddy.clickDownEventHandler();
		});

		viddy.el.$up.on('click', function() {
			viddy.clickUpEventHandler();
		});

		if (isModal === true) {
			viddy.el.$items.live('click', function() {
				var $this = $(this),
					video 	= $this.attr('data-video-url'),
					caption = $this.attr('data-caption-text');
				viddy.modalOpenHandler(video, caption);
			});

			viddy.el.$modalOverlay.on('click', function() {
				viddy.modalCloseHandler();
			});

			viddy.el.$close.on('click', function() {
				viddy.modalCloseHandler();
			});
	 	 }
	},
	moreEventHandler: function() {
		offset += 12;
		viddy.el.$down.text('loading');
		apiPageUrl = 'http://api.viddy.com/v1/media/search?q=' + search + '&count=' + count + '&offset=' + offset + '&apikey=' + apiKey;
		viddy.getData();
	},
	clickUpEventHandler: function() {
		if(viddy.el.$container.position().top < 0) {
			viddy.el.$down.css('background-color', '#fff');
			viddy.el.$container.animate({
			top: '+=800',
			easing: 'easeInOutExpo'
			}, 500, function() {
				viddy.el.$container.stop(true, true);
			});
		}

		if (viddy.el.$container.position().top === -800) {
			viddy.el.$up.css('background-color', 'grey');
		}
	},
	clickDownEventHandler: function() {
		if (!end) {
			multiplier += 1;
			viddy.moreEventHandler();
			viddy.el.$up.css('background-color', '#fff');
			viddy.el.$container.animate({
				top: '-=800',
				easing: 'easeInOutExpo'
			}, 500, function() {
				viddy.el.$container.stop(true, true);
				viddy.checkEnd();
			});
			topContainer = (multiplier * -800);
			lastPage = (topContainer + 800);
			//console.log(topContainer);
			return topContainer;
		}

		if (end && viddy.el.$container.position().top === lastPage) {
			viddy.el.$down.css('background-color', 'grey');
		}

		if (end && viddy.el.$container.position().top > topContainer) {
			//console.log(viddy.el.$container.position().top);
			viddy.el.$up.css('background-color', '#fff');
			viddy.el.$container.animate({
				top: '-=800',
				easing: 'easeInOutExpo'
			}, 500, function() {
				viddy.el.$container.stop(true, true);
			});
		}	
	},
	checkEnd: function() {
		if (end && viddy.el.$container.position().top === topContainer){
			viddy.el.$down.css('background-color', 'grey');	
		}
	},
	modalOpenHandler: function(video, caption) {
		var scrollTop = $(window).scrollTop();
		viddy.el.$modal.css('top', scrollTop);

		$('#loader').show();
		viddy.el.$modalOverlay.fadeIn(100, function() {
			viddy.el.$modal.fadeIn(200);
		});

		viddy.el.$modal.find('#modalContent').append("<div class='vid-container'><iframe src=" + video + " height='600px' width='600px allowtransparency='true' frameBorder='0'></iframe></div>");
		viddy.el.$modal.find('#caption').append('<p>' + caption + '</p>');


		viddy.el.$modal.find('video').load(function() {
			viddy.setContent();
		});
	},
	modalCloseHandler: function() {
		//document.getElementById("videoTest").pause();
		viddy.el.$modal.fadeOut(300, function() {
			viddy.el.$modalOverlay.fadeOut(100);
			$('.vid-container').remove();
			$('#caption').find('p').remove();
			$('#loader').show();
		});

	},
	setContent: function() {
		$('#loader').hide();
		$('.vid-container').hide();
	}
}

viddy.init();

})(jQuery);