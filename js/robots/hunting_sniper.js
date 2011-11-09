//HUNTING SNIPER
//
//Scans only if lost/no target.
//Chases target and backs off if too close.
//No collision detection to speak of.
//Why not add some as a user exercise? ;-)
//

//Init
if(!this.scanAngle)
{
	this.scanAngle = 0;
}

var range = this.scan(this.scanAngle, 5);

//Have target
if(range)
{
	this.cannon(this.scanAngle, range);
	
	if(range > 300)	//Move closer
	{
		this.drive(this.scanAngle, 75);
	}
	
	else if(range < 200)	//Back off
	{
		this.drive(this.scanAngle, 0);
		this.drive(this.scanAngle - 180, 100);
	}
}

else	//Only change scanning angle if we've lost the target
{
	this.scanAngle += 10;
}