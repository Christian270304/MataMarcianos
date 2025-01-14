import "https://code.jquery.com/jquery-3.7.1.js";
declare let $: any;
import {  COLUMNES, FILES, WIDTH, HEIGHT, ALIENSPEED } from "./config.js";
import { gameOver } from "./SpaceInvaders.js";
export class Exercit {
	private xPos: number;	// Posició horitzontal de l'exèrcit d'aliens
	private yPos: number;	// Posició vertical de l'exèrcit d'aliens
	private aliensWidth: number;
	private aliensHeight: number;
	private exercit: SVGPathElement;
	private direction: number; // Direcció del moviment (1 = dreta, -1 = esquerra)
	
	constructor() {
		// Inicialitzar valors
		this.direction = 1; // Inicialitzar la direcció a dreta
		this.xPos = 90;	// Posició horitzontal de l'exèrcit d'aliens
		this.yPos = 40; // Posició vertical de l'exèrcit d'aliens

		// Posicionar l'exèrcit dels aliens
		this.exercit = document.getElementById("aliens") as unknown as SVGPathElement;
		this.exercit.setAttribute("transform", "translate(" + this.xPos + " " + this.yPos + ")");

		this.aliensWidth = this.exercit.getBoundingClientRect().width;
		this.aliensHeight = this.exercit.getBBox().height;
		// Moure l'alien original fora de l'àrea de joc
		document.getElementById("alien")!.setAttribute("transform", "translate(-20 -15)");

		// Crear còpies de l'alien original
		for (let i = 0; i < FILES; i++) {
			for (let j = 0; j < COLUMNES; j++) {
				this.exercit.innerHTML += "<use id='a" + i + j + "' href='#alien' transform='translate(" + (j * 60 + 40) + " " + (i * 40 + 30) + ")'></use>";
			}
		}
	}
	
	public aliensMoviment() {
		let newYPos:number = this.yPos;
		const joc = (document.getElementById('joc') as unknown as SVGGElement).getBoundingClientRect();

		const allAliens = document.getElementById("aliens") as unknown as SVGGElement;
	
		const nave = document.querySelector<SVGGElement>("#nau");
		const alienRec = allAliens.getBoundingClientRect();
		if (!nave) return;
	
		const naveRect = nave.getBoundingClientRect();
		console.log(naveRect);
		$("use[id^='a']").each((i: number, e: SVGAElement) => {
			if (!e.parentNode) return; // Saltar si el alien fue eliminado
	
			const alienRect = e.getBoundingClientRect();
	
		
	
			const collisionNave = !(
				alienRect.right < naveRect.left ||
				alienRect.left > naveRect.right ||
				alienRect.bottom < naveRect.top ||
				alienRect.top > naveRect.bottom
			);
	
			if (collisionNave || alienRect.bottom >= (joc.bottom - 8)) {
				allAliens.remove();
				nave.remove();
				gameOver();

			}
		});
		if (alienRec.right >= joc.right) {
			this.direction = -ALIENSPEED; // Cambiar la dirección a izquierda
		} else if (Math.floor(alienRec.left) <= joc.left + 1) {
			this.direction = ALIENSPEED; // Cambiar la dirección a derecha
		}
		console.log("alien " + alienRec.left);
		console.log("joc " + joc.left);
		let newXPos = Math.floor(this.xPos + 10 * this.direction);
	
		if (this.yPos + this.exercit.getBoundingClientRect().height <= HEIGHT - 5) {
			newYPos = this.yPos + ALIENSPEED;
		}
	
		this.xPos = Math.max(0, Math.min(newXPos, joc.width - this.getAliensWidth()));
		this.yPos = Math.max(0, Math.min(newYPos, joc.height - this.getAliensHeight()));
	
		this.exercit.setAttribute("transform", `translate(${this.xPos} ${this.yPos})`);
		this.exercit.style.transition = "transform 0.1s ease-out";
	}
	
	

	public startMoviment() {
		setInterval(() => {
			this.aliensMoviment();
		}, 100);
	}

	getAliensWidth() {
		return this.aliensWidth;
	}

	getAliensHeight() {
		return this.aliensHeight;
	}
}

