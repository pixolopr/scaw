// JavaScript Document
var firstapp = angular.module('firstapp', ['ngRoute', 'phonecatControllers', 'templateservicemod', 'navigationservice', 'angularFileUpload', 'textAngular', 'ui.sortable', 'angular-loading-bar'
]);

/*
Client ID : 951565546728-s8mpt0u6nblg7qv6mpom6arvqm2o7qp8.apps.googleusercontent.com
Client Secret ID: qVyozubT7R6e2R3opkQq1Rhv
*/

firstapp.config(['$routeProvider',
  function ($routeProvider) {
        $routeProvider.
        when('/home', {
            templateUrl: 'views/template.html',
            controller: 'home'
        }).
        when('/users', {
            templateUrl: 'views/template.html',
            controller: 'usersCtrl'
        }).
        when('/login', {
            templateUrl: 'views/template.html',
            controller: 'loginCtrl'
        }).
        when('/adduser/:accesstype/:editid', {
            templateUrl: 'views/template.html',
            controller: 'adduserCtrl'
        }).
        when('/syllabus', {
            templateUrl: 'views/template.html',
            controller: 'syllabusCtrl'
        }).
        when('/addsyllabusdata/:addname/:parentid/:editid', {
            templateUrl: 'views/template.html',
            controller: 'addsyllabusdataCtrl'
        }).
        when('/questions', {
            templateUrl: 'views/template.html',
            controller: 'questionsCtrl'
        }).
        when('/createquestion/:editid', {
            templateUrl: 'views/template.html',
            controller: 'createquestionCtrl'
        }).
        when('/cardcreator/:editid', {
            templateUrl: 'views/template.html',
            controller: 'cardcreatorCtrl'
        }).
        when('/cardviewer/:editid', {
            templateUrl: 'views/template.html',
            controller: 'cardviewerCtrl'
        }).
        when('/contact', {
            templateUrl: 'views/template.html',
            controller: 'contact'
        }).
        otherwise({
            redirectTo: '/login'
        });
  }]);

firstapp.filter('capitalize', function () {
    return function (input) {
        return (!!input) ? input.charAt(0).toUpperCase() + input.substr(1).toLowerCase() : '';
    }
});

firstapp.config(function ($provide) {
    $provide.decorator('taOptions', ['taRegisterTool', '$delegate', '$rootScope', function (taRegisterTool, taOptions, $rootScope) {
        // $delegate is the taOptions we are decorating
        // register the tool with textAngular


        taRegisterTool('insertequation', {
            iconclass: "fa fa-reply",
            action: function () {
                console.log($rootScope.math.code);
                $rootScope.addmathequation(this);
            }
        });
        // add the button to the default toolbar definition
        taOptions.toolbar[1].push('insertequation');
        return taOptions;
 }]);
});

firstapp.config(function ($provide) {
    $provide.decorator('taOptions', ['taRegisterTool', '$delegate', '$rootScope', function (taRegisterTool, taOptions, $rootScope) {
        // $delegate is the taOptions we are decorating
        // register the tool with textAngular


        taRegisterTool('showcardviewer', {
            iconclass: "fa fa-eye",
            action: function () {
                console.log("VIEW CARD");
                $rootScope.modalchange(1);
            }
        });
        // add the button to the default toolbar definition
        taOptions.toolbar[1].push('showcardviewer');
        return taOptions;
 }]);
});

firstapp.config(function ($provide) {
    $provide.decorator('taOptions', ['taRegisterTool', '$delegate', function (taRegisterTool, taOptions) {
        // $delegate is the taOptions we are decorating
        // register the tool with textAngular
        taRegisterTool('colourRed', {
            iconclass: "fa fa-square red",
            action: function () {
                this.$editor().wrapSelection('forecolor', 'red');
            }
        });
        // add the button to the default toolbar definition
        taOptions.toolbar[1].push('colourRed');
        return taOptions;
 }]);
});

firstapp.config(function ($provide) {
    $provide.decorator('taOptions', ['taRegisterTool', '$delegate', function (taRegisterTool, taOptions) {
        // $delegate is the taOptions we are decorating
        // register the tool with textAngular
        taRegisterTool('colourGreen', {
            iconclass: "fa fa-square green",
            action: function () {
                this.$editor().wrapSelection('forecolor', 'green');
            }
        });
        // add the button to the default toolbar definition
        taOptions.toolbar[1].push('colourGreen');
        return taOptions;
 }]);
});

