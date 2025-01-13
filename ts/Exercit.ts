import "https://code.jquery.com/jquery-3.7.1.js";
declare let $: any;
import { ALIENS, COLUMNES, FILES } from "./config.js";
import { Position } from "./interfaces.js";
export class Exercit {
	private xPos: number;	// Posició horitzontal de l'exèrcit d'aliens
	private yPos: number;	// Posició vertical de l'exèrcit d'aliens
	private nAliens: number;	// Nombre total d'aliens
	private exercit: SVGElement;
	constructor() {
		// Inicialitzar valors
		this.xPos = 90;	// Posició horitzontal de l'exèrcit d'aliens
		this.yPos = 40; // Posició vertical de l'exèrcit d'aliens
		this.nAliens = ALIENS;

		// Posicionar l'exèrcit dels aliens
		this.exercit = document.getElementById("aliens") as unknown as SVGGElement;
		this.exercit.setAttribute("transform", "translate(" + this.xPos + " " + this.yPos + ")");

		// Moure l'alien original fora de l'àrea de joc
		document.getElementById("alien")!.setAttribute("transform", "translate(-20 -15)");

		// Crear còpies de l'alien original
		for (let i = 0; i < FILES; i++) {
			for (let j = 0; j < COLUMNES; j++) {
				this.exercit.innerHTML += "<use id='a" + i + j + "' href='#alien' transform='translate(" + (j * 60 + 40) + " " + (i * 40 + 30) + ")'></use>";
			}
		}
	}

	public getAlien(i: number, j: number) {
		return document.getElementById("a" + i + j)!;
	}

	public getAlienPos(i: number, j: number) {
		let transform = this.getAlien(i, j).getAttribute("transform");
		if (transform) {
			let pos = transform.match(/translate\((\d+) (\d+)\)/);
			if (pos) {
				return { x: parseInt(pos[1]), y: parseInt(pos[2]) };
			}
		}
		return null;
	}
}