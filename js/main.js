$(function(){

	//Category Model
	var Category = Backbone.Model.extend({
		defaults: function() {
		  return {
		    name		: "empty category...",
		    description	: "",
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

	//Application ####

	var AppView = Backbone.View.extend({
		el: $("#category"),
		statsTemplate: _.template($('#stats-template').html()),
		events: {
      		"keypress #new-category":  "createOnEnter",
      		"click #clear-completed": "clearCompleted",
      		"click #toggle-all": "toggleAllComplete"
    	},
    	initialize: function() {
			this.input = this.$("#new-category");

			this.listenTo(Categories, 'add', this.addOne);
			//this.listenTo(Categories, 'reset', this.addAll);
			this.listenTo(Categories, 'all', this.render);

			this.main = $('#categoryList');

			Categories.fetch();
    	},
    	render: function() {
			var done = Categories.all().length;

			if (Categories.length) {
				this.main.show();
			} else {
				this.main.hide();
			}
    	},
    	addOne: function(category) {
    		console.log("addOne");
      		var view = new CategoryView({model: category});
      		this.$("#categoryList table tbody").append(view.render().el);
    	},
    	addAll: function() {
      		console.log("addAll");
      		//Categories.each(this.addOne, this);
    	},
    	createOnEnter: function(e) {
      		if (e.keyCode !== 13) return;
      		if (!this.input.val()) return;
      		if (this.input.val().trim() === "") return;

      		Categories.create({name: this.input.val()});
      		this.input.val('');
    	},

    	clearCompleted: function() {
			console.log("clearCompleted");
			//_.invoke(Categories.done(), 'destroy');
			//return false;
	    },

	    toggleAllComplete: function () {
			console.log("toggleAllComplete");
			//var done = this.allCheckbox.checked;
			//Categories.each(function (todo) { todo.save({'done': done}); });
	    }

	});

	var App = new AppView();

});