var ENV = {};
ENV['src'] = 'http://www.cs.hmc.edu/~acarter/Seizure/Code/php/main.php';
var BOARD, CLEARED, CLEAR_NUM, FLAG_NUM, LEFT;
var HEIGHT = 16;
var WIDTH = 31;
var MINES = 99;
var bg, uc, fc, cc, ic;
var seconds = 0;
var start_time;
var stimeout = null, srecolor = null;
var DEBUG = false;
var done = false;
function load()
{
	//AJAX.getID(ENV['src']);
	var arg = LIB.empty();
	arg['function'] = 'new_game';
	arg['game'] = 'minesweeper';
	arg['sid'] = LIB.getValue('SID','value');
	//AJAX.sendRequest(ENV['src'],arg);
	BOARD = [];
	CLEARED = [];
	done = false;
	for(var i = -1; i <= HEIGHT; i++)
	{
		BOARD[i] = [];
		CLEARED[i] = [];
		for(var j = -1; j <= WIDTH; j++)
		{
			BOARD[i][j] = 0;
			CLEARED[i][j] = 0;
		}
	}
	CLEAR_NUM = 0;
	FLAG_NUM = 0;
	makeBoard();
	recolor(LIB.getValue('SID','value'));
	if(stimeout)
		clearTimeout(stimeout);
	if(srecolor)
		clearTimeout(srecolor);
	seconds = 0;
}
function timer()
{
	seconds = Math.floor(((new Date()).getTime()-start_time)/1000);
	stimeout = setTimeout("timer();",1000-((new Date()).getTime()-start_time)%1000);
	document.getElementById("tdiv").innerHTML = seconds;
	
}
function recolor(SID)
{
	//alert(CLEAR_NUM);
	bg = randomColor();
	uc = randomColor();
	fc = randomColor();
	ic = randomColor();
	cc = [];
	document.getElementById('html')['style'].setProperty('background-color', '#'+bg,"important");
	document.getElementById('Board')['style'].setProperty('background-color', '#'+bg,"important");
	for(var i = 0; i < 9; i++)
		cc[i] = randomColor();
	if(CLEAR_NUM != 0 && LIB.getValue('SID','value') == SID)
	{
		srecolor = setTimeout("try{recolor('"+SID+"');}catch(e){alert(e);}",3*((HEIGHT*WIDTH-MINES) -  CLEAR_NUM)+50);
	}
	var div = document.getElementById('Board');
	var new_table = div.childNodes[0].cloneNode(true);
	for(var i = 0; i < HEIGHT; i++)
	{
		var row = new_table.rows[i];
		for(var j = 0; j < WIDTH; j++)
		{
			var cell = row.cells[j];
			var color;
			if(CLEARED[i][j] == 1)
				color = cc[BOARD[i][j]];
			else if(CLEARED[i][j] == 0)
				color = uc;
			else if(CLEARED[i][j] == -1)
				color = fc;
			cell.style.backgroundColor = color;
		}
	}
	div.replaceChild(new_table,div.childNodes[0]);
	document.getElementById('tdiv').style.color = ic;
	document.getElementById('mdiv').style.color = ic;
	document.getElementById('cdiv').style.color = ic;
	var key = document.getElementById('key');
	var index = -2;
	for(i in key.childNodes)
	{
		
		if(key.childNodes[i].tagName == "DIV")
		{
			key.childNodes[i].style.color = ic;
			var color;
			if(index >= 0)
				color = cc[index];
			else if(index == -2)
				color = uc;
			else if(index == -1)
				color = fc;
			key.childNodes[i].style.backgroundColor = color;
			index++;
		}
	}
}
function makeBoard()
{
	bg = randomColor();
	uc = randomColor();
	fc = randomColor();
	ic = randomColor();
	cc = [];
	for(var i = 0; i < 9; i++)
		cc[i] = randomColor();
	try
	{
		document.getElementById('html')['style'].setProperty('background-color', '#'+bg,"important");
		document.getElementById('Board')['style'].setProperty('background-color', '#'+bg,"important");
	}
	catch(e1)
	{
		/*try
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
		}*/
	}
	var board = "<table>";
	for(var i = 0; i < HEIGHT; i++)
	{
		board += "<tr>";
		for(var j = 0; j < WIDTH; j++)
		{
			var color;
			if(CLEARED[i][j] == 1)
				color = cc[BOARD[i][j]];
			else if(CLEARED[i][j] == 0)
				color = uc;
			else if(CLEARED[i][j] == -1)
				color = fc;
			board += '<td class="board" style="background-color:#'+color+';" onmousedown="try{clicks('+i+','+j+',event.button,this)}catch(e){alert(e);};">';
			if(DEBUG)
				board += BOARD[i][j];
			board += '</td>';
		}
		board += "</tr>";
	}
	board += "</table>";
	document.getElementById('Board').innerHTML = board;
	document.getElementById('Timer').innerHTML = '<div id="tdiv" style="color:#'+ic+';height:100%;width:100%">'+seconds+'</div>';
	document.getElementById('Mines').innerHTML = '<div id="mdiv" style="color:#'+ic+';height:100%;width:100%">'+(MINES-FLAG_NUM)+'</div>';
	document.getElementById('Cleared').innerHTML = '<div id="cdiv" style="color:#'+ic+';height:100%;width:100%">'+(HEIGHT*WIDTH-MINES-CLEAR_NUM)+'</div>';
	var key = '<div style="text-align:center;height:25px;width25px;color:#'+ic+';background-color:#'+uc+';"></div><br />' +
			'<div style="text-align:center;height:25px; width25px; color:#'+ic+';background-color:#'+fc+';">F</div><br />';
	for(var i = 0; i < 9; i++)
		key += '<div style="text-align:center;height:25px;width25px;color:#'+ic+';background-color:#'+cc[i]+';">'+i+'</div><br />';
	document.getElementById('key').innerHTML = key;
}
function clicks(row,col,button,square)
{
	
    //document.getElementById("info").innerHTML = "clicks("+row+","+col+","+button+")<br/>";
	if(!done)
    {
        
        if(row < 0 || row == HEIGHT)
            return;
        if(col < 0 || col == WIDTH)
            return;
        if(button <= 1)
        {
            //document.getElementById("info").innerHTML += CLEAR_NUM+"<br/>";
            if(CLEAR_NUM == 0)
            {
                var mines = MINES;
                var squares = HEIGHT*WIDTH - 1;
                LEFT = 0;
                for(var i = 0; i < HEIGHT; i++)
                {
                    for(var j = 0; j < WIDTH; j++)
                    {
                        if(i != row || j != col)
                        {
                            if(squares*Math.random() <= mines)
                            {
                                mines--;
                                BOARD[i][j] = -1;
                            }
                            else
                                LEFT++;
                            squares--;
                            
                        }
                    }
                }
                for(var i = 0; i < HEIGHT; i++)
                {
                    for(var j = 0; j < WIDTH; j++)
                    {
                        if(BOARD[i][j] != -1)
                        {
                            BOARD[i][j] = 0;
                            //can't count itself as a mine
                            for(var k = 0; k < 9; k++)
                                if(BOARD[i+Math.floor(k/3)-1][j+(k%3)-1] == -1)
                                    BOARD[i][j]++;
                        }
                    }
                }
                start_time = (new Date()).getTime();
                
                setTimeout("recolor('"+LIB.getValue('SID','value')+"');",0);
                setTimeout("timer();",1000);
            }
            //document.getElementById("info").innerHTML += CLEARED[row][col]+"<br/>";
            if(CLEARED[row][col] != 0)
                return;
            //document.getElementById("info").innerHTML += BOARD[row][col]+"<br/>";
            if(BOARD[row][col] >= 0)
            {
				if(!square)
					square = document.getElementById('Board').childNodes[0].rows[row].cells[col];
                square.style.backgroundColor = cc[BOARD[row][col]];
				var cdiv = document.getElementById('cdiv');
				cdiv.replaceChild(document.createTextNode(HEIGHT*WIDTH-MINES-CLEAR_NUM),cdiv.childNodes[0]);
                CLEAR_NUM++;
                if(!done && CLEAR_NUM == HEIGHT*WIDTH - MINES)
                {
                    done = "win";
                    finished();
                }
                CLEARED[row][col] = 1;
                if(BOARD[row][col] == 0)
                    for(var k = 0; k < 9; k++)
                        clicks(row+Math.floor(k/3)-1,col+k%3-1,button);
            }
            else if(!done)
            {
                //document.getElementById("info").innerHTML += "Here";
                done = "lost";
                alert("BOOM");
                finished();
            }
        }
        else //hopefully right click
        {
            
            if(CLEARED[row][col] == -1)
            {
                FLAG_NUM--;
                CLEARED[row][col] = 0;
				square.style.backgroundColor = uc;
            }
            else if(CLEARED[row][col] == 0)
            {
                FLAG_NUM++;
                CLEARED[row][col] = -1;
				square.style.backgroundColor = fc;
            }
			var mdiv = document.getElementById('mdiv');
			mdiv.replaceChild(document.createTextNode(MINES-FLAG_NUM),mdiv.childNodes[0]);
            //removed right clicking for now
            //makes game significantly easier
            /*
            else if(CLEARED[row][col] == 1)
            {
                var flags = 0;
                for(var i = 0; i < 9; i++)
                    if(CLEARED[row+Math.floor(i/3)-1][col+Math.floor(i%3)-1] == -1)
                        flags++;
                if(flags == BOARD[row][col])
                    for(var i = 0; i < 9; i++)
                        clicks(row+Math.floor(i/3)-1, col+Math.floor(i%3)-1,0);
            }*/
            //alert(CLEARED[row][col]);
        }
	}
	//document.getElementById("info").innerHTML += done+"<br/>";
	//document.getElementById("mdiv").innerHTML = MINES-FLAG_NUM;
	//document.getElementById("cdiv").innerHTML = CLEAR_NUM;
	
	
	//document.getElementById("info").innerHTML += done+"<br/>";
	//makeBoard();
}
function finished()
{
    var sec = (new Date()).getTime() - start_time;
    var arg = LIB.empty();
    arg['function'] = 'is_top_score';
    arg['game'] = 'minesweeper';
    arg['score'] = CLEAR_NUM+"";
    arg['time'] = sec+"";
    arg['sid'] = LIB.getValue('SID','value');
    //document.getElementById("info").innerHTML += LIB.encode(arg) +"<br/>";
    /*AJAX.sendRequest(ENV['src'],arg,
        function(ret)
        {
            if(done != "processing")
            {
                var tdone = done;
                done = "processing";
                var score = (tdone == 'win' ? Math.floor(sec/1000) : CLEAR_NUM);
                if(ret < 10) {
                    var name = prompt('You '+tdone+'\nYour score of ' + score + ' is a high score\nWhat is your name?','');
                    var arg = LIB.empty();
                    arg['function'] = 'add_top_score';
                    arg['game'] = 'minesweeper';
                    arg['score'] = CLEAR_NUM + "";
                    arg['seconds'] = sec+"";
                    arg['sid'] = LIB.getValue('SID','value');
                    arg['name'] = name;
                    if(name)
                    {
                        AJAX.sendRequest(ENV['src'],arg,high_scores);
                        return;
                    }
                } else {
                    alert("You "+tdone+"\nScore = " + score);
                }
                
                high_scores();
            }
        });
	*/
    load();

}
function high_scores(args)
{
	//alert(args);
	var arg = LIB.empty();
	arg['function'] = 'get_top_scores';
	arg['game'] = 'minesweeper';
	arg['sid'] = LIB.getValue('SID','value');
	/*AJAX.sendRequest(ENV['src'],arg,
		function(retv)
		{
			var string = '';
			for(i in retv)
			{
				string += retv[i]['name'] + ' : ';
				if(eval(retv[i]) != HEIGHT*WIDTH-MINES)
					string += retv[i]['score'] + ' squares ';
				string += Math.floor(retv[i]['seconds']/1000) + ' seconds\n';
			}
			alert("High scores \n" + string);
			load();
		}
	);*/
}
