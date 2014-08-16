define(['backbone',
    'views/index',
    'views/login',
    'views/register',
    'views/forgotPassword',
    'views/courses',
    'views/editCourse',
    'views/instructors',
    'views/editInstructor'
    ], function (Backobne,
    IndexView,
    LoginView,
    RegisterView,
    ForgotPassword,
    CoursesView,
    EditCourseView,
    InstructorsView,
    EditInstructorView) {
    var FitStudioRouter = Backbone.Router.extend({
        currentView: null,

        routes: {
            index: 'index',
            login: 'login',
            register: 'register',
            forgotpassword: 'forgotpassword',
            courses: 'courses',
            'courses/:id': 'editCourse',
            instructors: 'instructors',
            'instructors/:id': 'editInstructors'
        },

        changeView: function (view) {
            if (this.currentView !== null) {
                this.currentView.undelegateEvents();
                this.currentView.off('navigate');
                if (this.currentView.onHide) {
                    this.currentView.onHide();
                }
            }
            this.currentView = view;
            this.currentView.on('navigate', this.navigate, this);
            if (this.currentView.show) {
                // with ko and the stuff, it's show
                this.currentView.show();
            } else {
                // for older views which are not updated
                this.currentView.render();
            }
        },

        navigate: function (params) {
            var route = params.route;
            delete params.route;
            this.params = params;
            window.location.hash = route;
        },

        index: function () {
            this.changeView(new IndexView());
        },

        login: function () {
            this.changeView(new LoginView());
        },

        register: function () {
            this.changeView(new RegisterView());
        },

        forgotpassword: function () {
            this.changeView(new ForgotPassword());
        },

        courses: function () {
            this.changeView(new CoursesView());
        },

        editCourse: function (id) {
            var params = {};
            if (this.params) {
                params = this.params;
                this.params = null;
            }
            this.changeView(new EditCourseView({id: id, data: params.model}));
        },

        instructors: function () {
            this.changeView(new InstructorsView());
        },

        editInstructors: function (id) {
            var params = {};
            if (this.params) {
                params = this.params;
                this.params = null;
            }
            this.changeView(new EditInstructorView({id: id, data: params.model}));
        }
    });

    return new FitStudioRouter();
});