function logger(){
	return {
			log : function(level,message){
				var levels = ['error','warn','info','debug'];
				if(typeof(message) !== 'string')
				{
					message = JSON.stringify(message);
				}
				console.log("["+Date.now()+"]["+level+"] "+message);
			}	
	} 
	
}
