//CAN COMPRESS SAFELY WITH http://dynamic-tools.net/toolbox/javascript_compressor/

//Game object
function Game(arena)
{
	//Properties (prefixed to avoid collisions with userland junk but OOPS that would be the Robot class and not this Game class!!!!)
	this._arena;	//But we only ever seem to use the global 'arena' !!??!!
	this._stopped = true;
	this._paused = false;
	this._fps = 15;
	this._timerFrequency = 1000 / this._fps;	//1000(ms) / FPS
	this._robots = {};	//Accessed by a few other scripts too
	this._robotCount = 0;
	this._robotCollisionDamage = 2;
	
	//Constructor
	this._arena = arena;
	//----
	
	//Triggered before a new play
	this.reset = function()
	{
		this._robots = {};		this._robotCount = 0;
		
		this._paused = false;
		this._stopped = false;
		
		var winmsg = document.getElementById('winmsg');
		if(winmsg)
		{
			document.body.removeChild(winmsg);
		}
		
		//Remove remaining robot ELEMENTS
		$('.robot').remove();
		
		//Remove remaining explosion ELEMENTS
		$('.explosion').remove();
		
		//Remove remaining missile ELEMENTS
		$('.missile').remove();
	};
	
	//Load robots
	this.init = function()
	{
		for(var loop = 1; loop < 5; loop++)
		{
			if(document.getElementById('cpu_' + loop + '_on').checked)
			{
				robot = new Robot('cpu_' + loop, document.getElementById('cpu_' + loop + '_color').value, makeOneLine(document.getElementById(document.getElementById('cpu_' + loop + '_program').value).value));
				
				this.addRobot('cpu_' + loop,robot);
			}
			
			if(document.getElementById('player_' + loop + '_on').checked)
			{
				robot = new Robot('player_' + loop, document.getElementById('player_' + loop + '_color').value, makeOneLine(document.getElementById('player_' + loop + '_program_source').value));
				
				this.addRobot('player_' + loop, robot);
			}
		}
		
		if(this._robotCount < 2)
		{
			alert('Select at least 2 robots please');
			this.stop();
			return false;
		}
		
		return true;
	};
	
	//Other methods
	this.addRobot = function(robotId, robotObject)
	{
		this._robots[robotId] = robotObject;
		this._robotCount++;
	};
	
	this.removeRobot = function(robotId)
	{
		delete this._robots[robotId];
		this._robotCount--;
	};
	
	this.draw = function()
	{
		for(var robotId in this._robots)
		{
			this._robots[robotId]._draw();
			
			this.drawStatistics(this._robots[robotId]);
		}
	};
	
	this.drawStatistics = function(robot)
	{
		document.getElementById(robot._elementId + '_damage').innerHTML = robot._damage;
		document.getElementById(robot._elementId + '_speed').innerHTML = robot._enginePower;
		document.getElementById(robot._elementId + '_heading').innerHTML = robot._currentDrivingAngle;
		document.getElementById(robot._elementId + '_scan').innerHTML = robot._currentScanAngle;
	};
	
	this.update = function()
	{
		for(var robotId in this._robots)
		{
			this._robots[robotId]._update();
		}
	};
	
	this.play = function()
	{
		if(!this._stopped)
		{
			return;
		}
		
		this.reset();
		var initSuccess = this.init();
		
		if(!initSuccess)
		{
			return;
		}
		
		//Record game start time
		this._startDate = new Date();
				
		mainGameLoop();
	};
	
	this.pause = function()	//But don't forget game timing!
	{
		this._paused = true;
	};
	
	this.unpause = function()	//But don't forget game timing!
	{
		this._paused = false;
	};
	
	this.togglePause = function()	//But don't forget game timing!
	{
		this._paused = !this._paused;
	};
	
	this.stop = function()
	{
		this._stopped = true;
		this._paused = false;
	};
	
	
	
	/*
	//MOVED OUT OF OBJECT (*in* the self object was NOT working properly)...
	this.goGoGo = function()	//"go" already in JavaScript somewhere (History object?)
	{
		if(!this._playing || this._paused)
		{
			//log('not playing');
			return;
		}
		
		//if(this._playing && !this._paused)
		else	//What's a good order here?
		{
			this.update();
			
			this.removeDeadRobots();
			
			this.collisionDetection();
			
			this.draw();
			
			this.announceWinnerIfAppropriate();
		}
		
		
		//var endDate = new Date();
		//log((endDate.getTime() - startDate.getTime()) + 'ms for ' + this._robotCount + ' robots');
		
		setTimeout('this.goGoGo()', this._timerFrequency);	//Seems to make this.PLAY() repeat??!!?
		//setTimeout(this.go, this._timerFrequency);	//Opera doesn't like this
		//setTimeout('go()', this._timerFrequency);
	};
	*/
	
	
	this.collisionDetection = function()
	{
		for(var robotId in this._robots)
		{
			this.checkRobotCollision(robotId);
		}
	};
	
	this.checkRobotCollision = function(robotIdToCheck)	//Need to (?) intelligently remove dublies here Daniel...
	{
		var robot = this._robots[robotIdToCheck];
		
		for(var robotId in this._robots)
		{
			if(robotId == robotIdToCheck)
			{
				continue;
			}
			
			var robotB = this._robots[robotId];
			
			//Ignore other robot if that is already stopped forcibly
			if(robotB._stopped)
			{
				continue;
			}
			
			var distance = getDistanceBetweenRobotAAndRobotB(robot, robotB);
			
			//nb. origin of robots is their geometric centre
			
			if(distance < 32)	//?or double the robot offset or what?
			{
				
				//if(robotIdToCheck == 'player_1'){log(distance);}
				
				//if(!this._robots[robotId]._stopped){
				this._robots[robotId]._damage += this._robotCollisionDamage;
				this._robots[robotId]._stopHard('collision');
				
				//}
				
				
				
				//if(!this._robots[robotIdToCheck]._stopped){
				this._robots[robotIdToCheck]._damage += this._robotCollisionDamage;
				this._robots[robotIdToCheck]._stopHard('collision');
				//}
				
				
				//NEW!
				return;
				
			}
			
		}
	};
	
	
	this.removeDeadRobots = function()
	{
		for(var robotId in this._robots)
		{
			if(this._robots[robotId]._remove)
			{
				this.removeRobot(robotId);
			}
		}
	};
	
	this.announceWinnerIfAppropriate = function()
	{
		var counter = 0;
		var robotId;
		
		for(var robotId in this._robots)
		{
			counter++;
			robotId = robotId;
		}
		
		if(counter == 0)
		{
			this.stop();
			alert('Draw!');
		}
		
		if(counter == 1)
		{
			var endDate = new Date();			var winTimeInMs = endDate.getTime() - this._startDate.getTime();
					
			
			var p = document.createElement('span');
			var robotName = robotId.replace('_', ' ');
			p.appendChild(document.createTextNode(robotName + ' wins!'));
			
			p.id = 'winmsg';
			p.style.position = 'absolute';
			
			p.style.left = '100px';
			p.style.top = '250px';
			p.style.fontSize = '3em';
			p.style.color = 'red';
			p.style.whiteSpace = 'nowrap';
			p.style.zIndex = '400';	//Put over robots *and* explosions/missiles
			
			document.body.appendChild(p);
			
			
			
			this.stop();
			
						
			//If *player* win then give 'em their time
			if(robotName.charAt(0) == 'p')
			{
				doScoring(robotId, robotName, winTimeInMs);
			}
		}
	};
}


//Main game loop
function mainGameLoop()
{
	if(game._stopped)	//ie. "stopping" breaks the game loop
	{
		return;
	}
	
	if(!game._paused)	//ie. "pausing" keeps the game loop but NOPs
	{
		game.update();
		game.collisionDetection();
		game.removeDeadRobots();
		game.draw();
		game.announceWinnerIfAppropriate();
	}
	
	setTimeout('mainGameLoop()', game._timerFrequency);}