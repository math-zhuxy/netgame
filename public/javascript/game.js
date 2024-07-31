const canvas=document.getElementById("GameCanvas");
const ctx=canvas.getContext("2d");

const RecSize=50;
const FrameSize=50;
const HeroSize=50;

const XNUMBER=15;
const YNUMBER=11;

const StateBarSize=200;

const GameWidth=XNUMBER*RecSize+2*FrameSize+StateBarSize;
const GameHeight=YNUMBER*RecSize+2*FrameSize;

let MyEattenBeansx=0;
let MyEattenBeansy=0;

const MaxWallNumber=25;
const MaxBeanNumber=18;
const MaxTrapNumber=8;


canvas.width=GameWidth;
canvas.height=GameHeight;


var MyHeroX=0;
var MyHeroY=0;
var MyHeroDirect=0;
var MyGameScore=0;

var MyGhostX=0;
var MyGhostY=0;
var HisGhostX=0;
var HisGhostY=0;

var GhostImg=new Image();
GhostImg.src='./picture/ghost.png';
var TrapImg=new Image();
TrapImg.src='./picture/trap.jpg';
var BoxImg=new Image();
BoxImg.src='./picture/box.png';
var ShadowBallImg=new Image();
ShadowBallImg.src='./picture/shadowball.png';
var ScarletImg=new Image();
ScarletImg.src='./picture/scarlet.png';

var HisHeroX=0;
var HisHeroY=0;
var HisHeroDirect=0;
var HisGameScore=0;
//0右边 1左边 2上边 3下边


//和服务器有关的参数
var IsAssignedId=false;
var IsMatchedGame=false;
var IsInitedGame=false;
var MyUserIdInServer=0;

var GameCounter=0;

let GameMatrix=new Array(YNUMBER);
for(var i=0;i<YNUMBER;i++){
    GameMatrix[i]=new Array(XNUMBER);
}

for(var i=0;i<YNUMBER;i++){
    for(var j=0;j<XNUMBER;j++){
        GameMatrix[i][j]=0;
    }
}
//0表示可以走，1表示墙，2表示豆子，3表示陷阱
//4表示箱子，5表示暗影之魂，6表示腐败之地
/*
    5
6   4   3
    5
*/
var BOX_STATE=-1;
//-1表示什么都没有，0表示暗影之魂，1表示腐败之地
function IsIn(){
    if(!(MyHeroX>=0&&MyHeroX<XNUMBER&&MyHeroY>=0&&MyHeroY<YNUMBER)){
        return false;
    }
    if(MyHeroX==HisHeroX&&MyHeroY==HisHeroY){
        return false;
    }
    if(MyHeroX==HisGhostX&&MyHeroY==HisGhostY){
        return false;
    }
    if(GameMatrix[MyHeroY][MyHeroX]==1){
        return false;
    }
    if(GameMatrix[MyHeroY][MyHeroX]==0){
        return true;
    }
    return true;
}


document.addEventListener("keyup",function(event){
    if(event.key=='s'){
        MyHeroY++;
        MyHeroDirect=3;
        if(!IsIn()){
            //console.log("not in!");
            MyHeroY--;
            MyGameScore--;
        }
        
    }
    else if(event.key=='w'){
        MyHeroY--;
        MyHeroDirect=2;
        if(!IsIn()){
            //console.log("not in!");
            MyHeroY++;
            MyGameScore--;                
        }
        
    }
    else if(event.key=='a'){
        MyHeroX--;
        MyHeroDirect=1;
        if(!IsIn()){         
            //console.log("not in!");
            MyHeroX++;
            MyGameScore--;
        }
        
    }
    else if(event.key=='d'){
        MyHeroX++;
        MyHeroDirect=0;
        if(!IsIn()){       
            //console.log("not in!");
            MyHeroX--;
            MyGameScore--;
        }
        
    }
    else if(event.key=='m'){
        console.log('m pressed');
        if(GameMatrix[MyHeroY][MyHeroX]==4){
            BOX_STATE=(MyHeroX+MyHeroY)%2;
            MyGameScore-=50;
            if(BOX_STATE==0){
                MyGameScore+=20;
            }
        }
        if(GameMatrix[MyHeroY][MyHeroX]==5){
            MyGameScore+=30;
            GameMatrix[MyHeroY][MyHeroX]=0;
        }
        
    }
});



