//CAN COMPRESS SAFELY WITH http://dynamic-tools.net/toolbox/javascript_compressor/

var RADS_PER_DEG = Math.PI / 180;
var DEGS_PER_RAD = 180 / Math.PI;

//Lookup tables
var cosine = [];
var sine = [];
var tangent = [];
var deg2rad = [];
var rad2deg = [];	//Try caching this as we go
var sqrt = [];	//Try caching this as we go

//
function makeLookupTables()
{
	for(var loop = 0; loop < 360; loop++)
	{
		deg2rad[loop] = degToRad(loop);
		
		sine[loop] = Math.sin(deg2rad[loop]);
		
		cosine[loop] = Math.cos(deg2rad[loop]);
		
		tangent[loop] = Math.tan(deg2rad[loop]);
	}
	
	/*
	for(some granularity of radians)
	{
		rad2deg[loop] = radToDeg(loop);
	}
	*/
}

function degToRad(deg)
{
	return deg * RADS_PER_DEG;
}

function radToDeg(rad)
{
	return rad * DEGS_PER_RAD;
}

function makePositiveAngle(angle)
{
	angle = angle % 360;
	
	if(angle < 0)
	{
		angle = 360 + angle;	//Won't work for BIG minus angles if *before* the modulo operation...
	}
	
	return angle;
}

//USE WITH Robot.scan() [and game.checkRobotCollision()]
function getDistanceBetweenRobotAAndRobotB(robotA, robotB)
{
	var max_x = Math.max(robotA._x, robotB._x);
	var min_x = Math.min(robotA._x, robotB._x);
	
	var max_y = Math.max(robotA._y, robotB._y);
	var min_y = Math.min(robotA._y, robotB._y);
	
	var delta_x = max_x - min_x;
	var delta_y = max_y - min_y;
	
	var squared_distance = (delta_x * delta_x) + (delta_y * delta_y);
	
	//cache
	if(!sqrt[squared_distance])
	{
		sqrt[squared_distance] = Math.sqrt(squared_distance);
		//log('not in cache');
	}
	//else log('got from cache');
	
	return sqrt[squared_distance];
}

//USE WITH Robot.scan()
//WHY DOES THIS ALWAYS SEEM TO WORK (?) BUT THE THING
//IN CAMPING_SNIPER.JS NEEDS ALL THAT QUADRANT CHECKING JUNK!!???!!??
function getDirectionFromRobotAToRobotB(robotA, robotB)
{
	var rads = Math.atan2(robotB._y - robotA._y, robotB._x - robotA._x);
	
	if(!rad2deg[rads])
	{
		rad2deg[rads] = 90 + radToDeg(rads);	//Build up our cache
		//log('not in cache');
	}
	//else log('using cache');
	
	var directionToRobotB = /*90 +*/ rad2deg[rads];
	
	
	if(directionToRobotB < 0){directionToRobotB += 360;} 
	
	return directionToRobotB;
}

//
function getDirectionFromRobotToPoint(robot, x, y)
{
	var rads = Math.atan2(y - robot._y, x - robot._x);
	
	if(!rad2deg[rads])
	{
		rad2deg[rads] = 90 + radToDeg(rads);	//Build up our cache
		//log('not in cache');
	}
	//else log('using cache');
	
	var directionToPoint = /*90 +*/ rad2deg[rads];
	
	
	if(directionToPoint < 0){directionToPoint += 360;} 
	
	return directionToPoint;
}

//PRECALC SOME STUFF!!!
//or how about coldec where bigger or not doesn't matter (using Math.min(), Math.max() etc?)
function smallerSquareOnBiggerSquare(smallerX, smallerY, smallerOffset, biggerX, biggerY, biggerOffset)
{
	//A more "central" hit of a smaller bullet on a bigger robot (as an example)
	/*
	if(bullet.x >= (game._robots[robotId].x - game._robots[robotId].offset) && bullet.x <= (game._robots[robotId].x + game._robots[robotId].offset))
	{
		if(bullet.y >= (game._robots[robotId].y - game._robots[robotId].offset) && bullet.y <= (game._robots[robotId].y + game._robots[robotId].offset))
		{
			game._robots[robotId]._damage += bullet.damage;
			bullet.remove = true;
		}
	}
	*/
	
	if((smallerX + smallerOffset) >= (biggerX - biggerOffset) && (smallerX - smallerOffset) <= (biggerX + biggerOffset))
	{
		if((smallerY + smallerOffset) >= (biggerY - biggerOffset) && (smallerY - smallerOffset) <= (biggerY + biggerOffset))
		{
			return true;
		}
	}
	
	return false;
}

//
//Should this go in the game class?????
//Explosion is bigger than a robot so we need to do "is robot (partially) in the explosion or not"
//sort of checking
function colDetExplosion(explosion)	//Missiles don't hurt robots, *explosions* hurt robots ;-)
{
	for(var robotId in game._robots)
	{
		/*
		if((explosion.x - explosion.offset) >= (game._robots[robotId].x - game._robots[robotId].offset) && (explosion.x + explosion.offset) <= (game._robots[robotId].x + game._robots[robotId].offset))
		{
			if((explosion.y - explosion.offset) >= (game._robots[robotId].y - game._robots[robotId].offset) && (explosion.y + explosion.offset) <= (game._robots[robotId].y + game._robots[robotId].offset))
			{
				log('a fine missile hit');
				game._robots[robotId]._damage += explosion.damage;
				explosion.finished = true;
			}
		}
		*/
		
		if(smallerSquareOnBiggerSquare(game._robots[robotId]._x, game._robots[robotId]._y, game._robots[robotId]._offset, explosion.x, explosion.y, explosion.offset))
		{
			game._robots[robotId]._damage += explosion.damage;
			explosion.finished = true;
		}
		
	}
}