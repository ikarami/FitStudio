define(['backbone',
    'views/index',
    'views/login',
    'views/register',
    'views/forgotPassword',
    'views/courses',
    'views/addCourse',
    'views/instructors'
    ], function (Backobne,
    IndexView,
    LoginView,
    RegisterView,
    ForgotPassword,
    CoursesView,
    AddCourseView,
    InstructorsView) {
    var FitStudioRouter = Backbone.Router.extend({
        currentView: null,

        routes: {
            index: 'index',
            login: 'login',
            register: 'register',
            forgotpassword: 'forgotpassword',
            courses: 'courses',
            addCourse: 'addCourse',
            instructors: 'instructors'
        },

        changeView: function (view) {
            if (this.currentView !== null) {
                this.currentView.undelegateEvents();
                if (this.currentView.onHide) {
                    this.currentView.onHide();
                }
            }
            this.currentView = view;
            if (this.currentView.show) {
                // with ko and the stuff, it's show
                this.currentView.show();
            } else {
                // for older views which are not updated
                this.currentView.render();
            }
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

        addCourse: function () {
            this.changeView(new AddCourseView());
        },

        instructors: function () {
            this.changeView(new InstructorsView());
        }
    });

    return new FitStudioRouter();
});