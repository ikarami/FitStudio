define(['backbone',
    'views/components/modal',
    'views/index',
    'views/login',
    'views/register',
    'views/forgotPassword',
    'views/courses',
    'views/courseDetails',
    'views/editCourse',
    'views/instructors',
    'views/instructorDetails',
    'views/editInstructor',
    'views/locations',
    'views/editLocation',
    'views/pouches',
    'views/pouchDetails',
    'views/editPouch',
    'views/users',
    'views/userDetails',
    'views/editUser',
    'collections/users',
    'collections/courses',
    'collections/instructors'
    ], function (Backobne,
    ModalComponentView,
    IndexView,
    LoginView,
    RegisterView,
    ForgotPassword,
    CoursesView,
    CourseDetailsView,
    EditCourseView,
    InstructorsView,
    InstructorDetailsView,
    EditInstructorView,
    LocationsView,
    EditLocationView,
    PouchesView,
    PouchDetailsView,
    EditPouchView,
    UsersView,
    UserDetailsView,
    EditUserView,
    usersCollection,
    coursesCollection,
    instructorsCollection) {
    var instance, FitStudioRouter = Backbone.Router.extend({
        currentView: null,

        components: {},

        routes: {
            index: 'index',
            login: 'login',
            register: 'register',
            forgotpassword: 'forgotpassword',
            courses: 'courses',
            'courses/:id': 'courseDetails',
            'courses/:id/edit': 'editCourse',
            instructors: 'instructors',
            'instructors/:id': 'instructorDetails',
            'instructors/:id/edit': 'editInstructors',
            pouches: 'pouches',
            'pouches/:id': 'pouchDetails',
            'pouches/:id/edit': 'editPouches',
            users: 'users',
            'users/:id': 'userDetails',
            'users/:id/edit': 'editUsers',
            locations: 'locations',
            'locations/:id': 'editLocations'
        },

        changeView: function (view) {
            if (this.currentView !== null) {
                this.currentView.undelegateEvents();
                this.currentView.off('all');
                if (this.currentView.onHide) {
                    this.currentView.onHide();
                }
            }
            this.currentView = view;
            this.currentView.on('all', this.viewEventsDispatcher, this);

            if (this.currentView.show) {
                // with ko and the stuff, it's show
                this.currentView.show();
            } else {
                // for older views which are not updated
                this.currentView.render();
            }
        },

        viewEventsDispatcher: function (eventName, args) {
            switch (eventName) {
                case 'navigate':
                    this.navigate(args);
                break;
                case 'modal':
                    this.modal(args);
                break;
                case 'loggedIn':
                    this.fetchData();
                    this.navigate({
                        route: '#index'
                    });
                break;
                default:
                    console.warn('Router :: viewEventsDispatcher :: unknown event ' + eventName);
            }
        },

        fetchData: function () {
            usersCollection.fetch();
            coursesCollection.fetch();
            instructorsCollection.fetch();
        },

        navigate: function (params) {
            var route = params.route;
            delete params.route;
            this.params = params;
            window.location.hash = route;
        },

        modal: function (params) {
            if (!this.components.modal) {
                this.components.modal = new ModalComponentView();
                this.components.modal.on('all', function (eventName, args) {
                    this.currentView.trigger('eventName', args);
                }, this);
            }
            this.components.modal.show(params);
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

        courseDetails: function (id) {
            this.changeView(new CourseDetailsView({id: id}));
        },

        editCourse: function (id) {
            this.changeView(new EditCourseView({id: id}));
        },

        instructors: function () {
            this.changeView(new InstructorsView());
        },

        instructorDetails: function (id) {
            this.changeView(new InstructorDetailsView({id: id}));
        },

        editInstructors: function (id) {
            this.changeView(new EditInstructorView({id: id}));
        },

        locations: function () {
            this.changeView(new LocationsView());
        },

        editLocations: function (id) {
            var params = {};
            if (this.params) {
                params = this.params;
                this.params = null;
            }
            this.changeView(new EditLocationView({id: id, data: params.model}));
        },

        pouches: function () {
            this.changeView(new PouchesView());
        },

        pouchDetails: function (id) {
            var params = {};
            if (this.params) {
                params = this.params;
                this.params = null;
            }
            this.changeView(new PouchDetailsView({id: id, data: params.model}));
        },

        editPouches: function (id) {
            var params = {};
            if (this.params) {
                params = this.params;
                this.params = null;
            }
            this.changeView(new EditPouchView({id: id, data: params.model}));
        },

        users: function () {
            this.changeView(new UsersView());
        },

        userDetails: function (id) {
            this.changeView(new UserDetailsView({id: id}));
        },

        editUsers: function (id) {
            this.changeView(new EditUserView({id: id}));
        }
    });

    instance = new FitStudioRouter();
    // JUST FOR DEBUGGING
    window.router = instance;

    return instance;
});