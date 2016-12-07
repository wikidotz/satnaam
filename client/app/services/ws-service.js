angular.module('hotelApp')

.service('WSService', ['$websocket', function($websocket) {

    this.init = function() {
        var dataStream = $websocket('ws://localhost:3001/hello');


        dataStream.onMessage(function(event) {
            console.log(event.data)
        });

        dataStream.onOpen(function(event){
            console.log('connction open')
        })
    }


}])
