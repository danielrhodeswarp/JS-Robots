//DEFENSIVE TOWER
//
//Scan constantly and shoot at most recently found target
//IF we have taken damage
//

if(!this.scanAngle)	//One-off initialisation
{
	this.scanAngle = rand(360);
	this.currentTargetAngle = 0;
	this.currentTargetRange = 0;
	this.gotFirstTarget = false;
	this.currentDamage = 0;
}

var range = this.scan(this.scanAngle, 5);

if(range)	//Update shooting angle if new target found
{
	this.gotFirstTarget = true;
	this.currentTargetAngle = this.scanAngle;
	this.currentTargetRange = range;
}

//Fire at current angle and range IF we've taken a hit
if(this.gotFirstTarget && (this.damage() != this.currentDamage))
{
	this.cannon(this.currentTargetAngle, this.currentTargetRange);
}

this.scanAngle += 10;
this.currentDamage = this.damage();