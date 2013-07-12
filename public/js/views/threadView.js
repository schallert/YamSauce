var ThreadView = Backbone.View.extend({
	className : "threadView",
	initialize : function(params) {
		this.thread = params.thread;
		this.template = $("#thread-template");
	},
	render : function(elem) {

		var threadStarter = this.thread.threadStarter;
		var starterId = threadStarter.id;
		this.data = {
			avatar: threadStarter.user.mugshot_url
			, from: threadStarter.user.full_name
			, to: "Bob"
			, "time-stamp": threadStarter.timestamp
			, content: threadStarter.text.rich
			, comments: this.thread.replies.models
			, likes: threadStarter.likes
			, starterId: starterId
		};
		
		var el = Mustache.render(this.template.html(),this.data);
		elem.append(el);

		// WHEN YOU CLOSE THINGS THEY CLOSE!
		$(".close").unbind("click");
		$(".close").click(function(){
		  // Super lame, I know, but hackathon so whatever
		  console.log("Closing");
		  var that = $(".active")

		  that
		  		.find(".close").hide().end()
		  		.find(".comments")
		  			.animate({marginLeft: "-50%"}, 300, function(){
		  				that
		  						.removeClass("active pure-u-1").addClass("pure-u-1-2")
		  				    .find(".message")
		  				      .removeClass("pure-u-1-2")
		  				    .end().find(".meta-comments")
		  				      .show()
		  				    .end()
		  				    .find(".close")
		  				      .hide()
		  				    .end()
		  				    .height("auto");

		  				    $(".shadowbox").fadeOut(300, function(){
		  				      $(".shadowbox").remove();
		  				    });
		  				    $(".group-threads").masonry();
		  			});
		});

		// WHEN YOU CLICK MESSAGES THEY COME INTO FOCUS HELL YEAH.
		$(".message").click(function() {


			//TODO: ok this is really, really gross and hackey and I'm sorry
		  if($(this).parent().hasClass("active"))
		    return;

		  var shadow = $("<div />").addClass("shadowbox").hide();

		  $("body").append(shadow);
		  $(".shadowbox").fadeIn();

		  var current_height = $(this).parent().height();

		  var that = $(this).parent();
		  that.find(".meta-comments").hide();

		  that
		    .addClass("active");
		  $(".active").animate({left: "0"}, function(){
		  	  that
		  	    .removeClass("pure-u-1-2")
		  	    .find(".comments").show()
		  	    .animate({marginLeft: "0%", left: "0px"}, 400, function(){
		  		    that
		  		      .find(".close").show().end()
		  		      .siblings().removeClass("active");
		  		    $(this).addClass("pure-u-1-2");
		  	    });
		  });
		});

		$("#replySubmitButton"+starterId).click(function () {
			var text = $("#replyText"+starterId).val();
			if (text) {
				SauceUtil.postGroupMessage(threadStarter.group_id, threadStarter.id, text, function (res) {
					console.log(res);
				});
			}
			$("#replyText"+starterId).val("");
		});

	} // end render function
});