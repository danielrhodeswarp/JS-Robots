//PERIMETER GUARD
//
//Walk back and forth across the same line
//shooting anything more-or-less in front
//and backtracking if hit another robots
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

//Reverse driving angle by 180 degrees
this.toggleAngle = function()
{
	if(this.currentAngle == this.startAngle)
	{
		this.currentAngle = this.returnAngle;
	}
	
	else
	{
		this.currentAngle = this.startAngle;
	}
};

//Init
if(!this.startAngle)
{
	this.startAngle = rand(360);
	this.returnAngle = this.startAngle - 180;
	this.currentAngle = this.startAngle;
}



this.drive(this.currentAngle, 50);

var range = this.scan(this.currentAngle, 10);

//Have target
if(range)
{
	this.cannon(this.currentAngle, range);
}

if(this.speed() == 0 || this.closeToWall())	//Hit wall or robot
{
	this.toggleAngle();
}

if(this.speed() == 0)	//For quick getaway bug
{
	this.drive(this.currentAngle, 50);
}