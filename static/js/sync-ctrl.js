tetra.controller.register('suggestions controller', {
	
	scope : 'suggestions',
	
	use : ['g/contact', 'g/suggestion'],
	
	constr : function(me, app, page, orm){return {
	
		events : {
			
			view : {
			
				'add contact' : function(params){ 
				
					// send request to server
					orm('contact').create({ userId : params.userId }).save();
					
					// ask view to show loading state
					app.notify('show loading state', { userId : params.userId });
					
				},
				
				'remove from suggestions' : function(params){ 
				
					// send request to server
					orm('suggestion').create({ userId : params.userId }).remove();
					
					// ask view to show loading state
					app.notify('show loading state', { userId : params.userId, cancel : true });
					
				},
				
				'cache some suggested contacts' : function(){ orm('suggestion').fetch({}); }
				
			},
			
			model : {
				
				'contact' : {
					'save'		: function(obj){  },
					'saved'		: function(obj){ 
						me.manageStack();
						app.notify('show contact adding sent', { userId : obj.get('userId') }); 
					}
				},
				
				'suggestion' : {
					'delete'	: function(obj){  },
					'append'	: function(col){ me.suggestionsStack = me.suggestionsStack.concat(col); },
					'deleted'	: function(obj){
						me.manageStack();
						// ask view to remove contact suggestion
						app.notify('hide contact suggestion', { userId : obj.get('userId') });
					},
				}
				
			}
			
		},
		
		methods : { 
			init : function(){
				
				me.suggestionsStack = [];
				
				me.currentIserId = '';
				
				me.manageStack = function(){
					
					// When new contact to be added,
					// add a new item from suggestions stack to the view,
					// and remove it from the stack
					var newSuggestion = me.suggestionsStack.pop();
					app.notify('add suggested contact', newSuggestion.getAll());
					
					// fill in contacts suggestions stack if nearly empty (<3 items)
					if(me.suggestionsStack.length < 3) orm('suggestion').fetch({});
					
				}
				
			}
		}
	
	}}
	
});
