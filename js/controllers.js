var phonecatControllers = angular.module('phonecatControllers', ['templateservicemod', 'navigationservice']);

//var adminurl = "http://localhost/rest/rest/index.php/";
//var imageurl = "http://localhost/rest/rest/uploads/";
var adminurl = "http://learnwithinq.com/adminpanel/rest/index.php/";
var imageurl = "http://learnwithinq.com/adminpanel/rest/uploads/";

var userarray = [{
        'image': 'admin.png',
        'post': 'Administrator'
    },
    {
        'image': 'edit.png',
        'post': 'Editor'
    },
    {
        'image': 'teach.png',
        'post': 'Teacher'
    }
];

phonecatControllers.controller('home', ['$scope', 'TemplateService', 'NavigationService', '$rootScope', '$filter', '$window', '$location',
    function ($scope, TemplateService, NavigationService, $rootScope, $filter, $window, $location) {
        $scope.template = TemplateService;
        TemplateService.content = "views/content.html";
        $scope.title = "dashboard";
        $scope.navigation = NavigationService.getnav();
        $rootScope.loginpage = false;
        $scope.wrongquestions = [];
        /*INITIALIZATIONS*/
        $scope.user = $.jStorage.get("user");

        $scope.date = {
            from: "",
            to: ""
        };

        $scope.editorslimit = 7; /*Limit no. of editors displayed on the dashboard*/
        $scope.showmorebuttontext = "See all of them"; /*Button that shows more or less editors*/
        $scope.showbutton = false;

        $scope.showmoreusers = function () {
            if ($scope.showmorebuttontext == "See all of them") {
                $scope.editorslimit = $scope.dashboarddata.editorquestiondata.size;
                $scope.showmorebuttontext = "See few of them";
            } else {
                $scope.editorslimit = 7;
                $scope.showmorebuttontext = "See all of them";
            }
        };

        /*GET TODAYS AND YESTERDATS DATES FOR INITIAL VALUES*/
        $scope.getDatetime = new Date();
        var todaysdate = new Date();
        $scope.getDatetime.setDate($scope.getDatetime.getDate() - 1);
        var yesterdaysdate = $scope.getDatetime;

        /*SET INITIAL DATE IN FILTERS*/
        $scope.date = {
            from: yesterdaysdate,
            to: todaysdate
        };

        /*GET THE DATE FROM 2 DATE FIELDS IN CONTENT.HTML AND CALL THE FUNCTION ON CLICK*/
        $scope.getdashboarddatabydate = function () {
            var getdashboarddatasuccess = function (response) {
                console.log(response.data);
                $scope.dashboarddata = response.data;

                if (response.data.editorquestiondata.length > $scope.editorslimit) {
                    $scope.showbutton = true;
                } else {
                    $scope.showbutton = false;
                };
            };
            var getdashboarddataerror = function (response) {
                console.log(response.data);
            };
            NavigationService.getdashboarddata($scope.user.id, $scope.user.access_id, $scope.date.from, $scope.date.to).then(getdashboarddatasuccess, getdashboarddataerror);
        };

        /*INITIALLY CALL DASHBOARD FUNCTION*/
        $scope.getdashboarddatabydate();

        /*GET CONCEPTS EXCEL*/
        $scope.getconceptsexceldata = function () {
            var getconceptsexceldatasuccess = function (response) {
                console.log(response.data);
                alasql('SELECT * INTO XLSX("concepts.xlsx",{headers:true}) FROM ?', [response.data]);
            };
            var getconceptsexceldataerror = function (response) {
                console.log(response.data);
            };
            NavigationService.getconceptsexceldata().then(getconceptsexceldatasuccess, getconceptsexceldataerror);
        };

        /*REDIRECT TO EDIT PAGE*/
        $scope.gotocreatequestion = function (questionsid) {
                $location.path('/createquestion/' + questionsid);
            },
            /*CHANGE STATUS OF QUESTION AFTER UPDATE*/
            $scope.changestatusofquestion = function (index) {
                /*CALLBACK FUNCTIONS OF SETFLAGVALUE*/
                setflagvaluesuccess = function (response) {
                    $scope.wrongquestions.splice(index, 1);
                };
                setflagvalueerror = function (error) {
                    console.log(error);
                }
                NavigationService.setflagvalue($scope.wrongquestions[index].id).then(setflagvaluesuccess, setflagvalueerror);
            },
            /*GET QUESTIONS TO BE EDITED*/
            //      CALLBACK FUNCTIONS
            getflaggedquestionssuccess = function (response) {
                $scope.wrongquestions = response.data;
            };
        getflaggedquestionserror = function (error) {
            console.log(error);
        };


        NavigationService.getflaggedquestions($scope.user.id).then(getflaggedquestionssuccess, getflaggedquestionserror);

        /*TAKE BACKUP*/
        $scope.backupdb = function () {
            var getbackupsuccess = function (response) {
                console.log(response.data);
            };
            var getbackuperror = function (response) {
                console.log(response.data);
            };
            //NavigationService.getbackup().then(getbackupsuccess, getbackuperror);
            $window.open('http://www.learnwithinq.com/adminpanel/rest/index.php/access/getbackup');
        };
    }
]);

phonecatControllers.controller('loginCtrl', ['$scope', 'TemplateService', 'NavigationService', '$rootScope', '$location',
    function ($scope, TemplateService, NavigationService, $rootScope, $location) {
        $scope.template = TemplateService;
        TemplateService.content = "views/login.html";
        $scope.title = "dashboard";

        $rootScope.loginpage = true;
        console.log('LOGIN CTRL');

        $scope.logindata = {
            'email': '',
            'password': ''
        };


        $scope.dologin = function () {


            var dologinsuccess = function (response) {
                console.log('Login button is pressed !');
                console.log(response);
                if (response.data != 'false') {
                    $rootScope.loginpage = false;
                    $scope.user = response.data;
                    $.jStorage.set("user", response.data);
                    $location.path('/home');
                    //STORE IN JSTORAGE IF NEEDED
                } else {
                    $scope.errormessage = 'Email and password do not match !';

                };
            };
            var dologinerror = function (response) {
                console.log(response.data);


            };

            $scope.errormessage = '';
            if ($scope.logindata.email != '' && $scope.logindata.password != '') {
                NavigationService.dologin($scope.logindata.email, $scope.logindata.password).then(dologinsuccess, dologinerror);
            } else {
                $scope.errormessage = 'All fields are compulsory!';
            }



        };
    }
]);

phonecatControllers.controller('usersCtrl', ['$scope', 'TemplateService', 'NavigationService', '$location',
    function ($scope, TemplateService, NavigationService, $location) {
        $scope.template = TemplateService;
        TemplateService.content = "views/users.html";
        $scope.title = "users";

        /*User Pagination*/
        $scope.page = {
            size: 5
        };
        $scope.currentpage = 0;
        $scope.count = $scope.currentpage * $scope.page.size;

        /*When the options of pagesize is changed*/
        $scope.fetchusers = function () {
            console.log("option value " + $scope.page.size);
            getusers();
        }

        /*When Next and Previous buttons clicked*/
        $scope.getusersdata = function (inc) {
            $scope.currentpage += inc;
            $scope.count = $scope.currentpage * $scope.page.size;
            getusers();
        }

        //SET USERR ACCESS TYPE
        $scope.users = [];
        //$scope.pagenumber = 0;
        //$scope.limit = 1000;
        $scope.useraccesstype = 4;

        var getuserssuccess = function (response) {
            console.log(response.data);
            $scope.users = response.data.users;
            $scope.usercount = response.data.count;
            $scope.totalpages = Math.ceil($scope.usercount / $scope.page.size);
            console.log($scope.usercount);
            console.log("Total Pages" + $scope.totalpages);
        };

        var getuserserror = function (response) {
            console.log(response.data);
        };

        var getusers = function () {
            //len = $scope.pagenumber * $scope.limit;
            NavigationService.getusers($scope.useraccesstype, $scope.count, $scope.page.size).then(getuserssuccess, getuserserror);
            //NavigationService.getusers($scope.useraccesstype, len, $scope.limit).then(getuserssuccess, getuserserror);
        };

        getusers();

        $scope.changeuser = function (uat) {
            $scope.count = 0;
            $scope.page.size = 5;
            $scope.useraccesstype = uat;
            $scope.users = [];
            getusers();
        };

        /*$scope.changepage = function (page) {
            $scope.pagenumber = page;
            getusers();
        };*/

        /*ADD USER*/
        $scope.adduser = function (id, eid) {
            console.log($location.path());
            $location.path('/adduser/' + id + '/' + eid);
        };

        /*DELETE USER*/
        $scope.deleteuser = function (id) {
            var deleteusersuccess = function (response) {
                console.log(response.data);
                if (response.data == 'true') {
                    getusers();
                };
            };
            var deleteusererror = function (response) {
                console.log(response.data);
            };
            NavigationService.deleteuser(id).then(deleteusersuccess, deleteusererror);
        };

    }
]);

