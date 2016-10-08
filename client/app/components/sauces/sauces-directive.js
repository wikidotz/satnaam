angular.module('hotelApp')

.directive('sauces', function($rootScope) {
    return {
        templateUrl: 'app/components/sauces/sauces-directive.html',
        link: function(scope, element, attrs) {

            var valuesHash = {
                0 : 'no',
                1 : 'less',
                2 : 'medium',
                3 : 'more'
            }

            scope.$on('updateIngredients', function(e, data){
                var classStr = '.'+valuesHash[data[scope.name.toLowerCase()]];
                element.find('a').removeClass('active');
                element.find(classStr).addClass('active')
                //element.find('.'+).addClass('active');
            })

            scope.saucesUnits = {
                'no' : {
                    value : 0,
                    label: 'No'
                },
                'less' : {
                    value : 1,
                    label: 'Less'
                },
                'medium' : {
                    value : 2,
                    label: 'Medium'
                },
                'more' : {
                    value : 3,
                    label: 'More'
                }
            }

            scope.unitChange = function($event, key){
                angular.element($event.target).parent().find('a').removeClass('active');
                angular.element($event.target).addClass('active');
                scope.sliderValue = key;
                scope.updateFn()(scope.name, key);
            }

            scope.stringValue = function(){
                return scope.saucesUnits[scope.sliderValue].value
            }

            scope.slider = {
                options: {
                    stop: function (event, ui) {
                        scope.updateFn()(scope.name, scope.stringValue())
                    }
                }
            }

        },
        scope: {
            name: '@name',
            sliderValue: '=',
            updateFn: '&'
        },
    }
})

// .directive('saucesOld', function() {
//     return {
//         templateUrl: 'templates/sauces-directive.html',
//         link: function(scope, element, attrs) {

//             var valuesHash = {
//                 0 : 'no',
//                 1 : 'less',
//                 2 : 'medium',
//                 3 : 'more'
//             }

//             scope.stringValue = function(){
//                 return valuesHash[scope.sliderValue]
//             }

//             scope.slider = {
//                 options: {
//                     stop: function (event, ui) {
//                         scope.updateFn()(scope.name, scope.stringValue())
//                     }
//                 }
//             }

//         },
//         scope: {
//             name: '@name',
//             sliderValue: '=',
//             updateFn: '&'
//         },
//     }
// })