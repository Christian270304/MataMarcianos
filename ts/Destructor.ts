import "https://code.jquery.com/jquery-3.7.1.js";
declare let $: any;
import { directions } from "./interfaces.js";
import { Bala } from "./Bala.js";
import { WIDTH, BALASPEED } from "./config.js";
export class Destructor {
	private xPos: number;	// Posició horitzontal de la nau
	private yPos: number;	// Posició vertical de la nau
	private nauWidth: number;
	private nauHeight: number;
	private nau: SVGPathElement;


	/**
	 * Constructor de la clase Destructor.
	 * 
	 * Inicializa la posición de la nave en el centro de la pantalla y
	 * la situa la altura correspondiente.
	 * 
	 */
	constructor() {
		// Inicializar valores
		this.xPos = 320; // Posición horizontal de la nave
		this.yPos = 460; // Posición vertical de la nave

		this.nau = $("#nau")[0] as unknown as SVGPathElement; // Seleccionar con jQuery y obtener el elemento DOM
		$(this.nau).attr("transform", `translate(${this.xPos} ${this.yPos})`);

		const bbox = this.nau.getBBox();
		this.nauWidth = bbox.width - 18;
		this.nauHeight = bbox.height;
	}


	/**
	 * Mueve la nave en la dirección especificada.
	 * 
	 * El movimiento es relativo, es decir, la nave se mueve 15 píxeles en la dirección
	 * especificada. Si la nave está en el borde de la pantalla, se mantiene en la
	 * posición actual.
	 * 
	 * @param {directions} direction Dirección en la que se va a mover la nave.
	 */
	public moveNau(direction: directions) {
		const newXPos = this.xPos + (direction === directions.RIGHT ? 15 : -15);

		this.xPos = Math.max(0 + this.getNauWidth(), Math.min(newXPos, WIDTH - this.getNauWidth()));

		$(this.nau).attr("transform", `translate(${this.xPos} ${this.yPos})`);
		$(this.nau).css("transition", "transform 0.1s ease-out");
	}



	/**
	 * Lanza una bala desde la nave actual.
	 * La bala sale desde la punta de la nave y se mueve hacia arriba.
	 * Si la bala sale de la pantalla, se elimina.
	 */
	public disparar() {
		const audio = new Audio("sounds/shoot.wav");
		audio.play();

		const bala = new Bala();
		bala.setxPos((this.xPos - this.getNauWidth() / 2) + 5);
		bala.setyPos(this.yPos - this.getNauHeight());

		const $joc = $("#joc"); 

		const balaInterval = setInterval(() => {
			bala.setyPos(bala.getyPos() - BALASPEED);
			if (bala.getyPos() <= 0 + bala.getBalaHeight()) {
				clearInterval(balaInterval);
				$(bala.getBala()).remove(); 
			}
		}, 50);

		// Añadimos la bala al contenedor
		$joc.append(bala.getBala());
	}


	/**
	 * Establece la posición horizontal de la nave en el valor especificado por parámetro.
	 * No permite que la nave se salga de la pantalla.
	 * @param xpos Nueva posición horizontal de la nave.
	 */
	public setxPos(xpos: number) {
		if (xpos < 0 + this.getNauWidth()) return;
		if (xpos > WIDTH - this.getNauWidth()) return;

		this.xPos = xpos;
		$(this.nau).attr("transform", `translate(${this.xPos} ${this.yPos})`);
	}


	getxPos() {
		return this.xPos;
	}

	getyPos() {
		return this.yPos;
	}

	getNauWidth() {
		return this.nauWidth;
	}

	getNauHeight() {
		return this.nauHeight;
	}


}