phonecatControllers.controller('adduserCtrl', ['$scope', 'TemplateService', 'NavigationService', '$routeParams', '$location',
    function ($scope, TemplateService, NavigationService, $routeParams, $location) {
        $scope.template = TemplateService;
        TemplateService.content = "views/adduser.html";
        $scope.title = "users";

        /*GET PARAMS*/
        $scope.editid = $routeParams.editid;
        $scope.accessid = $routeParams.accesstype;

        /*INITIALIZATIONS*/
        $scope.user = {
            'access_id': '',
            'name': '',
            'school': '',
            'board_id': 0,
            'standard_id': 0,
            'stream_id': 0,
            'email': '',
            'contact': '',
            'password': '',
            'verified': 0
        };
        $scope.pass = {
            'confirmpassword': ''
        };
        var explode=function() {
           
            $(document).ready(function () {
                $('.collapsible').collapsible();
            });
    
        }
        setTimeout(explode, 2000);
        
        
        var getfulldropdownsuccess = function(response){
            console.log(response.data,"this");
            $scope.boardsdata = response.data;
        }
        
        var getfulldropdownerror = function(response){
            console.log(response.data);
        }
        NavigationService.getfulldropdown().then(getfulldropdownsuccess, getfulldropdownerror);

        /*GET BOARD DROPDOWN*/
        var getboardssuccess = function (response) {
            console.log(response.data);
            $scope.boards = response.data;
        };
        var getboardserror = function (response) {
            console.log(response.data);
        };
        NavigationService.getboards().then(getboardssuccess, getboardserror);

        /*GET STANDARD DROPDOW*/
        $scope.getstandards = function () {
            if ($scope.user.board_id != '') {
                var getstandardsbyboardidsuccess = function (response) {
                    console.log(response.data);
                    $scope.standards = response.data;
                };
                var getstandardsbyboardiderror = function (response) {
                    console.log(response.data);
                };
                NavigationService.getstandardsbyboardid($scope.user.board_id).then(getstandardsbyboardidsuccess, getstandardsbyboardiderror);
            };
        };

        /*GET ALL DATA*/
        var getaccesssuccess = function (response) {
            console.log(response.data);
            $scope.access = response.data;
            setaccesstype();
        };
        var getaccesserror = function (response) {
            console.log(response.data);
            //INTERNET ERROR ACCESS DATA DROPDOWN
        };
        NavigationService.getaccess().then(getaccesssuccess, getaccesserror);

        /*INITIALIZATIONS IF EDIT USER*/
        if ($scope.editid != 0) {
            var getuserbyidsuccess = function (response) {
                console.log(response.data);
                $scope.user = response.data;
                $scope.pass.confirmpassword = $scope.user.password;
                $scope.getstandards();
            };
            var getuserbyiderror = function (response) {
                console.log(response.data);
            };
            NavigationService.getuserbyid($scope.editid).then(getuserbyidsuccess, getuserbyiderror);
        };

        /*FUNCTIONS*/

        /*SET ACCESS ID AND NAME*/
        var setaccesstype = function () {
            for (var a = 0; a < $scope.access.length; a++) {
                if ($scope.accessid == $scope.access[a].id) {
                    $scope.settype(a);
                };
            };
        };
        $scope.usertypename = "User Type";
        $scope.settype = function (ind) {
            $scope.user.access_id = $scope.access[ind].id;
            $scope.usertypename = $scope.access[ind].name;
        };

        /*ADD USER*/

        $scope.addteacherboard =function(boardid){
            $scope.user.board_id = boardid;
            console.log($scope.user.board_id);
            document.getElementById("board"+boardid).style.fill = "#03bdd6";
        }
        $scope.addteacherstandard =function(standardid){
            $scope.user.standard_id = standardid;
            document.getElementById("stand"+standardid).style.fill = "#03bdd6";
            console.log($scope.user.standard_id);
        }
        $scope.addtecherchap = function(chaptid){
            document.getElementById("chap"+chaptid).style.fill = "#03bdd6";
        }
        $scope.createuser = function () {
            console.log($scope.user.password);
            console.log($scope.pass.confirmpassword);

            if ($scope.user.password == $scope.pass.confirmpassword && $scope.user.password != '') {
                if ($scope.user.name != '' && $scope.user.contact != '') {

                    if ($scope.editid == 0) {
                        console.log($scope.user);
                        var createusersuccess = function (response) {
                            console.log(response.data);
                            if (response.data != 'false') {
                                $location.path('/users');
                            };
                        };
                        var createusererror = function (response) {
                            console.log(response.data);
                        };
                        NavigationService.createuser($scope.user).then(createusersuccess, createusererror);
                    } else {
                        console.log($scope.user);
                        var editusersuccess = function (response) {
                            console.log(response.data);
                            if (response.data == 'true') {
                                $location.path('/users');
                            };
                        };
                        var editusererror = function (response) {
                            console.log(response.data);
                        };
                        NavigationService.edituser($scope.user).then(editusersuccess, editusererror);
                    };

                } else {
                    //ERROR FILL ALL REQUIRED FIELDS
                    alert("Fill required fields");
                };
            } else {
                //ERROR PASSWORDS DO NOT MATCH
                alert("Passwords do not match");
            };
        };


        $scope.gobacktousers = function () {
            $location.path('/users');
        }





    }
]);

