function forest0 ( sketch ) {
var things = [];
var num_things = 100;


//////////////////////////////////////

var w = 600;
var h = 600;
var div = 30;
var sz = 4;
var disp_w = 300;
var range = 250;
var consumer;
var cells = [];

var pause;

/*
 * @name Array of Objects
 * @description Create a Jitter class, instantiate an array of objects
 * and move them around the screen.
 */
var trees = []; // array of Tree objects
var millisec;

sketch.setup= function() {
  sketch.print("strting...")
  sketch.createCanvas(w, h);
  millisec = sketch.millis();
  // Create objects
  //for (var i=0; i<50; i++) {
  //  bugs.push(new Tree());
  //}
  for (var x = 40; x < w; x+=(w/10)){
    for (var y = 40; y< h; y+=(h/10)){
      trees.push(new Tree(x, y, sketch.random(40,20), sketch.random(8,12), sketch.random(w,h)));////x,y,startsize , number of steps, length
      trees[trees.length-1].populate();
    }
  }

  pause = new Game_Menu();
  sketch.frameRate(60);
  sketch.createCanvas(w, h);
  sketch.colorMode(sketch.HSB);
  //noStroke();
  consumer = new Settler(250, sketch.mouseX, sketch.mouseY);


}

sketch.draw = function() {

  if (pause.pause == false){
    sketch.colorMode(sketch.RGB);
    sketch.background(0,0,0,50);
    //background(0);
    sketch.colorMode(sketch.HSB);
    //consumer.display();
    //consumer.motionTest();
    //consumer.dispGraph();
    //for (var i = 0; i<cells.length; i++){
      //cells[i].show();
      //cells[i].occ_test(consumer.r_sz);

    //}
    consumer.display();
    for (var i = 0; i<trees.length; i++){
    trees[i].occ_test(consumer.r_sz);}

    for (var i = 0; i<trees.length; i++){
    trees[i].display();
  }

  }
  pause.menu();

  //background(50, 89, 100);

//  if (mouseIsPressed){
//    trees.push(new Tree(mouseX, mopuseY, 60, 80, 250));
//    trees[trees.length-1].populate();
//  }

  //if (keyIsPressed){
  //  for (var i = 0; i<trees.length; i++){
  //  trees[i].reduce();
  //  }
  //}



  //for (var i=0; i<trees.length; i++) {
  //  trees[i].move();
  //  trees[i].display();
  //}
}

// Treeclass
function Tree(x, y, s, num, len) { ///x,y,startsize , number of steps, length
  this.Start_x = x;
  this.Start_y = y;
  this.diameter = sketch.random(8, 9);
  this.Start_sz = s;
  this.num = num; // this is how many circles
  this.T_sz = len; // this is how big the start size is
  this.xlocs = [];
  this.ylocs = [];
  this.sizes = [];

  //this.sml_rate =
  this.scaler = (this.T_sz/this.num)  // this is the scale factor

////////////////////


  this.last_x;
  this.last_y;
  this.last_sz;


///////////////////

this.reduce = function(){
  this.xlocs.pop();
  this.ylocs.pop();
  this.sizes.pop();
}


//this.occ_test = function(range) {
//  if (this.sizes.length > 1){
//    if (dist(this.Start_x,this.Start_y,mouseX,mouseY)<range) {
//      this.xlocs.pop();
//      this.ylocs.pop();
//      this.sizes.pop();
//    }
//  }
//}

////////////////////////////////////////
this.occ_test = function(range) {

  if (sketch.dist(this.Start_x,this.Start_y,sketch.mouseX,sketch.mouseY)<range) {
    if (this.sizes.length > 2){
      this.xlocs.pop();
      this.ylocs.pop();
      this.sizes.pop();
    }
  }
  else{
    if(this.sizes.length < this.num){
      var len = this.xlocs.length-1;
      last_x = [this.xlocs[len][0],this.xlocs[len][1],this.xlocs[len][2],this.xlocs[len][3]];
      last_y = [this.ylocs[len][0],this.ylocs[len][1],this.ylocs[len][2],this.ylocs[len][3]];
      last_sz = this.sizes[len];

      this.xlocs.push([last_x[0] +sketch.random(0,last_sz*.3), last_x[1] -sketch.random(0,last_sz*.3), last_x[2] +sketch.random(0,last_sz*.3),last_x[3] -sketch.random(0,last_sz*.3)]);
      this.ylocs.push([last_y[0] +sketch.random(0,last_sz*.3), last_y[2] -sketch.random(0,last_sz*.3), last_y[2] -sketch.random(0,last_sz*.3),last_y[3] +sketch.random(0,last_sz*.3)]);
      this.sizes.push(last_sz * 0.9);
  }
}
}



///////////////////////////////////////

this.populate = function() {
  var last_x = [this.Start_x,this.Start_x,this.Start_x,this.Start_x];
  var last_y = [this.Start_y,this.Start_y,this.Start_y,this.Start_y];
  var last_sz = this.Start_sz;
  //var new_dist = start_dist;
  for (var i = 1; i< this.num; i++) {

      this.xlocs[i] = [last_x[0] +sketch.random(0,last_sz*.3), last_x[1] -sketch.random(0,last_sz*.3), last_x[2] +sketch.random(0,last_sz*.3),last_x[3] -sketch.random(0,last_sz*.3)];
      this.ylocs[i] = [last_y[0] +sketch.random(0,last_sz*.3), last_y[2] -sketch.random(0,last_sz*.3), last_y[2] -sketch.random(0,last_sz*.3),last_y[3] +sketch.random(0,last_sz*.3)];
      //this.sizes[i] = [];


      //this.xlocs[i] = last_x += random(0,last_sz*.3);
      //this.ylocs[i] = last_y += random(-last_sz*.3,last_sz*.3);
      this.sizes[i] = last_sz * 0.9;/// rate of decrease
      last_x = this.xlocs[i];
      last_y = this.ylocs[i];
      last_sz= this.sizes[i];
      //ellipse(this.xlocs[i], this.ylocs[i],this.sizes[i],this.sizes[i]);
    //  translate(last_x*new_dist, last_y*new_dist)
    //  rotate(radians(random(-5,5)))
      ////////Imaging a move vector rotate situation/////

      ///////////////////////////////////////////////////
    }

  }
this.display = function() {
  //var col = [color(20,200,30),color(100,30,100),color(200,100,50),color(230,20,150)];
  var col = [sketch.color(100,52,35),sketch.color(133,52,35),sketch.color(166,52,35),sketch.color(200,52,35)];
  for (var i = 2; i< this.xlocs.length; i++){

    for (var j = 0; j<4; j++){
      //print(j, this.xlocs[i][j]);
      sketch.fill(col[j]);
      sketch.ellipse(this.xlocs[i][j], this.ylocs[i][j],this.sizes[i],this.sizes[i]);
    }

  }
}
  //this.move = function() {
  //  this.x += random(-this.speed, this.speed);
  //  this.y += random(-this.speed, this.speed);
  //};

  //this.display = function() {
  //  ellipse(this.x, this.y, this.diameter, this.diameter);
  //};
}

function keyPressed(){
    if (keyCode === LEFT_ARROW){
      for (var i = 0; i<trees.length; i++){
      trees[i].reduce();
      }
    }
}

function mouseClicked(){
  trees.push(new Tree(sketch.mouseX, sketch.mouseY, 20, 80, 250));
  trees[trees.length-1].populate();
}

function Settler(r,x,y){
    this.r_sz = r;
    this.lX = x;
    this.lY = y;
    this.changeRate = 100;

    this.display = function() {
        sketch.colorMode(sketch.HSB);
       sketch.fill(0,0,7);
       //fill(map(this.r_sz,0,1000,40,0),64,50)
        sketch.ellipse(sketch.mouseX, sketch.mouseY, this.r_sz,this.r_sz);
    }

    this.motionTest = function(){
        change = sketch.dist(this.lX,this.lY,sketch.mouseX,sketch.mouseY);
        this.lX = mouseX;
        this.lY = mouseY;
        if (change < 4){
            this.r_sz += 1;
        }
        else{this.r_sz = this.r_sz-4;}

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

function Game_Menu(){
    this.pause = false;
    this.menu = function(){
        if (this.pause == true){
            sketch.fill(0);
            sketch.rectMode(CENTER);
            sketch.rect(w/2,h/2,500,250);
            sketch.fill(240);
            sketch.textAlign(CENTER);
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

}
//function mousePressed(){
//  trees.push(new Tree(mouseX, mouseY, 1, 15));
//}
