//CAN COMPRESS SAFELY WITH http://dynamic-tools.net/toolbox/javascript_compressor/

//Missile object
function Missile(ownerElementId, elementId, x, y, direction, range)
{
	//Properties
	this.x;
	this.y;
	this.direction;
	this.elementId;
	this.speed = /*8*/16;
	this.hitWall = false;
	this.remove = false;
	this.ownerElementId;
	this.damage = 0;
	this.color;
	this.size = 15;
	this.offset = 7;	//To centre of size
	this.range;
	this.maxRange = 350;
	this.exploding = false;
	
	
	//Constructor
	
		this.ownerElementId = ownerElementId;
		this.elementId = elementId;
		this.x = x;
		this.y = y;
		this.direction = makePositiveAngle(direction);
		
		
		if(range > this.maxRange)range = this.maxRange;
		
		this.range = range;
		
		//alert(elementId);
		
		//Make <div>
		var bulletDiv = document.createElement('div');
	
		bulletDiv.id = this.elementId;
		
		
		
		//Need to separate (ie. not using .border = '') because of a Safari issue
		bulletDiv.style.borderStyle = 'solid';
		bulletDiv.style.borderWidth = '1px';
		bulletDiv.style.borderColor = 'black';
		
		//Make them go "over" robots
		bulletDiv.style.zIndex = 200;
		
		bulletDiv.style.width = (this.size - 2) + 'px';
		bulletDiv.style.height = (this.size - 2) + 'px';
		
		bulletDiv.style.position = 'absolute';
		
		//bulletDiv.style.backgroundColor = this.color;
		
		//For easy group removal (ie. when reseting the game)
		bulletDiv.className = 'missile';
		
		bulletDiv.style.top = (this.y - this.offset) + arena.offsetY + 'px';
		bulletDiv.style.left = (this.x - this.offset) + arena.offsetX + 'px';
		
		bulletDiv.style.backgroundColor = 'yellow';
		
		/*
		if((this.direction > 337.5 && this.direction < 22.5) || this.direction == 0)
		{
			bulletDiv.src = 'images/missile_up.png';
		}
		
		if(this.direction > 22.5 && this.direction < 67.5)
		{
			bulletDiv.src = 'images/missile_up_right.png';
		}
		
		if(this.direction > 67.5 && this.direction < 112.5)
		{
			bulletDiv.src = 'images/missile_right.png';
		}
		
		if(this.direction > 112.5 && this.direction < 157.5)
		{
			bulletDiv.src = 'images/missile_down_right.png';
		}
		
		if(this.direction > 157.5 && this.direction < 202.5)
		{
			bulletDiv.src = 'images/missile_down.png';
		}
		
		if(this.direction > 202.5 && this.direction < 247.5)
		{
			bulletDiv.src = 'images/missile_down_left.png';
		}
		
		if(this.direction > 247.5 && this.direction < 292.5)
		{
			bulletDiv.src = 'images/missile_left.png';
		}
		
		if(this.direction > 292.5 && this.direction < 337.5)
		{
			bulletDiv.src = 'images/missile_up_left.png';
		}
		*/
		
		//alert(bulletDiv);
		
		//document.getElementById('arena').appendChild(bulletDiv);
		document.body.appendChild(bulletDiv);
	//----
	
	this.setHitWall = function()
	{
		this.hitWall = false;
		
		if(this.x < 0 || this.x > arena.width || this.y < 0 || this.y > arena.height)
		{
			this.hitWall = true;
			
		}
	};
	
	//Change x and y based on current direction bearing
	this.changeCoords = function()
	{
		sin = sine[this.direction];
		cos = cosine[this.direction];
		
		this.x += sin * this.speed;	//Precalc?
		this.y -= cos * this.speed;
		
		
		this.range -= this.speed;
	};
	
	this.reachedTarget = function()
	{
		return(this.range < 0);
	};
	
	this.move = function()
	{
		this.changeCoords();
		
		this.setHitWall();
		
	
		
		if((this.hitWall && !this.exploding) || (this.reachedTarget() && !this.exploding))
		{
			//this.remove = true;
			
			var missileImg = document.getElementById(this.elementId);
			document.body.removeChild(missileImg);
			
			
			this.exploding = true;
			
			
			
			
			this.explosion = new Explosion(this.elementId, this.x, this.y);
		}
	};
	
	this.draw = function()
	{
		if(this.exploding)
		{
			this.explosion.draw();
			this.explosion.update();
			
			if(this.explosion.finished)
			{
				this.explosion = null;
				this.remove = true;
			}
		}
		
		else{
		
		//alert("Bullet::draw();");
		
		elementy = document.getElementById(this.elementId);
		//alert(elementy.tagName);
		
		//element.style.left = this.x - HALF_ROBOT_SIZE + 'px';
		//element.style.top = this.y - HALF_ROBOT_SIZE + 'px';
		
		
		
		
		
		
		elementy.style.top = (this.y - this.offset) + arena.offsetY + 'px';
		elementy.style.left = (this.x - this.offset) + arena.offsetX + 'px';
		
		
		//elementy.style.backgroundColor = this.color;
		
		//window.status = this.color;
		
		}
		
	};
}