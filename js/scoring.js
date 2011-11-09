//CAN'T COMPRESS WITH http://dynamic-tools.net/toolbox/javascript_compressor/  ?????

function doScoring(robotId, robotName, winTimeInMs)
{
	alert('Congratulations ' + robotName + '!\nYou won in ' + winTimeInMs + 'ms!');
	
	//Twitter sending for actual live version at jsrobots.com
	/*
	var nick = prompt('Congratulations ' + robotName + '!\nYou won in ' + winTimeInMs + 'ms!\nEnter your nickname for the Twitter hall of fame:\n(twitter.com/jsrobots)');
	
	if(!nick || jQuery.trim(nick) == '')
	{
		//Nothing (proper) entered OR dialogue cancelled
	}
	
	else
	{
		var scriptPreset = document.getElementById(robotId + '_program').options[document.getElementById(robotId + '_program').selectedIndex].innerHTML;
		
		var defeatedThing = getDefeatedThingString(getCheckedRobotsExcluding(robotId));
		
		a.jax({job:'sendScoreToTwitter', method:'POST', responseType:'text', reaction:sendScoreToTwitterReaction, nickname:nick, script_preset:scriptPreset, defeated_thing:defeatedThing, time:winTimeInMs});
	}
	*/
}

function getDefeatedThingString(robotIds)	//an array
{
	if(robotIds.length == 1)	//Only one opponent (so specify script type)
	{
		var scriptPreset = document.getElementById(robotIds[0] + '_program').options[document.getElementById(robotIds[0] + '_program').selectedIndex].innerHTML;
		if(scriptPreset == 'blank')	//Applicable for human players only
		{
			scriptPreset = 'original script';
		}
		
		if(robotIds[0].charAt(0) == 'c')	//CPU
		{
			return 'the CPU\'s' + String.fromCharCode(32) + scriptPreset;	//Crunch-safe space!
		}
		
		else	//Player
		{
			return robotIds[0].replace('_', ' ') + '\'s' + String.fromCharCode(32) + scriptPreset;	//Crunch-safe space!
		}
	}
	
	else	//Multiple opponents (give number of opponents)
	{
		return robotIds.length + String.fromCharCode(32) + 'opponents';	//Crunch-safe space!
	}
}

function getCheckedRobotsExcluding(winningRobotId)	//winner is only ever a human player
{
	var robotIds = [];
	
	for(var loop = 1; loop < 5; loop++)
	{
		if(document.getElementById('player_' + loop + '_on').checked)
		{
			if('player_' + loop != winningRobotId)
			{
				robotIds.push('player_' + loop);
			}
		}
		
		if(document.getElementById('cpu_' + loop + '_on').checked)
		{
			robotIds.push('cpu_' + loop);
		}
	}
	
	return robotIds;
}

function sendScoreToTwitterReaction(responseText)
{
	//NOP
}