/**
 * Created by tarjei on 2/27/14.
 */


if (!window.console) console = {log: function () {
}}; // fixes IE console undefined errors
var GT = window.GT || {};

GT.Editor = angular.module("GT.Editor", ['textAngular', 'ngSanitize']); //This makes ngSanitize required

GT.Editor.service("Require", function() {
        return {
            load: function (src, callback) {
                var script = document.createElement('script'),
                    loaded = false;
                script.setAttribute('src', src);
                if (callback) {
                    script.onreadystatechange = script.onload = function () {

                        if (!loaded) {
                            callback();
                        }
                        loaded = true;
                    };
                }
                document.getElementsByTagName('head')[0].appendChild(script);
            }
        };
    })


GT.Editor.service("mathJax", ['Require','$timeout', function (Require, $timeout) {
        var mathJaxUrl = "https://c328740.ssl.cf1.rackcdn.com/mathjax/latest/MathJax.js?delayStartupUntil=configured";
        var mathJaxIsLoaded = false;

        if (window.MathJax) { /* this one kicks in if mathjax is loaded already. */
            mathJaxIsLoaded = true;
        }
        return {
            activateMathIfQuizContainsMathElements: function (quiz) {
                var that = this;
                $timeout(function () {
                    if (that.quizContainsMathElements(quiz)) {
                        that.activateElements();
                    }
                }, 10);
            },
            quizContainsMathElements: function (quiz) {
                var i, j;

                function hasMath(content) {
                    return content && content.indexOf('`') > -1;
                }

                if (hasMath(quiz.introduction)
                    || hasMath(quiz.postscript)) {
                    return true;
                }

                for (i = 0; i < quiz.questions.length; i += 1) {
                    if (hasMath(quiz.questions[i].content)) {
                        return true;
                    }
                    for (j = 0; j < quiz.questions[i].answers.length; j += 1) {
                        if (hasMath(quiz.questions[i].answers[j].content)) {
                            return true;
                        }
                    }
                }
                return false;
            },
            activateElements: function () {
                this.withMathJax(function () {
                    MathJax.Hub.Queue(["Typeset", MathJax.Hub]);
                });
            },
            withMathJax: function (callback) {
                if (mathJaxIsLoaded) {
                    callback();
                } else {
                    Require.load(mathJaxUrl, function () {
                        var i = 0;
                        var waitForMathJaxThenRun = function () {
                            i = i + 1;
                            if (typeof MathJax != 'undefined') {
                                MathJax.Hub.Config({
                                    asciimath2jax: {
                                        delimiters: [
                                            ['`', '`']
                                        ]
                                    },
                                    config: ["MMLorHTML.js"],
                                    //extensions: ["asciimath2jax.js","MathEvents.js","MathZoom.js","MathMenu.js","toMathML.js"],
                                    jax: ["input/AsciiMath", "output/HTML-CSS", "output/NativeMML"],
                                    extensions: ["asciimath2jax.js"],
                                    showMathMenu: false,
                                    showMathMenuMSIE: false
                                });
                                //MathJax.Hub.Startup.onload();
                                MathJax.Hub.Configured()
                                mathJaxIsLoaded = true;
                                callback();
                            } else if (i < 11) {
                                setTimeout(waitForMathJaxThenRun, 100);
                            }
                        };
                        waitForMathJaxThenRun();
                    })
                }
            }

        }
    }]);


