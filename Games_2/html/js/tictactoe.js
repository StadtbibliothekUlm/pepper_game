var pepperAI = {	
	
	AiInterval: null,
	
	AiLevel: 0,
	
	AiDone: false,
	
	explained:false,
	
	register: function(){
		
		if (pepperAI.AiInterval == null){
			
			pepperAI.AiInterval = setInterval(function(){
				
				if(tictactoe.onTurn=="pepper" && pepperAI.AiDone == false){
					
					tictactoe.checkGameState(function(erg,matrix){
							
						var _temp = pepperAI.findTurn(matrix);
						if (_temp == "none"){
							return;
						}
						
						var obj = $('#'+_temp);
						pepperAI.AiDone = true;
						obj.trigger("touchstart");
						QiSession(function(session){
								memraise(session,"ttt/randSay",1);
						});
						setTimeout(function(){
								obj.trigger("touchend");
						},500);
					});
				}
			},2000);
			console.log("interval set");
		}
		else {
			console.log("AI already active");
		}
			
		
		
	},
	
	unregister: function(){
		
		if (pepperAI.AiInterval != null){
			
			clearInterval(pepperAI.AiInterval);
			console.log("interval cleared");
		}
		else {
			console.log("AI not active, do nothing");
		}
	},
	
	findTurn: function(matrix){
		
		var tryout =true;
		var maxtries=0;
		var i=-1;
		var j=-1;
		
		console.log("findturn, AI level="+pepperAI.AiLevel);
		
		if (pepperAI.AiLevel >=2){
			
			$.each(tictactoe.rows,function(index,value){
				
				if (tryout == true){
					var rowstate = matrix[value[0][0]][value[0][1]]+matrix[value[1][0]][value[1][1]]+matrix[value[2][0]][value[2][1]]
					
					if (rowstate ==2 && matrix[value[0][0]][value[0][1]] < 2 && matrix[value[1][0]][value[1][1]] < 2 && matrix[value[2][0]][value[2][1]]<2){
		
						$.each(value,function(index2,value2){
								
								if (matrix[value2[0]][value2[1]] ==0){
									i = value2[0];
									j = value2[1];
									tryout=false;
								}
						});	
								
					}
					
				}
					
			});
			
				
		}
				
		if(pepperAI.AiLevel >0){
			$.each(tictactoe.rows,function(index,value){
				
				if (tryout == true){
					var rowstate = matrix[value[0][0]][value[0][1]]+matrix[value[1][0]][value[1][1]]+matrix[value[2][0]][value[2][1]]
					
		
					if (rowstate ==4){
						
						$.each(value,function(index2,value2){
								
								if (matrix[value2[0]][value2[1]] ==0){
									
									i = value2[0];
									j = value2[1];
									tryout=false;
									
								}
						});	
								
					}
					
				}
					
			});
		} 
		
		if (pepperAI.AiLevel >1 && matrix[1][1] == 0){
			i = 1;
			j = 1;
			tryout=false;
		}
			
		
		while (tryout == true && maxtries < 11){
				
				var randn = tools.randInt(0,2);
				var randm = tools.randInt(0,2);
		
				if(matrix[randn][randm] == 0 && !(randn ==1 && randm==1)){
		
					tryout = false;
					maxtries=11;
					i = randn;
					j = randm;
					}
					else{
						maxtries++;
					}
		}
		
		if (i > -1 && j > -1){
					var objid = "c";
					if (i == 0) objid+="o";
					if (i == 1) objid+="m";
					if (i == 2) objid+="u";
					if (j == 0) objid+="l";
					if (j == 1) objid+="m";
					if (j == 2) objid+="r";
					return objid;
		}
		else {
			return "none";
		}
		
		
	}
	
	// ^new functions 
}

var tools = {
	
	areEqual: function(){
		
		var len = arguments.length;
		
		for (var i = 1; i< len; i++){
			if (arguments[i] === null || arguments[i] !== arguments[i-1])
			return false;
		}
		return true;
	},
	
	randInt: function (min,max){
		return Math.floor(Math.random()*(max-min+1)+min);
	}

}

