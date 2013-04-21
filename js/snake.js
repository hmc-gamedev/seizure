var ENV = {};
ENV['src'] = 'http://www.cs.hmc.edu/~acarter/Seizure/Code/php/main.php';


var NORTH = [-1,0], SOUTH = [1,0], EAST = [0,1], WEST = [0,-1];
var HEIGHT = 20, WIDTH=20;
var BOARD = [];
var TABLE;
var snake;
//tail to head;

var oldDir, newDir;

var food = [];

var THREAD;

function load()
{
	
	var wc = randomColor(), sc = randomColor(), fc = randomColor(), bc = randomColor(), bg = randomColor();
	try
	{
		document.getElementById('html')['style'].setProperty('background-color', '#'+bg,"important");
		document.getElementById('Board')['style'].setProperty('background-color', '#'+bg,"important");
	}
	catch(e1)
	{
		try
		{
			document.getElementById('body').innerHTML = 
			'<div ' +
			'style="width:150%;height:150%;background-color:#'+bg+';" >' +
			'<div id="Board" onclick="start();">' + 
			'</div>' +
			'</div>';

			//document.getElementById('html')['style']['background-color'] = "#" + bg;
			//document.getElementById('Board')['style']['background-color'] = "#" + bg;
		}
		catch(e2)
		{
			alert("e2: " + e2);
		}
	}
	var wc = randomColor(), sc = randomColor(), fc = randomColor(), bc = randomColor(), bg = randomColor();
	TABLE = document.createElement("TABLE");
	for(var i = 0; i < HEIGHT; i++)
	{
		var row = document.createElement("TR");
		for(var j = 0; j < WIDTH; j++)
		{
			var cell = document.createElement("TD");
			row.appendChild(cell);
		}
		TABLE.appendChild(row);
	}
	document.getElementById('Board').appendChild(TABLE);
	reload();
}
function reload()
{
	//AJAX.getID(ENV['src']);
	var arg = LIB.empty();
	arg['function'] = 'new_game';
	arg['game'] = 'snake';
	arg['sid'] = LIB.getValue('SID','value');
	// AJAX.sendRequest(ENV['src'],arg);
	for(var i = 0; i < HEIGHT; i++)
	{
		BOARD[i] = [];
		for(var j = 0; j < WIDTH; j++)
			BOARD[i][j] = (i == 0) || (j == 0) || (i == HEIGHT-1) || (j == WIDTH-1);
	}
	snake = new queue();
	snake.enqueue([HEIGHT/2,WIDTH/2]);
	snake.enqueue([HEIGHT/2,WIDTH/2+1]);
	BOARD[HEIGHT/2][WIDTH/2] = true;
	BOARD[HEIGHT/2][WIDTH/2+1] = true;
	food = makeFood();
	oldDir = newDir = EAST;
	LIB.setValue('start time','value',(new Date()).getTime());
	makeBoard();
}

function makeFood()
{
	var loc = Math.floor(Math.random()*((HEIGHT-2)*(WIDTH-2) - snake.length));
	for(var i = 0; i < HEIGHT; i++)
		for(var j = 0; j < WIDTH; j++)
		{
			if(!BOARD[i][j])
			{
				if(loc == 0)
					return [i,j];
				else
					loc--;
		}
	}
}

