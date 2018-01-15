
//返回 card 对象的文件名函数
function fname(){
    return this.num + this.suit + ".png"
}
//创建 card 对象
function card(num,suit){
    this.num = num;
    this.suit = suit;
    this.fname = fname;
}

//构建游戏版

var board = new Array(26);

for(var i = 1; i < 26; i++){
    board[i] = new card(0,"x");
    var obj = document.getElementById("card" + i);
    obj.src = "blank.png";
    obj.onclick = placeCard;    //点击响应的函数
}

//洗牌 一共两步 第一部 将牌放入数组（路径名）， 第二步，对数组进行无序的打乱。

//将牌放入数组
var deck = new Array(53);
for(var i = 0; i < 14; i++){
    deck[i] = new card(i, "c");
    deck[i + 13] = new card(i, "h");
    deck[i + 26] = new card(i,"s");
    deck[i + 39] = new card(i, "d");
}
//洗牌
n = Math.floor(100 * Math.random() + 200);
for(var i = 0; i < n; i++){
    var c1 = Math.floor(52 * Math.random() + 1);
    var c2 = Math.floor(52 * Math.random() + 1);
    var temp = deck[c2];
    deck[c2] = deck[c1];
    deck[c1] = temp;
}

//放牌
var nextcard = 1;
function placeCard(e){
    //判断用户点击了哪一个位置
    if(!e){
        e = window.event;
    }
    var thiscard = (e.target) ? e.target: e.srcElement;
    var pos = thiscard.id.substring(4);
    if(board[pos].suit != "x"){
        return;
    }
    //放牌
    var drwacard = document.getElementById("dcard");//刷新
    thiscard.src = deck[nextcard].fname();
    drwacard.src = "blank.png"; //这张牌的位置已经废了，不可能出现重复的牌了
    board[pos] = deck[nextcard];//把 x替换掉了
    nextcard++;
    Score();
    
    //检查游戏是否结束
    if(nextcard > 25){
        endGame();
    }else{
        drwacard.src = deck[nextcard].fname();
        
        nexti = new Image();
        nexti.src = deck[nextcard + 1].fname();
    }
    
}

//计算每一列、行和对角线更新得分

function Score(){
    var score = document.getElementById("totalscore");//总分
    var r, a; //r 用来确定位置，a 用来计算每一个数的值。
    totscore = 0;       //应该声明为一个全局变量，才能累加，否则，每一次点击，这个数值就会被初始化一次。就应该初始化，因为每一次计分都是重新遍历的
    //每一行的分
    for(x = 0; x < 5; x++){
        r = x * 5 + 1;
        a = addScore(board[r], board[r + 1],board[r+2], board[r + 3], board[r + 4], "row" + x);
        totscore = a + totscore;
        
    }
    //每一列得分
    for(x= 0; x < 5; x++){
        r = x + 1;
        a = addScore(board[r],board[r+5], board[r+10],board[r+15], board[r+20], "col" + x);
        totscore = a + totscore;
       
    }
    //对角线得分
    a = addScore(board[5], board[9], board[13], board[17], board[21], "diag1");
    totscore = a + totscore;
    a = addScore(board[1], board[7], board[13], board[19],board[25], "diag2");
    score.firstChild.nodeValue = totscore; //将分数输出到这个对消第一个元素之中，就是文本域，也可以用 innerHTML
//    if(totscore > 0){
//        score.innerHTML = totscore;    
//    }else{
//        score.innerHTML = 0;
//    }
//    
}

//合计得分
function addScore(c1, c2, c3, c4, c5, scorebox){
    var sub = 0; //记录分数
    var obj = document.getElementById(scorebox);
//    //标记
//    var pair = false; //对子  1分
//    var twopair = false; //双对子  2分
//    var threeOfAKind = false; //三条  3分
//    var straight = false;   //顺子    4分
//    var fullHouse = false; //葫芦     8分
//    var fourOfAKind = false; //铁支   25分
//    var flush = false; //同花         30分
//    var straightFlush = false; //同花顺    50分
//    var royaFlush = false; //同花大顺   250分
//    
    //存储数字
    var nums = new Array(5);
    nums[0] = c1.num;
    nums[1] = c2.num;
    nums[2] = c3.num;
    nums[3] = c4.num;
    nums[4] = c5.num;

    //存储花色
    var suit = new Array(5);
    suit[0] = c1.suit;
    suit[1] = c2.suit;
    suit[2] = c3.suit;
    suit[3] = c4.suit;
    suit[4] = c5.suit;
    
    //调用 countOfUp()函数，判断有几张牌被翻开,根据被翻开的牌，调用相应的函数，函数的返回值是布尔值，根据这个布尔值，确定是否执行下面的函数。
    switch(countOfUp(suit)){
        case 0:
            break;
        case 1:
            break;
        case 2:
            if(Pair(nums,suit)){
                sub = 2;
                obj.innerHTML = "对子<br> 2 分";
                              }
            else{
                sub = 0;
            }
    
            break;
        case 3:
            if(ThreeOfAkind(nums, suit)){
                sub = 3;
                obj.innerHTML = "三条<br> 3 分"
            }
            else{
                if(Pair(nums, suit)){
                    sub = 2;
                    obj.innerHTML = "对子<br> 2分"
                }else{
                    sub = 0;
                }
            }
            break;
        case 4:
            if(FourOfAKind(nums, suit)){
                sub = 25;
                obj.innerHTML = "铁支<br> 25分";
            }else{
                if(ThreeOfAkind(nums,suit)){
                   sub = 3;
                   obj.innerHTML ="三条<br> 3分"
                   }else{
                        if(TwoPair(nums,suit)){
                            sub = 2;
                            obj.innerHTML = "双对子<br> 2 分"
                        }else{
                            if(Pair(nums,suit)){
                                sub = 2;
                                obj.innerHTML = "对子<br> 2 分";
                              }
                            else{
                                sub = 0;
                                }
                        }
                   }
                }
            break;
        case 5:
            if(RoyaFlush(nums, suit)){
                sub = 250;
                obj.innerHTML = "同花大顺<br> 250分";
            }else{
                if(StraightFlush(nums,suit)){
                   sub = 50;
                   obj.innerHTML = "同花顺<br> 50分"   ; 
                }else{
                    if((Flush(nums, suit))){
                        sub = 30;
                        obj.innerHTML = "同花<br> 30分";
                    }else{
                        if(FullHouse(nums, suit)){
                            sub = 8;
                            obj.innerHTML = "葫芦<br>8分";
                        }else{
                            if(FourOfAKind(nums,suit)){
                                sub = 25; 
                                obj.innerHTML = "铁支<br>25分";
                            }else{
                                if(TwoPair(nums, suit)){
                                   sub = 2;
                                   obj.innerHTML = "双对子2分";
                                   }else{
                                        sub = 0;
                                   }
                            }
                        }
                    }
                    
                }
            }
            break;
            
    }
    
   return sub; 
   
    
}