GT.Editor.config(function ($provide) {
    $provide.decorator('taSanitize', function($delegate) {
        return function(unsafe, oldsafe, force) {
            if (!force) {
                return unsafe;
            }
            return $delegate(unsafe, oldsafe);
        }
    });



    $provide.decorator('taOptions', ['taRegisterTool', '$delegate', 'mathJax',
        function (taRegisterTool, taOptions, mathjax) {

            /* get the html currently selected (or as it is the current pos of the cursor) */
            function getSelectionHtml() {
                var html = "";
                if (typeof window.getSelection != "undefined") {
                    var sel = window.getSelection();
                    if (sel.rangeCount) {
                        var container = document.createElement("div");
                        for (var i = 0, len = sel.rangeCount; i < len; ++i) {
                            container.appendChild(sel.getRangeAt(i).cloneContents());
                        }
                        html = container.textContent;
                    }
                } else if (typeof document.selection != "undefined") {
                    if (document.selection.type == "Text") {
                        html = document.selection.createRange().text;
                    }
                }
                return html;
            }

            // $delegate is the taOptions we are decorating
            // register the tool with textAngular
            taRegisterTool('insertFx', {
                iconclass: "",
                buttontext: 'f(x)',
                action: function () {
                    var html = getSelectionHtml();
                    if (!html) {
                        html = " `int_3^4(4+x)dx = [4+x]_3^4` ";
                    } else {
                        html = '`' + html + '`';
                    }
                    var element = this.$editor().displayElements.text;
                    if (document.all) {
                        var sel = window.getSelection();
                        if (sel.getRangeAt && sel.rangeCount) {
                            var editor = element.get(0);
                            if (!editor.contains(sel.anchorNode) && !editor.contains(sel.anchorNode.parentNode)
                                ) {
                                return;
                            }
                            var range = sel.getRangeAt(0);
                            range.deleteContents();
                            range.insertNode(document.createTextNode(html));
                        }
                    } else {
                        this.$editor().wrapSelection('insertText', html);
                    }
                    element.find('.MathJax')
                        .attr('contenteditable', false);
                    mathjax.withMathJax(function() {
                        MathJax.Hub.Queue(["Typeset", MathJax.Hub, element.get(0)]);
                        MathJax.Hub.Queue(function () {

                            element.find('.MathJax')
                                .attr('contenteditable', false);
                        });
                    });
                }
            });

            //console.log(taOptions.toolbar)
            taRegisterTool('showHelp', {
                iconclass: "",
                buttontext: 'Hjelp',
                action: function () {
                    this.$emit('GT.Editor.showHelpText');
                }
            });
            taOptions.toolbar[3].push('insertFx');
            taOptions.toolbar[3].push('showHelp');
            return taOptions;
        }]);





});

GT.Editor.service("gtSanitize", ['taSanitize', function(taSanitize) {

    return function (html) {
        /**
         * Converts html containing .MathJax elements and <script> elements to
         * simple `expressions`.
         */
        try {
            var i;
            var fragment = document.createDocumentFragment();
            var base = document.createElement("span");
            fragment.appendChild(base);
            base.innerHTML = html;

            var elements = fragment.querySelectorAll('.MathJax, .MathJax_Preview');
            for (i = 0; i < elements.length; i++) {
                var obj = elements[i];
                obj.parentNode.removeChild(obj);
            }
            var scripts = fragment.querySelectorAll('script');
            for (i = 0; i < scripts.length; i++) {
                if (scripts[i].getAttribute('type') == 'math/asciimath') {
                    var script = scripts[i];
                    var inner = document.createTextNode('`' + script.innerHTML + '`')
                    script.parentNode.replaceChild(inner, script);
                }
            }
            return taSanitize(fragment.firstChild.innerHTML, '', true);
        } catch (e) {
            log("Error in filterhtml", e);
            log.error();
            return "ERROR";
        }
    }

}]);

GT.Editor.value('convertMathJaxToExpression', function (html) {
    /**
     * Converts html containing .MathJax elements and <script> elements to
     * simple `expressions`.
     */
    try {
        var i;
        var fragment = document.createDocumentFragment();
        var base = document.createElement("span");
        fragment.appendChild(base);
        base.innerHTML = html;

        var elements = fragment.querySelectorAll('.MathJax, .MathJax_Preview');
        for (i = 0; i < elements.length; i++) {
            var obj = elements[i];
            obj.parentNode.removeChild(obj);
        }
        var scripts = fragment.querySelectorAll('script');
        for (i = 0; i < scripts.length; i++) {
            if (scripts[i].getAttribute('type') == 'math/asciimath') {
                var script = scripts[i];
                var inner = document.createTextNode('`' + script.innerHTML + '`')
                script.parentNode.replaceChild(inner, script);
            }
        }
        return fragment.firstChild.innerHTML;
    } catch (e) {
        log("Error in filterhtml", e);
        log.error();
        return "ERROR";
    }
});


