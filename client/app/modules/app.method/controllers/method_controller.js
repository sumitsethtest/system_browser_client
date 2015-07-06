(function(global) {
  'use strict';

  var controller = function($scope, $rootScope, MethodGroup, MethodService, groupBar, _) {
    // --- Private variables ---------------------------------------------------

    var methodGroup = null;

    // --- Public variables ----------------------------------------------------

    $scope.methods = [];

    // --- Private methods -----------------------------------------------------

    var sortMethods = function(methods) {
      return _.sortBy(methods, 'name');
    };

    var selectMethod = function(method) {
      method.selected = true;
    };

    var deselectMethod = function(method) {
      method.selected = false;
    };

    var collectAllMethods = function() {
      var methods;

      if (groupBar.classSide) {
        methods = methodGroup.classMethods();
      } else {
        methods = methodGroup.instanceMethods();
      }

      $scope.methods = sortMethods(methods);
    };

    var collectGroupMethods = function(group) {
      var methods;

      if (groupBar.classSide) {
        methods = methodGroup.classMethodsInGroup(group.name);
      } else {
        methods = methodGroup.instanceMethodsInGroup(group.name);
      }

      $scope.methods = sortMethods(methods);
    };

    // --- Events --------------------------------------------------------------

    $scope.$on('get:method:all', function(_event1, behaviour) {
      var name = 'add:method:' + behaviour.name;

      if (!$scope.$$listeners.hasOwnProperty(name)) {
        $scope.$on(name, function(_event2, methods) {
          $rootScope.$broadcast('reset-source');

          methodGroup = new MethodGroup(methods, behaviour.name);
          $rootScope.$broadcast('add:method-group', methodGroup);

          var count = {
            instanceMethods: methodGroup.instanceMethods().length,
            classMethods: methodGroup.classMethods().length
          };

          $rootScope.$broadcast('method-count:method', count);
          $scope.$apply(collectAllMethods);
        });
      }

      MethodService.getAllFrom(behaviour.name);
    });

    $scope.$on('reset-methods', function() {
      $scope.methods = [];
    });

    $scope.$on('update-method-side', function() {
      if (methodGroup === null) {
        return;
      }

      $rootScope.$broadcast('add:method-group', methodGroup);
      collectAllMethods();
    });

    $scope.$on('filter:method', function(_event, group) {
      collectGroupMethods(group);
    });

    $scope.$on('list-box:method:selected', function() {
      $scope.methods.forEach(deselectMethod);
    });

    // --- Public methods ------------------------------------------------------

    $scope.getMethodSource = function(method) {
      $rootScope.$broadcast('get:source', methodGroup.owner, method);
    };

    $scope.selectMethod = function(method) {
      $rootScope.$broadcast('list-box:method:selected');
      selectMethod(method);
    };
  };

  global.app.method.controller('MethodController', [
    '$scope',
    '$rootScope',
    'MethodGroup',
    'MethodService',
    'groupBar',
    '_',
    controller]);
})(window.global);