phonecatControllers.controller('syllabusCtrl', ['$scope', 'TemplateService', 'NavigationService', '$location', 'FileUploader', '$rootScope', '$sce',
    function ($scope, TemplateService, NavigationService, $location, FileUploader, $rootScope, $sce) {
        $scope.template = TemplateService;
        TemplateService.content = "views/syllabus.html";
        $scope.title = "syllabus";

        /*INITIALIZATIONS*/

        $scope.boards = [];
        $scope.standards = [];
        $scope.subjects = [];
        $scope.chapters = [];
        $scope.concepts = [];

        $scope.path = {
            'currentpath': 'boards',
            'board': '',
            'boards': [],
            'standard': '',
            'standards': [],
            'subject': '',
            'subjects': [],
            'chapter': '',
            'chapters': [],
            'concept': '',
            'concepts': []
        };

        if ($rootScope.path) {
            if ($rootScope.path.currentpath != 'boards') {
                $scope.path = $rootScope.path;
            };
        };

        var getdata = function (objname, id) {
            var getdatasuccess = function (response) {
                console.log(response.data);
                $scope.path[objname] = response.data;
                $scope[objname] = response.data;
                _.forEach($scope[objname], function (value) {
                    value.sync = true;
                    if (objname == 'subjects') {
                        value.image = $sce.trustAsHtml(value.image);
                    }
                });

                $rootScope.path = $scope.path;
            };
            var getdataerror = function (response) {
                console.log(response.data, id);
            };
            NavigationService.getdata(id, objname).then(getdatasuccess, getdataerror);
        };

        $scope.changepath = function (currpath, objectname, obj) {
            $scope.path.currentpath = currpath;
            $scope.path[objectname] = obj;

            /*GET DATA OF THAT THING*/
            if (currpath == 'boards') {
                $scope.path = {
                    'currentpath': 'boards',
                    'board': '',
                    'boards': [],
                    'standard': '',
                    'standards': [],
                    'subject': '',
                    'subjects': [],
                    'chapter': '',
                    'chapters': [],
                    'concept': '',
                    'concepts': []
                };
                getboards();
            } else {

                switch (currpath) {
                    case 'standards':
                        console.log("Standards");
                        $scope.path.standard = [];
                        $scope.path.subject = [];
                        $scope.path.chapter = [];
                        $scope.path.concept = [];
                        break;
                    case 'subjects':
                        $scope.path.subject = [],
                            $scope.path.chapter = [];
                        $scope.path.concept = [];
                        break;
                    case 'chapters':
                        $scope.path.chapter = [];
                        $scope.path.concept = [];
                        break;
                    case 'concepts':
                        break;
                    default:

                }

                if (!obj.name) {
                    if (currpath == 'standards') {
                        getdata(currpath, $scope.path.board);
                    };
                    if (currpath == 'subjects') {
                        getdata(currpath, $scope.path.standard);
                    };
                    if (currpath == 'chapters') {
                        getdata(currpath, $scope.path.subject);
                    };
                } else {
                    $scope.addid = obj.id;
                    getdata(currpath, obj.id);
                };

            };

        };

        /*ADD DATA*/
        $scope.adddata = function () {
            if ($scope.path.currentpath == 'subjects') {
                $scope.path[$scope.path.currentpath].push({
                    'name': 'ABC',
                    'sync': false,
                    'image': 'logo.png'
                });
            } else {
                $scope.path[$scope.path.currentpath].push({
                    'name': 'ABC',
                    'sync': false
                });
            };
            //$location.path('/addsyllabusdata/' + $scope.path.currentpath + '/' + $scope.addid + '/0');
        };

        /*EDIT DATA*/
        $scope.editdata = function (ind) {
            $scope.path[$scope.path.currentpath][ind].sync = false;
        };

        /*DELETE DATA*/
        $scope.deletedata = function (ind) {
            var deletedatasuccess = function (response) {
                console.log(response.data);
                $scope.path[$scope.path.currentpath].splice(ind, 1);
            };
            var deletedataerror = function (response) {
                console.log(response.data);
            };
            NavigationService.deletedata($scope.path[$scope.path.currentpath][ind].id, $scope.path.currentpath).then(deletedatasuccess, deletedataerror);
        };

        /*UPLOAD SUBJECT IMAGE*/
        $scope.files = [];

        $scope.LoadFileData = function (files) {
            $scope.files = files;
        };

        $scope.syncdata = function (obj, ind) {
            if (obj.id) {
                var editdatasuccess = function (response) {
                    console.log(response.data);
                    if (response.data == 'true') {
                        obj.sync = true;
                    };
                };
                var editdataerror = function (response) {
                    console.log(response.data);
                };
                var sortorder = ind + 1;
                NavigationService.editdata(obj.id, obj.name, $scope.addid, $scope.path.currentpath, sortorder).then(editdatasuccess, editdataerror);
            } else {
                var createdatasuccess = function (response) {
                    console.log(response.data);
                    if (response.data != 'false') {
                        obj.id = response.data;
                        obj.sync = true;
                    };
                };
                var createdataerror = function (response) {
                    console.log(response.data);
                };


                var sortorder = ind + 1;
                if ($scope.path.currentpath == "subjects") {
                    var pid = $scope.path.standard.id;
                    var formdata = new FormData();
                    formdata.append('name', obj.name);
                    formdata.append('parentid', pid);
                    formdata.append('sortorder', sortorder);
                    formdata.append('subjectimage', $scope.files[0]);

                    NavigationService.createsubject(formdata).then(createdatasuccess, createdataerror);
                } else {
                    NavigationService.createdata(obj.name, $scope.addid, $scope.path.currentpath, sortorder).then(createdatasuccess, createdataerror, $scope.files);
                };
            };
        };

        var getboards = function () {
            var getboardssuccess = function (response) {
                console.log(response.data);
                $scope.boards = response.data;
                $scope.path.boards = response.data;
                $scope.addid = 0;

                _.forEach($scope.boards, function (value) {
                    value.sync = true;
                });

                $rootScope.path = $scope.path;
            };
            var getboardserror = function (response) {
                console.log(response.data);
            };
            NavigationService.getboards().then(getboardssuccess, getboardserror);
        };
        getboards();

        /*DATA REORDER*/
        $scope.sortableOptions = {
            update: function (e, ui) {
                console.log("UPDATE");
            },
            stop: function (e, ui) {
                console.log("STOP");
                console.log($scope.path[$scope.path.currentpath]);

                _.forEach($scope.path[$scope.path.currentpath], function (value, key) {
                    var updatesortordersuccess = function (response) {
                        console.log(response.data);
                    };
                    var updatesortordererror = function (response) {
                        console.log(response.data);
                    };
                    var so = key + 1;

                    if (value.id) {
                        console.log(value);
                        NavigationService.updatesortorder($scope.path.currentpath, value.id, so).then(updatesortordersuccess, updatesortordererror);
                    };
                });
            }
        };

        /*GO TO CARD CREATOR*/
        $scope.gotocardcreator = function (cid) {
            $location.path('/cardcreator/' + cid);
        };

        /*UPLOAD IMAGE*/
        var uploader = $scope.uploader = new FileUploader({
            url: 'http://localhost/rest/rest/index.php/subjects/uploadsubjectimage',
            autoUpload: true,
        });

        // FILTERS

        uploader.filters.push({
            name: 'customFilter',
            fn: function (item /*{File|FileLikeObject}*/ , options) {
                return this.queue.length < 10;
            }
        });

        // CALLBACKS

        uploader.onWhenAddingFileFailed = function (item /*{File|FileLikeObject}*/ , filter, options) {
            console.info('onWhenAddingFileFailed', item, filter, options);
        };
        uploader.onAfterAddingFile = function (fileItem) {
            console.info('onAfterAddingFile', fileItem);
        };
        uploader.onAfterAddingAll = function (addedFileItems) {
            console.info('onAfterAddingAll', addedFileItems);
        };
        uploader.onBeforeUploadItem = function (item) {
            console.info('onBeforeUploadItem', item);
        };
        uploader.onProgressItem = function (fileItem, progress) {
            console.info('onProgressItem', fileItem, progress);
        };
        uploader.onProgressAll = function (progress) {
            console.info('onProgressAll', progress);
        };
        uploader.onSuccessItem = function (fileItem, response, status, headers) {
            console.info('onSuccessItem', fileItem, response, status, headers);
            $('.alert').addClass('hide');
            if (response.error) {
                $('.alert-danger').html(response.message).removeClass('hide');
            } else {
                $scope.img = response.newfilename;
            }
        };
        uploader.onErrorItem = function (fileItem, response, status, headers) {
            console.info('onErrorItem', fileItem, response, status, headers);
        };
        uploader.onCancelItem = function (fileItem, response, status, headers) {
            console.info('onCancelItem', fileItem, response, status, headers);
        };
        uploader.onCompleteItem = function (fileItem, response, status, headers) {
            console.info('onCompleteItem', fileItem, response, status, headers);
        };
        uploader.onCompleteAll = function () {
            console.info('onCompleteAll');
        };

        console.info('uploader', uploader);
    }
]);

phonecatControllers.controller('addsyllabusdataCtrl', ['$scope', 'TemplateService', 'NavigationService', '$routeParams', '$location',
    function ($scope, TemplateService, NavigationService, $routeParams, $location) {
        $scope.template = TemplateService;
        TemplateService.content = "views/addsyllabusdata.html";
        $scope.title = "syllabus";

        /*GET PARAMS*/
        $scope.editid = $routeParams.editid;
        $scope.addname = $routeParams.addname;
        $scope.parentid = $routeParams.parentid;

        $scope.data = {
            'name': '',
            'image': '',
            'color': ''
        };

        $scope.createdata = function () {
            var createdatasuccess = function (response) {
                console.log(response.data);
                if (response.data != 'false') {
                    $location.path('/syllabus');
                };
            };
            var createdataerror = function (response) {
                console.log(response.data);
            };
            NavigationService.createdata($scope.data.name, $scope.parentid, $scope.addname).then(createdatasuccess, createdataerror);
        };
    }
]);

