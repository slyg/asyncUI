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
					
				},
				
				'cache some suggested contacts' : function(){ orm('suggestion').fetch({}); }
				
			},
			
			model : {
				
				'contact' : {
					'save'		: function(obj){ me.manageStack(); }
				},
				
				'suggestion' : {
					'delete'	: function(obj){ me.manageStack(); },
					'append'	: function(col){ me.suggestionsStack = me.suggestionsStack.concat(col); }
				}
				
			}
			
		},
		
		methods : { 
			init : function(){
				
				me.suggestionsStack = [];
				
				me.manageStack = function(){
					
					// When new contact to be added,
					// add a new item from suggestions stack to the view,
					// and remove it from the stack
					
					function renderSuggestions(){
					
						var newSuggestion = me.suggestionsStack.pop();
						app.notify('add suggested contact', newSuggestion.getAll());
						
						// fill in contacts suggestions stack if nearly empty (<3 items)
						if(me.suggestionsStack.length < 3) orm('suggestion').fetch({});
					}
					
					if (me.suggestionsStack.length > 0) {
						renderSuggestions()
					} else {
						orm('suggestion').fetch({}, renderSuggestions);
					}
					
				}
				
			}
		}
	
	}}
	
});