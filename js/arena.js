//CAN COMPRESS SAFELY WITH http://dynamic-tools.net/toolbox/javascript_compressor/

//Arena object
function Arena(elementId)
{
	//Properties
	this.elementId = elementId;
	this.element = document.getElementById(this.elementId);
	
	this.wallDamage = 2;
	
	//Constructor
	//var dimensions = Element.getDimensions(this.element);	//if Prototype then 500
	//alert('dims from Prototype: ' + dimensions.width, + ',' + dimensions.height);
	//this.width = dimensions.width;
	//this.height = dimensions.height;

	
	
	this.width = $('#' + elementId).width();	//if jQuery then 500
	this.height = $('#' + elementId).height();
	//alert(this.height + ',' + this.height);
	
	
	//var offset = Position.cumulativeOffset(this.element);	//if Prototype then 8,101
	//alert('offset from Prototype: ' + offset);
	//this.offsetX = offset[0];
	//this.offsetY = offset[1];
	
	
	var offset = $('#' + elementId).offset();	//if jQuery then 8,100.86666870117188
	this.offsetX = offset.left;		this.offsetY = offset.top;
	//alert(this.offsetX + ',' + this.offsetY);
	
	//----
	
	//Methods
}