GT.Editor.directive('asciimathHelp', function() {
    return {
        templateUrl: CONFIG.templateRoot + '../js/' + 'editor/asciimath.html',
    }
});
GT.Editor.directive("gtEditor", ['mathJax','textAngularManager', 'convertMathJaxToExpression', '$log', '$timeout', 'taSanitize',
    function (mathJax, textAngularManager, convertMathJaxToExpression, $log, $timeout, taSanitize) {
        return {
            restrict: 'A',
            templateUrl: CONFIG.templateRoot + '../js/' + 'editor/mathEditor.html',
            scope: {
                ngModel: '='
            },
            controller: function($scope){
                $scope.editorName = "mathEditor" + new Date().getTime();
                $scope.showHelp = false;
                $scope.toggleHelp = function() {
                    $scope.showHelp = !$scope.showHelp;
                }
                $scope.$on('GT.Editor.showHelpText', function(targetScope) {

                    $scope.toggleHelp();
                });
            },
            require: '^ngModel',
            link: function ($scope, $element, $elementAttributes, ngModel) {
                var previewElement = $element.find('.mathPreview');

                /* this usually indicates that jquery was not loaded!
                if (previewElement.length == 0) {
                    throw new Error("No preview element!"+ $element.find('.header').length )
                }*/
                var previewMathJax;

                //ngModel.$formatters.push(convertMathJaxToExpression);
                ngModel.$parsers.push(function(html) {
                    return taSanitize(convertMathJaxToExpression(html));
                });

                $scope.showMathDialog = false;
                $scope.mathDialog = "";

                var initialValue = $scope.$parent.$eval($elementAttributes.ngModel)
                if (initialValue && initialValue.indexOf('`') > 0) {
                    mathJax.withMathJax(function() {
                        MathJax.Hub.Queue(["Push", function () {
                            $element.find('.MathJax').attr('contenteditable', 'false');
                        }]);
                    });
                }
                $scope.value = angular.copy(initialValue);
                $scope.$watch('ngModel', function(newValue, oldValue) {
                    if (oldValue != newValue && (newValue == null || newValue == "")) {
                        // it is possible that we should allow for all model changes, but
                        // that is hard due to the fact that the model content will change every time
                        // the value changes so we would have a loop.
                        $scope.value = newValue;
                    }
                });
                var timeoutPromise = null;
                $scope.$watch('value', function(newValue, oldValue) {
                    if (newValue == oldValue) {
                        return;
                    }
                    // use timeout + timeoutPromise to reduce cpu load of sanitizing.
                    if (timeoutPromise) {
                        $timeout.cancel(timeoutPromise);
                    }
                    $timeout(function() {
                        ngModel.$setViewValue(newValue); }, 200);
                });
                var previewNode = previewElement.get(0);
                $scope.$watch('mathDialog', function (newValue, oldValue) {

                    if ((newValue != oldValue) && oldValue) {
                        try {
                            var jaxElement = MathJax.Hub.getAllJax($scope.elementId)[0];
                            if (jaxElement) {
                                MathJax.Hub.Queue(["Text", jaxElement, newValue]);
                            } else {
                                $element.find("#" + $scope.elementId).html(newValue);
                                $element.find("#" + $scope.elementId + "-Frame").remove();
                                MathJax.Hub.Process($scope.elementId);
                            }
                            $element.find('.MathJax').attr('contenteditable', 'false');
                            textAngularManager.retrieveEditor($scope.editorName).scope.updateTaBindtaTextElement();
                            mathJax.withMathJax(function() {
                                MathJax.Hub.Queue(["Push", function () {
                                    previewMathJax = MathJax.Hub.getAllJax(previewNode)[0];
                                    if (previewMathJax) {
                                        MathJax.Hub.Queue(["Text", previewMathJax, newValue]);
                                    } else {
                                        $log("no preview jax");
                                    }
                                }]);
                            })
                        } catch (e) {
                            $log.info("mathDialog error:", e);
                            $log.error(e.stack)
                        }


                    }
                });

                $scope.exitDialog = function() {
                    $element.find("#" + $scope.elementId + "-Frame").removeClass("active");
                    $scope.elementId = null;
                    $scope.showMathDialog = false;
                }

                $element.on('click', '.MathJax', function (event) {
                    event.preventDefault();
                    $scope.$apply(function() {
                        var targetElement = event.currentTarget;
                        $(targetElement).addClass("active");
                        var elementId = targetElement.id.replace('-Frame', "");
                        var originalElement = $element.find("#" + elementId)[0];
                        $scope.showMathDialog = true;
                        $scope.mathDialog = originalElement.innerHTML;
                        $scope.elementId = elementId;
                        $element.find(".mathdialog").focus();

                    });
                    if (!previewMathJax) {
                        mathJax.withMathJax(function() {
                            previewElement.html('`' + $scope.mathDialog + '`');
                            var previewNode = previewElement.get(0);

                            MathJax.Hub.Queue(["Typeset", MathJax.Hub, previewNode]);
                        });
                    }

                });




            }

        }

    }]);
