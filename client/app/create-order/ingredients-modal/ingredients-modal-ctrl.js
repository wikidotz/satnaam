angular.module('hotelApp')

.controller('IngredientsModalCtrl', ['$scope', '$uibModalInstance', '$rootScope', 'product', 'order', 'lessItem', function($scope, $uibModalInstance, $rootScope, product, order, lessItem) {

    $scope.product = product;
    $scope.order = order;
    $scope.selecteds = [];

    var sliderValueMap = {
        'no' : 0,
        'less' : 1,
        'medium' : 2,
        'more' : 3
    }


    $scope.itemTypes = [{
        type: 'MIX',
        label: 'Mix',
        abbr: 'M'
    }, {
        type: 'HALFJAIN',
        label: 'Half Jain',
        abbr: 'HJ'
    }, {
        type: 'JAIN',
        label: 'Jain',
        abbr: 'J'
    }]

    function isSameProduct(item) {
        return item.prod_id == product.prod_id;
    }

    function isSelected(item) {
        return item.iSelected;
    }

    $scope.productFilter = function(item) {
        return item.prod_id == product.prod_id;
    }

    $scope.itemClick = function(item){
        item.iSelected = !item.iSelected;
        $scope.isAllSelected = false;

        updateIngredients(item);
    }

    function updateIngredients(item){
        var itemType = item.ingredients.type;

        if(item.iSelected) {
            angular.element('.item-type-btn').find('button').removeClass('active');
            angular.element('.'+itemType.toLowerCase()).addClass('active');

            if(item.isModified){
                $scope.sweetValue = sliderValueMap[item.ingredients.sweet];
                $scope.garlicValue = sliderValueMap[item.ingredients.garlic];
                $scope.chilliValue = sliderValueMap[item.ingredients.chilli];
            }else{
                $scope.sweetValue =
                $scope.garlicValue =
                $scope.chilliValue = 2;
            }
            var data = {
                sweet : $scope.sweetValue,
                garlic : $scope.garlicValue,
                chilli : $scope.chilliValue 
            }

            $rootScope.$broadcast('updateIngredients', data);
            //console.log($scope.sweetValue, $scope.garlicValue, $scope.chilliValue)
        }else{
            angular.element('.item-type-btn').find('button').removeClass('active');
        }
    }


    $scope.toggleItemType = function($event, type) {

        angular.element($event.target).parent().find('button').removeClass('active');
        angular.element($event.target).addClass('active');

        for (var i = 0; i < $scope.order.itemsInOrder.filter(isSameProduct).length; i++) {

            if ($scope.order.itemsInOrder.filter(isSameProduct)[i].iSelected) {
                $scope.order.itemsInOrder.filter(isSameProduct)[i].ingredients.type = type.type;
                $scope.order.itemsInOrder.filter(isSameProduct)[i].ingredients.abbr = type.abbr;
                $scope.order.itemsInOrder.filter(isSameProduct)[i].isModified = true;
            }
        };

        $scope.isAllSelected = false;
    }

    $scope.updateSauceges = function(name, value){
        for (var i = 0; i < $scope.order.itemsInOrder.filter(isSameProduct).length; i++) {
            if ($scope.order.itemsInOrder.filter(isSameProduct)[i].iSelected) {
                $scope.order.itemsInOrder.filter(isSameProduct)[i].ingredients[name.toLowerCase()] = value;
                $scope.order.itemsInOrder.filter(isSameProduct)[i].ingredients.isMedium = (value == 'medium')
                $scope.order.itemsInOrder.filter(isSameProduct)[i].isModified = true;
                $scope[name.toLowerCase()+'Value'] = value;
            }
        };
    }

    $scope.showCloseBtn = lessItem;

    var itemTobeRemoved = [];

    $scope.removeItem = function(e, theItem){
        e.stopPropagation();
        var keys = theItem.prod_id + JSON.stringify(theItem.ingredients).replace(/[{}"]/g, '');
        angular.element(e.target).parent().remove();
        itemTobeRemoved.push(keys);
    }

    $scope.ok = function() {

        for (var i = 0; i < $scope.order.itemsInOrder.length; i++) {
            $scope.order.itemsInOrder[i].iSelected = false;
        }


        if(!lessItem){
            $uibModalInstance.close($scope.product);
        }else{
            $uibModalInstance.close(itemTobeRemoved);
        }
    };

    $scope.cancel = function() {
        $uibModalInstance.dismiss('cancel');
    };
}])