function makeBoard()
{
	var wc = randomColor(), sc = randomColor(), fc = randomColor(), bc = randomColor(), bg = randomColor();
	try
	{
		document.getElementById('html').style.setProperty('background-color', '#'+bg,"important");
		document.getElementById('Board').style.setProperty('background-color', '#'+bg,"important");
	}
	catch(e1)
	{
		try
		{
			document.getElementById('body').innerHTML = 
			'<div ' +
			'style="width:150%;height:150%;background-color:#'+bg+';" >' +
			'<div id="Board" onclick="start();">' + 
			'</div>' +
			'</div>';

			//document.getElementById('html')['style']['background-color'] = "#" + bg;
			//document.getElementById('Board')['style']['background-color'] = "#" + bg;
		}
		catch(e2)
		{
			alert("e2: " + e2);
		}
	}
	var new_table = TABLE.cloneNode(true);
	for(var i = 0; i < HEIGHT; i++)
	{
		var row = new_table.rows[i];
		for(var j = 0; j < WIDTH; j++)
		{
			var cell = row.cells[j];
			var color;
			if(i == 0 || j == 0 || i == HEIGHT-1 || j == WIDTH-1)
				color = wc;
			else if(BOARD[i][j])
				color = sc;
			else if(food[0] == i && food[1] == j)
				color = fc;
			else
				color = bc;
			cell.style.backgroundColor = color;
		}
	}
	document.getElementById('Board').replaceChild(new_table,TABLE);
	TABLE = new_table;
}
function start()
{
	if(!THREAD)
		THREAD = setTimeout("try{move();}catch(e){alert(e);}",1500/snake.length);
}
function move()
{
	var cloc = snake.last();
	var first = snake.first();
	oldDir = newDir;
	var nloc = [];
	nloc[0] = cloc[0] + oldDir[0];
	nloc[1] = cloc[1] + oldDir[1];
	if(BOARD[nloc[0]][nloc[1]] && (first[0] != nloc[0] || first[1] != nloc[1]))
	{
		var sec = (new Date()).getTime() - eval(LIB.getValue('start time','value'));
		var arg = LIB.empty();
		arg['function'] = 'is_top_score';
		arg['game'] = 'snake';
		arg['score'] = snake.length - 2 + "";
		arg['sid'] = LIB.getValue('SID','value');
		/*ajavxAJAX.sendRequest(ENV['src'],arg,
			function(ret)
			{
				if(ret < 10) {
					var name = prompt('You lost\nYour score of ' + (snake.length-2) + ' is a high score\nWhat is your name?','');
					var arg = LIB.empty();
					arg['function'] = 'add_top_score';
					arg['game'] = 'snake';
					arg['score'] = (snake.length - 2) + "";
					arg['seconds'] = sec+"";
					arg['sid'] = LIB.getValue('SID','value');
					arg['name'] = name;
					if(name)
					{
						AJAX.sendRequest(ENV['src'],arg,high_scores);
						return;
					}
				} else {
					alert("You lost\nScore = " + (snake.length-2));
				}
				high_scores();
			});*/
			high_scores();
		//alert("You lost\nScore = " + (snake.length-2));
		//load();
		//THREAD = undefined;
		return;
	}
	snake.enqueue(nloc);
	if(nloc[0] == food[0] && nloc[1] == food[1])
		food = makeFood();
	else
	{
		var tail = snake.dequeue();
		BOARD[tail[0]][tail[1]] = false;
	}
	BOARD[nloc[0]][nloc[1]] = true;
	makeBoard();
	THREAD = undefined;
	start();
}
function high_scores(args)
{
	//alert(args);
	/*
	var arg = LIB.empty();
	arg['function'] = 'get_top_scores';
	arg['game'] = 'snake';
	arg['sid'] = LIB.getValue('SID','value');
	AJAX.sendRequest(ENV['src'],arg,
		function(retv)
		{
			var string = '';
			for(i in retv)
				string += retv[i]['name'] + ' : ' + retv[i]['score'] + '\n';
			alert("High scores \n" + string);
			reload();
			THREAD = undefined;
		}
	);
	*/
	reload();
	THREAD = undefined;
}
function pressed(key)
{
	var dir;
	switch(key.keyCode)
	{
		case 37:
			dir = WEST;
			break;
		case 38:
			dir = NORTH;
			break;
		case 39:
			dir = EAST;
			break;
		case 40:
			dir = SOUTH;
			break;
	}
	if(dir)
		if(dir[0] != -1*oldDir[0] && dir[1] != -1*oldDir[1])
			newDir = dir;
}
