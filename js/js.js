window.onload=function(){
	//分数
	var fenshu = 0;
	//背景移动速度
	var bgSpeed = 5;
	//敌机移动速度
	var enemySpeed = 5;
	//炮弹移动速度
	var bulletSpeed = 10;

	// 背景
	var game = document.getElementById('game');
	var windowHeight = game.clientHeight;
	var windowWidth = game.clientWidth;
	var bg = -836;
	// 背景图片移动
	setInterval(function(){
		bg += bgSpeed;
		if(bg>-68)
		{
			bg=-836;
		}
		game.style.backgroundPosition='0px '+bg+'px';
	},20);

	//大招进行中
	var doingDazhao = null;

	//战机操作类
	function main(playerId){
		this.player = document.getElementById(playerId);
		//战机的宽度
		this.playerWidth = this.player.width;
		//战机的长度
		this.playerHeight = this.player.height;

		//设置战机位置
		this.position = function(x,y){
			this.player.style.left = x+'px';
		    this.player.style.top = y+'px';
		}

		//战机开火
		this.doFire = function(){
			var x = this.player.offsetLeft+(this.playerWidth/2);
			var y = this.player.offsetTop-(this.playerHeight/4);

			//循环获取一颗空闲的子弹，把它放在飞机的前面
			for(var i=0;i<11;i++)
			{
				var eshot = document.getElementById('eshot'+i);
				if(eshot.style.display=='none')
				{
					eshot.style.top = y+'px';
					eshot.style.left = x+'px';
					eshot.style.display = 'block';
					//获取到后即return
					return;
				}
			}
		}

		//战机放大招
		this.doDazhao = function(){
			//不能和队友同时放大招
			if(null!=doingDazhao){
				return;
			}

			var x = this.player.offsetLeft+(this.playerWidth/2);
			var y = this.player.offsetTop-(this.playerHeight/4);

			//放大招，时间暂定
			bulletSpeed = 0;
			enemySpeed = 0;
			bgSpeed = 0;
			
			//把11颗炮弹全部召唤出来
			var eshArr = new Array(11);
			for(var i=0;i<11;i++)
			{
				var eshot = document.getElementById('eshot'+i);
				eshArr[i] = eshot;
				eshot.style.left = x+'px';
				eshot.style.top = y+'px';
				eshot.style.display = 'block';
			}

			var that = this;
			//炮弹出现之后，一秒钟之后分散
			doingDazhao = setTimeout(function(){

				//子弹向右边分散
				De = setInterval(function(){
					eshArr[1].style.left = eshArr[1].offsetLeft+1+'px';
					eshArr[2].style.left = eshArr[2].offsetLeft+2+'px';
					eshArr[3].style.left = eshArr[3].offsetLeft+3+'px';
					eshArr[4].style.left = eshArr[4].offsetLeft+4+'px';
					eshArr[5].style.left = eshArr[5].offsetLeft+5+'px';
					if(eshArr[5].offsetLeft>485)
					{
						clearInterval(De);
					}
				},10);

				//子弹向左边分散
				De1 = setInterval(function(){
					eshArr[6].style.left = eshArr[6].offsetLeft-1+'px';
					eshArr[7].style.left = eshArr[7].offsetLeft-2+'px';
					eshArr[8].style.left = eshArr[8].offsetLeft-3+'px';
					eshArr[9].style.left = eshArr[9].offsetLeft-4+'px';
					eshArr[10].style.left = eshArr[10].offsetLeft-5+'px';
					if(eshArr[10].offsetLeft<20)
					{
						clearInterval(De1);
					}
				},10);

				//子弹去全部分散开之后才发射出去
				d2 = setTimeout(function(){
					d3 = setInterval(function(){
						for(var bb=0;bb<11;bb++)
						{
							var eshotD = document.getElementById('eshot'+bb);
							eshotD.style.top = eshotD.offsetTop-20+'px';
							checkHit(eshotD,true);
							if(eshotD.offsetTop<0)
							{
								eshotD.style.display = 'none';
								enemySpeed = 5;
								bulletSpeed = 10;
								bgSpeed = 5;
								clearTimeout(doingDazhao);
								doingDazhao = null;
								clearTimeout(d2);
								clearInterval(d3);
							}
						}
					},20);
					
				},1000);
				
			},1000);
		}

		//传入一个敌机，检测被敌机撞
		this.collision = function(enemy){
			//自己位置
			var px = this.player.offsetLeft;
			var py = this.player.offsetTop;
			//敌机位置
			var ex = enemy.offsetLeft;
			var ey = enemy.offsetTop;
			//碰撞检测
			if(py<ey+50 && px+100>ex && px<ex+100 && py>ey)
			{
				this.player.style.display = 'none';
				enemy.style.display = 'none';

				//爆炸
				var img = document.createElement('img');
				img.src = './images/boom.gif';
				img.style.position = 'absolute';
				img.style.top = (py-200)+'px';
				img.style.left = (px-130)+'px';
				img.width = '400';
				img.height = '400';
				game.appendChild(img);
				alert('游戏结束，你的分数：'+fenshu);
				window.location.reload();
			}
		}

	}

	//获取玩家
	var player1 = new main('player');
	
	//移动
	game.addEventListener("mousemove",function(){
		    var oevent=window.event||arguments[0];
		    var chufa=oevent.srcElement||oevent.target;
		    var selfplanX=oevent.clientX-(player1.playerWidth/2);
		    var selfplanY=oevent.clientY-(player1.playerHeight*1.2);
		    player1.position(selfplanX,selfplanY)
		
	},true);
	
	//发射大招
	document.onkeyup = function(ee)
	{
		var eve = ee || window.event;
		if(eve.keyCode==70)
		{
			player1.doDazhao();

		}
	}

	//循环判断子弹和敌机，如果是显示状态的，就对其进行移动
	setInterval(function(){
		for(var i=0;i<11;i++)
		{
			var eshot = document.getElementById('eshot'+i);
			//循环所有子弹，如果识别到子弹是显示状态，就进行发射
			if(eshot.style.display=='block')
			{
				checkHit(eshot);
				eshot.style.top = eshot.offsetTop-bulletSpeed+'px';
				if(eshot.offsetTop<0)
				{
					eshot.style.display = 'none';
				}
			}
		}

		//移动敌机
		for(var i=0;i<6;i++)
		{
			var ee = document.getElementById('e'+i);
			//循环所有敌机，如果是显示状态，就进行移动
			if(ee.style.display=='block')
			{
				player1.collision(ee);
				player2.collision(ee);
				ee.style.top = (ee.offsetTop+enemySpeed)+'px';
				//如果已经飞出窗口了，就对它进行隐藏
				if(ee.offsetTop>windowHeight)
				{
					ee.style.display = 'none';
				}
			}
		}
	},20);
	

	//接收服务器给的敌机id，出现敌机
	function showEnemy(i)
	{
		
		// alert(i);
		var ee = document.getElementById('e'+i);

		if(ee.style.display=='none')
		{	
			ee.style.top = '-105px'
			ee.style.left = Math.ceil(Math.random()*10000%400)+'px';
			ee.style.display = 'block';
		}
	}

	//检测是否击中
	function checkHit(eshot,big=false)
	{
		//子弹位置
		eshotX = eshot.offsetLeft;
		eshotY = eshot.offsetTop;

		for(var i=0;i<6;i++)
		{
			var enemy = document.getElementById('e'+i);
			if(enemy.style.display=='block')
			{
				//敌机位置
				enemyX = enemy.offsetLeft+10;
				enemyY = enemy.offsetTop+110;
				
				//判断碰撞
				if(eshotY<enemyY-30 && eshotX>enemyX && eshotX<enemyX+95 && eshotY>enemyY-50)
				{
					enemy.style.display = 'none';
					//如果不是大招，一颗炮弹只能打一架飞机
					if(!big){
						eshot.style.display = 'none';
					}
					
					fenshu += 10;
					document.getElementsByTagName('span')[0].innerHTML = fenshu+'分';
					if(fenshu>3000)
					{
						alert('通关了');
						game.style.background='url(./images/bg3.jpg) no-repeat 0px -836px';
						fenshu = 0;
					}
					var pp = document.createElement('img');
					pp.src = './images/boom.gif';
					pp.width = '250';
					pp.height = '150';
					pp.style.position = 'absolute';
					pp.style.top = eshotY-120+'px';
					pp.style.left = eshotX-100+'px';
					game.appendChild(pp);
					setTimeout(function(){
						pp.style.display = 'none';
					},500);

				}
			}
		}	
	}



	//获取队友
	var player2 = new main('player2');


	/*模拟服务器返回*/

	//模拟服务器返回一个敌机id
	setInterval(function(){
		
		var i = Math.floor(Math.random()*100000%6);
		showEnemy(i);

		//开火
		player1.doFire();
		player2.doFire();
	},500);

	//模拟服务器返回的友机操作
	setInterval(function(){
		var key = Math.floor(Math.random()*100000%5);
		switch(key)
		{
			case 1:

			player2.position(Math.max(0,player2.player.offsetLeft-10),player2.player.offsetTop);
			break;
			case 2:

			player2.position(player2.player.offsetLeft,Math.max(0,player2.player.offsetTop-10));
			break;
			case 3:

			player2.position(Math.min(windowWidth,player2.player.offsetLeft+10),player2.player.offsetTop);
			break;
			case 4:
			
			player2.position(player2.player.offsetLeft,Math.min(windowHeight,player2.player.offsetTop+10));
			break;
			case 0:
			// player2.doDazhao();	
			break;
		}
	},100);

	//模拟服务器返回的队友放大招
	document.onkeydown = function(ee)
	{
		var eve = ee || window.event;
		if(eve.keyCode==82)
		{
			player2.doDazhao();

		}
	}
}