tetra.controller.register('suggestions controller', {
	
	scope : 'suggestions',
	
	use : ['g/contact', 'g/suggestion'],
	
	constr : function(me, app, page, orm){return {
	
		events : {
			
			view : {
			
				'add contact' : function(params){ 
				
					if(me.itemHasExpired(params.userId)) return false;
				
					// send request to server
					orm('contact').create({ userId : params.userId }).save();
					
					// ask view to show its gonna be done
					app.notify('show contact adding sent', { userId : params.userId });
					
				},
				
				'remove from suggestions' : function(params){ 
				
					if(me.itemHasExpired(params.userId)) return false;
				
					// send request to server
					orm('suggestion').create({ userId : params.userId }).remove();
					 
					// ask view to remove contact suggestion
					app.notify('hide contact suggestion', { userId : params.userId });
					
				},
				
				'add some suggested contacts to the cache' : function(){ orm('suggestion').fetch({}); }
				
			},
			
			model : {
				'contact' : {
					'save'		: function(obj){ me.manageSuggestionsStack(); }
				},
				'suggestion' : {
					'delete'	: function(obj){ me.manageSuggestionsStack(); },
					'append'	: function(col){ me.suggestionsStack = me.suggestionsStack.concat(col); }
				}
			}
			
		},
		
		methods : { 
			init : function(){
				
				me.suggestionsStack = [];
				me.expiredItems		= {};
				
				me.manageSuggestionsStack = function(){
					
					// When new contact suggestion has to be added to the view,
						// if suggestions stack ist empty fetch, then Render
						// else Render immediately
					
					if (me.suggestionsStack.length == 0) {
						orm('suggestion').fetch({}, me.renderSuggestion);
					} else {
						me.renderSuggestion();
					}
					
				};
				
				me.renderSuggestion = function(){
				
					// Rendering
						// before rendering suggestion
						// pop it from the stack
						// then ask view to render poped item
						// after poping stack, check if its length is less than 3, fetch new suggestions
					
					var newSuggestion = me.suggestionsStack.pop();
					app.notify('add suggested contact', newSuggestion.getAll());
					
					if(me.suggestionsStack.length < 3) orm('suggestion').fetch({});
				};
				
				me.itemHasExpired = function(id){
				
					// check if item has already be used
					
					if(me.expiredItems[id] == 'expired') {
						return true;
					} else {
						me.expiredItems[id] = 'expired';
						return false;
					}
					
				};
				
			}
		}
	
	}}
	
});