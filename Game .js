<!DOCTYPE html>
<html>
<head>
    <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
    <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css">
      <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.2.0/jquery.min.js"></script>
      <script src="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/js/bootstrap.min.js"></script>
    <style>
        canvas {
            border:1px solid #d3d3d3;
            background-color: #f1f1f1;
        }
    </style>
</head>
<body onload="startGame()" style="margin:15px;">
    <br>
    <button type="button" class="btn btn-info" onclick="startGame()"><h3>START !</h3></button>
    <div class="form-group" style="float:right;">
      <label for="usr">Score:</label>
      <input type="text" class="form-control" style="width:200px;text-align:center" id="score">
    </div>

<script>

    function createArray(length) {
        var arr = new Array(length || 0),
            i = length;

        if (arguments.length > 1) {
            var args = Array.prototype.slice.call(arguments, 1);
            while(i--) arr[length-1 - i] = createArray.apply(this, args);
        }

        return arr;
    }

    var ball, plank;
    height = 500;
    width = 900;

    blocks = createArray(6, 31); 

    obstacles = createArray(6, 31);
    ballv = 2; 
    plankv = 4; 
    var pling, ding ;
    var score = 0, cnt = 0;
    var myGameArea;


function startGame() {

    
    
    if(myGameArea != null)
    {
        clearInterval(myGameArea.interval);
    }
    score = 0; 
    ballv = 2;
    plankv = 4;
    document.getElementById('score').value = score;

    ball = new component(15, 15, "red", 450, 250, ballv);
    plank = new component(120, 20, "rgb(104,104,104)", 450, height - 20, plankv);    
    pling = new sound("pling.mp3");
    ding = new sound("ding.mp3");
    // blueGamePiece = new component(75, 75, "blue", 10, 110);
    for(i = 0; i < 5; i++)
    {
        for(j = 0; j < width/30; j++)
        {
            if((Math.floor(Math.random()*100000))%2==0)
            {
                cnt++;
                obstacles[i][j] = 1;
                blocks[i][j] = (new component(30, 30 , "yellow", j*30, i*30, 0));
            }
            else
            {
                obstacles[i][j] = 0;
            }
        }
    }
    // console.log("block " + blocks.length);
    myGameArea.start();


}

     myGameArea = {
    canvas : document.createElement("canvas"),
    start : function() {
        this.canvas.width = width;
        this.canvas.height = height;
        this.context = this.canvas.getContext("2d");
        document.body.insertBefore(this.canvas, document.body.childNodes[0]);
        this.interval = setInterval(updateGameArea, 20);

        window.addEventListener('keydown', function (e) {
            myGameArea.key = e.keyCode;
        })
        window.addEventListener('keyup', function (e) {
            myGameArea.key = false;
        })
    },
    clear : function() {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    },
    stop : function() {
        
        window.alert("Score is: " + score + ".\nPress START! to Restart the Game !");
        clearInterval(this.interval);
    }
}

