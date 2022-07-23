class Player{
  constructor(){
    this.live = false;
    this.position = createVector(width/2, height *3/4);
  }
  
  update(){
    if(keyIsDown(DOWN_ARROW)){
      this.position.y += 3;
    }
    else if(this.position.y > height*3/4) this.position.y -=3;
    }
  
  show(){
    strokeWeight(40);
    stroke(255);
    point(this.position.x,this.position.y);
  }
}
//gunner
const bullets = [];
class EnemyShooter{
  constructor(Player){
    this.fRate = Math.random()*80 + 50;
    this.temp = this.fRate;
    this.position = createVector(350, 0);
    this.gun = p5.Vector.random2D();
    while(this.gun.x > 0 || Math.abs(this.gun.y/ this.gun.x) >1.3){
        this.gun = p5.Vector.random2D();
    }
  }
  
  update(Player){
    if(this.temp <= 0){
      this. temp = this.fRate;
      bullets.push(new Bullet(this));
    }
    this.temp -= 1;
    if(Player.position.y <= height*3/4){
      this.position.y += 2;
    }
  }
  
  show(){
    strokeWeight(20);
    stroke(255);
    point(this.position.x,this.position.y);
    strokeWeight(3);
    line(this.position.x, this.position.y, this.position.x + this.gun.x*20, this.position.y + this.gun.y*20);
  }
  
}

//bullet
class Bullet{
  constructor(EnemyShooter){
    this.position = createVector(EnemyShooter.position.x, EnemyShooter.position.y);
    this.velocity = createVector(EnemyShooter.gun.x * 4, EnemyShooter.gun.y * 4);
  }
  
  update(Player){
    this.position.add(this.velocity);
     if(Player.position.y <= height*3/4){
      this.position.y += 2;
    }
  }
  
  show(){
    strokeWeight(6);
    stroke(255);
    point(this.position.x,this.position.y);
  }
  
  Hit(Player){
    if(Math.sqrt(Math.pow(Player.position.x - this.position.x,2) + Math.pow(Player.position.y - this.position.y,2) < 300)){
       Player.live = false;
       }
  }
}
const horde = [];

class Text{
  constructor(){
    this.s = 0;
    this.hs = 0;
    this.start = true;
    this.restart = false
  }
  
  update(Player){
    if(Player.live){
      if(Player.position.y <= height*3/4) this.s += 1;
      if (this.s > this.hs ) this.hs = this.s;
    }
    if(mouseIsPressed  && (this.start || this.restart)) {
      this.start = false;
      this.restart = false
      Player.live = true;
    }
    if(!this.start && !P.live) this.restart = true;
  }
  show(){
    stroke(0)
    textSize(16);
    fill('white');
    text("score: " +int(this.s/10), 10, 30);
    text("highscore: "+int(this.hs/10),10,50)
    if(this.start){
      textSize(50);
      fill('white');
      text("PLAY",width/3 ,height/2)
      textSize(20)
      text("press the down arrow to go backward", width/5-50, height/2+50);
      textSize(20)
      text("-click to start-", width/3, height/2+70);
    }
    if(this.restart){
      textSize(40);
      fill('white');
      text("RESTART ?",width/3-35 ,height/2)
      textSize(20)
      text("press the down arrow to go backward", width/5-50, height/2+50);
      textSize(20)
      text("-click to start-", width/3, height/2+70);
    }
  }
}

function setup() {
  createCanvas(400, 800);
    P = new Player();
    S=new Text();
    step = Math.random()*80 + 20;
}


function draw() {
  background(40);
  
  S.update(P);
  S.show();
  
  if(P.live){
    if(P.position.y <= height *3/4){
      step -= 1;
    }
    if(step <= 0){
      step = Math.random() *80 +20;
      horde.push(new EnemyShooter())
    }
    
    if(P.position.y > height) {
      P.live = false;
      P.position.y = height * 3/4;
    }
      P.update();
      P.show();
    for (var i = 0; i < horde.length; i++){
      horde[i].update(P);
      horde[i].show();
      if(horde[i].position.y >= height) horde.splice(i,1);
    }
    for(var i =0; i < bullets.length; i++){
      bullets[i].update(P);
      bullets[i].show();
      bullets[i].Hit(P);
      if(bullets[i].position.x < 0) bullets.splice(i,1);
    }
  }
  else{
      for (var i = 0; i < horde.length; i++){
        horde.splice(i,1);
      }
      for(var i =0; i < bullets.length; i++){
        bullets.splice(i,1);
      }
    S.s = 0;
  }
}