phonecatControllers.controller('questionsCtrl', ['$scope', 'TemplateService', 'NavigationService', '$location', '$http', '$rootScope', '$interval',
    function ($scope, TemplateService, NavigationService, $location, $http, $rootScope, $interval) {
        $scope.template = TemplateService;
        TemplateService.content = "views/questions.html";
        $scope.title = "questions";

        /*INITIALIZATION*/

        $scope.search = {
            id: ""
        };

        if ($rootScope.qafilter) {

            console.log("Take from rootscope");

            $scope.questions = $rootScope.questions;
            $scope.boards = $rootScope.boards;
            $scope.standards = $rootScope.standards;
            $scope.subjects = $rootScope.subjects;
            $scope.chapters = $rootScope.chapters;
            $scope.concepts = $rootScope.concepts;
            $scope.users = $rootScope.users;

            $scope.filter = $rootScope.qafilter;

            console.log($scope.filter);

        } else {

            console.log("Fresh maal");

            $scope.questions = [];
            $scope.boards = [];
            $scope.standards = [];
            $scope.subjects = [];
            $scope.chapters = [];
            $scope.concepts = [];
            $scope.users = [];

            $rootScope.questions = [];
            $rootScope.boards = [];
            $rootScope.standards = [];
            $rootScope.subjects = [];
            $rootScope.chapters = [];
            $rootScope.concepts = [];
            $rootScope.users = [];

            $scope.filter = {
                'count': 0,
                'userid': $rootScope.user.id,
                'access': $rootScope.user.access_id,
                'limit': "20",
                'conceptid': '0',
                'chapterid': '0',
                'subjectid': '0',
                'standardid': '0',
                'boardid': '0'
            };

            $rootScope.qafilter = {
                'count': 0,
                'userid': $rootScope.user.id,
                'access': $rootScope.user.access_id,
                'limit': 50,
                'conceptid': '0',
                'chapterid': '0',
                'subjectid': '0',
                'standardid': '0',
                'boardid': '0'
            };
        };

        $scope.currentpage = 0;
        $scope.srnumberreference = 0;

        var getquestionssuccess = function (response) {
            console.log(response.data);
            $scope.search.id = "";
            $scope.questions = response.data;

            for (var q = 0; q < $scope.questions.length; q++) {

            };
        };
        var getquestionserror = function (response) {
            console.log(response.data);
        };

        /*GET QUESTION COUNT*/
        var getquestionscountsuccess = function (response) {
            $scope.totalquestions = response.data;
            $scope.srnumberreference = $scope.currentpage;
            $scope.totalpages = Math.ceil($scope.totalquestions / $scope.filter.limit);
        };
        var getquestionscounterror = function () {
            console.log(response.data);
        };

        /*
          PARAMS TO SEND GET QUESTIONS
          1: current count
          2: limit
          3: chapter id OR 0
          4: subject id OR o
          5: standard id or 0
        */

        /*$rootScope.$watch(function () {
            var math = document.getElementById("mathtablequestion");
            MathJax.Hub.Queue(["Typeset", MathJax.Hub], math);
            return true;
        });*/

        var getquestions = function () {
            NavigationService.getquestions($scope.filter).then(getquestionssuccess, getquestionserror);
            NavigationService.getquestionscount($scope.filter).then(getquestionscountsuccess, getquestionscounterror);
        };

        /*WHEN NEXT AND PREVIOUS BUTTON CLICKED*/
        $scope.getpagedata = function (inc) {
            $scope.currentpage += inc;
            $scope.filter.count = $scope.currentpage * $scope.filter.limit;
            getquestions();
        }

        $scope.pagenumber = 0;
        $scope.fetchquestions = function () {
            getquestions();
        };

        $scope.getdata = function (objname, id) {
            var getdatasuccess = function (response) {
                console.log(response.data);
                $scope[objname] = response.data;
                $rootScope[objname] = response.data;

                getquestions();
            };

            $scope.currentpage = 0;
            $scope.filter.count = '0';
            $rootScope.qafilter.count = '0';

            var getdataerror = function (response) {
                console.log(response.data, id);
            };
            if (objname == 'standards' || objname == 'subjects' || objname == 'chapters' || objname == 'concepts') {
                $scope.filter.conceptid = '0';
                $rootScope.qafilter.conceptid = '0';
                $scope.concepts = [];
            };
            if (objname == 'standards' || objname == 'subjects' || objname == 'chapters') {
                $scope.filter.chapterid = '0';
                $rootScope.qafilter.chapterid = '0';
                $scope.chapters = [];
            };
            if (objname == 'standards' || objname == 'subjects') {
                $scope.filter.subjectid = '0';
                $rootScope.qafilter.subjectid = '0';
                $scope.subjects = [];
            };
            if (objname == 'standards') {
                $scope.filter.standardid = '0';
                $rootScope.qafilter.standardid = '0';
                $scope.standards = [];
            };
            if (objname == 'concepts') {
                getquestions();
            };
            if (objname == 'conceptquestion' || objname == 'user') {
                if (objname == 'user') {
                    if ($rootScope.user.id == id) {
                        $scope.filter.userid = id;
                        $scope.filter.access = '1';
                        $rootScope.qafilter.userid = id;
                        $rootScope.qafilter.access = '1';
                    } else {
                        $scope.filter.userid = id;
                        $scope.filter.access = '2';
                        $rootScope.qafilter.userid = id;
                        $rootScope.qafilter.access = '2';
                    };
                };
                getquestions();
            } else {
                NavigationService.getdata(id, objname).then(getdatasuccess, getdataerror);
            };

        };

        /*SEARCH QUESTION BY ID*/
        $scope.searchquestionbyid = function () {
            console.log($scope.search.id);
            var searchquestionbyidsuccess = function (response) {
                console.log(response.data);
                $scope.srnumberreference = 0;
                $scope.questions = [];
                $scope.questions.push(response.data);
                $scope.totalquestions = 1;
                $scope.totalpages = 1;
            };
            var searchquestionbyiderror = function (response) {
                console.log(response.data);
            };
            NavigationService.searchquestionbyid($scope.search.id).then(searchquestionbyidsuccess, searchquestionbyiderror);
        };

        /*REMOVE SEARCH*/
        $scope.checksearchremove = function () {
            if ($scope.search.id == "") {
                getquestions();
            };
        };

        /*GET ALL BOARDS INITIALLY*/
        var getboardssuccess = function (response) {
            console.log(response.data);
            $scope.boards = response.data;

            NavigationService.getquestions($scope.filter).then(getquestionssuccess, getquestionserror);
            NavigationService.getquestionscount($scope.filter).then(getquestionscountsuccess, getquestionscounterror);
        };
        var getboardserror = function (response) {
            console.log(response.data);
        };
        NavigationService.getboards().then(getboardssuccess, getboardserror);

        //GET ALL USERS IF ADMIN
        if ($rootScope.user.access_id == 1) {
            var geteditorsandteacherssuccess = function (response) {
                console.log(response.data);
                $scope.users = response.data;
            };
            var geteditorsandteacherserror = function (response) {
                console.log(response.data);
            };
            NavigationService.geteditorsandteachers().then(geteditorsandteacherssuccess, geteditorsandteacherserror);
        };

        //CREATE / EDIT
        $scope.gotocreatequestion = function (id) {
            $rootScope.qafilter = $scope.filter;
            $location.path('/createquestion/' + id);
        };

        //DELETE QUESTION
        $scope.deletequestion = function (id) {
            var deletequestionandanswersuccess = function (response) {
                console.log(response.data);
                NavigationService.getquestions($scope.filter).then(getquestionssuccess, getquestionserror);
                NavigationService.getquestionscount($scope.filter).then(getquestionscountsuccess, getquestionscounterror);
            };
            var deletequestionandanswererror = function (response) {
                console.log(response.data);
            };
            NavigationService.deletequestionandanswer(id).then(deletequestionandanswersuccess, deletequestionandanswererror);
        };
        $scope.gotoupload = function () {

        };

        /*UPLOAD EXCEL*/
        $scope.files = [];

        $scope.LoadFileData = function (files) {
            $scope.files = files;
        };

        $scope.submit = function () {

            $rootScope.showupload = true;
            functioncomplete = false;
            gifcomplete = false;

            $interval(function () {
                if (functioncomplete) {
                    $rootScope.showupload = false;
                };
                gifcomplete = true;
            }, 3300, 1);

            var formdata = new FormData();
            formdata.append('file', $scope.files[0]);
            formdata.append('userid', $rootScope.user.id);



            NavigationService.bulkuploadquestions(formdata).success(function (response) {
                console.log(response);
                $('#quesexcelinp').val('');
                $scope.files = [];

                functioncomplete = true;
                if (gifcomplete) {
                    $rootScope.showupload = false;
                };
                NavigationService.getquestions($scope.filter).then(getquestionssuccess, getquestionserror);
                NavigationService.getquestionscount($scope.filter).then(getquestionscountsuccess, getquestionscounterror);
            });
        };

        $scope.getTheFiles = function ($files) {
            angular.forEach($files, function (value, key) {
                formdata.append(key, value);
            });
        };

        // NOW UPLOAD THE FILES.
        $scope.uploadFiles = function () {

            console.log(formdata);

            var request = {
                method: 'POST',
                url: adminurl + 'questions/bulkupload',
                data: formdata,
                headers: {
                    'Content-Type': undefined
                }
            };

            // SEND THE FILES.
            return $http(request)
                .success(function (d) {
                    alert(d);
                })
                .error(function () {});
        };
    }
]);

