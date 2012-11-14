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