var navigationservice = angular.module('navigationservice', [])

    .factory('NavigationService', function ($http) {

        //    if(window.location.origin == "http://localhost"){
        //            var adminurl = "http://localhost/rest/rest/index.php/";
        //        }else{
        var adminurl = "https://api.learnwithinq.com/rest/index.php/";
//        var adminurl = "http://localhost/rest/index.php/";
        //        };

        var navigation = [{
            name: "Home",
            classis: "active",
            link: "#/home",
            subnav: []
    }, {
            name: "About",
            active: "",
            link: "#/about",
            subnav: []
    }, {
            name: "Services",
            classis: "",
            link: "#/services",
            subnav: []
    }, {
            name: "Portfolio",
            classis: "",
            link: "#/portfolio",
            subnav: []
    }, {
            name: "Contact",
            classis: "",
            link: "#/contact",
            subnav: []
    }, {
            name: "Centers-details",
            classis: "",
            link: "#/center-details",
            subnav: []
    }];

        return {
            getnav: function () {
                return navigation;
            },
            makeactive: function (menuname) {
                for (var i = 0; i < navigation.length; i++) {
                    if (navigation[i].name == menuname) {
                        navigation[i].classis = "active";
                    } else {
                        navigation[i].classis = "";
                    }
                }
                return menuname;
            },
            dologin: function (email, pass) {
                return $http.get(adminurl + 'users/dologin', {
                    params: {
                        email: email,
                        password: pass
                    }
                });
            },
            isloggedin: function (email) {
                return $http.get(adminurl + 'users/isloggedin', {
                    params: {
                        email: email
                    }
                });
            },
            getusers: function (aid, count, limit) {
                return $http.get(adminurl + 'access/getdatabyaccessid', {
                    params: {
                        accessid: aid,
                        count: count,
                        limit: limit
                    }
                });
            },
            getaccess: function () {
                return $http.get(adminurl + 'access/getall', {
                    params: {}
                });
            },
            getuserbyid: function (id) {
                return $http.get(adminurl + 'users/getuserbyid', {
                    params: {
                        userid: id
                    }
                });
            },
            getboards: function () {
                return $http.get(adminurl + 'boards/getall', {
                    params: {}
                });
            },
            getstandardsbyboardid: function (id) {
                return $http.get(adminurl + 'standards/getstandards', {
                    params: {
                        id: id
                    }
                });
            },
            createuser: function (data) {
                return $http.get(adminurl + 'users/insert', {
                    params: {
                        data: data
                    }
                });
            },
            edituser: function (data) {
                return $http.get(adminurl + 'users/edituser', {
                    params: {
                        data: data
                    }
                });
            },
            deleteuser: function (id) {
                return $http.get(adminurl + 'users/deleteuserbyid', {
                    params: {
                        userid: id
                    }
                });
            },
            getboards: function () {
                return $http.get(adminurl + 'boards/getall', {
                    params: {}
                });
            },
            getdata: function (id, funcname) {
                return $http.get(adminurl + funcname + '/get' + funcname, {
                    params: {
                        id: id
                    }
                });
            },
            createdata: function (name, pid, addname, sortorder) {
                var singular = addname.substring(0, addname.length - 1);
                return $http.get(adminurl + addname + '/create' + singular, {
                    params: {
                        name: name,
                        parentid: pid,
                        sortorder: sortorder
                    }
                });
            },
            editdata: function (id, name, pid, addname, sortorder) {
                var singular = addname.substring(0, addname.length - 1);
                return $http.get(adminurl + addname + '/edit' + singular + 'byid', {
                    params: {
                        id: id,
                        name: name,
                        parentid: pid,
                        sortorder: sortorder
                    }
                });
            },
            createsubject: function (formdata) {

                return $http({
                    url: adminurl + 'subjects/createsubject',
                    method: "POST",
                    headers: {
                        "Content-Type": undefined
                    },
                    data: formdata,
                    transformRequest: angular.identity
                });
            },
            updatesortorder: function (addname, id, sortorder) {
                var singular = addname.substring(0, addname.length - 1);
                return $http.get(adminurl + addname + '/update' + singular + 'sortorder', {
                    params: {
                        id: id,
                        sortorder: sortorder
                    }
                });
            },
            deletedata: function (id, addname) {
                var singular = addname.substring(0, addname.length - 1);
                return $http.get(adminurl + addname + '/delete' + singular + 'byid', {
                    params: {
                        conceptid: id
                    }
                });
            },
            updatecardsortorder: function (id, cn) {
                return $http.get(adminurl + 'concepts/updatecardsortorder', {
                    params: {
                        id: id,
                        cardnumber: cn
                    }
                });
            },
            getquestions: function (filter) {
                return $http.get(adminurl + 'questions/getquestionswithlimit', {
                    params: {
                        count: filter.count,
                        limit: filter.limit,
                        userid: filter.userid,
                        access: filter.access,
                        chapterid: filter.chapterid,
                        conceptid: filter.conceptid,
                        subjectid: filter.subjectid,
                        standardid: filter.standardid,
                        boardid: filter.boardid
                    }
                });
            },
            getquestionscount: function (filter) {
                return $http.get(adminurl + 'questions/getquestionscount', {
                    params: {
                        count: filter.count,
                        limit: filter.limit,
                        userid: filter.userid,
                        access: filter.access,
                        chapterid: filter.chapterid,
                        conceptid: filter.conceptid,
                        subjectid: filter.subjectid,
                        standardid: filter.standardid,
                        boardid: filter.boardid
                    }
                });
            },
            getfulldropdown: function () {
                return $http.get(adminurl + 'questions/getfulldropdown', {
                    params: {}
                });
            },
            getalleditdropdownid: function (id) {
                return $http.get(adminurl + 'chapters/getalleditdropdownid', {
                    params: {
                        chapterid: id
                    }
                });
            },
            createquestion: function (q) {
                return $http.get(adminurl + 'questions/createquestion', {
                    params: {
                        data: q
                    }
                });
            },
            editquestion: function (data) {
                return $http({
                    method: 'POST',
                    url: adminurl + 'questions/editquestion',
                    data: data, //forms user object
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded'
                    }
                });
            },
            createanswer: function (a) {
                return $http.get(adminurl + 'answers/createanswer', {
                    params: {
                        data: a
                    }
                });
            },
            editanswer: function (data) {
                return $http({
                    method: 'POST',
                    url: adminurl + 'answers/editanswer',
                    data: data, //forms user object
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded'
                    }
                });
            },
            getquestionfulldata: function (id) {
                return $http.get(adminurl + 'questions/getquestionfulldata', {
                    params: {
                        id: id
                    }
                });
            },
            searchquestionbyid: function (id) {
                return $http.get(adminurl + 'questions/getquestionsbyid', {
                    params: {
                        id: id
                    }
                });
            },
            removeimage: function (type, id) {
                return $http.get(adminurl + 'questions/removeimage', {
                    params: {
                        id: id,
                        type: type
                    }
                });
            },
            addconcepttoquestion: function (qid, cid) {
                return $http.get(adminurl + 'question_concept/insert', {
                    params: {
                        data: {
                            question_id: qid,
                            concept_id: cid
                        }
                    }
                });
            },
            removeallconcepts: function (id) {
                return $http.get(adminurl + 'question_concept/removeallconcepts', {
                    params: {
                        questionid: id
                    }
                });
            },
            getquestionconcepts: function (id) {
                return $http.get(adminurl + 'question_concept/getconcepts', {
                    params: {
                        questionid: id
                    }
                });
            },
            addcard: function (conid, cardno, data, loadmore) {
                return $http({
                    method: 'POST',
                    url: adminurl + 'concepts/addcard',
                    data: {
                        concept: conid,
                        number: cardno,
                        data: data,
                        loadmoredata: loadmore
                    }, //forms user object
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded'
                    }
                });
            },
            editcard: function (id, conid, cardno, data, loadmore) {
                return $http({
                    method: 'POST',
                    url: adminurl + 'concepts/editcard',
                    data: {
                        id: id,
                        concept: conid,
                        number: cardno,
                        data: data,
                        loadmoredata: loadmore
                    }, //forms user object
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded'
                    }
                });
            },
            deletecard: function (id) {
                return $http.get(adminurl + 'concepts/deletecardbyid', {
                    params: {
                        id: id
                    }
                });
            },
            getcardsbyconceptid: function (id) {
                return $http.get(adminurl + 'concepts/getallcardsbyconceptid', {
                    params: {
                        conceptid: id
                    }
                });
            },
            bulkuploadquestions: function (formdata) {
                return $http({
                    url: adminurl + 'questions/bulkupload',
                    method: "POST",
                    headers: {
                        "Content-Type": undefined
                    },
                    data: formdata,
                    transformRequest: angular.identity
                });
            },
            uploadfullquestiondata: function (formdata) {
                return $http({
                    url: adminurl + 'questions/uploadfullquestiondata',
                    method: "POST",
                    headers: {
                        "Content-Type": undefined
                    },
                    data: formdata,
                    transformRequest: angular.identity
                });
            },
            editfullquestiondata: function (formdata) {
                return $http({
                    url: adminurl + 'questions/editfullquestiondata',
                    method: "POST",
                    headers: {
                        "Content-Type": undefined
                    },
                    data: formdata,
                    transformRequest: angular.identity
                });
            },
            getimagename: function (formdata) {
                return $http({
                    url: adminurl + 'questions/returnimagename',
                    method: "POST",
                    headers: {
                        "Content-Type": undefined
                    },
                    data: formdata,
                    transformRequest: angular.identity
                });
            },
            deletequestionandanswer: function (id) {
                return $http.get(adminurl + 'questions/deletequestionandanswerandconcept', {
                    params: {
                        questionid: id
                    }
                });
            },
            getconceptsexceldata: function () {
                return $http.get(adminurl + 'concepts/getconceptsexceldata', {
                    params: {}
                });
            },
            mathmltolatex: function (mathml) {
                return $http.get('http://www.wiris.net/demo/editor/mathml2latex', {
                    params: {
                        mml: mathml
                    }
                });
            },
            latextomathml: function (latex) {
                return $http.get('http://www.wiris.net/demo/editor/latex2mathml', {
                    params: {
                        latex: latex
                    }
                });
            },
            getdashboarddata: function (id, access, from, to) {
                return $http.get(adminurl + 'users/getdashboarddata', {
                    params: {
                        userid: id,
                        access: access,
                        from: from,
                        to: to
                    }
                });
            },
            geteditorsandteachers: function () {
                return $http.get(adminurl + 'access/geteditorsandteachers', {
                    params: {}
                });
            },
            getbackup: function () {
                $http.get(adminurl + 'access/getbackup', {
                    params: {}
                });
            },
            sendnotification: function (notificationdetails) {
                return $http.get(adminurl + 'notifications/sendgeneralnotificationnbystandards', {
                    params: {
                        userstype: notificationdetails.usertype,
                        standard: notificationdetails.standard,
                        message: notificationdetails.message,
                        urlid: notificationdetails.questionid,
                        url: notificationdetails.questionid ? 'question' : 'home'
                    }
                });
            },
            getflaggedquestions: function (id) {
                console.log(id);
                return $http.get(adminurl + 'questions/getquestiontoedited', {
                    params: {
                        userid: id
                    }
                });
            },
            setflagvalue: function (questionid) {
                return $http.get(adminurl + 'questions/changequestionflag', {
                    params: {
                        id: questionid,
                        value: 0
                    }
                });
            },
            getallquestiontypes: function () {
                return $http.get(adminurl + 'questiontypes/getall', {
                    params: {}
                });
            },
            getallbatches: function () {
                return $http.get(adminurl + 'batches/getallbatches', {
                    params: {}
                });
            },
            insertbycontroller: function (controller, data) {
                return $http.get(adminurl + controller + '/insert', {
                    params: {
                        data: data
                    }
                });


            },
            
            updatebycontroller: function (controller,id, data) {
                return $http.get(adminurl + controller + '/updatebyid', {
                    params: {
                        id:id,
                        data: data
                    }
                });


            },
                
            deletebycontrollerandid: function (controller, id) {
                return $http.get(adminurl + controller + '/deletebyid', {
                    params: {
                        id: id
                    }
                });
            },
            getstudentstoaddinbatch: function (batchid) {
                return $http.get(adminurl + 'batches/getstudentstoaddinbatch', {
                    params: {
                        batch_id: batchid
                    }
                });

            },
            deletemanyby: function (controller, field, value) {
                return $http.get(adminurl + controller + '/deletemanyby', {
                    params: {
                        field: field,
                        value: value
                    }
                });

            },

        }
    });