phonecatControllers.controller('createquestionCtrl', ['$scope', 'TemplateService', 'NavigationService', '$location', '$routeParams', 'textAngularManager', '$rootScope', '$interval', '$anchorScroll',
    function ($scope, TemplateService, NavigationService, $location, $routeParams, textAngularManager, $rootScope, $interval, $anchorScroll) {
        $scope.template = TemplateService;
        TemplateService.content = "views/createquestion.html";
        $scope.title = "questions";

        //INITIALIZATIONS
        $scope.user = $rootScope.user;
        //GET FORM TYPE
        $scope.editid = $routeParams.editid; //0->Create OR Edit

        /*INITIALIZE MATHS TOOLBAR*/
        $rootScope.math = {
            'code': 'Abhay'
        };
        $scope.code = {
            'question': '',
            'answer': ''
        };

        /*SETTING UP PAGE*/
        $interval(function () {

            $(document).ready(function () {
                $('.collapsible').collapsible();
            });

        }, 1000, 1);

        /*$rootScope.$watch(function () {
            var math = document.getElementById("MathExample");
            MathJax.Hub.Queue(["Typeset", MathJax.Hub],math);
            return true;
        });*/

        var matheditor;
        var objectname = '';
        $scope.setdatavariable = function (ind) {
            objectname = ind;
            if (ind.slice(0, 6) != 'option') {
                if (ind == 'answer') {
                    matheditor = editor2;
                } else {
                    matheditor = editor;
                };
            } else {
                //IF OPTION
                matheditor = editor3;
            };

            console.log(objectname);
        };

        /*SET THE SELECTED EQUATIONINTO THE EDITOR*/
        $rootScope.setselectedtextintoeditor = function () {
            var text = "";
            if (window.getSelection) {
                text = window.getSelection().toString();
            } else if (document.selection && document.selection.type != "Control") {
                text = document.selection.createRange().text;
            }

            //NEED TO DO THIS TWICE
            text = text.replace("$$", "");
            text = text.replace("$$", "");

            /*CONVERT LATEX TO MATHML*/
            var latex2mathmlsuccess = function (response) {
                console.log(response.data);
                matheditor.setMathML(response.data);
            };
            var latex2mathmlerror = function (response) {
                console.log(response.data);
            };
            NavigationService.latextomathml(text).then(latex2mathmlsuccess, latex2mathmlerror);
        };

        $rootScope.modalchange = function (ind) {
            var math = $('#MathExample');
            if (objectname.slice(0, 6) != 'option') {
                console.log($scope[objectname][objectname]);
                $scope.code.question = $scope[objectname][objectname];
            } else {
                $scope.code.question = $scope.answer[objectname];
            };
            console.log($scope.code.question);
            if (ind == 1) {
                $('#modal1').show();
                //MathJax.Hub.Queue(["Typeset", MathJax.Hub],math);
            } else {
                $('#modal1').hide();
            };

            $anchorScroll('#modal1');

            $interval(function () {
                MathJax.Hub.Queue(["Typeset", MathJax.Hub, "MathExample"]);
            }, 500, 1);
        };

        var editor;
        $scope.loadmathseditor = function () {
            editor = com.wiris.jsEditor.JsEditor.newInstance({
                'language': 'en'
            });
            editor2 = com.wiris.jsEditor.JsEditor.newInstance({
                'language': 'en'
            });
            editor3 = com.wiris.jsEditor.JsEditor.newInstance({
                'language': 'en'
            });
            editor.insertInto(document.getElementById('editorContainer'));
            editor2.insertInto(document.getElementById('editorContainer2'));
            editor3.insertInto(document.getElementById('editorContainer3'));

            $interval(function () {
                $('.wrs_linksContainer').remove();
                $('.wrs_context').remove();

                $(document).ready(function () {
                    $('.collapsible').collapsible();
                });

            }, 1000, 1);
        };
        //Here your view content is fully loaded !!


        $rootScope.addmathequation = function (el) {
            console.log(editor.getMathML());
            var mathmltolatexsuccess = function (response) {
                console.log(response.data);
                var latexmath = '$$ ' + response.data + ' $$';

                $rootScope.math.code = latexmath;

                el.$editor().wrapSelection('insertHTML', $rootScope.math.code, true);

                $interval(function () {

                    console.log(objectname);
                    console.log($scope[objectname]);
                    console.log($scope[objectname][objectname]);
                }, 1000, 1);
                //textAngularManager.refreshEditor('carddata0');
            };

            var mathmltolatexerror = function (response) {
                console.log(response.data);
            };
            NavigationService.mathmltolatex(matheditor.getMathML()).then(mathmltolatexsuccess, mathmltolatexerror);
        };

        var setdropdownvalus = function (dropdownids) {

            console.log("BOARDS AVAILABLE ?");
            console.log($scope.boards);
            $scope.boardid = dropdownids.board;
            $scope.standardid = dropdownids.standard;
            $scope.subjectid = dropdownids.subject;

            for (var b = 0; b < $scope.boards.length; b++) {
                if ($scope.boards[b].id == $scope.boardid) {
                    $scope.dropdown.board = b;

                    for (var stdid = 0; stdid < $scope.boards[b].standards.length; stdid++) {
                        if ($scope.boards[b].standards[stdid].id == $scope.standardid) {
                            $scope.dropdown.standard = stdid;

                            for (var sb = 0; sb < $scope.boards[b].standards[stdid].subjects.length; sb++) {
                                if ($scope.boards[b].standards[stdid].subjects[sb].id == $scope.subjectid) {
                                    $scope.dropdown.subject = sb;
                                    console.log(sb);
                                    $scope.chapterchange('mark');
                                };
                            };
                        };
                    };
                };
            };

            /*SHOW LOADER*/
            $('#cqloadermodal').hide();
        };

        //GET ALL THE QUESTION TYPES
        var getallquestiontypes = function () {
            var getallquestiontypessuccess = function (response) {
                console.log(response.data);
                $scope.questiontypes = response.data;
            };
            var getallquestiontypeserror = function (response) {
                console.log(response.data);
                alert("Could not get question type, Try Refreshing the page.");
            };
            NavigationService.getallquestiontypes().then(getallquestiontypessuccess, getallquestiontypeserror);
        };
        getallquestiontypes();

        var getfulldropdown = function () {
            /*DROPDOWN ARRAY*/
            var getfulldropdownsuccess = function (response) {
                console.log(response.data);
                console.log($rootScope.question);
                console.log($rootScope.dropdownvals);
                $scope.boards = response.data;

                if ($scope.editid != "0") {
                    /*GET BOARD STANDARD SUBJECT VALUE AND DROPDOWNS*/
                    var getalleditdropdownssuccess = function (response) {
                        console.log(response.data);
                        $scope.dropdown = response.data;
                        setdropdownvalus(response.data);
                        console.log($scope.dropdown);
                    };
                    var getalleditdropdownserror = function (response) {
                        console.log(response.data);
                    };
                    NavigationService.getalleditdropdownid($scope.question.chapter_id).then(getalleditdropdownssuccess, getalleditdropdownserror);
                } else {
                    if ($rootScope.question) {
                        setdropdownvalus($rootScope.dropdownvals);
                    };
                };
            };
            var getfulldropdownerror = function (response) {
                console.log(response.data);
            };
            NavigationService.getfulldropdown().then(getfulldropdownsuccess, getfulldropdownerror);
        };


        if ($scope.editid != '0') {

            /*SHOW LOADER*/
            $('#cqloadermodal').show();

            var getquestionfulldatasuccess = function (response) {
                console.log(response.data);
                $scope.question = response.data.question;

                $scope.answer = response.data.answer;
                $scope.questionimage = response.data.questionimage;
                $scope.answerimage = response.data.answerimage;
                // $scope.question.type=response.data.question.questiontype_id;
                // $scope.question.questionverified=response.data.question.verified;
                // $scope.answer.answerverified=response.data.answer.answerverified;
                /*DROPDOWN ARRAY*/
                /*var getfulldropdownsuccess = function (response) {
                    console.log(response.data);
                    console.log($rootScope.question);
                    console.log($rootScope.dropdownvals);
                    $scope.boards = response.data;

                    //GET BOARD STANDARD SUBJECT VALUE AND DROPDOWNS
                    var getalleditdropdownssuccess = function (response) {
                        console.log(response.data);
                        $scope.dropdown = response.data;
                        setdropdownvalus(response.data);
                        console.log($scope.dropdown);
                    };
                    var getalleditdropdownserror = function (response) {
                        console.log(response.data);
                    };
                    NavigationService.getalleditdropdownid($scope.question.chapter_id).then(getalleditdropdownssuccess, getalleditdropdownserror);
                };
                var getfulldropdownerror = function (response) {
                    console.log(response.data);
                };
                NavigationService.getfulldropdown().then(getfulldropdownsuccess, getfulldropdownerror);*/
                getfulldropdown();

            };
            var getquestionfulldataerror = function (response) {
                console.log(response.data);
            };
            NavigationService.getquestionfulldata($scope.editid).then(getquestionfulldatasuccess, getquestionfulldataerror);

        } else {

            $scope.question = {
                'question': '',
                'chapter_id': '',
                'format': 1,
                'questiontype_id': '1',
                'optionsavailable': '0',
                'optionsformat': 1,
                'difficulty': '1',
                'marks': '0',
                'user_id': '1',
                'questionverified': '0'
            };
            $scope.answer = {
                'question_id': '',
                'answer': '',
                'option1': '',
                'option2': '',
                'option3': '',
                'option4': '',
                'answerformat': 1,
                'optionformat': 1,
                'answerverified': '0'
            };

            if ($rootScope.question) {
                $scope.question.chapter_id = $rootScope.question.chapter_id;
                $scope.question.format = $rootScope.question.format;
                $scope.question.questiontype_id = $rootScope.question.questiontype_id;
                $scope.question.optionsavailable = $rootScope.question.optionsavailable;
                $scope.question.difficulty = $rootScope.question.difficulty;
                $scope.dropdown = $rootScope.dropdown;
                console.log($scope.dropdown);
                console.log($rootScope.dropdownvals);

            };

            getfulldropdown();

            /*DROPDOWN ARRAY*/
            /*var getfulldropdownsuccess = function (response) {
                console.log(response.data);
                console.log($rootScope.question);
                console.log($rootScope.dropdownvals);
                $scope.boards = response.data;
                if ($scope.editid == "0" && $rootScope.question) {
                    setdropdownvalus($rootScope.dropdownvals);
                };
            };
            var getfulldropdownerror = function (response) {
                console.log(response.data);
            };
            NavigationService.getfulldropdown().then(getfulldropdownsuccess, getfulldropdownerror);*/
        };

        $scope.dropdown = {
            'board': 'noboard',
            'standard': 'nostandard',
            'subject': 'nosubject'
        };

        $scope.concept = {
            'concepts': []
        };

        $scope.chapterchange = function (ed) {
            for (var con = 0; con < $scope.boards[$scope.dropdown.board].standards[$scope.dropdown.standard].subjects[$scope.dropdown.subject].chapters.length; con++) {
                if ($scope.boards[$scope.dropdown.board].standards[$scope.dropdown.standard].subjects[$scope.dropdown.subject].chapters[con].id == $scope.question.chapter_id) {
                    $scope.conceptsdropdown = $scope.boards[$scope.dropdown.board].standards[$scope.dropdown.standard].subjects[$scope.dropdown.subject].chapters[con].concepts;

                    var getquestionconceptssuccess = function (response) {
                        console.log(response.data);
                        if (response.data.length > 0) {
                            _.forEach($scope.conceptsdropdown, function (value, key) {
                                console.log(key);
                                console.log(value);
                                if (_.indexOf(response.data, value.id) > -1) {
                                    $scope.concept.concepts[key] = true;
                                };
                            });
                        };
                    };
                    var getquestionconceptserror = function (response) {
                        console.log(response.data);
                    };
                    NavigationService.getquestionconcepts($scope.editid).then(getquestionconceptssuccess, getquestionconceptserror);
                };
            };
        };

        /*REMOVE IMAGE*/
        $scope.removeimage = function (ind) {
            if (ind == "question") {
                $scope.questionimage = "";
            } else {
                $scope.answerimage = "";
            };

            var removeimagesuccess = function (response) {
                console.log(response.data);
            };
            var removeimageerror = function (response) {
                console.log(response.data);
            };
            NavigationService.removeimage(ind, $scope[ind].id).then(removeimagesuccess, removeimageerror);
        };




        $scope.goback = function () {
            $location.path('/questions');
        };

        $scope.checkcons = function () {
            for (var cs = 0; cs < $scope.concept.concepts.length; cs++) {
                if ($scope.concept.concepts[cs]) {
                    console.log(cs);
                } else {

                };
            };
        };


        /*STORE IMAGE IN FILES*/
        $scope.files = [];
        $scope.LoadFileData = function (files, ind) {
            $scope.files[ind] = files[0];
        };

        $scope.showfile = function () {
            console.log($scope.files[0]);
        };

        /*UPLOAD QUESTION-ANSWER-IMAGE-CONCEPTS*/
        $scope.submit = function () {

            /*SHOW LOADER*/
            $('#cqloadermodal').show();

            /*STORE FOR NEXT TIME*/
            $rootScope.question = $scope.question;
            $rootScope.dropdown = $scope.dropdown;
            $rootScope.dropdownvals = {
                board: 0,
                standard: 0,
                subject: 3
            };

            for (var b = 0; b < $scope.boards.length; b++) {
                if (b == $scope.dropdown.board) {
                    $rootScope.dropdownvals.board = $scope.boards[b].id;
                    for (s = 0; s < $scope.boards[b].standards.length; s++) {
                        if (s == $scope.dropdown.standard) {
                            $rootScope.dropdownvals.standard = $scope.boards[b].standards[s].id;
                            for (sub = 0; sub < $scope.boards[b].standards[s].subjects.length; sub++) {
                                if (sub == $scope.dropdown.subject) {
                                    $rootScope.dropdownvals.subject = $scope.boards[b].standards[s].subjects[sub].id;
                                }
                            }
                        }
                    };
                }
            };

            console.log($scope.dropdown);

            var formdata = new FormData();

            angular.forEach($scope.question, function (value, key) {
                console.log(value);
                formdata.append(key, value);
            });
            formdata.append('user_id', $rootScope.user.id);
            angular.forEach($scope.answer, function (value, key) {
                formdata.append(key, value);
            });

            //console.log($scope.files);
            formdata.append('questionimage', $scope.files[0]);
            formdata.append('answerimage', $scope.files[1]);
            if ($scope.editid != 0) {
                formdata.append('questionid', $scope.question.id);
                formdata.append('answerid', $scope.answer.id);
            };

            var conceptsarray = [];
            for (var cs = 0; cs < $scope.concept.concepts.length; cs++) {
                if ($scope.concept.concepts[cs]) {
                    conceptsarray.push($scope.conceptsdropdown[cs].id);
                };
            };
            formdata.append('concepts', conceptsarray);

            if ($scope.editid == 0) {
                console.log($scope.question)
                NavigationService.uploadfullquestiondata(formdata).success(function (response) {
                    console.log(response);
                    /*HIDE LOADER*/
                    $('#cqloadermodal').hide();
                    $location.path('/questions');
                });
            } else {
                console.log($scope.question);
                NavigationService.editfullquestiondata(formdata).success(function (response) {
                    console.log(response);
                    /*HIDE LOADER*/
                    $('#cqloadermodal').hide();
                    $location.path('/questions');
                });
            };
        };

        $scope.createquestion = function () {
            if ($scope.editid != '0') {

                var editquestionsuccess = function (response) {
                    console.log(response.data);
                    if (response.data == 'true') {

                        var editanswersuccess = function (response) {
                            console.log(response.data);
                            if (response.data == 'true') {

                                var removeallconceptssuccess = function (response) {
                                    console.log(response.data);
                                    if (response.data == 'true') {
                                        concount = 0;
                                        for (var cs = 0; cs < $scope.concept.concepts.length; cs++) {
                                            if ($scope.concept.concepts[cs]) {

                                                var addconcepttoquestionsuccess = function (response) {
                                                    console.log(response.data);
                                                    concount++;
                                                    if (concount == $scope.concept.concepts.length) {
                                                        $scope.goback();
                                                    };
                                                };
                                                var addconcepttoquestionerror = function (response) {
                                                    console.log(response.data);
                                                };
                                                NavigationService.addconcepttoquestion($scope.answer.question_id, $scope.conceptsdropdown[cs].id).then(addconcepttoquestionsuccess, addconcepttoquestionerror);
                                            } else {
                                                concount++;
                                                if (concount == $scope.concept.concepts.length) {
                                                    $scope.goback();
                                                };
                                            };
                                        };
                                    };
                                };
                                var removeallconceptserror = function (response) {
                                    console.log(response.data);
                                };
                                NavigationService.removeallconcepts($scope.editid).then(removeallconceptssuccess, removeallconceptserror);
                            };

                        };
                        var editanswererror = function (response) {
                            console.log(response.data);
                        };
                        console.log($scope.answer);
                        NavigationService.editanswer($scope.answer).then(editanswersuccess, editanswererror);
                    };
                };
                var editquestionerror = function (response) {
                    console.log(response.data);
                };
                NavigationService.editquestion($scope.question).then(editquestionsuccess, editquestionerror);

            } else {

                console.log($scope.question);
                console.log($scope.answer);

                var createquestionsuccess = function (response) {
                    console.log(response.data);
                    if (response.data == 'false') {
                        //SHOW ERROR

                    } else {
                        $scope.answer.question_id = response.data;

                        var createanswersuccess = function (response) {
                            console.log(response.data);
                            if (response.data == 'false') {
                                //SHOW ERROR

                            } else {
                                concount = 0;
                                for (var cs = 0; cs < $scope.concept.concepts.length; cs++) {
                                    if ($scope.concept.concepts[cs]) {

                                        var addconcepttoquestionsuccess = function (response) {
                                            console.log(response.data);
                                            concount++;
                                            if (concount == $scope.concept.concepts.length) {
                                                $scope.goback();
                                            };
                                        };
                                        var addconcepttoquestionerror = function (response) {
                                            console.log(response.data);
                                        };
                                        NavigationService.addconcepttoquestion($scope.answer.question_id, $scope.conceptsdropdown[cs].id).then(addconcepttoquestionsuccess, addconcepttoquestionerror);
                                    } else {
                                        concount++;
                                        if (concount == $scope.concept.concepts.length) {
                                            $scope.goback();
                                        };
                                    };
                                };
                            };
                        };
                        var createanswererror = function (response) {
                            console.log(response.data);
                        };
                        console.log($scope.answer);
                        NavigationService.createanswer($scope.answer).then(createanswersuccess, createanswererror);
                    };
                };
                var createquestionerror = function (response) {
                    console.log(response.data);
                };


                console.log($scope.concept);
                NavigationService.createquestion($scope.question).then(createquestionsuccess, createquestionerror);
            };
        };
    }
]);

