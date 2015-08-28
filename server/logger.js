var logger = exports;
logger.debugLevel = 'warn';
logger.log = function(level,message){
	var levels = ['error','warn','info','debug'];
	if(typeof(message) !== 'string')
	{
		//message = JSON.stringify(message);
	}
	console.log("["+Date.now()+"]["+level+"] "+message);
}