firstapp.config(function ($provide) {
    $provide.decorator('taOptions', ['taRegisterTool', '$delegate', function (taRegisterTool, taOptions) {
        // $delegate is the taOptions we are decorating
        // register the tool with textAngular
        taRegisterTool('colourBlue', {
            iconclass: "fa fa-square blue",
            action: function () {
                this.$editor().wrapSelection('forecolor', '#03bdd6');
            }
        });
        // add the button to the default toolbar definition
        taOptions.toolbar[1].push('colourBlue');
        return taOptions;
 }]);
});

firstapp.config(function ($provide) {
    $provide.decorator('taOptions', ['taRegisterTool', '$delegate', function (taRegisterTool, taOptions) {
        // $delegate is the taOptions we are decorating
        // register the tool with textAngular
        taRegisterTool('colourBlack', {
            iconclass: "fa fa-square black",
            action: function () {
                this.$editor().wrapSelection('forecolor', '#555');
            }
        });
        // add the button to the default toolbar definition
        taOptions.toolbar[1].push('colourBlack');
        return taOptions;
 }]);
});

firstapp.config(function ($provide) {
    $provide.decorator('taOptions', ['taRegisterTool', '$delegate',
                function (taRegisterTool, taOptions) {
            // $delegate is the taOptions we are decorating
            // register the tool with textAngular
            taRegisterTool('superscript', {
                iconclass: "fa fa-superscript",
                action: function () {
                    return this.$editor().wrapSelection("superscript", null);
                },
                activeState: function () {
                    return this.$editor().queryCommandState('superscript');
                }
            });
            // add the button to the default toolbar definition
            taOptions.toolbar[1].push('superscript');
            return taOptions;
}]);
});

firstapp.config(function ($provide) {
    $provide.decorator('taOptions', ['taRegisterTool', '$delegate',
                function (taRegisterTool, taOptions) {
            // $delegate is the taOptions we are decorating
            // register the tool with textAngular
            taRegisterTool('subscript', {
                iconclass: "fa fa-subscript",
                action: function () {
                    return this.$editor().wrapSelection("subscript", null);
                },
                activeState: function () {
                    return this.$editor().queryCommandState('subscript');
                }
            });
            // add the button to the default toolbar definition
            taOptions.toolbar[1].push('subscript');
            return taOptions;
}]);
});

firstapp.config(function ($provide) {
    $provide.decorator('taOptions', ['taRegisterTool', '$delegate',
                function (taRegisterTool, taOptions) {
            // $delegate is the taOptions we are decorating
            // register the tool with textAngular
            taRegisterTool('arrowrightsymbol', {
                iconclass: "fa fa-long-arrow-right",
                action: function () {
                    return this.$editor().wrapSelection('insertHTML', '&#8594;', true);
                },
                activeState: function () {
                    //return this.$editor().queryCommandState('subscript');
                }
            });
            // add the button to the default toolbar definition
            taOptions.toolbar[1].push('arrowrightsymbol');
            return taOptions;
}]);
});

firstapp.config(function ($provide) {
    $provide.decorator('taOptions', ['taRegisterTool', '$delegate',
                function (taRegisterTool, taOptions) {
            // $delegate is the taOptions we are decorating
            // register the tool with textAngular
            taRegisterTool('arrowleftsymbol', {
                iconclass: "fa fa-long-arrow-left",
                action: function () {
                    return this.$editor().wrapSelection('insertHTML', '&#8592;');
                },
                activeState: function () {
                    //return this.$editor().queryCommandState('subscript');
                }
            });
            // add the button to the default toolbar definition
            taOptions.toolbar[1].push('arrowleftsymbol');
            return taOptions;
}]);
});

firstapp.config(function ($provide) {
    $provide.decorator('taOptions', ['taRegisterTool', '$delegate',
                function (taRegisterTool, taOptions) {
            // $delegate is the taOptions we are decorating
            // register the tool with textAngular
            taRegisterTool('arrowbothsymbol', {
                iconclass: "fa fa-arrows-h",
                action: function () {
                    return this.$editor().wrapSelection('insertHTML', '<p>&#8596;</p>');
                },
                activeState: function () {
                    //return this.$editor().queryCommandState('subscript');
                }
            });
            // add the button to the default toolbar definition
            taOptions.toolbar[1].push('arrowbothsymbol');
            return taOptions;
}]);
});



firstapp.directive('ngFiles', ['$parse', function ($parse) {

    function fn_link(scope, element, attrs) {
        var onChange = $parse(attrs.ngFiles);
        element.on('change', function (event) {
            onChange(scope, {
                $files: event.target.files
            });
        });
    };

    return {
        link: fn_link
    }
        }]);


firstapp.filter('imagepath', function () {
    return function (input) {
        return "http://localhost/rest/rest/uploads/" + input;
        //return "http://learnwithinq.com/adminpanel/rest/uploads/" + input;
    };
});