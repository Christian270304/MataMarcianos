import { BALASCALE,WIDTH,HEIGHT } from "./config.js";
export class Bala{
    private xPos: number;
    private yPos: number;
    private balaWidth: number;
	private balaHeight: number;
    private bala: SVGGElement;

    /**
     * Constructor de la clase Bala.
     * 
     * @param {number} [x=320] Posicion horizontal de la bala.
     * @param {number} [y=434] Posicion vertical de la bala.
     * 
     * Crea un elemento <g> con id "bala" y establece su 
     * posicion y escala segun los parametros.
     *
    */
    constructor(x = 320, y = 434) {
		this.bala = this.createBalaElement();
        this.balaWidth = this.bala.getBBox().width;
        this.balaHeight = this.bala.getBBox().height;

        this.xPos = x;
		this.yPos = y;

        this.bala.setAttribute(
            "transform",
            `translate(${this.xPos} ${this.yPos}),scale(${BALASCALE})`
        );
    
    }

    /**
     * Crea un elemento <g> con id "bala" y devuelve la referencia a este.
     * El elemento <g> contiene dos <path>
     *
     * @returns {SVGGElement} Elemento <g> con la bala
     */
    private createBalaElement(): SVGGElement {
        // Crear el elemento <g> con id "bala"
        const gElement = document.createElementNS("http://www.w3.org/2000/svg", "g");
        gElement.setAttribute("id", "bala");
    
        // Crear el primer <path>
        const path1 = document.createElementNS("http://www.w3.org/2000/svg", "path");
        path1.setAttribute(
            "d",
            "M82.358,71.21692v77.33H26.388c0-21.82.24006-43.65-.06994-65.47a101.62711,101.62711,0,0,1,13.61-52.98c4.01-7.02,8.53472-13.7529,15.16472-18.67289,14.99,15.19,23.67525,33.4929,26.86525,54.59288C82.218,67.71692,82.19806,69.47693,82.358,71.21692Z"
        );
        path1.setAttribute("style", "fill:rgb(255, 249, 85)");
    
        // Crear el segundo <path>
        const path2 = document.createElementNS("http://www.w3.org/2000/svg", "path");
        path2.setAttribute(
            "d",
            "M55.09278,11.424c-6.634,4.92047-11.1543,11.65631-15.16681,18.66913A101.71813,101.71813,0,0,0,26.31446,83.08142c.31677,21.8169.076,43.642.07733,65.4635H1.68592c-.00208-22.46484.08532-44.93017-.0423-67.39429A100.546,100.546,0,0,1,7.66187,46.28735,93.95145,93.95145,0,0,1,42.3252.45306C44.5423,2.22906,53.054,9.543,55.09278,11.424Z"
        );
        path2.setAttribute("style", "fill:rgb(23, 23, 23)");
    
        // Añadir los paths al elemento <g>
        gElement.appendChild(path1);
        gElement.appendChild(path2);
    
        return gElement;
    }
    
    setxPos(xpos:number) {
		if (xpos < 0 + this.balaWidth) return;
		if (xpos > 640 - this.balaWidth) return;
		this.xPos = xpos;
        this.bala.setAttribute(
            "transform",
            `translate(${this.xPos} ${this.yPos}),scale(${BALASCALE})`
        );	}

    setyPos(ypos:number) {
        // if (ypos < 0 + this.balaHeight) return;
        if (ypos > 480 - this.balaHeight) return;
        this.yPos = ypos;
        this.bala.setAttribute(
            "transform",
            `translate(${this.xPos} ${this.yPos}),scale(${BALASCALE})`
        );    
    }

    getBalaWidth() {
        return this.balaWidth;
    }

    getBalaHeight() {
        return this.balaHeight;
    }

    getBala() {
        return this.bala;
    }

    getyPos() {
        return this.yPos;
    }

    getxPos() {
        return this.xPos;
    }
}