var tictactoe={
	
	nextSymbol: "x",
	onTurn: "human",
	rows: [
		[[0,0],[0,1],[0,2]],
		[[1,0],[1,1],[1,2]],
		[[2,0],[2,1],[2,2]],
		[[0,0],[1,0],[2,0]],
		[[0,1],[1,1],[2,1]],
		[[0,2],[1,2],[2,2]],
		[[0,0],[1,1],[2,2]],
		[[2,0],[1,1],[0,2]]
	],
	
	registerCanvas: function(){
		setTimeout(function(){
			var cans = $('.ttt-can');
			$.each(cans,function(index,value){
					
					$(value).canvasDraw(function(){
							
							var contextID = $(value).attr("id");
							contextID = contextID.replace("c","d");
							$(this).remove();
							$('#ttt-board').append("<div class='turntaken "+tictactoe.nextSymbol+"' id='"+contextID+"'></div>");
							
							if(tictactoe.nextSymbol	== "x"){
								tictactoe.nextSymbol = "o";
							}
							else {
								tictactoe.nextSymbol = "x";
							}
							
							tictactoe.checkGameState(function(erg,toMark){
									
									if(tictactoe.onTurn == "none"){
										return;
									}
									
									if(erg > 0){
										
										tictactoe.onTurn="none";
										$('body').append("<div id='veil'></div>");
										
										$.each(toMark,function(index,value){
												
												var obj = $('#'+value);
												obj.addClass("winningLine");
						
												
										});
										
										pepperAI.unregister();
						
										if (erg == 2){
											QiSession(function(session){
													memraise(session,"ttt/complete","humanwins");
											});
										}
										else if (erg == 1){
											QiSession(function(session){
													memraise(session,"ttt/complete","pepperwins");
											});
										}
										else if (erg == 3){
											QiSession(function(session){
													memraise(session,"ttt/complete","draw");
											});
										}
										
										setTimeout(function(){
												window.location.reload(true);
										},8000);
										
									}
									else {
										if (tictactoe.onTurn == "human"){
											tictactoe.onTurn = "pepper";
											pepperAI.AiDone = false;
											$('body').append("<div id='veil'></div>");
										}
										else{
											tictactoe.onTurn = "human";
											$('#veil').remove();
										}
										
									}
									
							});
					});			
					
			});
		},30);	
	},
	
	
	
	checkGameState: function(callback){
		
		var matrix =[[0,0,0],[0,0,0],[0,0,0]];
		var os = $('.o');
		var xs = $('.x');
        if (os.length < 3 && xs.length < 3 && tictactoe.onTurn != "pepper"){
        	callback(0,[]);
        	return;
        }

        $.each(os,function(index,value){
        	var id = $(value).attr("id");
        	var one = id[1]
        	var two = id[2]
        	var n = 0;
        	var m = 0;
        	if (one =="o") n=0;
        	if (one =="m") n=1;
        	if (one =="u") n=2;
        	if (two =="l") m=0;
        	if (two =="m") m=1;
        	if (two =="r") m=2;
        	matrix[n][m]= 1;
        	
        });
        
        $.each(xs,function(index,value){
        	var id = $(value).attr("id");
        	var one = id[1]
        	var two = id[2]
        	var n = 0;
        	var m = 0;
        	if (one =="o") n=0;
        	if (one =="m") n=1;
        	if (one =="u") n=2;
        	if (two =="l") m=0;
        	if (two =="m") m=1;
        	if (two =="r") m=2;
        	matrix[n][m]= 2;
        });
        
        
        
        if(matrix[0][0] > 0 && tools.areEqual(matrix[0][0],matrix[0][1],matrix[0][2])){
        		callback(matrix[0][0],["dol","dom","dor"]);
        		return;
        }
        
        if(matrix[1][0] > 0 && tools.areEqual(matrix[1][0],matrix[1][1],matrix[1][2])){
        		callback(matrix[1][0],["dml","dmm","dmr"]);
        		return;
        }
        
        if(matrix[2][0] > 0 && tools.areEqual(matrix[2][0],matrix[2][1],matrix[2][2])){
        		callback(matrix[2][0],["dul","dum","dur"]);
        		return;
        }
        
        
        if(matrix[0][0] > 0 && tools.areEqual(matrix[0][0],matrix[1][0],matrix[2][0])){
        		callback(matrix[0][0],["dol","dml","dul"]);
        		return;
        }
        
        if(matrix[0][1] > 0 && tools.areEqual(matrix[0][1],matrix[1][1],matrix[2][1])){
        		callback(matrix[0][1],["dom","dmm","dum"]);
        		return;
        }
        if(matrix[0][2] > 0 && tools.areEqual(matrix[0][2],matrix[1][2],matrix[2][2])){
        		callback(matrix[0][2],["dor","dmr","dur"]);
        		return;
        }
        
        if(matrix[0][0] > 0 && tools.areEqual(matrix[0][0],matrix[1][1],matrix[2][2])){
        		callback(matrix[1][1],["dol","dmm","dur"]);
        		return;
        }
        
        if(matrix[2][0] > 0 && tools.areEqual(matrix[2][0],matrix[1][1],matrix[0][2])){
        		callback(matrix[1][1],["dor","dmm","dul"]);
        		return;
        }
        
        if (tictactoe.onTurn == "pepper"){
        	callback(0,matrix);
        	return;
        }
         
        if (os.length + xs.length > 8){
        	callback(3,[]);
        	return;
        }

        callback(0,[]);
        return;
    }
    
}

$(document).ready(function(){
	
	setTimeout(function(){
		tictactoe.registerCanvas();
		pepperAI.register();
		QiSession(function(session){

		        session.service("ALBehaviorManager").then(function (bm) {
		            bm.getRunningBehaviors().then(function (rbs) {
		                if ($.inArray('games_2/tictactoe', rbs) == -1){
						    bm.startBehavior("games_2/tictactoe").then(function(){
								
								memread(session,"ttt/difficulty",function(data){
									
									pepperAI.AiLevel=data;
									if (pepperAI.AiLevel==2 && pepperAI.explained==false){
										QiSession(function(session){
												memraise(session,"ttt/explain",1);
												pepperAI.explained=true;
										});
									}
								});

		                    });
		                }
		            });
		            //if (bm.getRunningBehaviors().indexOf("fotoapp/reconfigure") > -1){
		        });
				
		});
	},500);
	
	games.bindClose();
	
	
});