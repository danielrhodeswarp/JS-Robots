//CAN COMPRESS SAFELY WITH http://dynamic-tools.net/toolbox/javascript_compressor/

//Robot object
function Robot(elementId, color, script)
{
	//Properties-(prefixed to avoid collisions with userland junk-----------------------
	this._elementId = elementId;
	this._element;
	this._color = color;
	this._script = script;
	
	this._size = 31;
	this._offset = 15;	//To centre of size
	
	//access the arena object??
	this._x = /*Math.floor*/((Math.random() * (500 - this._offset)) + this._offset);	//Are we sometimes going *over* walls with this????
	this._y = /*Math.floor*/((Math.random() * (500 - this._offset)) + this._offset);
	
	this._topSpeed = 8;
	this._currentSpeed;
	this._currentDrivingAngle = '';
	this._moving = false;
	this._enginePower = 0;	//A percentage of topSpeed
	this._stopped = false;	//Have we been forcibly stopped?
	
	this._remove = false;
	this._disabled = false;
	
	this._bullets = {};
	this._bulletCounter = 0;
	
	this._damage = 0;
	
	this._currentScanAngle = '';
	
	this._missiles = {};
	this._missileCounter = 0;
	this._missileLauncherSlowness = 16;
	this._missileLauncherCountdown = 0;
	
	
	
	//Methods---------------------------
	
	//Create the <div> to represent the robot (hidden)
	this._makeElement = function()
	{
		var robotImage = document.createElement('div');
	
		robotImage.id = this._elementId;
		
		robotImage.style.position = 'absolute';
		
		//Let's have it so active robots *roll over* dead robots
		robotImage.style.zIndex = 100;
		
		//Need to separate (ie. not using .border = '') because of a Safari issue
		robotImage.style.borderStyle = 'solid';
		robotImage.style.borderWidth = '1px';
		robotImage.style.borderColor = 'black';
		
		//For easy group removal (ie. when reseting the game)
		robotImage.className = 'robot';
		
		//Set text color
		if(color != 'white')
		{
			robotImage.style.color = 'white';
		}
		
		else
		{
			robotImage.style.color = 'black';
		}
		
		robotImage.style.width = (this._size - 2) + 'px';
		robotImage.style.height = (this._size - 2) + 'px';
		
		robotImage.style.backgroundColor = this._color;
		
		document.body.appendChild(robotImage);
	};
	
	//Crobots-esque API functions FOR THE USER---------------------
	
	//Degree should be within the range 0-359,
	//otherwise degree is forced into 0-359 by a modulo 360
	//operation, and made positive if necessary.
	//Resolution controls the scanner's sensing resolution, up to +/- 10 degrees. 
	//----
	//Return FALSE if no robots are within the scan range or a positive
	//integer representing the range to the closest robot
	this.scan = function(degree, resolution)
	{
		if(resolution < 0)
		{
			resolution = 0;
		}
		if(resolution > 10)
		{
			resolution = 10;
		}
		
		degree = makePositiveAngle(degree);
		this._currentScanAngle = degree;
		
		var candidates = {};
		var haveCandidates = false;
		
		for(var robotId in game._robots)
		{
			if(robotId == this._elementId)
			{
				continue;
			}
			
			var angleFromThis = Math.floor(getDirectionFromRobotAToRobotB(this, game._robots[robotId]));
			//Integer needed only to get a resolution of zero working...!!!
			//(could do the Math.floor not here but in the final ELSE block below...)
			
			//
			var fromDegree = makePositiveAngle(degree - resolution);
			var toDegree = makePositiveAngle(degree + resolution);
			
			//log('Ang from this: ' + angleFromThis + '. Scan from ' + fromDegree + ' to ' + toDegree);
			
			//359 - 0 wraparound
			if(fromDegree > toDegree)
			{
				if(angleFromThis == 0)
				{
					haveCandidates = true;
					candidates[robotId] = getDistanceBetweenRobotAAndRobotB(this, game._robots[robotId]);
				}
				
				else if(angleFromThis < toDegree && angleFromThis > 0)
				{
					haveCandidates = true;
					candidates[robotId] = getDistanceBetweenRobotAAndRobotB(this, game._robots[robotId]);
				}
				
				else if(angleFromThis < 0 && angleFromThis > fromDegree)
				{
					haveCandidates = true;
					candidates[robotId] = getDistanceBetweenRobotAAndRobotB(this, game._robots[robotId]);
				}
			}
			
			else
			{
				if((angleFromThis >= fromDegree) && (angleFromThis <= toDegree))
				{
					haveCandidates = true;
					candidates[robotId] = getDistanceBetweenRobotAAndRobotB(this, game._robots[robotId]);
				}
			}
		}
		
		//return false if no candidates
		if(!haveCandidates)
		{
			return false;
		}
		
		//return range of closest robot
		var minimum = 200000000;
		
		for(var candidateId in candidates)
		{
			if(candidates[candidateId] < minimum)
			{
				minimum = candidates[candidateId];
			}
		}
		
		//return minimum;	//Will be a float
		
		return Math.floor(minimum);	//Will be an integer (as per orig CROBOTS)
	};
	
	//fire a missile heading a specified range
	//and direction. Degree is forced into
	//the range 0-359 as in scan().  Range can be 0-700, with greater
	//ranges truncated to 700. 
	//----
	//Return TRUE if a missile was fired, or FALSE if the cannon is reloading
	this.cannon = function(degree, range)
	{
		//Reloading?
		if(this._missileLauncherCountdown > 0)
		{
			return false;
		}
		
		//Reset reload countdown
		this._missileLauncherCountdown = this._missileLauncherSlowness;
		
		var missileId = this._elementId + '_' + this._missileCounter;
		
		miss = new Missile(this._elementId, missileId, this._x, this._y, degree, range);
		
		this._missiles[missileId] = miss;
		
		this._missileCounter++;
		
		return true;
	};
	
	
	
	//activates the robot's drive mechanism, on a
	//specified heading and speed.  Degree is forced into the range
	//0-359 as in scan().  Speed is expressed as a percent, with 100 as
	//maximum.  A speed of 0 disengages the drive.  Changes in
	//direction can be negotiated at speeds of less than 50 percent (have/should actually implement this restriction Daniel???). 
	this.drive = function(degree, speed)
	{
		//If stopped then need diff angle to reactivate (or just stop for one turn?????~)
		if(this._stopped /*&& degree == this._currentDrivingAngle*/)	//makePositiveANgle() on degree?
		{	
			this._stopped = false;
			return false;	//Not per orig CROBOTS docs
		}
		
		
		
		degree = makePositiveAngle(degree);
		
		//log(degree);		
		
		//this._setEnginePower(speed);
		
		//this._move(degree);
		
		//Use current or desired engine power?? PROB DESIRED!!
		if(this._moving && degree != this._currentDrivingAngle && /*this._enginePower*/ speed > 50)
		{
			//log('too fast to turn!');
			//stop or what? NOP will continue with previous heading and speed
			return false;	//Not per orig CROBOTS docs
		}
		else
		{
			this._setEnginePower(speed);			this._move(degree);
			return true;	//Not per orig CROBOTS docs
		}
	};
	
	
	
	
	/*
	returns the percent

        of damage, 0-99. (100 percent damage means the robot is

        completely disabled, thus no longer running!) 
	*/
	this.damage = function()	//Should prob also do a getDamage()
	{
		return this._damage;
	};
	
	
	/*

        The speed() function returns the current speed of the robot.

        speed() takes no arguments, and returns the percent of speed,

        0-100.  Note that speed() may not always be the same as the last

        drive(), because of acceleration and deacceleration. 
		*/
	
	this.speed = function()	//Should prob also do a getSpeed()
	{
		return this._enginePower;
	};
	
	
	this.loc_x = function()	//Should prob also do a getX()
	{
		//return this._x;	//Will be a float
		
		return Math.floor(this._x);	//Will be an integer (as per orig CROBOTS)
	};
	
	this.loc_y = function()	//Should prob also do a getY()
	{
		//return this._y;	//Will be a float
		
		return Math.floor(this._y);	//Will be an integer (as per orig CROBOTS)
	};
	
		//Non "this." functions that robot scripts can use
		
		//rand(fromZeroToOneLessThanThisParamater)
		
		//sqrt(thisParamaterIsEnsuredPositiveAndTheSquareRootIsReturned)
		
		//sin (degree)	//Or just use Math. for this junk??
		//cos (degree)
		//tan (degree)
		//atan (ratio)	
		
		//----
	
	
	//End Crobots API functions-----------------
	
	//----HELPER---------
	/*
	this.driveTo = function(x, y, speed)
	{
		degree = makePositiveAngle(getDirectionFromRobotToPoint(this, x, y));
		
		this._setEnginePower(speed);
		
		this._move(degree);
	}
	*/
	
	this._stop = function(message)	//Don't really need message parm (debug junk)
	{
		//????
		//this._backtrack();
		//log('backtracking');
		
		//if(message == null){message = '';}else{message = ' due to ' + message;}
		//log('stopping ' + this._elementId + message);
		
		this._moving = false;
		this._enginePower = 0;
		this._currentSpeed = 0;
		//this._stopped = true;
		
	};
	
	this._stopHard = function(message)	//Don't really need message parm (debug junk)
	{
		//????
		//this._backtrack();	//A form of coordinate clipping
		//log('backtracking');
		
		//if(message == null){message = '';}else{message = ' due to ' + message;}
		//log('stopping HARD ' + this._elementId + message);
		
		this._moving = false;
		this._enginePower = 0;
		this._currentSpeed = 0;
		this._stopped = true;
		
	};
	
	this._backtrack = function()	//A form of coordinate clipping (like we have for wall hits)
	{
		//log(this._currentDrivingAngle - 180);
		this._shortMove(this._currentDrivingAngle - 180);
		//this._move(this._currentDrivingAngle - 180);
	};
	
	this._setEnginePower = function(power)
	{
		if(power < 0)
		{
			power = 0;
		}
		
		if(power > 100)
		{
			power = 100;
		}
		
		this._enginePower = power;
		
		this._currentSpeed = /*Math.floor*/((this._topSpeed / 100) * this._enginePower);
		
		//Housekeeping var
		this._moving = (this._currentSpeed > 0);
	};
	//----/HELPER--------
	
	
	
	//Set user's main routine
	this._setScript = function(script)
	{
		try
		{
			this._userUpdate = new Function(script);
		}
		
		catch(error)
		{
			alert('Could not LOAD the program for: ' + this._elementId.replace('_', ' ') + '\nError: "' + error + '"\nPlease check the program source');
			game.stop();
		}
	};
	
	//
	this._shortMove = function(degree)
	{
		var sin = sine[degree];
		var cos = cosine[degree];
		//log(this._currentSpeed);
		this._x += /*Math.floor*/(sin * this._currentSpeed);	//Math.floor gave gradual rounding decrement when, for example, a robots was circling...
		this._y -= /*Math.floor*/(cos * this._currentSpeed);
	};
	
	//Change x and y based on direction and speed
	this._move = function(degree)
	{
		var sin = sine[degree];
		var cos = cosine[degree];
		
		this._x += /*Math.floor*/(sin * this._currentSpeed);	//Math.floor gave gradual rounding decrement when, for example, a robots was circling...
		this._y -= /*Math.floor*/(cos * this._currentSpeed);
		
		//Prob wanna return after each IF block (only wanna stop() once per turn!)
		
		if(this._x < 0)
		{
			this._x = 0;
			this._stop('wallhit');
			this._damage += arena.wallDamage;
			
		}
		
		if(this._x >= arena.width)
		{
			this._x = arena.width - 1;
			this._stop('wallhit');
			this._damage += arena.wallDamage;
			
		}
		
		if(this._y < 0)
		{
			this._y = 0;
			this._stop('wallhit');
			this._damage += arena.wallDamage;
			
		}
		
		if(this._y >= arena.height)
		{
			this._y = arena.height - 1;
			this._stop('wallhit');
			this._damage += arena.wallDamage;
			
		}
		
		//Housekeeping var
		this._currentDrivingAngle = degree;
	};
	
	
	
	
	
	//Internal main routine (user's main routine and some hidden internal stuff)
	this._update = function()
	{
		if(this._damage >= 100 && !this._remove)
		{
			this._remove = true;
			
			//Remove also all missiles (explosions?) (but what about timing etc?)
			for(var missile in this._missiles)			{
				this._missiles[missile].remove = true;
			}
			
			//Put following stuff in draw() ?			
			this._element.style.backgroundColor = 'orange';
			//Let's have it so active robots *roll over* dead robots
			this._element.style.zIndex = 10;
		}
		
		
		
		this._missileLauncherCountdown--;
		
		
		
		//Move missiles	
		for(var missile in this._missiles)
		{
			this._missiles[missile].move();
			
			//coldet?
			//NOPE, do it in explosion class (doing it here would be for all MISSILEs and not all EXPLOSIONS)
			//colDetExplosion(this._bullets[bullet], this._elementId);
			
			if(this._missiles[missile].remove)
			{
				var img = document.getElementById(missile);
				
				img.parentNode.removeChild(img);
				
				delete this._missiles[missile];
				//this._missileCounter--;
			}
		}
		
		//User's script
		//if(!this._disabled)
		//{		
			try
			{	
				this._userUpdate();
			}
			
			catch(error)
			{
				alert('Could not EXECUTE the program for: ' + this._elementId.replace('_', ' ') + '\nError: "' + error + '"\nPlease check the program source');
				game.stop();
			}
		//}
	};
	
	//Draw the robot and all owned bullets and missiles/explosions
	this._draw = function()
	{
		this._element.style.left = (this._x - this._offset) + arena.offsetX + 'px';
		this._element.style.top = (this._y - this._offset) + arena.offsetY + 'px';
		
		if(!this._remove)	//? show minus deaths? or always set to zero? MINUS DEATHS APPEAR! so maybe drawing of death score is out a lil in terms of timing (ometimes the death score is positivee ie. "2" or "1")....
		{
			
			this._element.innerHTML = 100 - this._damage;
			
			
		}
		
		//Draw missiles
				for(var missile in this._missiles)
		{
			this._missiles[missile].draw();
		}
	};
	
	//Constructor
		this._setScript(this._script);
	this._makeElement();
	this._element = document.getElementById(this._elementId);
	//----
}