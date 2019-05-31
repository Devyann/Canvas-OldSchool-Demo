window.addEventListener("load", function(event){
  class Star {
    constructor(vec, speed, starRadius, color, opacity) {

      this.pos = vec;
      this.speed = speed;
      this.color = color;
      this.opacity = opacity;
      this.starRadius = starRadius;
    }
    update(width, height) {
      let xCenter = Math.floor(width / 2);
      let yCenter = Math.floor(height / 2);
      let x = this.pos.x;
      let y = this.pos.y;
      let ab = xCenter - x; // adjacent
      let bc = yCenter - y; // opposé
      let ac = Math.pow(ab, 2) + Math.pow(bc, 2); // hypothénuse
      let radius = Math.sqrt(ac);
      let angle = Math.atan2(bc, ab) + this.speed;
      let xTo = xCenter - radius * Math.cos(angle);
      let yTo = yCenter - radius * Math.sin(angle);

      return new Star(new Vec(xTo, yTo), this.speed, this.starRadius, this.color, this.opacity);
    }
  }
  class Vec {

    constructor(x, y) {

      this.x = x;
      this.y = y;

    }
    plus(anotherVec) {

      return new Vec(this.x + anotherVec.x, this.y + anotherVec.y);

    }

  }
  class Char {

    constructor(char, pos, width){
    
      this.char = char;
      this.pos = pos;
      this.width = width;
    
    }

  }
  class TextScrolling {
    
    constructor(textChars, speed, speedFactor, yStart, scrollDirection, angle){
    
      this.textChars = textChars;
      this.charsLength = textChars.length;
      this.speed = speed;
      this.speedFactor = speedFactor;
      this.yStart = yStart;
      this.scrollDirection = scrollDirection;
      this.angle = angle;
      this.sinusSpeed = 0.2;
    }
    static init(textToCroll, yStart, scrollDirection, speedFactor){
    
      let arrayChars = textToScroll.split('');
      let textChars = [];
      let speed = (scrollDirection == 'right') ? 1 : -1;
      let xStart = (speed < 0) ? canvas.width : 0;
      arrayChars.forEach(char => {
      
        let letter = char;
        let width = cx.measureText(char).width;
        let pos = new Vec(xStart, yStart); 
            let createdChar = new Char(letter, pos, width);
        xStart += createdChar.width;
        textChars.push(createdChar);
             
      });

      
      return new TextScrolling(textChars, speed, speedFactor, yStart, scrollDirection, 0);     
    }
    update(){
      let textChars = this.textChars;
      this.angle += this.sinusSpeed;
      let y = this.yStart + Math.sin(this.angle) * 2;
      let speedVec = new Vec(this.speed * this.speedFactor, y - this.yStart);
      textChars = textChars.map(char => {
        char.pos = char.pos.plus(speedVec);
        
        return char;
      });

      let scrollLimit = (this.speed < 0) ? 0 : canvas.width;
      
      textChars = textChars.filter(char =>{
        if (this.speed < 0) {
          return (char.pos.x + char.width) > 0;
        } else {
          return char.pos.x < scrollLimit + char.width;
        }
      });
      if (textChars.length > 0){     
        return new TextScrolling(textChars, this.speed, this.speedFactor, this.yStart, this.scrollDirection, this.angle);
      } else {
        return TextScrolling.init(textToScroll, this.yStart, this.scrollDirection, this.speedFactor);
      }
      
    }
    

  }
  class Circle{

    constructor(xCenter, yCenter, xRadius, yRadius, color, rotation){
    
      this.pos = new Vec(xCenter, yCenter);
      this.xRadius = xRadius;
      this.yRadius = yRadius;
      this.color = color;
      this.rotation = rotation;
    }
    draw(){
    
      cx.beginPath();
      cx.strokeStyle = this.color;
      // void ctx.ellipse(x, y, rayonX, rayonY, rotation, angleDébut, angleFin, antihoraire);
      cx.ellipse(this.pos.x, this.pos.y, this.xRadius, this.yRadius, this.rotation, 0, PI *2);
      cx.stroke();
    }

  }
  class Triangle{

    constructor(circle, speed = 0.1){
      this.circle = circle; 
      this.speed = speed;
    }
    init(){

      let angle = 1.5 * PI; // sommet
      this.height = this.circle.yRadius * 1.6;
      let x1 = this.circle.xRadius * Math.cos(angle) + this.circle.pos.x;
      let y1 = this.circle.yRadius * Math.sin(angle) + this.circle.pos.y;
      this.posA = new Vec(x1, y1);
      this.pointA = new Circle(this.posA.x, this.posA.y, 2, 2, "red", 0);
      this.angleA = angle;
      let oppose = this.height - this.circle.yRadius;
      let hypotenuse = this.circle.xRadius;
      let adjacent = Math.sqrt(Math.pow(hypotenuse, 2) - Math.pow(oppose, 2));
      angle = Math.atan2(oppose, - adjacent);
      let x2 = this.circle.xRadius * Math.cos(angle) + this.circle.pos.x;
      let y2 = this.circle.yRadius * Math.sin(angle) + this.circle.pos.y;
      this.posB = new Vec(x2, y2);
      this.pointB = new Circle(this.posB.x, this.posB.y, 2, 2, "green", 0);
      this.angleB = angle;
      angle = Math.atan2(oppose, adjacent);
      let x3 = this.circle.xRadius * Math.cos(angle) + this.circle.pos.x;
      let y3 = this.circle.yRadius * Math.sin(angle) + this.circle.pos.y;
      this.posC = new Vec(x3, y3);
      this.pointC = new Circle(this.posC.x, this.posC.y, 2, 2, "aqua", 0);
      this.angleC = angle;
      
      
    }
    draw(){
      this.pointA.draw();
      this.pointB.draw();
      this.pointC.draw();
      cx.strokeStyle = "teal";
      cx.lineWidth = 2;
      cx.beginPath();
      cx.moveTo(this.posA.x, this.posA.y);
      cx.lineTo(this.posB.x, this.posB.y);
      cx.stroke();
      cx.lineWidth = 1;
      cx.lineTo(this.posC.x, this.posC.y);
      cx.lineTo(this.posA.x, this.posA.y);
      cx.stroke();
      
    }
    update(){
      let triangle = new Triangle(this.circle, this.speed);
      triangle.angleA = this.angleA + this.speed;
      triangle.posA = this.newPos(triangle.angleA);
      triangle.pointA = new Circle(triangle.posA.x, triangle.posA.y, 2, 2, "red", 0);
      triangle.angleB = this.angleB + this.speed;
      triangle.posB = this.newPos(triangle.angleB);
      triangle.pointB = new Circle(triangle.posB.x, triangle.posB.y, 2, 2, "green", 0);
      triangle.angleC = this.angleC + this.speed;
      triangle.posC = this.newPos(triangle.angleC);
      triangle.pointC = new Circle(triangle.posC.x, triangle.posC.y, 2, 2, "aqua", 0);
      return triangle;
    }
    newPos(angle){
      let x = this.circle.xRadius * Math.cos(angle) + this.circle.pos.x;
      let y = this.circle.yRadius * Math.sin(angle) + this.circle.pos.y;
      return new Vec(x, y);
    }

  } 
  class Space {

    constructor() {
      this.width = parseInt(canvas.width);
      this.height = parseInt(canvas.height);
      this.stars = [];
      this.starCounter = 0;
      this.triangles = [];
      this.circles = [];
      this.trianglesCounter = 0;
      this.circlesCounter = 0;


    }
    static init(nbOfStars, nbOfTriangles) {

      let space = new Space();
      space.starCounter = nbOfStars;
      space.trianglesCounter = space.circlesCounter = nbOfTriangles;
      let starBuffer = Math.floor((space.width - space.height) / 2);
      for (let i = 0; i < space.starCounter; i++) {
        
        let x = Math.floor(Math.random() * (space.width - 0 + 1) + 0);
        //let y = Math.floor(Math.random() * (space.height + starBuffer - (-starBuffer) + 1) + (-starBuffer));
        let y = Math.floor(Math.random() * (space.height + starBuffer + starBuffer + 1) - starBuffer);

        let speed = Math.floor(Math.random() * (6 - 0 + 1) + 1)  / 400;
        let opacity = Math.random() + 0.1;
        opacity = opacity.toFixed(1);
        let starColorLength = starColors.length;
        let starColor = starColors[Math.floor(Math.random() * (starColorLength))];
        let starRadius = Math.floor(Math.random() * (4 - 2 + 1) + 2);

        space.stars.push(new Star(new Vec(x, y), speed, starRadius, starColor, opacity));
      }
      // xCenter, yCenter, xRadius, yRadius, color, rotation
      for (let i = 1; i <= space.circlesCounter; i++){
        let color = (i > 1) ? "rgba(0, 0, 0, 0)" : "blue";
        space.circles.push(new Circle(space.width / 2, space.height / 2, stargateRadius - i * 10, stargateRadius - i * 10, color, 0));
      }
      // circle, speed = 0.1
      for (let i = 0; i < space.trianglesCounter; i++){
        let speed = (i < 1) ? 0.1 : 0.1 - i * 0.01;
        let triangle = new Triangle(space.circles[i], speed);
        console.log(triangle);
        console.log(space.triangles);
        console.log(triangle.init());

        space.triangles.push(triangle);

      }
      space.triangles.map(triangle => {
         triangle.init(); 
      });
      


      space.scrolling = TextScrolling.init(textToScroll, space.height - 25, 'left', 8);
      console.log(space);
      return space;
    }
    update() {

      let space = new Space();
      let stars = this.stars;
      let triangles = this.triangles;

      stars = stars.map(star => {
        return star.update(this.width, this.height);
      });
      triangles = triangles.map(triangle => {
        return triangle.update();
      });
      
      space.width = this.width;
      space.height = this.height;
      space.stars = stars;
      space.circles = this.circles;
      space.circlesCounter = this.circlesCounter;
      space.trianglesCounter = this.trianglesCounter;
      space.triangles = triangles;
      space.starCounter = this.starCOunter;

      space.scrolling = this.scrolling.update();

      return space;
    }

  }
  class Display {

    constructor(space, canvas) {

      this.space = space;
      this.canvas = canvas;

    }
    frame() {
      cx = this.canvas;
      cx.clearRect(0, 0, this.space.width, this.space.height);
      cx.fillStyle = "black";
      cx.fillRect(0, 0, this.space.width, this.space.height);
      cx.drawImage(imgBackground, 0, 0);
      this.starRoutine();
      cx.fillStyle = "rgba(0, 0, 0, 0.6)";
      cx.arc(this.space.width / 2, this.space.height / 2, stargateRadius, 0, PI * 2);
      cx.fill();
      // cx.fillStyle = "rgba(0, 0, 0, 0.8)";
      // cx.fillRect(0, this.space.height - 80, this.space.width, this.space.height);
      cx.drawImage(imgStargate, this.space.width / 2 - imgStargate.width / 2 - 20, this.space.height / 2 - imgStargate.height / 2 + 18);
      this.space.circles.map(circle => {
        circle.draw();
      });
      this.space.triangles.map(triangle => {
        triangle.draw();
      });
      
      this.textScrolling();
    }
    starRoutine(){  
      
      

      this.space.stars.map(star => {
        let radius = star.starRadius;
        let gradient = cx.createRadialGradient(star.pos.x, star.pos.y, radius / 2, star.pos.x, star.pos.y, radius);
        gradient.addColorStop(0, `rgba(${ star.color.colorFrom }, ${ star.opacity }`);
        gradient.addColorStop(.9, `rgba(${ star.color.colorTo}, ${ star.opacity }`);
        cx.fillStyle = gradient;
        cx.beginPath();
        cx.arc(star.pos.x, star.pos.y, radius, 0, 2 * Math.PI);
        cx.fill();
      });
      
    }
    textScrolling(){
      let chars = this.space.scrolling.textChars;
      
      
      chars.map(char => {
        // cx.fillStyle = "gold";
        let strokeGradient = cx.createLinearGradient(char.pos.x, char.pos.y - (char.width * 1.2), char.pos.x + char.width, char.pos.y + (char.width * 1.2));
        strokeGradient.addColorStop(0, 'rgba(0, 0, 0, 1)');
        strokeGradient.addColorStop(.5, 'rgba(128, 128, 128, 1)');
        strokeGradient.addColorStop(1, 'rgba(255, 255, 255, 1)');
        let fillGradient = cx.createLinearGradient(char.pos.x, char.pos.y - (char.width * 1.2), char.pos.x + char.width, char.pos.y + (char.width * 1.2));
        fillGradient.addColorStop(0.000, 'rgba(144, 106, 0, 1.000)');
        fillGradient.addColorStop(0.435, 'rgba(217, 159, 0, 1.000)');
        fillGradient.addColorStop(1.000, 'rgba(255, 255, 255, 1.000)');
        cx.fillStyle = fillGradient;
        cx.strokeStyle = strokeGradient;
        cx.fillText(char.char, char.pos.x, char.pos.y);
        cx.lineWidth = 3;
        cx.strokeText(char.char, char.pos.x, char.pos.y);
        
      });
      cx.lineWidth = 1;
      
    }

  }

  function runSpace(time) {

    display = new Display(display.space.update(), cx);

    display.frame();

    requestAnimationFrame(runSpace);
  }


  const PI = Math.PI;
  const canvas = document.querySelector("canvas");
  let cx = canvas.getContext("2d");
  let imgStargate = document.createElement("img");
  imgStargate.src = "./assets/images/png/stargate.png";
  let imgBackground = document.createElement("img");
  imgBackground.src = "./assets/images/jpg/background.jpg";

  let stargateRadius = 335;
  let width = canvas.width = window.innerWidth;
  let height = canvas.height = window.innerHeight;
  cx.font = "4em Orbitron";
  let textToScroll = "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec quam urna, elementum sit amet nullam.";
  // couleurs étoiles
  const starColors = [{"name" : "red", "colorFrom" : "231 ,176 , 139", "colorTo" : "198, 55, 24"},
                     {"name" : "yellow", "colorFrom" : "243 ,241 , 215", "colorTo" : "221, 159, 49"},
                     {"name" : "white", "colorFrom" : "252 ,252 , 252", "colorTo" : "175, 184, 179"},
                     {"name" : "white", "colorFrom" : "255 ,255 , 255", "colorTo" : "175, 184, 179"},
                     {"name" : "blue", "colorFrom" : "242 ,252 , 252", "colorTo" : "78, 164, 228"}];
  var space = Space.init(4000, 32);
  var display = new Display(space, cx);
  var frame = display.frame()
  runSpace();
});
