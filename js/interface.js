//CAN COMPRESS SAFELY WITH http://dynamic-tools.net/toolbox/javascript_compressor/

var game;
var arena;

//jQuery onload-alike
$(function(){prepareJRobots();});

//once per page load
function prepareJRobots()
{
	makeLookupTables();
	
	arena = new Arena('arena');
	game = new Game(arena);
	
	
	
	//not seem work in chrome and opera (coz local file:// access????)
	/*
	//jQuery to put the external robot scripts into a DOM element
	//(so we can get at them for robot loading time)
	$('#normal_tower').load('js/robots/normal_tower.js', function (textStatus) {
    window.alert('Request complete'+textStatus);});
    */
}



//
function playButton()
{
	game.play();
}

//
function stopButton()
{
	game.stop();
}

//
function pauseButton()
{
	game.togglePause();
}

//Load player script on <select>'s onchange
function setPlayer(number, programName)
{
	document.getElementById('player_' + number + '_program_source').value = document.getElementById(programName).value;
}

//
function makeOneLine(stringy)
{
	var noSingleLineComments = stringy.replace(/[/][/].*/g, '');
	
	var oneLine = noSingleLineComments.replace(/(\n|\r)/g, '');
	
	return oneLine;
}

function catchTab(e)
{
	var key = null;
	
	if(window.event) key = event.keyCode;
	else if(e.which) key = e.which;
	
	//key = window.event.keyCode || event.which;
	
	if(key != null && key == 9)	//Tab = 9
	{
		//IE and Opera
		if(document.selection)
		{
			this.focus();
			var sel = document.selection.createRange();
			sel.text = '\t';
		}
		
		//Mozilla + Netscape
		else if(this.selectionStart || this.selectionStart == "0")
		{
			var start = this.selectionStart;
			var end = this.selectionEnd;
			this.value = this.value.substring(0,start) + '\t' + this.value.substring(end,this.value.length);
			this.selectionStart = this.selectionEnd = start + 1;	//move cursor to AFTER just inserted tab
		}
		
		else this.value += '\t';	//Last resort, simply append tab to end of text
		
		return false;	//IMPORTANT! Kill the actual tabbing event
	}
}