function DrawHero(i,j,direction,color){
    var x=i*RecSize+HeroSize/2+FrameSize;
    var y=j*RecSize+HeroSize/2+FrameSize;
    ctx.beginPath();
    ctx.arc(x,y,HeroSize/2,0,Math.PI*2);
    ctx.fillStyle=color;
    ctx.fill();
    var Dirx=0;
    var Diry=0;
    if(direction==0){
        Dirx=1;
    }
    if(direction==1){
        Dirx=-1;
    }
    if(direction==2){
        Diry=1;
    }
    if(direction==3){
        Diry=-1;
    }
    var Eyex=x+Dirx*15;
    var Eyey=y-Diry*15;
    var Eye1x=Eyex+Diry*10;
    var Eye1y=Eyey+Dirx*10;
    ctx.beginPath();
    ctx.arc(Eye1x,Eye1y,5,0,Math.PI*2);
    ctx.fillStyle='black';
    ctx.fill();
    var Eye2x=Eyex-Diry*10;
    var Eye2y=Eyey-Dirx*10;
    ctx.beginPath();
    ctx.arc(Eye2x,Eye2y,5,0,Math.PI*2);
    ctx.fillStyle='black';
    ctx.fill();
}   

function DrawRec(i,j){
    var x=i*RecSize+FrameSize;
    var y=j*RecSize+FrameSize;
    if((i+j)%2==0){
        ctx.fillStyle='rgb(221, 190, 139)';
    }
    else{
        ctx.fillStyle='rgb(238, 232, 213)';
    }
    ctx.fillRect(x,y,RecSize,RecSize);
}

function DrawGhost(i,j,color){
    var x=i*RecSize+FrameSize;
    var y=j*RecSize+FrameSize;
    ctx.drawImage(GhostImg,x,y,RecSize,RecSize);
    ctx.fillStyle=color;
    var Size=10;
    ctx.fillRect(x,y,Size,Size);
    ctx.fillRect(x+RecSize-Size,y,Size,Size);
    ctx.fillRect(x,y+RecSize-Size,Size,Size);
    ctx.fillRect(x+RecSize-Size,y+RecSize-Size,Size,Size);
}

function DrawFivePointedStar(i,j){
    var x=i*RecSize+FrameSize+RecSize/2;
    var y=j*RecSize+FrameSize;
    // 任选一个起始点
    var pointA_x = x;
    var pointA_y = y;
    var _PI = Math.PI;
    
    
    var pointB_x = pointA_x + RecSize/2;
    var pointB_y = pointA_y + (RecSize/2)*Math.tan(_PI/5);
    
    
    var pointC_x = pointA_x + RecSize*Math.sin(_PI/10);
    var pointC_y = pointA_y + RecSize*Math.cos(_PI/10);
    
    
    var pointD_x = pointA_x - RecSize*Math.sin(_PI/10);
    var pointD_y = pointA_y + RecSize*Math.cos(_PI/10);
    
    
    var pointE_x = pointA_x - RecSize/2;
    var pointE_y = pointA_y + (RecSize/2)*Math.tan(Math.PI/5);
    
    // 开始绘制五角星
    ctx.fillStyle='yellow'
    ctx.beginPath();
    ctx.moveTo(pointA_x, pointA_y);
    ctx.lineTo(pointC_x, pointC_y);
    ctx.lineTo(pointE_x,pointE_y);
    ctx.lineTo(pointB_x,pointB_y);
    ctx.lineTo(pointD_x,pointD_y);
    ctx.closePath();
    ctx.fill();
}

function DrawScore(){
    ctx.font="50px Verdana";
    ctx.fillStyle='black';
    ctx.fillText("my src:",GameWidth-StateBarSize/2,50,StateBarSize);
    ctx.fillText(MyGameScore,GameWidth-StateBarSize/2,100,StateBarSize);
    ctx.fillText("his src:",GameWidth-StateBarSize/2,150,StateBarSize);
    ctx.fillText(HisGameScore,GameWidth-StateBarSize/2,200,StateBarSize);
}

