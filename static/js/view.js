tetra.view.register('suggestions list', {
	
	scope : 'suggestions',
	
	constr : function(me, app, _){return {
		
		events : {
			
			user : {
				
				'click' : {
					
					'.add-to-contact' : function(e, elm){
						var userId = _(elm).attr('data-user-id');
						_('i[data-user-id='+ userId +']').hide();
						app.notify('add contact', {userId : userId}); 
					},
					'.remove-from-suggestion' : function(e, elm){
						_(elm).hide();
						app.notify('remove from suggestions', {userId : _(elm).attr('data-user-id')}); 
					}
					
				},
				
				'mouseover' : {
					
					'.contact-list' : function(e, elm){
						if (!me.hasHovered) {
							me.hasHovered = true;
							app.notify('add some suggested contacts to the cache');
						} 
					}
					
				}
				
			},
			
			controller : {
				
				'show contact adding sent' : function(params){
					
					var target = _('li[data-user-id=' + params.userId + ']');
					target.find('.profile-container').fadeOut(function(){
						target.find('.confirm-addition').fadeIn();
						window.setTimeout(function(){target.slideUp(function(){target.remove();});}, me.confirmationLifeTime);
					});
					
				},
				
				'hide contact suggestion' : function(params){
					var target = _('li[data-user-id=' + params.userId + ']');
					target.slideUp(function(){target.remove();});
				},
				
				'add suggested contact' : function(params){
					app.exec('suggestItem', params, function(html) {
						_('#suggested-contacts .contact-list').append(html); 
						var target = _('li[data-user-id=' + params.userId + ']').hide(); // to allow fadeIn effect
						window.setTimeout(function(){
							target.slideUp(function(){ target.fadeIn(); });
						}, me.confirmationLifeTime);
					});
				},
				
				'show loading state' : function(params){
					var 
						parent = _('li[data-user-id=' + params.userId + ']'),
						target = parent.find('.btn')
					;
					
					if(params.cancel) {
						target.removeClass('btn-primary').addClass('btn-default btn-disabled');
					} else {
						target.addClass('btn-loading');
					}
				}
				
			}
			
		},
		
		methods : {
			
			init : function(){ me.confirmationLifeTime = 800; }
			
		}
		
	}}
	
});