describe("Editor", function () {
    var element, $scope, timeout;
    beforeEach(module("GT.Editor"));
    beforeEach(module('../editor/mathEditor.html'));
    beforeEach(module('../editor/asciimath.html'));
    beforeEach(inject(function ($compile, $rootScope, $timeout) {
        $scope = $rootScope;
        $scope.test = "testContent";
        element = angular.element('<div gt-editor ng-model="test"></div>');
        $compile(element)($rootScope)
        timeout = $timeout;

    }));
    afterEach(function () {
        //    element.remove();
    });

    describe("taSanitize should work with script elements", function () {
        var sanitize;
        beforeEach(inject(function (gtSanitize) {
            sanitize = gtSanitize;
        }));
        it("Should allow for math/asciimath script tags but not others", function () {
                expect(sanitize('<script id="test" type="o"></script>', '', true)).to.equal('')

        });
        it("should convert math scripts to ``-expressions ", function() {
            expect(
                sanitize('<script id="" type="math/asciimath">er</script>', '', true)
            ).to.equal('`er`')
        })
        it("should remove previews", function() {
            expect(
                sanitize('<span class="MathJax"></span><span class="MathJax_Preview"></span>', '', true)
            ).to.equal('')
        })
    });

    describe("mathjax model attribute interaction", function () {

        it("should convert mathjax items to `` elements", function () {
            $scope.test = "<p>testContent</p>";
            $scope.$digest();

            var p = element.find('.ta-text p').html("content with both spans and text from mathax "
             + '<span class="MathJax"></span><span class="MathJax_Preview"></span><script type="math/asciimath">f(x) = y</script>')
             ;
            expect(element.find('.ta-text p').length).to.equal(1)
            element.find('.ta-text').triggerHandler('keyup')
            $scope.$digest();
            timeout.flush();
            expect($scope.test).to.equal("<p>content with both spans and text from mathax `f(x) = y`</p>")

        })

    });
    describe("MathJax button", function () {
        var range, sel, editorScope;

        beforeEach(inject(function(textAngularManager, $document){
            $scope.test = "<p>new element</p>"
            $scope.$digest();
            $document.find('body').append(element);
            var directiveScope = element.children().scope()
            var editor = textAngularManager.retrieveEditor(directiveScope.editorName);
            editorScope = editor.scope;
            editor.editorFunctions.focus();
            $scope.$digest();
            // setup selection
            sel = window.rangy.getSelection();
            range = window.rangy.createRangyRange();
            range.selectNodeContents(element.find('.ta-text p')[0]);
            sel.setSingleRange(range);
        }));
        afterEach(function(){
            element.remove();
        });
        it("injecting a formula should trigger loading of mathJax.", function () {

            element.find('.ta-text')
                .triggerHandler('focus');
            $scope.$digest();

            var button = element.find('button[name=insertFx]');

            expect(button.attr('disabled')).not.to.equal("disabled")

            element.find('button[name=insertFx]').triggerHandler('click');

            $scope.$digest();

            timeout.flush();
            expect($scope.test).to.equal("<p>`new element`</p>")
        });

    })
    describe("adding mathjax to the editor", function( ) {


        beforeEach(function() {
            $scope.test = "<p>testContent</p>";
            $scope.$digest();

            var p = element.find('.ta-text p');

            p
                .html("content with both spans and text from mathax"
                    + '<span class="MathJax"></span><span class="MathJax_Preview"></span><script type="math/asciimath">f(x) = y</script>')
            ;
        })
        it("should not save the complete representation back to the system", function () {
            expect(element.find('.ta-text p').length).to.equal(1)
            element.find('.ta-text').triggerHandler('keyup')
            $scope.$digest();
            timeout.flush();
            expect($scope.test).to.equal("<p>content with both spans and text from mathax`f(x) = y`</p>")
        });
    })


    it("should have content-editable=true", function () {
        $scope.$digest();
        expect(element.html()).to.contain("testContent");
        //expect(element.find('.contentEditor').attr('contenteditable')).to.equal("true")

    })

    it("should inject the model", function () {
        $scope.test = "new element"
        $scope.$digest();
        expect(element.html()).to.contain("new element");
    })

    it("should update the model with changes", function () {
        $scope.$digest();
        element.find('.ta-text')
            .html("<p>Old element</p>")
            .triggerHandler('keyup');
        $scope.$digest();
        //$scope.$digest();
        timeout.flush();
        expect($scope.test).to.equal("<p>Old element</p>")
    })
    it("should reset the value if the model changes to 0.", function() {
        $scope.$digest();
        var taText = element.find('.ta-text');
        taText
            .html("<p>Old element</p>")
            .triggerHandler('keyup');
        $scope.$digest();

        $scope.test = "kpkpok"
        $scope.$digest();

        expect(taText.html()).to.equal("<p>Old element</p>")

        $scope.test = ""
        $scope.$digest();

        expect(taText.html()).to.equal("")

    })

    it("should not show the math dialog by default", function() {
        expect(element.find('.mathDialog').is(':visible')).to.be.false;
        //expect(element.find('.mathDialog')[0].className.indexOf('ng-hide')).to.equal(-1);
    })

    describe("editing the math dialog", function() {
        beforeEach(function() {
            $scope.$digest();
            element.find('.ta-text')
                .html("<p>content with both spans and text from mathax</p>"
                    + '<span class="MathJax" id="MathJax-Element-1-Frame"></span><span class="MathJax_Preview"></span><script id="MathJax-Element-1" type="math/asciimath">f(x) = y</script>')

            ;
            element.find(".ta-text").triggerHandler('keyup')

            $scope.$digest();
            element.find(".ta-text").focus()
            element.find(".MathJax").click();
            element.find(".MathJax").triggerHandler('click');
            $scope.$digest();


        })
        it("should be shown id the mathjax element is clicked", function() {
            expect(element.find(".ta-text .MathJax").length).to.equal(1)
            expect(element.find('.mathDialog')[0].className.indexOf('ng-hide')).to.equal(-1);
            expect(element.find('#MathJax-Element-1-Frame').hasClass('active')).to.be.true;
        })

        it("should update the main view when the formula changes", function() {
            var mathDialog = element.find(".mathDialog textarea");
            mathDialog.val("f(x) = 2y")
            mathDialog.triggerHandler('change')

            $scope.$digest();


            expect(element.find('.ta-text').html()).to.contain("f(x) = 2y");

            timeout.flush();
            expect($scope.test).to.equal("<p>content with both spans and text from mathax</p>`f(x) = 2y`")

            mathDialog.triggerHandler('blur')

            $scope.$digest();
            expect(element.find('#MathJax-Element-1-Frame').hasClass('active')).to.be.false;
            expect(element.find('.mathDialog')[0].className.indexOf('ng-hide')).not.to.equal(-1);

        })


    })

})