function DrawAllElements(){
    ctx.fillStyle='darkblue';
    ctx.fillRect(0,0,GameWidth-StateBarSize,GameHeight);
    for(var i=0;i<XNUMBER;i++){
        for(var j=0;j<YNUMBER;j++){
            DrawRec(i,j);
            if(GameMatrix[j][i]==1){
                ctx.fillStyle='darkblue';
                ctx.fillRect(FrameSize+i*RecSize,FrameSize+j*RecSize,RecSize,RecSize);
            }
            else if(GameMatrix[j][i]==2){
                DrawFivePointedStar(i,j);
            }
            else if(GameMatrix[j][i]==3){
                ctx.drawImage(TrapImg,FrameSize+i*RecSize,FrameSize+j*RecSize,RecSize,RecSize);
            }
            else if(GameMatrix[j][i]==4){
                ctx.drawImage(BoxImg,FrameSize+i*RecSize,FrameSize+j*RecSize,RecSize,RecSize);
            }
            else if(GameMatrix[j][i]==5){
                ctx.drawImage(ShadowBallImg,FrameSize+i*RecSize,FrameSize+j*RecSize,RecSize,RecSize);
            }
            else if(GameMatrix[j][i]==6){
                ctx.drawImage(ScarletImg,FrameSize+i*RecSize,FrameSize+j*RecSize,RecSize,RecSize);
            }
            
        }
    }
    DrawScore();
    DrawHero(HisHeroX,HisHeroY,HisHeroDirect,'blue');
    DrawHero(MyHeroX,MyHeroY,MyHeroDirect,'red');
    DrawGhost(HisGhostX,HisGhostY,'blue');
    DrawGhost(MyGhostX,MyGhostY,'red');
}

