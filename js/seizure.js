var HEX = ['0','1','2','3','4','5','6','7','8','9','a','b','c','d','e','f'];

function add(val)
{
	this.next = {};
	this.next.val = val;
	this.next.add = add;
	return this.next;
}

function queue()
{
	this.length = 0;
	this.last =
		function()
		{
			return this.tail && this.tail.val;
		};
	this.first =
		function()
		{
			return this.head && this.head.val;
		};
	this.enqueue =
	function(val)
	{
		if(!this.tail)
		{
			this.tail = {};
			this.tail.val = val;
			this.tail.add = add;
			this.head = this.tail;
		}
		else if(length == 1)
			this.head.next = this.tail = this.tail.add(val);
		else
			this.tail = this.tail.add(val);
		this.length++;
	};
	this.dequeue = 
	function()
	{
		this.length--;
		var val = this.head.val;
		this.head = this.head.next;
		return val;
	};
	this.iterator =
		function()
		{
			var i = {};
			i.current = this.head;
			i.hasNext =
			function()
			{
				return this.current.next;
			};
			i.next =
			function()
			{
				var val = this.current.val;
				this.current = this.current.next;
				return val;
			};
			return i;
		};
}

function randomColor()
{
	var color = "";
	for(var i = 0; i < 6; i++)
		color += HEX[Math.floor(Math.random()*16)];
	return color;
}
