//MOSQUITO
//
//A non-offensive robot that flies around randomly
//like a lunatic
//

//Helper
this.closeToCoord = function(coord)
{
	return (Math.abs(coord.x - this.loc_x()) < 20) && (Math.abs(coord.y - this.loc_y()) < 20);
};

this.getRandomCoord = function()
{
	return {x:rand(500), y:rand(500)};	//Object literal
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

this.getCoordAndHeading = function()
{
	this.coord = this.getRandomCoord();
	this.heading = this.getHeadingToXY(this.coord.x, this.coord.y);
};

//Init
if(!this.coord)
{
	this.getCoordAndHeading();
}

this.drive(this.heading, 100);

//Stop (and change coord) if close enough to desired coord
//OR if we've hit another robot
if(this.closeToCoord(this.coord) || this.speed() == 0)
{
	this.drive(this.heading, 0);	//Stop
		
	this.getCoordAndHeading();
	this.drive(this.heading, 100);	//For quick getaway bug
}