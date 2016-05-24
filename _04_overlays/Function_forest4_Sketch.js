function forest4( sketch ) {

//////////////////////////////////////
var w = 600;
var h = 600;
var div = 8 ;
var sz = 4;
var disp_w = 300;
var range = 250;
var consumer;
var cell_Count =((div)*(div));
var cells = [cell_Count];
var pause;
var trees = [cell_Count]; // array of Tree objects
var millisec;
var cells = [];
var cellSZ = 20;

sketch.setup= function() {
  sketch.print("strting...")
  sketch.createCanvas(w, h);
  millisec = sketch.millis();
  var loc = 0

  for (var x = 1 ; x <= div; x+=1){
    for (var y = 1; y<= div; y+=1){
      trees[loc] = (new Tree(( ((w/div)*x)-40), (y*(h/div))-40, sketch.random(40,20), sketch.random(8,12), sketch.random(w,h)));////x,y,startsize , number of steps, length
      trees[loc].populate();
      loc+=1;
    }
  }

  sketch.print("trees populated  cc="+String(cell_Count)+"   l="+String(trees.length));
  sketch.frameRate(60);
  sketch.createCanvas(w, h);
  sketch.colorMode(sketch.HSB);
  consumer = new Settler(250, sketch.mouseX, sketch.mouseY);

  for (var x=15; x<(w); x+=cellSZ){
      for (var y=0; y<(h); y+=cellSZ){
          cell = new Cells_objs(x,y,100,15);
          cells.push(cell);
      }
  }


}

sketch.draw = function() {
    sketch.colorMode(sketch.RGB);
    sketch.background(0,0,0,20);
    sketch.colorMode(sketch.HSB);

    consumer.motionTest();
    for (var i = 0; i<cells.length; i++){ cells[i].show(); cells[i].occ_test(consumer.r_sz);}
    consumer.display();
    for (var i = 0; i<trees.length; i++){  trees[i].occ_test(consumer.r_sz); trees[i].display();}

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
            if (sketch.dist(this.x,this.y,sketch.mouseX,sketch.mouseY)<range/2) {
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


// Treeclass
function Tree(x, y, s, num, len) { ///x,y,startsize , number of steps, length
  this.Start_x = x;
  this.Start_y = y;
  this.diameter = sketch.random(8, 9);
  this.Start_sz = s;
  this.num = num; // this is how many circles
  this.T_sz = len; // this is how big the start size is
  this.xlocs = [this.num];
  this.ylocs = [this.num];
  this.sizes = [this.num];
  this.displayRange = this.num;
  this.scaler = (this.T_sz/this.num)  // this is the scale factor
  this.last_x;
  this.last_y;
  this.last_sz;
///////////////////tree function/////////////////////
this.occ_test = function(range) {
  if (sketch.dist(this.Start_x,this.Start_y,sketch.mouseX,sketch.mouseY)<range/2) {if (this.sizes.length > 2){this.displayRange -=1;}}
  else{if(this.displayRange < this.num-1 ){this.displayRange +=1;}}
}
///////////////tree function////////////////////////
this.populate = function() {
  var last_x = [this.Start_x,this.Start_x,this.Start_x,this.Start_x];
  var last_y = [this.Start_y,this.Start_y,this.Start_y,this.Start_y];
  var last_sz = this.Start_sz;
  for (var i = 1; i< this.num; i++) {
      this.xlocs[i] = [last_x[0] +sketch.random(0,last_sz*.3), last_x[1] -sketch.random(0,last_sz*.3), last_x[2] +sketch.random(0,last_sz*.3),last_x[3] -sketch.random(0,last_sz*.3)];
      this.ylocs[i] = [last_y[0] +sketch.random(0,last_sz*.3), last_y[2] -sketch.random(0,last_sz*.3), last_y[2] -sketch.random(0,last_sz*.3),last_y[3] +sketch.random(0,last_sz*.3)];
      this.sizes[i] = last_sz * 0.9;/// rate of decrease
      last_x = this.xlocs[i];
      last_y = this.ylocs[i];
      last_sz= this.sizes[i];
      ///////////////////////////////////////////////////
    }
  }
/////////////tree function//////////////////////////
this.display = function() {
  for (var i = 2 ; i< this.displayRange; i++){
    var degree = sketch.map(i,0,this.num,10,70);
    var col = [sketch.color(100,52,degree),sketch.color(133,52,degree),sketch.color(166,52,degree),sketch.color(200,52,degree)];
    for (var j = 0; j<4; j++){
      sketch.fill(col[j]);
      sketch.ellipse(this.xlocs[i][j], this.ylocs[i][j],this.sizes[i],this.sizes[i]);
      }
    }
  }

}
      /////////////////////End tree Funtion //////////////////////////////
function Soil(centX, centY, stro){

  this.centX = centX;
  this.centY = centY;
  this.sw = stro;
}




function Settler(r,x,y){
    this.r_sz = r;
    this.lX = x;
    this.lY = y;
    this.changeRate = 100;

    this.display = function() {
      sketch.colorMode(sketch.HSB);
      percent = sketch.map(this.r_sz,0,400,0,1);
      //colorRange = sketch.map(this.r_sz,0,400,5,30);
      //sketch.fill(0,0,colorRange);
      sketch.fill(0,0,0,0)
      sketch.stroke(16,40+(percent*38),41);
      sketch.ellipse(sketch.mouseX, sketch.mouseY, this.r_sz,this.r_sz);
      sketch.noStroke();
      for (rad=10; rad<this.r_sz/2; rad+=35){
        c_count = sketch.map(rad,20,250,10,80);
        sketch.angleMode(sketch.DEGREES);
        sketch.translate(sketch.mouseX,sketch.mouseY);
        coler_degree = sketch.map(rad,20,250,sketch.map(this.r_sz,0,400,30,90),10);
        for (i=0; i<360;i+=(360/c_count)){
          sketch.rotate(i);
          sketch.fill(42,25,coler_degree);
          //sketch.ellipse(sketch.mouseX+this.r_sz, sketch.mouseY, 20,20 );
          //sketch.ellipse(rad, 0, 5,5 );
          sketch.triangle(rad,0,rad+12,0,rad+6,12);
          sketch.rotate(-i);
        }
        sketch.translate(-sketch.mouseX,-sketch.mouseY);
      }
      //sketch.stroke(0);
    }


    this.motionTest = function(){
        change = sketch.dist(this.lX,this.lY,sketch.mouseX,sketch.mouseY);
        this.lX = sketch.mouseX;
        this.lY = sketch.mouseY;
        if (change < 4 ){if(this.r_sz < 400){this.r_sz += 3;}}
        else{if(this.r_sz > 15){this.r_sz = this.r_sz-8;}}
    }

    this.dispGraph = function(){
        sketch.colorMode(HSB);
        centX = disp_w/2;
        centY = disp_w/2;
        eSz = (disp_w*.75)
        sketch.stroke(0);
        sketch.fill(map(this.r_sz,0,1000,40,0),64,50);
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
        sketch.textAlign(CENTER);
        sketch.text(this.r_sz,centX+val,(disp_w/2)-10);
    }
}
/////////////////////End tree Funtion //////////////////////////////
      ///////////////////////////////////////////////////
}
////////////////End of sketch function////////////////////////