phonecatControllers.controller('cardcreatorCtrl', ['$scope', 'TemplateService', 'NavigationService', '$location', '$routeParams', 'textAngularManager', 'FileUploader', '$filter', '$rootScope', '$window', '$interval', '$anchorScroll',
    function ($scope, TemplateService, NavigationService, $location, $routeParams, textAngularManager, FileUploader, $filter, $rootScope, $window, $interval, $anchorScroll) {
        $scope.template = TemplateService;
        TemplateService.content = "views/cardcreator.html";
        $scope.title = "syllabus";

        //GET FORM TYPE
        $scope.editid = $routeParams.editid; //0->Create OR Edit

        /*CREATE CARDS ARRAY*/
        $scope.cards = [];
        $scope.card = {
            'id': 0,
            'conceptdata': 'Write Content Here',
            'loadmoredata': 'nothing',
            'sync': false
        };

        $rootScope.math = {
            'code': 'Abhay'
        };

        var editor;

        /*SET THE SELECTED EQUATIONINTO THE EDITOR*/
        $rootScope.setselectedtextintoeditor = function () {
            var text = "";
            if (window.getSelection) {
                text = window.getSelection().toString();
            } else if (document.selection && document.selection.type != "Control") {
                text = document.selection.createRange().text;
            }
            text = text.replace("$$", "");
            text = text.replace("$$", "");

            /*CONVERT LATEX TO MATHML*/
            var latex2mathmlsuccess = function (response) {
                console.log(response.data);
                editor.setMathML(response.data);
            };
            var latex2mathmlerror = function (response) {
                console.log(response.data);
            };
            NavigationService.latextomathml(text).then(latex2mathmlsuccess, latex2mathmlerror);
        };
        /* window.onload = function () {
             editor = com.wiris.jsEditor.JsEditor.newInstance({
                 'language': 'en'
             });
             editor.insertInto(document.getElementById('editorContainer'));
         };*/

        $scope.loadmathseditor = function () {
            editor = com.wiris.jsEditor.JsEditor.newInstance({
                'language': 'en'
            });
            editor.insertInto(document.getElementById('editorContainer'));
        };
        //Here your view content is fully loaded !!
        $interval(function () {
            $('.wrs_linksContainer').remove();
            $('.wrs_context').remove();
        }, 2000, 1);

        //CARD VIEWER SET INDEX
        $scope.code = {
            'question': '',
            'answer': ''
        };
        $scope.setdatavariable = function (ind) {
            objectname = ind;
            console.log(objectname);
        };

        //OPEN CARD VIEWER
        $rootScope.modalchange = function (ind) {
            var math = $('#MathExample');
            $scope.code.question = $scope.cards[objectname].conceptdata;
            console.log($scope.code.question);
            if (ind == 1) {
                $('#modal1').show();
                //MathJax.Hub.Queue(["Typeset", MathJax.Hub],math);
            } else {
                $('#modal1').hide();
            };

            $anchorScroll('#modal1');

            $interval(function () {
                MathJax.Hub.Queue(["Typeset", MathJax.Hub, "MathExample"]);
            }, 500, 1);
        };

        $rootScope.addmathequation = function (el) {
            console.log(editor.getMathML());
            var mathmltolatexsuccess = function (response) {
                console.log(response.data);
                var latexmath = '$$ ' + response.data + ' $$';

                $rootScope.math.code = latexmath;

                el.$editor().wrapSelection('insertHTML', $rootScope.math.code, true);

                textAngularManager.refreshEditor('carddata0');
            };
            var mathmltolatexerror = function (response) {
                console.log(response.data);
            };
            NavigationService.mathmltolatex(editor.getMathML()).then(mathmltolatexsuccess, mathmltolatexerror);
        };

        /*GET CARDS BY CONCEPT ID*/
        var getcardsbyconceptidsuccess = function (response) {
            console.log(response.data);
            if (response.data.length == 0) {
                $scope.cards.push($scope.card);
            } else {
                var dataarray = [];
                _.forEach(response.data, function (value) {
                    console.log(value);

                    _.replace(value.conceptdata, '<img src="', '<img src+"' + imageurl);

                    value.sync = true;
                });
                $scope.cards = response.data;
            };
        };
        var getcardsbyconceptiderror = function (response) {
            console.log(response.data);
        };
        NavigationService.getcardsbyconceptid($scope.editid).then(getcardsbyconceptidsuccess, getcardsbyconceptiderror);

        $scope.version = textAngularManager.getVersion();
        $scope.versionNumber = $scope.version.substring(1);
        $scope.disabled = false;

        /*CANCEL CREATION*/
        $scope.goback = function () {
            $location.path('/syllabus');
        };

        /*CHAPTER REORDER*/
        $scope.sortableOptions = {
            update: function (e, ui) {
                console.log("UPDATE");
            },
            stop: function (e, ui) {
                console.log("STOP");
                console.log($scope.cards);

                _.forEach($scope.cards, function (value, key) {
                    var updatesortordersuccess = function (response) {
                        console.log(response.data);
                    };
                    var updatesortordererror = function (response) {
                        console.log(response.data);
                    };

                    var so = key + 1;

                    if (value.id) {
                        console.log(value);
                        NavigationService.updatecardsortorder(value.id, so).then(updatesortordersuccess, updatesortordererror);
                    };
                });
            }
        };

        $scope.changeposition = function (ind, change) {
            if ((ind + change) > 0 || (ind + change) < $scope.cards.length) {

                console.log($scope.cards);

                var tempcard1 = $scope.cards[ind];
                var tempcard2 = $scope.cards[ind + change];

                $scope.cards[ind] = tempcard2;
                $scope.cards[ind + change] = tempcard1;

                console.log($scope.cards);

                _.forEach($scope.cards, function (value, key) {
                    var updatesortordersuccess = function (response) {
                        console.log(response.data);
                    };
                    var updatesortordererror = function (response) {
                        console.log(response.data);
                    };

                    var so = key + 1;

                    if (value.id) {
                        console.log(value);
                        NavigationService.updatecardsortorder(value.id, so).then(updatesortordersuccess, updatesortordererror);
                    };
                });
            };
        };

        $scope.createcard = function () {

            var cardnumber = 0;
            var checkfinish = 0;

            _.forEach($scope.cards, function (value, key) {

                if (value.sync == false) {

                    /**/
                    if (value.conceptdata == '') {
                        value.conceptdata = "No Content Here";
                    } else {
                        _.replace(value.conceptdata, imageurl, '');
                    };

                    /*ADD CARD TO DATABASE*/
                    var addcardsuccess = function (response) {
                        console.log(response.data);
                        checkfinish++
                        if (checkfinish == $scope.cards.length) {
                            $scope.goback();
                        };
                    };
                    var addcarderror = function (response) {
                        console.log(response.data);
                    };
                    cardnumber++;
                    NavigationService.addcard($scope.editid, cardnumber, value.conceptdata, value.loadmoredata).then(addcardsuccess, addcarderror);
                };

                if (value.sync == true) {

                    /*CONCACENATE LEFT AND RIGHT SIDE*/
                    if (value.conceptdata == '') {
                        value.conceptdata = "No Content Here";
                    };

                    var editcardsuccess = function (response) {
                        console.log(response.data);
                        checkfinish++
                        if (checkfinish == $scope.cards.length) {
                            $scope.goback();
                        };
                    };
                    var editcarderror = function (response) {
                        console.log(response.data);
                    };
                    cardnumber++;
                    NavigationService.editcard(value.id, $scope.editid, cardnumber, value.conceptdata, value.loadmoredata).then(editcardsuccess, editcarderror);
                };

                if (value.sync == 'delete') {
                    var deletecardsuccess = function (response) {
                        console.log(response.data);
                        checkfinish++;
                        if (checkfinish == $scope.cards.length) {
                            $scope.goback();
                        };
                    };
                    var deletecarderror = function (response) {
                        console.log(response.data);
                    };
                    NavigationService.deletecard(value.id).then(deletecardsuccess, deletecarderror);
                };
            });
        };

        /*ADD CARD*/
        $scope.addcard = function () {
            $scope.cards.push({
                'id': 0,
                'conceptdata': 'Write Content Here',
                'loadmoredata': 'nothing',
                'sync': false
            });
        };

        /*DUPLICATE CARD*/
        $scope.duplicatecard = function (ind) {
            $scope.cards.splice(ind + 1, 0, {
                'id': 0,
                'conceptdata': $scope.cards[ind].conceptdata,
                'loadmoredata': 'nothing',
                'sync': false
            });
        };

        /*LAYOUT MODE*/
        $scope.layoutmode = false;

        /*DELETE CARD*/
        $scope.deletecard = function (ind) {
            console.log(ind);
            if ($scope.cards[ind].id != 0) {
                $scope.cards[ind].sync = 'delete';
            } else {
                $scope.cards.splice(ind, 1);
            };
        };

        /*UPLOAD IMAGE*/
        var uploader = $scope.uploader = new FileUploader({
            url: 'http://localhost/rest/rest/index.php/subjects/uploadsubjectimage',
            autoUpload: true,
        });

        // FILTERS

        uploader.filters.push({
            name: 'customFilter',
            fn: function (item /*{File|FileLikeObject}*/ , options) {
                return this.queue.length < 10;
            }
        });

        // CALLBACKS

        uploader.onWhenAddingFileFailed = function (item /*{File|FileLikeObject}*/ , filter, options) {
            console.info('onWhenAddingFileFailed', item, filter, options);
        };
        uploader.onAfterAddingFile = function (fileItem) {
            console.info('onAfterAddingFile', fileItem);
        };
        uploader.onAfterAddingAll = function (addedFileItems) {
            console.info('onAfterAddingAll', addedFileItems);
        };
        uploader.onBeforeUploadItem = function (item) {
            console.info('onBeforeUploadItem', item);
        };
        uploader.onProgressItem = function (fileItem, progress) {
            console.info('onProgressItem', fileItem, progress);
        };
        uploader.onProgressAll = function (progress) {
            console.info('onProgressAll', progress);
        };
        uploader.onSuccessItem = function (fileItem, response, status, headers) {
            console.info('onSuccessItem', fileItem, response, status, headers);
            $('.alert').addClass('hide');
            if (response.error) {
                $('.alert-danger').html(response.message).removeClass('hide');
            } else {
                $scope.img = response.newfilename;
            }
        };
        uploader.onErrorItem = function (fileItem, response, status, headers) {
            console.info('onErrorItem', fileItem, response, status, headers);
        };
        uploader.onCancelItem = function (fileItem, response, status, headers) {
            console.info('onCancelItem', fileItem, response, status, headers);
        };
        uploader.onCompleteItem = function (fileItem, response, status, headers) {
            console.info('onCompleteItem', fileItem, response, status, headers);
        };
        uploader.onCompleteAll = function () {
            console.info('onCompleteAll');
        };

        console.info('uploader', uploader);

    }
]);

