//NORMAL TOWER
//
//Scan constantly and shoot at most recently found target
//

if(!this.scanAngle)	//One-off initialisation
{
	this.scanAngle = rand(360);
	this.currentTargetAngle = 0;
	this.currentTargetRange = 0;
	this.gotFirstTarget = false;
}

var range = this.scan(this.scanAngle, 5);

if(range)	//Update shooting angle if new target found
{
	this.gotFirstTarget = true;
	this.currentTargetAngle = this.scanAngle;
	this.currentTargetRange = range;
}

//Fire at current angle and range
if(this.gotFirstTarget)
{
	this.cannon(this.currentTargetAngle, this.currentTargetRange);
}

this.scanAngle += 10;