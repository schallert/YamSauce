define(['js/backbone','js/models/messageModel'],function(Backbone,Message){
	
	var MessageView = Backbone.View.extend({
		className : "messageView",
		initialize : function(group) {
			this.group = group;
		},
		render : function() {
			
		}
	});

	return MessageView;
});