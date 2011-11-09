//RADIUS GUARD
//
//Walk around a circle protecting what's inside
//the circle by shooting outwards if there's a target.
//Change drive direction if hit a robot or wall
//

//Helper method
this.closeToWall = function()
{
	var x = this.loc_x();
	var y = this.loc_y();

	if(x < 10 || x > 490)
	{
		return true;
	}

	if(y < 10 || y > 490)
	{
		return true;
	}

	return false;
};

//Init
if(!this.walkAngle)
{
	this.walkAngle = 0;
	this.angleInc = 3;
	this.affector = 1;
}

//Scan current tangent (ie. drive angle minus 90) from centre of circle
//[We need to *add* 90 when angleInc is negative (ie. moving anti-clockwise)]
this.scanAngle = this.walkAngle + (90 * -this.affector);

this.drive(this.walkAngle, 50);

var range = this.scan(this.scanAngle, 10);

//Have target
if(range)
{
	this.cannon(this.scanAngle, range);
}

this.walkAngle += (this.angleInc * this.affector);

if(this.speed() == 0 || this.closeToWall())	//Hit wall or robot
{
	//this.angleInc = -this.angleInc;
	this.affector = -this.affector;
	this.walkAngle -= 180;
}

if(this.speed() == 0)	//For quick getaway bug
{
	this.drive(this.walkAngle, 50);
}