phonecatControllers.controller('cardviewerCtrl', ['$scope', 'TemplateService', 'NavigationService', '$routeParams', '$location',
    function ($scope, TemplateService, NavigationService, $routeParams, $location) {
        $scope.template = TemplateService;
        TemplateService.content = "views/cardviewer.html";
        $scope.title = "syllabus";

        //GET FORM TYPE
        $scope.editid = $routeParams.editid; //0->Create OR Edit

        /*CREATE CARDS ARRAY*/
        $scope.cards = [];
        $scope.card = {
            'id': 0,
            'conceptdata': 'Write Content Here',
            'loadmoredata': 'nothing',
            'sync': false
        };

        /*GET CARDS BY CONCEPT ID*/
        var getcardsbyconceptidsuccess = function (response) {
            console.log(response.data);
            if (response.data.length == 0) {
                $scope.cards.push($scope.card);
            } else {
                var dataarray = [];
                _.forEach(response.data, function (value) {
                    console.log(value);
                    console.log(value.conceptdata);

                    value.sync = true;
                });
                $scope.cards = response.data;
            };
        };
        var getcardsbyconceptiderror = function (response) {
            console.log(response.data);
        };
        NavigationService.getcardsbyconceptid($scope.editid).then(getcardsbyconceptidsuccess, getcardsbyconceptiderror);
    }
]);

