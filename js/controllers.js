var phonecatControllers = angular.module('phonecatControllers', ['templateservicemod', 'navigationservice']);

var adminurl = "http://localhost/rest/rest/index.php/";

phonecatControllers.controller('home', ['$scope', 'TemplateService', 'NavigationService', '$rootScope',
  function ($scope, TemplateService, NavigationService, $rootScope) {
        $scope.template = TemplateService;
        TemplateService.content = "views/content.html";
        $scope.title = "dashboard";
        $scope.navigation = NavigationService.getnav();
        $rootScope.loginpage = false;

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
  }]);

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
                console.log(response.data);
                if (response.data != 'false') {
                    $rootScope.loginpage = false;
                    $scope.user = response.data;
                    $location.path('/home');
                    //STORE IN JSTORAGE IF NEEDED
                };
            };
            var dologinerror = function (response) {
                console.log(response.data);
            };
            NavigationService.dologin($scope.logindata.email, $scope.logindata.password).then(dologinsuccess, dologinerror);
        };
  }]);

phonecatControllers.controller('usersCtrl', ['$scope', 'TemplateService', 'NavigationService', '$location',
  function ($scope, TemplateService, NavigationService, $location) {
        $scope.template = TemplateService;
        TemplateService.content = "views/users.html";
        $scope.title = "users";

        //SET USERR ACCESS TYPE
        $scope.users = [];
        $scope.pagenumber = 0;
        $scope.limit = 10;
        $scope.useraccesstype = 4;
        var getuserssuccess = function (response) {
            console.log(response.data);
            $scope.users = response.data.users;
            $scope.usercount = response.data.count;
        };
        var getuserserror = function (response) {
            console.log(response.data);
        };
        var getusers = function () {
            len = $scope.pagenumber * $scope.limit;
            NavigationService.getusers($scope.useraccesstype, len, $scope.limit).then(getuserssuccess, getuserserror);
        };
        getusers();
        $scope.changeuser = function (uat) {
            $scope.useraccesstype = uat;
            $scope.users = [];
            getusers();
        };

        $scope.changepage = function (page) {
            $scope.pagenumber = page;
            getusers();
        };


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

  }]);
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
            'board_id': '',
            'standard_id': '',
            'email': '',
            'contact': '',
            'password': '',
            'verified': 0
        };
        $scope.pass = {
            'confirmpassword': ''
        };

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




  }]);
phonecatControllers.controller('syllabusCtrl', ['$scope', 'TemplateService', 'NavigationService', '$location', 'FileUploader', '$rootScope',
  function ($scope, TemplateService, NavigationService, $location, FileUploader, $rootScope) {
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
                getboards();
            } else {
                $scope.addid = obj.id;
                getdata(currpath, obj.id);
            };

        };

        /*ADD DATA*/
        $scope.adddata = function () {
            $scope.path[$scope.path.currentpath].push({
                'name': 'ABC',
                'sync': false
            });
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
                NavigationService.createdata(obj.name, $scope.addid, $scope.path.currentpath, sortorder).then(createdatasuccess, createdataerror);
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


  }]);


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



  }]);

