tetra.model.register('suggestion', {
	
	req : {
		fetch 	: { url : '/r/suggestions/' },
		save 	: { url : '/r/suggestions/' },
		del 	: { url : '/r/suggestions/' }
	},
	
	attr : { userId : '', fullName : '', headline : '', color: '' },
	
	methods : function(attr) { return {};}
	
});

tetra.model.register('contact', {
	
	req : {
		fetch 	: { url : '/r/contacts/' },
		save 	: { url : '/r/contacts/' },
		del 	: { url : '/r/contacts/' }
	},
	
	attr : { userId : '' },
	
	methods : function(attr) { return {};}
	
});

tetra.controller.register('suggestions controller', {
	
	scope : 'suggestions',
	
	use : ['g/contact', 'g/suggestion'],
	
	constr : function(me, app, page, orm){return {
	
		events : {
			
			view : {
			
				'add contact' : function(params){ 
					// send request to server
					orm('contact').create({ userId : params.userId }).save(); 
					// ask view to promise its gonna be done
					app.notify('show contact adding sent', { userId : params.userId });
				},
				
				'remove from suggestions' : function(params){ 
					// send request to server
					orm('suggestion').create({ userId : params.userId }).remove(); 
					// ask view to remove contact suggestion
					app.notify('hide contact suggestion', { userId : params.userId });
				}
				
			},
			
			model : {
				
				'contact' : {
					
					'create'	: function(obj){console.log('UI created contact | ' + obj);},
					'saved'		: function(obj){console.log('Server saved contact | ' + obj);}
					
				},
				
				'suggestion' : {
					
					'create'	: function(obj){console.log('UI created suggestion | ' + obj);},
					'delete'	: function(obj){console.log('UI removed suggestion | ' + obj);},
					'deleted'	: function(obj){console.log('Server deleted suggestion | ' + obj);},
					
				}
				
			}
			
		},
		
		methods : { 
			init : function(){
				
				window.orm = orm;
				
			}
		}
	
	}}
	
});

tetra.view.register('suggestions list', {
	
	scope : 'suggestions',
	
	constr : function(me, app, _){return {
		
		events : {
			
			user : {
				
				'click' : {
					
					'.add-to-contact' : function(e, elm){app.notify('add contact', {userId : _(elm).attr('data-user-id')});},
					'.remove-from-suggestion' : function(e, elm){app.notify('remove from suggestions', {userId : _(elm).attr('data-user-id')});}
					
				}
				
			},
			
			controller : {
				
				'show contact adding sent' : function(params){
					
					var confirmationLifeTime = 3000; // seconds
					var target = _('li[data-user-id=' + params.userId + ']');
					target.find('.profile-container').fadeOut('fast', function(){
						target.find('.confirm-addition').fadeIn('fast');
						window.setTimeout(function(){target.slideUp('slow', function(){target.remove();});}, confirmationLifeTime);
					});
					
					
				},
				
				'hide contact suggestion' : function(params){
					var target = _('li[data-user-id=' + params.userId + ']');
					target.slideUp('fast', function(){target.remove();});
				}
				
			}
			
		}
		
	}}
	
});