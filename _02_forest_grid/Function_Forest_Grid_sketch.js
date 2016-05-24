//////////////////////////////////////
function Forest_Grid ( sketch ) {

var things = [];
var num_things = 100;


//////////////////////////////////////

var w = 600;
var h = 600;
var div = 20;
var sz = 4;
var disp_w = 300;
var range = 250;
var consumer;
var cells = [];

var pause;

sketch.setup = function() {
    pause = new Game_Menu();
    sketch.frameRate(60);
    sketch.createCanvas(w, h);
    sketch.colorMode(sketch.HSB);
    sketch.noStroke();
    consumer = new Settler(250, sketch.mouseX, sketch.mouseY);
    //for (var x=disp_w; x<(w); x+=div){
    for (var x=15; x<(w); x+=div){
        for (var y=0; y<(h); y+=div){
            cell = new Cells_objs(x,y,100,15);
            cells.push(cell);
        }
    }
    ///////////////////////////////
    for(var i = 0;i < num_things ;i++) {
        things.push(new Thing() );
    }
    sketch.background(0);

    ///////////////////////////////

}

sketch.draw = function() {

    if (pause.pause == false){
        sketch.colorMode(sketch.RGB);
        sketch.background(0,0,0,.2);
        sketch.colorMode(sketch.HSB);
        consumer.display();
        consumer.motionTest();
        //consumer.dispGraph();
        for (var i = 0; i<cells.length; i++){
            cells[i].show();
            cells[i].occ_test(consumer.r_sz);
        }
    }
    pause.menu();

    //////////////////////////////////////
    //for(var i = 0;i < things.length;i++) {
    //    things[i].update();
    //    things[i].display();
    //}
/////////////////////////////////


}

function Cells_objs(x,y,b,sz) {
    this.x = x;
    this.y = y;
    this.b = b;
    this.sz = sz;
    this.h = sketch.random(80,143);
    this.step = 1;
    //map(mouseY,0,h,100,0)

    this.show = function(){
        this.H_jitter();
        sketch.fill(this.h,100,this.b/2);
        sketch.rect(this.x-2-this.sz/2,this.y-2-this.sz/2,this.sz+4,this.sz+4)
        //fill(this.h,100,this.b);
        //ellipse(this.x,this.y,this.sz,this.sz);
     }
    this.occ_test = function(range) {
        if (this.b > 5){
            if (sketch.dist(this.x,this.y,sketch.mouseX,sketch.mouseY)<range) {
                this.b -= 3
            }
        }
        if (this.b < 100){
            this.b +=.3
        }
    }

    this.H_jitter = function(){
        this.step = sketch.random(-.5,.5);
        if (this.h+this.step>143){
            this.h-=this.step;
        }
        else if (this.h+this.step<80){
            this.h+=(this.step*(-1));
        }
        else{this.h+=this.step;}
    }

}

function Settler(r,x,y){
    this.r_sz = r;
    this.lX = x;
    this.lY = y;
    this.changeRate = 100;

    this.display = function() {
      range = this.r_sz;
        sketch.colorMode(sketch.HSB);
       //fill(32,32,64);
       sketch.fill(sketch.map(this.r_sz,0,1000,40,0),64,50)
        sketch.ellipse(sketch.mouseX,sketch.mouseY, this.r_sz,this.r_sz);
    }

    this.motionTest = function(){
        change = sketch.dist(this.lX,this.lY,sketch.mouseX,sketch.mouseY);
        this.lX = sketch.mouseX;
        this.lY = sketch.mouseY;

        if (change < 4 ){
          if (this.r_sz< 400){
            this.r_sz += 1;
          }
        }
        else{
          if(this.r_sz>0){
            this.r_sz = this.r_sz-4;
          }
        }

    }

    this.dispGraph = function(){
        sketch.colorMode(sketch.HSB);
        centX = disp_w/2;
        centY = disp_w/2;
        eSz = (disp_w*.75)

        sketch.stroke(0);
        sketch.fill(sketch.map(this.r_sz,0,1000,40,0),64,50);
        sketch.ellipse(centX,centY,disp_w*.75,disp_w*.75);
        sketch.stroke(2);
        sketch.line(centX, centY, disp_w/2+(eSz/2), centY);
        sketch.stroke(0);
        sketch.fill(240);
        sketch.ellipse(centX,centY,4,4);
        sketch.ellipse(centX+(eSz/2), centY,4,4);

        val = sketch.map(this.r_sz,0,1000,0 ,eSz/2)
        sketch.ellipse(centX+val,disp_w/2,4,4);
        sketch.textSize(18);
        sketch.textAlign(sketch.CENTER);
        sketch.text(this.r_sz,centX+val,(disp_w/2)-10);
    }
}

function Game_Menu(){
    this.pause = false;
    this.menu = function(){
        if (this.pause == true){
            sketch.fill(0);
            sketch.rectMode(sketch.CENTER);
            sketch.rect(w/2,h/2,500,250);
            sketch.fill(240);
            sketch.textAlign(sketch.CENTER);
            sketch.textSize(60);
            sketch.text("paused",w/2,h/2);
        }
    }

    this.pauseToggle = function(){
        if (this.pause == false){this.pause = true;}
        else{this.pause = false;}
    }
}

function  keyTyped() {
    if (key === "p"){
        pause.pauseToggle();
        pause.menu();
    }
}

function Thing() {
    this.poit = new p5.Vector(200,200);
    this.move = new p5.Vector(-1,1);

    //this.fade = funtion(){}
    //this.ExpandThing = function(){}


    this.update = function() {
    if(sketch.mouseIsPressed) {
      this.poit = new p5.Vector(sketch.mouseX,sketch.mouseY);
    }
      //this.poit = new p5.Vector(mouseX,mouseY);
      this.move = new p5.Vector(sketch.random(-2,2),sketch.random(-2,2));
      this.poit.add(this.move);
  }

    this.display = function() {

        sketch.stroke(sketch.random(150,255),0,0,150);
        //point(this.poit.x,this.poit.y);
        sketch.rect(this.poit.x,this.poit.y,4,4);
    }
}



function Pointers(a,r,x,y){//start angle//radious//centerx//centery
  this.angle  = sketch.radians(a);
  this.R = r;
  this.centerX = x;
  this.centerY = y;

  this.xloc = this.centerY + sin(this.angle) * this.R;
  this.yloc = this.centerX + cos(this.angle) * this.R;

  this.rotate = function(step) {
    this.angle += sketch.radians(step);
    this.xloc = this.centerY + sketch.sin(this.angle) * this.R;
    this.yloc = this.centerX + sketch.cos(this.angle) * this.R;
  }

  this.display = function() {
    sketch.fill(200,150,130);
    sketch.ellipse(this.xloc,this.yloc,50,50);

  }


}
}