function component(width, height, color, x, y, speed) {
    this.width = width;
    this.height = height;
    this.x = x;
    this.y = y;  
    this.dx = speed;
    this.dy = speed; 


    this.update = function(){
        ctx = myGameArea.context;
        ctx.fillStyle = color;
        ctx.fillRect(this.x, this.y, this.width, this.height);
        ctx.strokeStyle = "black";
        ctx.strokeRect(this.x, this.y, this.width, this.height);

        ctx.fillStyle="rgba(0,0,0,.4)";
        ctx.beginPath();
        ctx.moveTo(this.x,this.y);
        ctx.lineTo(this.x+this.height/4,this.y+this.height/4);
        ctx.lineTo(this.x+this.height/4,this.y+.75*this.height);
        ctx.lineTo(this.x,this.y+this.width);
        ctx.closePath();
        ctx.fill();

        ctx.fillStyle="rgba(0,0,0,.6)";
        ctx.beginPath();
        ctx.moveTo(this.x,this.y+this.height);
        ctx.lineTo(this.x+this.height/4,this.y+this.height*.75);
        ctx.lineTo(this.x+this.width-this.height*.25,this.y+this.height*.75);        
        ctx.lineTo(this.x+this.width, this.y+this.height);
        ctx.closePath();
        ctx.fill();

        ctx.fillStyle="rgba(0,0,0,.2)";
        ctx.beginPath();
        ctx.moveTo(this.x+this.height/4,this.y+this.height/4);
        ctx.lineTo(this.x+this.width-this.height*.25,this.y+this.height*.25);
        ctx.lineTo(this.x+this.width-this.height*.25,this.y+this.height*.75);        
        ctx.lineTo(this.x+this.height*.25, this.y+this.height*.75);
        ctx.closePath();
        ctx.fill();
    }

    this.move = function(){

        if(this.x + this.width >= myGameArea.canvas.width)
        {
            this.dx = -ballv;
        }
        else if(this.x <= 0)
        {
            this.dx = ballv;
        }
        if(this.y + this.height >= myGameArea.canvas.height)
        {
            // console.log("enterd");
            this.dy = -ballv;
        }
        else if(this.y <= 0)
        {
            this.dy = ballv;
        }
        // console.log(dx);
        // console.log(dy);
        this.x = (this.x + this.dx);
        this.y = (this.y + this.dy);
    }

    this.drag = function() {

        // console.log("called");
        this.dx=0;
        this.dy=0;
        if (myGameArea.key && myGameArea.key == 37)
        {
            this.dx = -plankv;
        }

        if(myGameArea.key && myGameArea.key == 39)
        {
            this.dx = plankv;
        }
        // console.log(myGameArea.canvas.width);
        // console.log(this.x + this.width);
        if(this.x <= 0 && this.dx == -plankv)
            this.x = 0;
        else if(this.x + this.width >= myGameArea.canvas.width && this.dx == plankv)
            this.x = myGameArea.canvas.width - this.width;
        else
            this.x = (this.x + this.dx); 
    }

    this.notTouch = function(touchPlank) {

        if(this.y + this.height >= myGameArea.canvas.height - touchPlank.height)
        {
            // console.log("sat");
            if(this.x +this.width >= touchPlank.x && this.x <= touchPlank.x + touchPlank.width )
            {
                // console.log("not sat");
                this.dy = -ballv;
                this.y = (this.y + this.dy);
                ding.play();
                // console.log(this.y);
                return false;
            }
            return true;
        }
        return false;
    }

    this.tapBlock = function() {
        if(this.x%30 == 0)
            xx = Math.floor(((this.x-1)/30))*30;
        if(this.x == 0)
            xx = 0;
        else
            xx = Math.floor((this.x/30))*30;
        if(this.y%30 == 0)
            yy = Math.floor(((this.y-1)/30))*30;
        if(this.y == 0)
            yy=0;
        else
            yy = Math.floor((this.y/30))*30;
        prevx = (this.x - this.dx);
        prevy = (this.y - this.dy);
        // console.log("enter");
        // console.log("this.x " + this.x);
        // console.log("xx " + xx);
        // console.log("this.y " + this.y);
        // console.log("yy " + yy/30);
        // if(yy <= 5)
        //     console.log("arra " + obstacles[yy/30][xx/30]);
        if(yy<=150 && obstacles[yy/30][xx/30] == 1)
        {
            
            // console.log("xxc " + xx);
            // console.log("yyc " + yy);
            // // console.log("x " + this.x/30);
            // // console.log("y " + this.y/30);
            // console.log("prevx " + prevx);
            // console.log("prevy " + prevy);
            // console.log("this.x " + this.x);
            // console.log("this.y " + this.y);
            if((this.x <= xx && this.y <= yy) && (this.x + 10 >= xx && this.y + 10 >= yy))
            {
                this.dx = -ballv;
                this.dy = -ballv;
                this.x = (this.x + this.dx);
                this.y = (this.y + this.dy);
                obstacles[yy/30][xx/30] = 0;
                pling.play();
                score += 5;
                document.getElementById('score').value = score;
            }
            else if((this.x <= xx + 30 && this.y + 10 <= yy + 30) && (this.x + 10 >= xx + 30 && this.y >= yy + 30))
            {
                this.dx = ballv;
                this.dy = -ballv;
                this.x = (this.x + this.dx);
                this.y = (this.y + this.dy);
                obstacles[yy/30][xx/30] = 0;
                pling.play();
                score += 5;
                document.getElementById('score').value = score;
            }
            else if((this.x + 10 >= xx && this.y <= yy + 30) && (this.x <= xx && this.y + 10 >= yy + 30))
            {
                this.dy = ballv;
                this.dx = -ballv;
                this.x = (this.x + this.dx);
                this.y = (this.y + this.dy);
                obstacles[yy/30][xx/30] = 0;
                pling.play();
                score += 5;
                document.getElementById('score').value = score;
            }
            else if((this.x <= xx + 30 && this.y <= yy + 30) && (this.x + 10 >= xx + 30 && this.y + 10 >= yy + 30))
            {
                this.dy = ballv;
                this.dx = ballv;
                this.x = (this.x + this.dx);
                this.y = (this.y + this.dy);
                obstacles[yy/30][xx/30] = 0;
                pling.play();
                score += 5;
                document.getElementById('score').value = score;
            }
            else
            {
                if((prevx <= xx && prevx + 10 >= xx) && (prevy <= yy + 30 && prevy + 10 >= yy))
                {
                    // console.log("enter 1");
                    if(this.dx == ballv)
                    {
                        this.dx = -ballv;
                    }
                    else if(this.dx == -ballv)
                    {
                        this.dx = ballv;
                    }
                    this.x = this.x + this.dx;
                    obstacles[yy/30][xx/30] = 0;
                    pling.play();
                    score += 5;
                    document.getElementById('score').value = score;
                }
                else if((prevx <= xx + 30 && prevx + 10 >= xx) && (prevy <= yy + 30 && prevy + 10 >= yy))
                {
                    // console.log("enter 2");
                    if(this.dx == ballv)
                    {
                        this.dx = -ballv;
                    }
                    else if(this.dx == -ballv)
                    {
                        this.dx = ballv;
                    }
                    this.x = this.x + this.dx;
                    obstacles[yy/30][xx/30] = 0;
                    pling.play();
                    score += 5;
                    document.getElementById('score').value = score;
                }
                else if((prevy <= yy && prevy + 10 >= yy) && (prevx <= xx + 30 && prevx + 10 >= xx) )
                {
                    // console.log("enter 3");
                    if(this.dy == ballv)
                    {
                        this.dy = -ballv;
                    }
                    else if(this.dy == -ballv)
                    {
                        this.dy = ballv;
                    }
                    this.y = this.y + this.dy;
                    obstacles[yy/30][xx/30] = 0;
                    pling.play();
                    score += 5;
                    document.getElementById('score').value = score;
                }
                else if ((prevy <= yy + 30 && prevy + 10 >= yy) && (prevx <= xx + 30 && prevx + 10 >= xx))
                {
                    // console.log("enter 4");
                    // console.log("dy bef " + this.dy);
                    if(this.dy == ballv)
                    {

                        this.dy = -ballv;
                    }
                    else if(this.dy == -ballv)
                    {
                        // console.log("enenene");
                        this.dy = ballv;
                    }
                    // console.log("dy af " + this.dy);
                    this.y = this.y + this.dy;
                    obstacles[yy/30][xx/30] = 0;
                    pling.play();
                    score += 5;
                    document.getElementById('score').value = score;
                }
            }
        }
    }
}

function updateGameArea() {

    if(ball.notTouch(plank)) {
        // console.log("happe");
        myGameArea.stop();
    }
    else
    {    
        myGameArea.clear();
        ball.update();
        ball.tapBlock();
        if(score/5 == cnt)
        {
            myGameArea.stop();
        }
        // console.log("bing bing");
        for(i = 0; i < 5; i++)
        {
            for(j = 0; j < width/30; j++)
            {
                if(obstacles[i][j] == 1) 
                {
                    blocks[i][j].update();

                }
                // else
                // {
                //     console.log("x " + i);
                //     console.log("y " + j);
                // }
                
            }
        }
        ball.move();
        plank.update(); 
        plank.drag();  
        
        
        // yellowGamePiece.move();     
        // blueGamePiece.update();
    }
}

function sound(src) {

    this.sound = document.createElement("audio");
    this.sound.src = src;
    this.sound.setAttribute("preload", "auto");
    this.sound.setAttribute("controls", "none");
    this.sound.setAttribute("volume", .2);
    this.sound.style.display = "none";
    document.body.appendChild(this.sound);
    this.play = function(){
        this.sound.play();
    }
    this.stop = function(){
        this.sound.pause();
    }    
}
</script>
 
</body>
</html>
