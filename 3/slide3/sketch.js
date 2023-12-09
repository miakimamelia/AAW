// let colors = "fff-fff-f13".split("-").map(a=>"#"+a)
let colors = ["#0077cc", "#33aaff", "#66ccff", "#99ddff", "#cceeff"];

// let colors = ["#0099ff", "#33ccff", "#66d9ff", "#00cc66", "#00ff99"];
let overAllTexture



function windowResized() {
	// Resize the overAllTexture canvas when the window is resized
	resizeCanvas(windowWidth, windowHeight);

    let center = createVector(width / 2, height / 2);
    for (let i = 0; i < radiations.length; i++) {
        radiations[i].p = createVector(
          center.x + width * 0.3 * cos(i / radiations.length * 2 * PI * 0.5),
          center.y + height * 0.3 * sin(i / radiations.length * 2 * PI * 5.23875)
        );
      }
    
  
  }


class Wave{
	constructor(args){
		let def ={
			p: createVector(10,0),
			rSpeed: random(1)*random(1),
			color: color(0),
			r: 5,
			live: int(random(150,150)),
			alive: true,
			polygonCount: int(random(1,20)),
			randomId: int(random(50)),
            dash: random(0)<10,

			
			
		}
		Object.assign(def,args)
		Object.assign(this,def)
		this.originalLive = this.live
	}
	draw(){
		let liveRatio = this.live/this.originalLive
		push()
			let clr = color(this.color)
			clr.setAlpha(liveRatio*255)

			stroke(clr)
			strokeWeight(2*liveRatio )
		
			noFill()
			translate(this.p)
			push()
				if (this.dash){
					drawingContext.setLineDash([10, 10]);
				}
			pop()
		beginShape()
			for(let i=-1;i<10;i++){
				let rr = map(noise(i,frameCount/50,this.randomId),1,0,1,0)*this.r
				let ang = i+ random()*0
				let xx = rr*cos(ang),yy = rr*sin(ang)
				if (random()<10){
						point(xx,yy)
				}
				if (i%this.polygonCount==0){
					vertex(xx,yy)
				}
			}
		strokeWeight(2*liveRatio)
		endShape()
		
		pop()
	}
	update(){
		this.r+=this.rSpeed
		this.live--
		if (this.live < 0){
			this.alive=false
		}
		
	}
}
class Radiation{
	constructor(args){
        let def = {
            p: createVector(0, 0),
            color: random(colors),
            randomId: int(random(10000)),
			freq: int(random(300,1000)),
            lastWaveEmitTs: 0,
        
          };
          Object.assign(def, args);
          Object.assign(this, def);
        }


        draw() {
            push();
            noStroke();
            translate(this.p);
            if (frameCount - this.lastWaveEmitTs < 1) {
              scale(2);
            }
            fill(this.color);
            ellipse(0, 0, 15, 15);
        
            pop()
        }
        update(){
            if ( (this.randomId+frameCount) % this.freq ==0){
                this.emitWave()
            }
        }
        
	emitWave(parent=this){
		waves.push(new Wave({
			p: this.p.copy(),
			color: this.color,
			parent
		}))
	}
}
          
     
        
          
let radiations = []
let waves =[]
let canvas
function setup() {
	pixelDensity(2)
	canvas = createCanvas(1000, 1000);
	background(100);
	let total = 60
	let ii = 0
	while(ii<total){
		let newP = createVector(random(width),random(height))
		let flag = true
		for(let k=0;k<radiations.length;k++){
			if (radiations[k].p.dist(newP)<50){
				flag=false
				break;
			}
		}
		if (flag){
			radiations.push(new Radiation({
				p: createVector(width/2+width*0.3*cos(ii/total*2*PI*0.5),
												height/2+height*0.3*sin(ii/total*2*PI*5.23875))
				// p: newP,
			}))
			ii++
		}
	}
	fill(0)
	rect(0,0,width,height)
	
	overAllTexture=createGraphics(width,height)
	overAllTexture.loadPixels()
	for(var i=0;i<width+50;i++){
		for(var o=0;o<height+50;o++){
			overAllTexture.set(i,o,color(200,noise(i/10,i*o/300)*random([0,0,20	,50])))
		}
	}
	
    overAllTexture.updatePixels();
    windowResized();
  }

function draw() {
	noStroke()
	fill(240)
	rect(0,0,width,height)
	waves.forEach(wave=>{
		wave.update()
		wave.draw()
	})
	waves = waves.filter(w=>w.alive)
	radiations.forEach(radiation=>{
		radiation.update()
		radiation.draw()
	})
	
	waves.forEach(wave=>{
		radiations.forEach(radiation=>{
			if (frameCount-radiation.lastWaveEmitTs>5 &&
					wave.parent!==radiation &&  
					abs(wave.p.dist(radiation.p)-wave.r)<2 && wave.color == radiation.color ){
					radiation.emitWave()
				radiation.lastWaveEmitTs = frameCount
				radiation.lastWaveParent = wave.parent
			}
		})
	})
	
	push()
	radiations.forEach(radiation=>{
		let clr = color(radiation.color)
		clr.setAlpha(150)
		radiations.forEach(radiation2=>{
			drawingContext.setLineDash([5, 15]);
			drawingContext.lineDashOffset = frameCount/1;
			stroke(clr)
			if ( radiation === radiation2.lastWaveParent ||
					radiation2 === radiation.lastWaveParent){
				line(radiation.p.x,radiation.p.y,radiation2.p.x,radiation2.p.y)
			}
		})
	})
	pop()
	
	
	
	push()
		blendMode(MULTIPLY)
		image(overAllTexture,0,0,width,height)
	pop()
	
	// push()
	// 	textSize(50)
	// 	fill(255)
	// 	text(waves.length,30,height-30)
	// pop()
	
	push()
	drawingContext.filter = "blur(10px)"
	blendMode(BURN)
	image(canvas, 0, 0)
	drawingContext.filter = "blur(20px)"
	image(canvas, 0, 0)
	
	pop()
	
	push()
		blendMode(OVERLAY)
		fill(28*3, 28*3, 28*3)
		rect(0,0,width,height)
	pop()
	
	
	
// 	push()
// 	drawingContext.filter = "invert(0.95)" 
// 	image(canvas, 0, 0) 
	
// 	pop()
	
	push()
		blendMode(MULTIPLY)
		image(overAllTexture,0,0,width,height)

	pop()
	
	
	


}

function keyPressed(){
	if (key==' '){
		if (isLooping()){
			noLoop()
		}else{
			loop()
		}
	}
	if (key=="s"){
		save()
	}
}