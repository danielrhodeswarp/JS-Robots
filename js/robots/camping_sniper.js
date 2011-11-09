//CAMPING SNIPER
//
//Hide in a random corner for easier scanning
//
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

this.getRandomCorner = function()
{
	var decider = rand(1000);
	
	var x = 499;
	if(decider < 500)
	{
		x = 0;
	}
	
	decider = rand(1000);
	
	var y = 499;
	if(decider < 500)
	{
		y = 0;
	}
	
	return {x:x, y:y};	//Object literal
};

this.getScanAnglesForCorner = function(corner)
{
	if(corner.x == 0 && corner.y == 0)
	{
		return {min:90, max:180};
	}
	
	if(corner.x == 499 && corner.y == 0)
	{
		return {min:180, max:270};
	}
	
	if(corner.x == 499 && corner.y == 499)
	{
		return {min:270, max:359};
	}
	
	if(corner.x == 0 && corner.y == 499)
	{
		return {min:0, max:90};
	}
};

this.getHeadingToXY = function(x, y)
{
	var heading;
	
	var curx = this.loc_x();
	var cury = this.loc_y();
	
	var dx = curx - x;
	var dy = cury - y;
	
	//atan() only returns -90 to +90, so figure out how to use
	//the atan() value
	if(dx == 0)	//x is zero, we either move due north or south
	{
		if(y > cury)
		{
			heading = 180;	//South
		}
		
		else
		{
			heading = 0;	//North
		}
	}
	
	else
	{
		if(y < cury)
		{
			if(x > curx)
			{
				heading = atan(dy / dx);	//NORTH EAST
			}
			
			else
			{
				heading = 180 + atan(dy / dx);	//NORTH WEST
			}
        }
        
        else
        {
        	if(x > curx)
        	{
        		heading = 360 + atan(dy / dx);	//SOUTH EAST
        	}
        	
        	else
        	{
        		heading = 180 + atan(dy / dx);	//SOUTH WEST
        	}
        }
    }
    
    return heading;
};

//Init
if(!this.corner)
{
	this.corner = this.getRandomCorner();
	this.heading = this.getHeadingToXY(this.corner.x, this.corner.y);
	
	var scanAngles = this.getScanAnglesForCorner(this.corner);
	this.scanMin = scanAngles.min;
	this.scanMax = scanAngles.max;
	
	this.scanAngle = this.scanMin;
	
	this.currentDamage = 0;
}

//Almost in that corner? Then stop!
if(this.closeToWall())
{
	this.drive(this.heading, 0);
	
	var range = this.scan(this.scanAngle, 5);
	
	if(range && range < 350)
	{
		this.cannon(this.scanAngle, range);
	}
	
	this.scanAngle += 10;
	
	if(this.scanAngle > this.scanMax)
	{
		this.scanAngle = this.scanMin;
	}
}

else
{
	this.drive(this.heading, 50);
}

//Change corner if got damage (from explosion or collision)
if(this.currentDamage != this.damage())
{
	this.corner = this.getRandomCorner();
	this.heading = this.getHeadingToXY(this.corner.x, this.corner.y);
	this.drive(this.heading, 50);	//For quick getaway bug
}

this.currentDamage = this.damage();