//CAN COMPRESS SAFELY WITH http://dynamic-tools.net/toolbox/javascript_compressor/

//  for user scripts.....

function rand(number)	//fromZeroToOneLessThanThisParameter
{
	return Math.floor(Math.random() * number);
}

//Returns the square root of a number. Number is made positive if necessary.
//(Math.sqrt of negative number is NaN or even ERROR!
//use CACHING or not?
function sqrt(number)
{
	return Math.sqrt(Math.abs(number));
}

//Returns the trigometric sine of degree (degree being an integer from zero to 359).
//use CACHING or not?
function sine(degree)	//function name of "sin" not liked by JavaScript
{
	return sine[degree] || Math.sin(degToRad(degree));
}

//Returns the trigometric cosine of degree (degree being an integer from zero to 359).
//use CACHING or not?
function cosine(degree)	//function name of "cos" not liked by JavaScript
{
	return cosine[degree] || Math.cos(degToRad(degree));
}

//Returns the trigometric tangent of degree (degree being an integer from zero to 359).
//use CACHING or not?
function tan(degree)
{
	return tangent[degree] || Math.tan(degToRad(degree));
}

//Returns the integer degree value, between -90 and +90, of the ratio.
//use CACHING or not?
function atan(ratio)
{
	//return Math.floor(radToDeg(Math.atan(ratio)));	//Do we need to add 90 degs to this?
	return 90 + Math.floor(radToDeg(Math.atan(ratio)));
}

//Need? (def not doc'd)...
function atan2(x, y)
{
	return 90 + Math.floor(radToDeg(Math.atan2(x, y)));	//Do we need to add 90 degs to this?
}

//VERY useful for debugging your robot scripts! or indeed the game logic itself!
function log(message)
{
	var p = document.createElement('p');
	p.innerHTML = message;
	p.style.margin = 0;
	
	document.getElementById('console').appendChild(p);
}