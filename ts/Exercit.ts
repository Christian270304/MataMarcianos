import "https://code.jquery.com/jquery-3.7.1.js";
declare let $: any;
import { ALIENS, COLUMNES, FILES, WIDTH, HEIGHT } from "./config.js";
import { Position } from "./interfaces.js";
export class Exercit {
	private xPos: number;	// Posició horitzontal de l'exèrcit d'aliens
	private yPos: number;	// Posició vertical de l'exèrcit d'aliens
	private aliensWidth: number;
	private aliensHeight: number;
	private nAliens: number;	// Nombre total d'aliens
	private exercit: SVGPathElement;
	private direction: number; // Direcció del moviment (1 = dreta, -1 = esquerra)

	constructor() {
		this.direction = 1; // Inicialitzar la direcció a dreta
		// Inicialitzar valors
		this.xPos = 90;	// Posició horitzontal de l'exèrcit d'aliens
		this.yPos = 40; // Posició vertical de l'exèrcit d'aliens
		this.nAliens = ALIENS;

		// Posicionar l'exèrcit dels aliens
		this.exercit = document.getElementById("aliens") as unknown as SVGPathElement;
		this.exercit.setAttribute("transform", "translate(" + this.xPos + " " + this.yPos + ")");

		this.aliensWidth = this.exercit.getBBox().width;
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
	
	
	public aliensMoviment() {
		let newYPos:number = this.yPos;

		if (this.xPos + this.exercit.getBBox().width >= WIDTH) {
			this.direction = -1; // Canviar la direcció a esquerra
		} else if (this.xPos <= 0) {
			this.direction = 1; // Canviar la direcció a dreta
		}
		
		let newXPos = this.xPos + 20 * this.direction;

		if (this.yPos + this.exercit.getBBox().height <= (HEIGHT)-5) {
			newYPos = this.yPos + 5;
		}

		this.xPos = Math.max(0, Math.min(newXPos, WIDTH - this.getAliensWidth()));
		this.yPos = Math.max(0, Math.min(newYPos, HEIGHT - this.getAliensHeight()));

		this.exercit.setAttribute("transform", `translate(${this.xPos} ${this.yPos})`);
		this.exercit.style.transition = "transform 0.1s ease-out";


		const allAliens = document.getElementById('aliens') as unknown as SVGGElement;
		const nave = document.querySelector<SVGGElement>("#nau"); 
		if (!nave) throw new Error("Nave no encontrada");
		const naveRect = nave.getBoundingClientRect();
		console.log(naveRect);
		$("use[id^='a']").each((i: number, e: SVGAElement) => {
			const alienRect = e.getBoundingClientRect();
			

			const collisionNave = !(
				alienRect.right < naveRect.left ||
				alienRect.left > naveRect.right ||
				alienRect.bottom < naveRect.top ||
				alienRect.top > naveRect.bottom
			);
			

			if (collisionNave || alienRect.bottom >= HEIGHT) {
				allAliens.remove();
				nave.remove();
				gameOver();

			}
		});
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

	getyPos() {
        return this.yPos;
    }

    getxPos() {
        return this.xPos;
    }
}

function gameOver(): void {
	// Crear texto de Game Over
	const textGameOver = document.createElementNS("http://www.w3.org/2000/svg", "text");
	textGameOver.setAttribute("x", "50%");
	textGameOver.setAttribute("y", "50%");
	textGameOver.setAttribute("font-size", "24");
	textGameOver.setAttribute("fill", "red");
	textGameOver.setAttribute("text-anchor", "middle");
	textGameOver.textContent = "GAME OVER";
	document.getElementById("joc")!.appendChild(textGameOver);

	// Reproducir sonido de Game Over
	const audio = new Audio("sounds/gameover.mp3");
	audio.play();

	// Crear botón de Replay
    const replayButton = document.createElement("button");
	const svg = document.querySelector<SVGElement>("svg")!;
    
	const svgRect = svg.getBoundingClientRect();
	replayButton.style.position = "absolute";
	replayButton.style.zIndex = "5";
	replayButton.style.fontSize = "24px";
	replayButton.style.color = "red";
	replayButton.style.transform = "translate(-50%, 30%)";
	replayButton.style.left = `${svgRect.left + svgRect.width / 2}px`;
	replayButton.style.top = `${svgRect.top + svgRect.height / 2}px`;
	replayButton.style.display = "block";
	replayButton.textContent = "Replay";
	replayButton.onclick = () => {
		location.reload();
	};
    document.body.appendChild(replayButton);

}