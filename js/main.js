$(function(){

	//###Category's Section
	//Category Model
	var Category = Backbone.Model.extend({
		defaults: function() {
		  return {
		    name		: "empty category...",
		    order 		: Categories.nextOrder()
		  };
		}
	});

	//Category Collection
	var CategoryList = Backbone.Collection.extend({
		model: Category,
		localStorage: new Backbone.LocalStorage("category-list"),
		all: function() {
			return this.where();
	    },
	    nextOrder: function() {
			if (!this.length) return 1;
			return this.last().get('order') + 1;
	    },
	    comparator: 'order'
	});

	var Categories = new CategoryList;

	//Category View
	var CategoryView = Backbone.View.extend({
		tagName:  "tr",
		template: _.template($('#item-category').html()),
		events: {
			"dblclick .iten"  : "edit",
			"click a.destroy" : "clear",
			"keypress .edit"  : "updateOnEnter",
			"blur .iten"      : "close"
	    },
	    initialize: function() {
			this.listenTo(this.model, 'change', this.render);
			this.listenTo(this.model, 'destroy', this.remove);
    	},
    	render: function() {
			this.$el.html(this.template(this.model.toJSON()));
			this.input = this.$('.edit');
			this.aIten = this.$('.iten');
			return this;
	    },
	    edit: function() {
	    	this.$el.addClass("editing");
			this.input.removeClass("hidden");
			this.input.focus();
			this.aIten.addClass("hidden");
    	},
    	close: function() {
			var value = this.input.val();
			if (!value) {
				this.clear();
			} else {
				this.model.save({name: value});
				this.$el.removeClass("editing");
				this.input.addClass("hidden");
				this.aIten.removeClass("hidden");
				this.aIten.text(value);
			}
		},
		updateOnEnter	: function(e) {
      		if (e.keyCode == 13) this.close();
    	},
    	clear: function() {
    		this.model.destroy();
    	}
    });

	//###Link's Section
	//Link Model
	var Link = Backbone.Model.extend({
		defaults: function() {
		  return {
		    name		: "empty link...",
		    address		: "",
		    description	: "",
		    category 	: null,
		    order 		: Links.nextOrder()
		  };
		}
	});

	//Link Collection
	var LinkList = Backbone.Collection.extend({
		model: Link,
		localStorage: new Backbone.LocalStorage("link-list"),
		all: function() {
			return this.where();
	    },
	    nextOrder: function() {
			if (!this.length) return 1;
			return this.last().get('order') + 1;
	    },
	    comparator: 'order'
	});

	var Links = new LinkList;

	//Link View
	var LinkView = Backbone.View.extend({
		tagName:  "tr",
		template: _.template($('#item-link').html()),
		events: {
			"dblclick .link"  : "edit",
			"click a.destroy" : "clear",
			"keypress .edit"  : "updateOnEnter",
			"blur .link"      : "close"
	    },
	    initialize: function() {
			this.listenTo(this.model, 'change', this.render);
			this.listenTo(this.model, 'destroy', this.remove);
    	},
    	render: function() {
			this.$el.html(this.template(this.model.toJSON()));
			this.input = this.$('.edit');
			this.aLink = this.$('.link');
			return this;
	    },
	    edit: function() {
	    	this.$el.addClass("editing");
			this.input.removeClass("hidden");
			this.input.focus();
			this.aLink.addClass("hidden");
    	},
    	close: function() {
			var name 		= $(".linkName:visible").val();
			var address 	= $(".linkAddress:visible").val();
			var description = $(".linkDescription:visible").val();
			var category 	= $(".linkCategory:visible").val();


			if (!name || !address || !category) {
				this.clear();
			} else {
				this.model.save({
	      			name 		: name,
	      			address		: address,
				    description	: description,
				    category 	: category
	      		});


				this.$el.removeClass("editing");
				this.input.addClass("hidden");
				this.aLink.removeClass("hidden");
			}
		},
		updateOnEnter	: function(e) {
			if (e.keyCode == 13) this.close();
    	},
    	clear: function() {
    		this.model.destroy();
    	}
    });


	//###Application Section

	var AppView = Backbone.View.extend({
		el: $("#main"),
		events: {
			//Categorys event
      		"keypress #new-category":  "createCategoryOnEnter",
      		//Links event
      		"click #createLink":  "createLinkOnEnter"
    	},
    	initialize: function() {
    		
    		//##Load Category section
			this.input = this.$("#new-category");
			this.listenTo(Categories, 'add', this.addOneCategory);
			this.listenTo(Categories, 'all', this.renderCategory);
			this.mainCategory = $('#categoryList table');
			this.emptyCategory= $('#categoryList .alert');
			Categories.fetch();

			//##Load Link section
			this.inputLinkName = this.$("#linkName");
			this.inputLinkAddress = this.$("#linkAddress");
			this.inputLinkDescription = this.$("#linkDescription");
			this.inputLinkCategory = this.$("#linkCategory");
			this.listenTo(Links, 'add', this.addOneLink);
			this.listenTo(Links, 'all', this.renderLink);
			this.listenTo(Links, 'all', this.fetchByName);
			this.mainLink = $('#links table tbody');
			this.emptyLink= $('#links .alert');
			Links.fetch();
    	},
    	renderCategory: function() {
			if (Categories.length) {
				this.mainCategory.show();
				this.emptyCategory.hide();
			} else {
				this.mainCategory.hide();
				this.emptyCategory.show();
			}
    	},
    	addOneCategory: function(category) {
      		var view = new CategoryView({model: category});
      		this.$("#categoryList table tbody").append(view.render().el);
    	},
    	createCategoryOnEnter: function(e) {
      		if (e.keyCode !== 13) return;
      		if (!this.input.val()) return;
      		if (this.input.val().trim() === "") return;

      		Categories.create({name: this.input.val()});
      		this.input.val('');
    	},
    	//	Link methods
    	renderLink: function() {
    		if (Links.length) {
				this.mainLink.show();
				this.emptyLink.hide();
				
			} else {
				this.mainLink.hide();
				this.emptyLink.show();
			}
    	},
    	addOneLink: function(link) {
      		var view = new LinkView({model: link});
      		this.$("#links table tbody").append(view.render().el);
    	},
    	createLinkOnEnter: function(e) {
      		if (!(this.inputLinkName.val().trim() !== '')) return;
      		if (!(this.inputLinkAddress.val().trim() !== '')) return;
      		if (!(this.inputLinkDescription.val().trim() !== '')) return;
      		if (!(this.inputLinkCategory.val().trim() !== '')) return;

      		Links.create({
      			name 		: this.inputLinkName.val(),
      			address		: this.inputLinkAddress.val(),
			    description	: this.inputLinkDescription.val(),
			    category 	: this.inputLinkCategory.val()
      		});

      		//Clean Fields
      		this.inputLinkName.val("")
      		this.inputLinkAddress.val("")
      		this.inputLinkDescription.val("")
      		this.inputLinkCategory.val("")
    	}
	});

	var App = new AppView();

});