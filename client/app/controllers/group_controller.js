(function(global) {
  'use strict';

  var controller = function($scope, Group, GroupBar) {
    $scope.$on('add:method-group', function(_event, methodGroup) {
      var ctx;
      var groups = [];

      if (GroupBar.classSideChecked()) {
        ctx = 'singleton';
      } else {
        ctx = 'instance';
      }

      if (methodGroup.anyPublicMethods(ctx)) {
        groups.push({name: Group.labels.public});
      }

      if (methodGroup.anyPrivateMethods(ctx)) {
        groups.push({name: Group.labels.private});
      }

      if (methodGroup.anyProtectedMethods(ctx)) {
        groups.push({name: Group.labels.protected});
      }

      if (groups.length > 0) {
        groups.unshift({name: Group.labels.all, selected: true});
      }

      $scope.items = groups;
    });

    $scope.$on('reset-methods', function() {
      $scope.items = [];
      $scope.showGroupBar = false;
      GroupBar.setInstanceSide();
    });

    $scope.$on('list-box:group:selected', function() {
      $scope.items.forEach(function(group) {
        group.selected = false;
      });
      $scope.showGroupBar = true;
    });

    $scope.$on('show:groupbar', function() {
      $scope.showGroupBar = true;
    });

    $scope.getSublist = function(group) {
      $scope.$parent.$broadcast('filter:method', group);
    };

    $scope.select = function(group) {
      $scope.$emit('list-box:group:selected');
      group.selected = true;
    };

    $scope.toggleClassSide = function() {
      $scope.$parent.$broadcast('class-side-checkbox', $scope.groupbar.classSide);
      $scope.showGroupBar = true;
    };
  };

  global.app.controller('GroupController', [
    '$scope',
    'Group',
    'GroupBar',
    controller]);
})(window.global);
