angular.module('MainModule', ['ngResource', 'ngSanitize'])
    .factory('repoUrlTransformer', RepoUrlTransformerFactory)
    .factory('patchProcessor', PatchProcessorFactory)
    .factory('isIgnored', isIgnoredFactory)
    .factory('Commit', ['$resource', CommitFactory])
    .factory('Commits', ['$resource', CommitsFactory])
    .factory('Repo', ['$resource', RepoFactory])
    .factory('shortcutBinder', function() {return shortcut;})
    .filter('diffToHtml', PatchProcessorFactory)
    .config(function($locationProvider, $routeProvider) {
        $locationProvider.hashPrefix("!");
//        $locationProvider.html5Mode(true);
        $routeProvider.when('/', {templateUrl: './js/templates/index.html', controller:RepoInitCtrl});
        $routeProvider.when('/slideshow', {templateUrl: './js/templates/slideshow.html'});
    })
    .filter('substr', function() {
        return function(i, s, e) {
            return i.substr(s, e);
        }
    })
    .filter('trenary', function() {
        return function(i, s, e) {
            return i?s:e;
        }
    })
    .filter('asId', function() {
        return function(v) {
            return v.replace(/[\/\.\s]/g, "_");
        }
    })
    .filter('ignored', function(isIgnored) {
        return function(v) {
            return isIgnored(v);
        }
    })
    .directive('gsCommit', function() {
        return function(scope, element, attrs) {
            scope.$watch('slideshow.pointer', function() {
                if (scope.commit.sha == scope.slideshow.pointer) {
                    element.removeClass("not-chosen");
                    element.addClass("chosen");
                } else {
                    element.removeClass("chosen");
                    element.addClass("not-chosen");
                }
            })
        }
    });



angular.module('MainModuleDev', ['MainModule', 'ngMockE2E']).run(function($httpBackend, $resource) {
    $httpBackend.whenGET(/^\/js\/spec\/mocks.*\//).passThrough();

    var base = 'https://api.github.com/repos/e2e/test';
    $httpBackend.whenGET(base).respond(gitoscop.mock.repo);
    $httpBackend.whenGET(base + '/commits').respond(gitoscop.mock.commits);
    $httpBackend.whenGET(base + '/commits/15c1fe392942b70e456f10afbdfd9c3329249a43').respond(gitoscop.mock.commitsById['15c1fe392942b70e456f10afbdfd9c3329249a43']);
    $httpBackend.whenGET(base + '/commits/428f2b563663315df4f235ca19cef4bdcf82e2ab').respond(gitoscop.mock.commitsById['428f2b563663315df4f235ca19cef4bdcf82e2ab']);
    $httpBackend.whenGET(/.*/).passThrough();
});