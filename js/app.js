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
        when('/notifications', {
            templateUrl: 'views/template.html',
            controller: 'notificationsCtrl'
        }).
        when('/createnotification', {
            templateUrl: 'views/template.html',
            controller: 'createNotificationCtrl'
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

firstapp.config(function ($provide) {
    $provide.decorator('taOptions', ['taRegisterTool', '$delegate',
                function (taRegisterTool, taOptions) {
            // $delegate is the taOptions we are decorating
            // register the tool with textAngular
            taRegisterTool('editequation', {
                iconclass: "fa fa-usd",
                action: function () {
                    return this.$editor().wrapSelection('insertHTML', '$$   $$');
                },
                activeState: function () {
                    //return this.$editor().queryCommandState('subscript');
                }
            });
            // add the button to the default toolbar definition
            taOptions.toolbar[1].push('editequation');
            return taOptions;
}]);
});

/*firstapp.config(function ($provide) {
    $provide.decorator('taOptions', ['taRegisterTool', '$delegate', 'taSelection', '$rootScope',
                function (taRegisterTool, taOptions, taSelection, $rootScope) {
            // $delegate is the taOptions we are decorating
            // register the tool with textAngular
            taRegisterTool('editequation', {
                iconclass: "fa fa-pencil-square-o",
                action: function () {
                    $rootScope.setselectedtextintoeditor();
                },
                activeState: function () {
                    //return this.$editor().queryCommandState('subscript');
                }
            });
            // add the button to the default toolbar definition
            taOptions.toolbar[1].push('editequation');
            return taOptions;
}]);
});*/

firstapp.config(function ($provide) {
    function createTable(colCount, rowCount) {
        var tds = "";
        for (var idxCol = 0; idxCol < colCount; idxCol++) {
            tds = tds + "<td>&nbsp;</td>";
        }
        var trs = "";
        for (var idxRow = 0; idxRow < rowCount; idxRow++) {
            trs = trs + "<tr>" + tds + "</tr>";
        }

        return '<table class="table table-bordered">' + trs + '</table>';
    }

    $provide.decorator('taOptions', ['taRegisterTool', '$delegate', '$rootScope', function (taRegisterTool, taOptions, $rootScope) {
        taRegisterTool('table', {
            iconclass: 'fa fa-table',
            tooltiptext: 'insert table',
            action: function (promise, restoreSelection) {
                var that = this;
                $('#tablemodal').show();
                $rootScope.invitation = {};
                $rootScope.ok = function () {
                    restoreSelection();
                    var html = createTable($rootScope.invitation.col, $rootScope.invitation.row);
                    $('#tablemodal').hide();
                    return that.$editor().wrapSelection('insertHtml', html);
                };

                $rootScope.cancel = function () {
                    $('#tablemodal').hide();
                };
                /*var modalInstance = $modal.open({
                    templateUrl: 'views/table.html',
                    controller: function ($rootScope, $modalInstance) {
                        $rootScope.invitation = {};
                        $rootScope.ok = function () {
                            console.log($rootScope.invitation);
                            $modalInstance.close($rootScope.invitation);
                        };

                        $rootScope.cancel = function () {
                            $modalInstance.dismiss('cancel');
                        };
                    },
                    resolve: {
                        result: function () {
                            return $rootScope.newtable;
                        }
                    },
                    size: 'sm'

                });*/
                //define result modal , when user complete result information 
                /*modalInstance.result.then(function (result) {
                    if (result) {
                        restoreSelection();
                        var html = createTable(result.col, result.row);
                        promise.resolve();
                        return that.$editor().wrapSelection('insertHtml', html);
                    }
                });*/
                return false;
            }
        });
        // add the button to the default toolbar definition
        taOptions.toolbar[1].push('table');
        return taOptions;
    }])
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
        //return "http://localhost/rest/rest/uploads/" + input;
        return "http://learnwithinq.com/adminpanel/rest/uploads/" + input;
    };
});

firstapp.filter('strReplace', function () {
    return function (input) {
        input = input || '';
        return input.replace(new RegExp('$$', 'g'), '');
    };
});
