define(['backbone', 'views/index'], function (Backobne, IndexView) {
	var FitStudioRouter = Backbone.Router.extend({
		currentView: null,

		routes: {
			'index': 'index',
			'login': 'index'
		},

		changeView: function (view) {
			if (this.currentView !== null) {
				this.currentView.undelegateEvents();
			}
			this.currentView = view;
			this.currentView.render();
		},

		index: function () {
			this.changeView(new IndexView());
		},

		login: function () {
			this.changeView(new IndexView());
		}
	});

	return new FitStudioRouter();
});