phonecatControllers.controller('questionsCtrl', ['$scope', 'TemplateService', 'NavigationService', '$location', '$http', '$rootScope', '$interval',
  function ($scope, TemplateService, NavigationService, $location, $http, $rootScope, $interval) {
        $scope.template = TemplateService;
        TemplateService.content = "views/questions.html";
        $scope.title = "questions";

        $scope.questions = [];

        var getquestionssuccess = function (response) {
            console.log(response.data);
            $scope.questions = response.data;
            for (var q = 0; q < $scope.questions.length; q++) {

            };
        };
        var getquestionserror = function (response) {
            console.log(response.data);
        };
        //GET QUESTIONS WITH LIMIT
        NavigationService.getquestions(0, 1000).then(getquestionssuccess, getquestionserror);

        //CREATE / EDIT
        $scope.gotocreatecustomer = function (id) {
            $location.path('/createquestion/' + id);
        };

        //DELETE QUESTION
        $scope.deletequestion = function (id) {
            var deletequestionandanswersuccess = function (response) {
                console.log(response.data);
                NavigationService.getquestions(0, 1000).then(getquestionssuccess, getquestionserror);
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
            formdata.append('userid', 1);



            NavigationService.bulkuploadquestions(formdata).success(function (response) {
                console.log(response);
                $('#quesexcelinp').val('');
                $scope.files = [];

                functioncomplete = true;
                if (gifcomplete) {
                    $rootScope.showupload = false;
                };


                NavigationService.getquestions(0, 1000).then(getquestionssuccess, getquestionserror);
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


}]);

phonecatControllers.controller('createquestionCtrl', ['$scope', 'TemplateService', 'NavigationService', '$location', '$routeParams', 'textAngularManager',
  function ($scope, TemplateService, NavigationService, $location, $routeParams, textAngularManager) {
        $scope.template = TemplateService;
        TemplateService.content = "views/createquestion.html";
        $scope.title = "questions";



        //GET FORM TYPE
        $scope.editid = $routeParams.editid; //0->Create OR Edit


        if ($scope.editid != '0') {

            var getquestionfulldatasuccess = function (response) {
                console.log(response.data);
                $scope.question = response.data.question;
                $scope.answer = response.data.answer;

                /*GET BOARD STANDARD SUBJECT VALUE AND DROPDOWNS*/
                var getalleditdropdownssuccess = function (response) {
                    console.log(response.data);

                    $scope.boardid = response.data.boardid;
                    $scope.standardid = response.data.standardid;
                    $scope.subjectid = response.data.subjectid;

                    for (var b = 0; b < $scope.boards.length; b++) {
                        if ($scope.boards[b].id == $scope.boardid) {
                            $scope.dropdown.board = b;

                            for (var stdid = 0; stdid < $scope.boards[b].standards.length; stdid++) {
                                if ($scope.boards[b].standards[stdid].id == $scope.standardid) {
                                    $scope.dropdown.standard = stdid;

                                    for (var sb = 0; sb < $scope.boards[b].standards[stdid].subjects.length; sb++) {
                                        if ($scope.boards[b].standards[stdid].subjects[sb].id == $scope.subjectid) {
                                            $scope.dropdown.subject = sb;

                                            $scope.chapterchange('mark');
                                        };
                                    };
                                };
                            };
                        };
                    };


                };
                var getalleditdropdownserror = function (response) {
                    console.log(response.data);
                };
                NavigationService.getalleditdropdownid($scope.question.chapter_id).then(getalleditdropdownssuccess, getalleditdropdownserror);
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
                'type': '1',
                'optionsavailable': '0',
                'difficulty': '1',
                'user_id': '1',
                'verified': '0'
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
                'user_id': '1'
            };
        };

        $scope.dropdown = {
            'board': 'noboard',
            'standard': '',
            'subject': ''
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

        var getfulldropdownsuccess = function (response) {
            console.log(response.data);
            $scope.boards = response.data;
        };
        var getfulldropdownerror = function (response) {
            console.log(response.data);
        };
        NavigationService.getfulldropdown().then(getfulldropdownsuccess, getfulldropdownerror);

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



  }]);

phonecatControllers.controller('cardcreatorCtrl', ['$scope', 'TemplateService', 'NavigationService', '$location', '$routeParams', 'textAngularManager', 'FileUploader',
  function ($scope, TemplateService, NavigationService, $location, $routeParams, textAngularManager, FileUploader) {
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

        $scope.createcard = function () {

            var cardnumber = 0;
            var checkfinish = 0;

            _.forEach($scope.cards, function (value, key) {

                if (value.sync == false) {

                    /**/
                    if (value.conceptdata == '') {
                        value.conceptdata = "No Content Here";
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

}]);

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


  }]);

phonecatControllers.controller('contact', ['$scope', 'TemplateService', 'NavigationService',
  function ($scope, TemplateService, NavigationService) {
        $scope.template = TemplateService;
  }]);


phonecatControllers.controller('headerctrl', ['$scope', 'TemplateService', '$location', '$rootScope',
 function ($scope, TemplateService, $location, $rootScope) {
        $scope.template = TemplateService;

        console.log('HEADER CTRL');
        $rootScope.loginpage = false;

        $scope.logout = function () {
            $location.path('/login');
        };
  }]);