phonecatControllers.controller('mathjaxeditorCtrl', ['$scope', 'TemplateService', 'NavigationService',
    function ($scope, TemplateService, NavigationService) {
        $scope.template = TemplateService;

        console.log("MATH JAX EDITOR");
    }
]);

phonecatControllers.controller('contact', ['$scope', 'TemplateService', 'NavigationService',
    function ($scope, TemplateService, NavigationService) {
        $scope.template = TemplateService;
    }
]);

phonecatControllers.controller('headerctrl', ['$scope', 'TemplateService', '$location', '$rootScope', 'NavigationService',
    function ($scope, TemplateService, $location, $rootScope, NavigationService) {

        $scope.template = TemplateService;
        console.log('Always called');
        /*INITIALIZATIONS*/
        $rootScope.user = $.jStorage.get("user");
        $scope.user = $.jStorage.get("user");


        $scope.userarray = userarray;
        var isloggedinsuccess = function (response) {
            console.log(response.data);
            if (response.data == "true") {

            } else {
                $location.path('/login');
            };
        };
        var isloggedinerror = function (response) {
            console.log(response.data);
        };
        //NavigationService.isloggedin($rootScope.user.email).then(isloggedinsuccess, isloggedinerror);
        //$rootScope.loginpage = false;

        $scope.logout = function () {
            $.jStorage.flush();
            $location.path('/login');
        };

        /*OPEN EQUATION EDITOR*/
        $rootScope.openequationeditor = function () {
            $('#equationeditor').show();
        };
        /*CLOSE EQUATION EDITOR*/
        $rootScope.closeequationeditor = function () {
            $('#equationeditor').hide();
        };

        //DROP IMAGE ON TEXT EDITOR
        $rootScope.dropHandler = function (file, insertAction) {
            if (file.type.substring(0, 5) !== "image") {
                // add your own code here
                alert("only images can be added");
                return;
            }
            if (file.size > 50000000) {
                // add your own code here
                alert("File size cannot exceed 5MB");
                return;
            };

            var formdata = new FormData();
            formdata.append('image', file);


            NavigationService.getimagename(formdata).success(function (response) {
                console.log(response);

                response = response.replace(/[\s]/g, '');
                response = imageurl + response;
                //var filterresponse = $filter('imagepath', response);
                // create a base64 string
                var reader = new FileReader();
                reader.onload = function () {
                    reader.result && insertAction("insertImage", response, true);
                };

                reader.readAsDataURL(file);
            });
            return true;
        };
    }
]);

phonecatControllers.controller('notificationsCtrl', ['$scope', 'TemplateService', '$location', '$rootScope', 'NavigationService',
    function ($scope, TemplateService, $location, $rootScope, NavigationService) {


        $scope.template = TemplateService;
        TemplateService.content = "views/notifications.html";
        $scope.title = "Notifications";

        /*INITIALIZATIONS*/
        $rootScope.user = $.jStorage.get("user");
        $scope.user = $.jStorage.get("user");

        /*routing*/
        $scope.goToCreate = function () {
            $location.path('/createnotification');
        };


    }
]);


phonecatControllers.controller('createNotificationCtrl', ['$scope', 'TemplateService', '$location', '$rootScope', 'NavigationService',
    function ($scope, TemplateService, $location, $rootScope, NavigationService) {


        $scope.template = TemplateService;
        TemplateService.content = "views/createNotification.html";
        $scope.title = "Create Notification";
        $scope.notification = {};
        /*INITIALIZATIONS*/
        $rootScope.user = $.jStorage.get("user");
        $scope.user = $.jStorage.get("user");



        /*Functions*/
        $scope.sendNotification = function () {
            NavigationService.sendnotification($scope.notification).then(function (response) {
                /*ON SUCCESS*/
                $('.notification-text').html($scope.notification.message);
                $('.inner-notification').addClass('show-inner-notification');
            }, function (error) {
                console.log("Internet error");

            });



        };

    }
]);



phonecatControllers.controller('centerdetailsCtrl', ['$scope', 'TemplateService', 'NavigationService', '$rootScope', '$filter', '$window', '$location',
    function ($scope, TemplateService, NavigationService, $rootScope, $filter, $window, $location) {

        $scope.template = TemplateService;
        TemplateService.content = "views/center-details.html";
        $scope.title = "Center Details";
        $scope.alldata = [];
        $scope.cities = [];
        $scope.centers = [];
        $scope.batches = [];
        $scope.details = [];
        $scope.newdata = {};

        $(document).ready(function () {
            $('.view-modal').modal();
        });

        $scope.showmodal = function (id, headertitle) {
            $scope.modalheader = id;
            $('.view-modal').show();

            //            if (id == 'centers') {
            //                $scope.key = 'centres';
            //                $scope.details = $scope.cities;
            //
            //            } else if (id == 'batches') {
            //                $scope.key = 'batches';
            //                $scope.details = $scope.centers;
            //            } else if (id == 'cities') {
            //                $scope.key = '';
            //                $scope.details = new Array($scope.cities.length);
            //            }
            console.log($scope.details);
        }
        $scope.closemodal = function (modalname) {
            $('.' + modalname).hide();
        }


        $scope.addnewvalue = function (header) {

            $scope.modalheader = header;
            $('.insert-modal').show();



        };


        insertbycontrollersuccess = function (response) {

            console.log(response);
        }
        insertbycontrollererror = function (error) {

            console.log(error);
        }

        $scope.adddata = function () {

            NavigationService.insertbycontroller($scope.modalheader, $scope.newdata).then(insertbycontrollersuccess, insertbycontrollererror)



        }

        deletedatasuccess = function (response) {
            consoole.log(response);
        }
        deletedataerror = function (error) {
            consoole.log(error);
        }

        $scope.deletedata = function (id) {

            NavigationService.deletebycontrollerandid($scope.modalheader, id).then(deletedatasuccess, deletedataerror)

        }



        $scope.addstudentsinbatches = function (id) {

            $location.path('/batch-user/' + id);

        }








        getallbatchessuccess = function (response) {
            console.log(response);
            $scope.alldata = response.data;

            $scope.alldata.forEach(function (value, key) {
                var citydata = {
                    id: value.id,
                    name: value.name,
                    centres: value.centres
                }

                $scope.cities.push(citydata);

                value.centres.forEach(function (center, key) {
                    var centerdata = {
                        id: center.id,
                        name: center.name,
                        batches: center.batches,
                        city: center.city
                    };
                    $scope.centers.push(centerdata);
                })



            });

            console.log($scope.cities, $scope.centers);

        }
        getallbatcheserror = function (error) {
            console.log(error);
        }
        NavigationService.getallbatches().then(getallbatchessuccess, getallbatcheserror);
    }
]);
phonecatControllers.controller('batchusersCtrl', ['$scope', 'TemplateService', 'NavigationService', '$rootScope', '$filter', '$window', '$location', '$routeParams',
    function ($scope, TemplateService, NavigationService, $rootScope, $filter, $window, $location, $routeParams) {

        $scope.template = TemplateService;
        TemplateService.content = "views/user_batch.html";
        var batch_id = $routeParams.batch_id;
        $scope.batchdetails = [];
        getstudentstoaddinbatchsuccess = function (response) {
            $scope.batchdetails = response.data;
            console.log(response);
        }
        getstudentstoaddinbatcherror = function (error) {
            console.log(error);
        }
        NavigationService.getstudentstoaddinbatch(batch_id).then(getstudentstoaddinbatchsuccess, getstudentstoaddinbatcherror);




        var addandremovestudent = function (addto, removefrom, student) {

            var index = $scope.batchdetails[removefrom].indexOf(student);
            console.log(index);
            if (index != -1) {
                $scope.batchdetails[removefrom].splice(index, 1);
            }


            $scope.batchdetails[addto].push(student);

        }

        $scope.removestudentfromgroup = function (student) {
            deletebycontrollerandidsuccess = function (response) {
                console.log(response);
                addandremovestudent('students_to_add', 'students', student);

            }
            deletebycontrollerandiderror = function (error) {
                console.log(error);
            }
            console.log(student);
            NavigationService.deletemanyby('user_batch', 'user_id', student.id).then(deletebycontrollerandidsuccess, deletebycontrollerandiderror);

        }

        $scope.addstudenttogroup = function (student) {

            insertbycontrollersuccess = function (response) {
                console.log(response);

                addandremovestudent('students', 'students_to_add', student);

            }
            insertbycontrollererror = function (error) {
                console.log(error);
            }

            console.log(student);
            var data = {
                batch_id: $scope.batchdetails.id,
                user_id: student.id
            }
            NavigationService.insertbycontroller('user_batch', data).then(insertbycontrollersuccess, insertbycontrollererror);

        }

    }])
