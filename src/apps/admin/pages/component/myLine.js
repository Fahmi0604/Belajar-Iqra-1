class MyLine {
    constructor(p5) {
        this.p5 = p5
        this.px = p5.pmouseX
        this.py = p5.pmouseY
        this.x = p5.mouseX
        this.y = p5.mouseY
    }

    show() {
        this.p5.stroke(50)
        this.p5.strokeWeight(15)
        this.p5.line(this.px, this.py, this.x, this.y)
    }
}

export default MyLine