function SendingMsg(){
    let data={
        "herox":MyHeroX,
        "heroy":MyHeroY,
        "herodir":MyHeroDirect,
        "user":MyUserIdInServer,
        "score":MyGameScore,
        "beansx":MyEattenBeansx,
        "beansy":MyEattenBeansy,
        "ghostx":MyGhostX,
        "ghosty":MyGhostY,
    };
    fetch('/data',{
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body:JSON.stringify(data),
    })
    .then(response=>{
        if(!response.ok){
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
    .then(data=>{
        if(data.ex==true){
            IsMatchedGame=false;
            IsInitedGame=false;
            MyUserIdInServer=0;
            IsAssignedId=false;
            window.location.href="/exitpage";
        }
        HisHeroX=data.x;
        HisHeroY=data.y;
        HisHeroDirect=data.dir;
        HisGameScore=data.src;
        HisGhostX=data.gx;
        HisGhostY=data.gy;
        GameMatrix[data.eaty][data.eatx]=0;
    })
    .catch(error => {
        console.error('Error sending data: ', error);
    });
    
}

function GhostMove() {
    if(GameCounter%10==0){
        if(MyGhostX<MyHeroX){
            MyGhostX++;
        }
        else if(MyGhostX>MyHeroX){
            MyGhostX--;
        }
        else if(MyGhostY<MyHeroY){
            MyGhostY++;
        }
        else if(MyGhostY>MyHeroY){
            MyGhostY--;
        }
        else if(MyGhostX<0){
            MyGhostX=0;
        }
        if(MyGhostX>=XNUMBER){
            MyGhostX=XNUMBER-1;
        }
        if(MyGhostY<0){
            MyGhostY=0;
        }
        if(MyGhostY>YNUMBER){
            MyGhostY=YNUMBER-1;
        }
    }
}

function ScarletSpread(){
    if(GameCounter%50!=0){
        return;
    }
    function spread(i,j){
        if(i>=0&&i<XNUMBER&&j>=0&&j<YNUMBER){
            if(GameMatrix[j][i]==0||GameMatrix[j][i]==2){
                GameMatrix[j][i]=6;
            }
        }
    }
    var Counter=0;
    if(GameCounter%(2*50)==0){
        for(var i=0;i<XNUMBER;i++){
            for(var j=0;j<YNUMBER;j++){
                if(GameMatrix[j][i]==6){
                    Counter++;
                    if(Counter>=5){
                        return;
                    }
                    spread(i-1,j);
                    spread(i,j-1);
                }
            
            }
        }
    }
    else{
        for(var i=XNUMBER-1;i>=0;i--){
            for(var j=YNUMBER-1;j>=0;j--){
                if(GameMatrix[j][i]==6){
                    Counter++;
                    if(Counter>=5){
                        return;
                    }
                    spread(i+1,j);
                    spread(i,j+1);
                }
            }
        }
    }
}

function HeroCollisonCheck(){
    if(MyHeroX==MyGhostX&&MyHeroY==MyGhostY){
        MyGameScore-=5;
    }
    if(GameMatrix[MyHeroY][MyHeroX]==2){
        MyGameScore+=20;
        GameMatrix[MyHeroY][MyHeroX]=0;
        MyEattenBeansx=MyHeroX;
        MyEattenBeansy=MyHeroY;
    }
    else if(GameMatrix[MyHeroY][MyHeroX]==3){
        MyGameScore-=4;
    }
    else if(GameMatrix[MyHeroY][MyHeroX]==4){
        var i=MyHeroX;
        var j=MyHeroY;
        if(BOX_STATE==0){
            for(var k=0;k<3;k++){
                var Minx=Math.max(0,i-3)
                var Maxx=Math.min(XNUMBER,i+4)
                var a=Minx+Math.floor(Math.random()*(Maxx-Minx))
                var Miny=Math.max(0,j-2)
                var Maxy=Math.min(YNUMBER,j+3)
                var b=Miny+Math.floor(Math.random()*(Maxy-Miny))
                if(b>=0&&b<YNUMBER&&a>=0&&a<XNUMBER&&GameMatrix[b][a]==0){
                    GameMatrix[b][a]=5;
                    GameMatrix[j][i]=0;
                    MyEattenBeansx=i;
                    MyEattenBeansy=j;
                    break;
                }            
            }
        }
        if(BOX_STATE==1){
            if(GameMatrix[j][i-1]==0){
                GameMatrix[j][i-1]=6;
            }
            else if(GameMatrix[j][i+1]==0){
                GameMatrix[j][i+1]=6;
            }
            else if(GameMatrix[j-1][i]==0){
                GameMatrix[j-1][i]=6;
            }
            else if(GameMatrix[j+1][i]==0){
                GameMatrix[j+1][i]=6;
            }
            GameMatrix[j][i]=0;
            MyEattenBeansx=i;
            MyEattenBeansy=j;
        }
    }
    else if(GameMatrix[MyHeroY][MyHeroX]==5){
        if(MyGameScore>=100){
            GameMatrix[MyHeroY][MyHeroX]=0;
        }
        if(GameCounter%15==0){
            MyGameScore++;
        }
    }
    else if(GameMatrix[MyHeroY][MyHeroX]==6){
        GameMatrix[MyHeroY][MyHeroX]=0;
        MyGameScore+=5;
    }
}


function GameLoop(){
    ctx.clearRect(0,0,GameWidth,GameHeight);
    DrawAllElements();
    //console.log(BOX_STATE);
    GhostMove();
    HeroCollisonCheck();
    BOX_STATE=-1;
    ScarletSpread();
    SendingMsg(); 
    if(GameCounter%20==0){
        MyGameScore--;
    }
    GameCounter++;
}


function GetMyId(){
    console.log("matching...");
    let data={
        "userid":MyUserIdInServer};
    fetch('/match',{
        method: 'POST',
        headers: {
        'Content-Type': 'application/json',
        },
        body:JSON.stringify(data),
    })
    .then(response=>{
        if(!response.ok){
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
    .then(data=>{
        if(IsAssignedId==false){
            MyUserIdInServer=data.userid;
            IsAssignedId=true;
        }
        if(MyUserIdInServer>=3){
            alert("服务器已满！")
            IsMatchedGame=false;
            IsInitedGame=false;
            MyUserIdInServer=0;
            IsAssignedId=false;
            window.location.href="/"
        }
        IsMatchedGame=data.ismatched;
        console.log("match: ");
        console.log("my user id is: ",MyUserIdInServer);
        console.log("IsMatched: ",IsMatchedGame);
    })
    .catch(error => {
        console.error('Error sending data: ', error);
    });
}

function InitGame(){
    if(IsInitedGame==true){
        return;
    }
    ctx.clearRect(0,0,GameWidth,GameHeight);
    console.log("matched successfully");
    console.log("init game");
    if(MyUserIdInServer==1){
        MyHeroX=0;
        MyHeroY=0;
        MyHeroDirect=0;
        HisHeroX=XNUMBER-1;
        HisHeroY=YNUMBER-1;
        HisHeroDirect=1;
        MyGhostX=XNUMBER-1;
        MyGhostY=0;
        HisGhostX=0;
        HisGhostY=YNUMBER-1;
    }
    if(MyUserIdInServer==2){
        MyHeroX=XNUMBER-1;
        MyHeroY=YNUMBER-1;
        MyHeroDirect=1;
        HisHeroX=0;
        HisHeroY=0;
        HisHeroDirect=0;
        MyGhostX=0;
        MyGhostY=YNUMBER-1;
        HisGhostX=XNUMBER-1;
        HisGhostY=0;
    }
    DrawHero(MyHeroX,MyHeroY,MyHeroDirect,'red');
    DrawHero(HisHeroX,HisHeroY,HisHeroDirect,'blue');
    DrawGhost(MyGhostX,MyGhostY,'red');
    DrawGhost(HisGhostX,HisGhostY,'blue');

    let data={
        //"user":MyUserIdInServer,
        "x":XNUMBER,
        "y":YNUMBER,
        "max":MaxWallNumber,
        "maxbean":MaxBeanNumber,
        "maxtrap":MaxTrapNumber,
    };
    fetch('/init',{
        method: 'POST',
        headers: {
        'Content-Type': 'application/json',
        },
        body:JSON.stringify(data),
    })
    .then(response=>{
        if(!response.ok){
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
    .then(data=>{
        for(var i=0;i<data.size;i++){
            GameMatrix[data.wally[i]][data.wallx[i]]=1;
        }
        for(var i=0;i<data.beansize;i++){
            GameMatrix[data.beany[i]][data.beanx[i]]=2;
        }
        for(var i=0;i<data.trapsize;i++){
            GameMatrix[data.trapy[i]][data.trapx[i]]=3;
        }
        for(var i=0;i<data.boxsize;i++){
            GameMatrix[data.boxy[i]][data.boxx[i]]=4;
        }
        for(var i=0;i<YNUMBER;i++){
            GameMatrix[i][0]=0;
            GameMatrix[i][XNUMBER-1]=0;
        }
    })
    .catch(error => {
        console.error('Error sending data: ', error);
    });

    IsInitedGame=true;
}

var MatchingTimeCounter=0;
function MainLoop(){
    //执行匹配循环
    if(!IsMatchedGame){
        if(MatchingTimeCounter%5==0){
            GetMyId();
            //console.log(Math.floor(Math.random()*2));
        }
        MatchingTimeCounter++;
    }
    //执行初始化游戏，仅执行一次
    if(IsMatchedGame&&!IsInitedGame){
        InitGame();
    }
    //游戏循环
    if(IsMatchedGame&&IsInitedGame){
        GameLoop();
    }
}

var ButtonIsClicked=false;

//这里是match的界面
function beign(){
    ctx.clearRect(0,0,GameWidth,GameHeight);
    var gradient = ctx.createLinearGradient(0, 0, 700, 0);
    gradient.addColorStop(0, "skyblue"); // 第一个偏移值为0
    gradient.addColorStop(1, "#fffc96"); // 第一个偏移值为1
    ctx.beginPath();
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, GameWidth, GameHeight);
    ctx.fill();
    var a=GameWidth/2;
    var b=GameHeight/2;
    ctx.font="50px Verdana";
    ctx.textAlign='center';
    ctx.fillStyle='black';
    ctx.fillText("Matching...",a,b,400);
}

function Game(){
    if(!ButtonIsClicked){
        canvas.style.display='block';
        var img=document.getElementById('gamestartdiv');
        img.style.display='none';
        document.getElementById('gamebutton_1').style.display='none';
        document.getElementById('gamebutton_2').style.display='none';
        beign();
        setInterval(MainLoop,100);
        ButtonIsClicked=true;
    }
}