//此函数判断 传递进来的牌 有几张是翻开的 然后根据翻开牌的张数 确定执行的函数
function countOfUp(suit){
    var count = 0;  //  计数变量
    for(var i = 0; i < suit.length; i++){
        if(suit[i] != "x"){
            count++;
        }
    }
    return count;
}

function Pair(n,s){
    for(var i = 0; i < n.length - 1; i++){
        //不能过滤掉n = 0的情况
        if(n[i] != 0){
          if(n[i] == n[i + 1]){
            return true;
            }  
        }
        
    }
    return false;
}
function TwoPair(n, s){
    for(var i = 0; i < n.length - 3; i++){
        if(n[i] != 0){
           if(n[i] == n[i + 1] && s[i] == s[i + 1] && n[i+2] == n[i + 3] && s[i+ 2] == s[i + 3]){
            return true;
        }
        }  
    }
       
    return false;
}
function ThreeOfAkind(n,s){
    for(var i = 0 ; i < n.length - 2; i++){
        if(n[i] != 0){
            if(n[i] == n[i+1] && n[i+1] == n[i + 2]){
            return true;
        }   
     }
        
    }
    return false;
}
function Straight(n,s){
    var count1 = 0;
    var count2 = 0;
    //正序计数 
    for(var i = 0; i < n.length - 1; i++){
        if(n[i] != 0){
             if(n[i] == (n[i + 1] + 1)){
            count1 ++;
             }
        }
       
    }
    //倒序计数
    for(var i = n.length - 1; i > 0; i++){
        if(n[i] != 0){
             if(n[i] == (n[i - 1] +1)){
            count2 ++;
             }
        }
       
    }
    if(count1 == n.length - 1 || count2 == n.length -1){
        return true;
    }else{
        return false;
    }
}
function FullHouse(n ,s){
    //只有两种情况，一种是前两个是一个对子，后面是三条，第二种情况是前面是三条，后面是对子
    //或者说是 这一行同时满足对子跟三条，所以，可以调用前面的两个函数 进行判断
    if(Pair(n,s) && ThreeOfAkind(n,s)){
        return true;
    }
    return false;
    
}
function FourOfAKind(n ,s){
    for(var i = 0; i < n.length - 3; i++){
        if(n[i] == n[i + 1] && n[i + 1] == n [i + 2] && n[i + 2] == n[i + 3]){
            return true;
        }
    }
    return false;
}
function Flush(n, s){
    //同花 连续五张牌 花色相同
    for(var i = 0; i < n.length - 5; i++){
        if(s[i] == s[i + 1] && s[i+1] == s[i + 2] && s[i+2] == s[i + 3] && s[i + 3] == s[i + 4]){
            return true;
        }
    }
    return false;
}
function StraightFlush(n ,s){
    //同花顺 五张花色相同且连续，并且最大值不得大于 J
    if(FullHouse(n, s) && Flush(n,s) &&(n[0] < 11) && (n[n.length -1] < 11)){
        return true;
    }
    
    return false;   

}

function RoyaFlush(n,s){
    var n = n;
    var s = s;
    if(FullHouse(n, s) && Flush(n,s) &&(n[0] > 11) && (n[n.length -1] > 11)){
        return true;
    }
    
    return false;   

}

//结束游戏

function endGame(){
    var stat = document.getElementById("status");
    stat.innerHTML = "<b>Game Over</b>";
}
//重新游戏 刷新页面，也可以用ajax 来刷新，但是需要用到框架。把游戏页面内嵌到这个主页面中。

//为这个函数添加事件
var game = document.getElementById("newgame");
game.onclick = function(){
    location.reload();
}


