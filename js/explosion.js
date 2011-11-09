//CAN COMPRESS SAFELY WITH http://dynamic-tools.net/toolbox/javascript_compressor/

//Explosion object
function Explosion(elementId, x, y)
{
	//Properties
	this.x;
	this.y;
	
	this.size = 63;
	this.offset = 31;	//To centre of size
	
	this.finished = false;
	this.elementId;
	this.damage = 10;
	
	//??
	this.countDown = 10;
	this.fadeRate = 1;
	
	
	//Other methods
	this.makeElement = function(elementId)
	{
		var elm = document.createElement('div');
		
		elm.id = elementId;
		
		
		
		elm.style.width = (this.size - 2) + 'px';
		elm.style.height = (this.size - 2) + 'px';
		
		elm.style.position = 'absolute';
		
		//Make them go "over" robots
		elm.style.zIndex = 200;
		
		elm.style.borderStyle = 'solid';
		elm.style.borderWidth = '1px';
		elm.style.borderColor = 'black';
		
		//For easy group removal (ie. when reseting the game)
		elm.className = 'explosion';
		
		elm.style.margin = '0';
		elm.style.padding = '0';
		
		elm.style.backgroundColor = 'orange';
		
		elm.style.top = (this.y - this.offset) + arena.offsetY + 'px';
		elm.style.left = (this.x - this.offset) + arena.offsetX + 'px';
		
		//document.getElementById('arena').appendChild(elm);
		document.body.appendChild(elm);
	};
	
	this.update = function()
	{
		if(this.finished)return;
		
		//alert(this.fadeRate);
		
		//this.countDown--;
		////this.size = this.size - this.fadeRate;
		//this.offset = this.offset - this.fadeRate;	//Is it OK for coldet to change the offset onl y and not also the size???
		//this.damage--;
		
		colDetExplosion(this);	//a global dunction (eek!) in maths.js
		this.finished = true;
		
		//if(this.countDown == 0)
		//{
		//	this.finished = true;
		//}
	};
	
	this.draw = function()
	{
		var elm = document.getElementById(this.elementId);
		
		
		elm.style.top = (this.y - this.offset) + arena.offsetY + 'px';
		elm.style.left = (this.x - this.offset) + arena.offsetX + 'px';
		
		//this.finished = true;
	};
	
	//Constructor
	
		this.x = x;
		this.y = y;
		
		this.elementId = elementId;
		
		this.makeElement(elementId);
	//----
}