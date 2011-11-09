//AGGRESSIVE TOWER
//
//Scan constantly and shoot at target if found
//ELSE lob a random missile for the sake of it!
//

if(!this.scanAngle)	//One-off initialisation
{
	this.scanAngle = rand(360);
}

var range = this.scan(this.scanAngle, 10);

if(range)
{
	this.cannon(this.scanAngle, range);
}

//Go wild!
else
{
	//Add 50 so we don't hit ourself!
	this.cannon(rand(360), rand(300) + 50);
}

this.scanAngle += 20;