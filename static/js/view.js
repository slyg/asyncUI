tetra.view.register('suggestions list', {
	
	scope : 'suggestions',
	
	constr : function(me, app, _){return {
		
		events : {
			
			user : {
				
				'click' : {
					
					'.add-to-contact' : function(e, elm){app.notify('add contact', {userId : _(elm).attr('data-user-id')});},
					'.remove-from-suggestion' : function(e, elm){app.notify('remove from suggestions', {userId : _(elm).attr('data-user-id')});}
					
				},
				
				'mouseover' : {
					
					'#suggested-contacts' : function(e, elm){
						if (!me.hasHovered) {
							me.hasHovered = true;
							app.notify('cache some suggested contacts');
						} 
					}
					
				}
				
			},
			
			controller : {
				
				'show contact adding sent' : function(params){
					
					var target = _('li[data-user-id=' + params.userId + ']');
					target.find('.profile-container').fadeOut('fast', function(){
						target.find('.confirm-addition').fadeIn('fast');
						window.setTimeout(function(){target.slideUp('slow', function(){target.remove();});}, me.confirmationLifeTime);
					});
					
				},
				
				'hide contact suggestion' : function(params){
					var target = _('li[data-user-id=' + params.userId + ']');
					target.slideUp('fast', function(){target.remove();});
				},
				
				'add suggested contact' : function(params){
					app.exec('suggestItem', params, function(html) {
						_('#suggested-contacts').append(html); 
						var target = _('li[data-user-id=' + params.userId + ']');
						window.setTimeout(function(){target.slideUp('fast', function(){target.fadeIn();});}, me.confirmationLifeTime);
					});
				},
				
				'show loading state' : function(params){
					var target = _('li[data-user-id=' + params.userId + ']').find('.btn');
					
					if(params.cancel) {
						target.removeClass('btn-primary').addClass('btn-default btn-disabled');
					} else {
						target.addClass('btn-loading');
					}
				}
				
			}
			
		},
		
		methods : {
			
			init : function(){ 
				me.hasHovered = false;
				me.confirmationLifeTime = 1000;
			}
			
		}
		
	}}
	
});

$(function(){
	
	$('body').append('<script id="tmpl_suggestItem" type="text/html"> <li class="divider-after rc pbn" data-user-id="{%=userId %}" style="display:none;"> <div class="confirm-addition tac" style="display:none;">Demande envoy&eacute;e &agrave; {%=fullName %}</div> <div class="profile-container pam"> <div class="gr"> <div class="gu gu-4of5"> <img width="40"  height="40" class="img avatar pointer"  src="http://viadeo.github.com/tetra-ui/img/avatars/avatar-n-40x40.png" style="background-color:{%=color%};" /> <span class="bd plm"> <h5 class="pbxs mbxs"><a href="/">{%=fullName%}</a></h5> <p class="title pbxs mbxs">{%=headline%}</p> <a class="btn btn-primary add-to-contact" title="Add to my contacts" data-user-id="{%=userId%}"><span>Ajouter &agrave; mes contacts</span></a> </span> </div> <div class="gu gu-last tar"> <span class="tooltip tooltip-right"> <i class="vicon pointer remove-from-suggestion" data-user-id="{%=userId%}">&times;</i> <span class="tooltip-content">Ne plus proposer</span> </span> </div> </div> </div> </li> </script>');
	
});