export class Destructor {
	private xPos: number;	// Posició horitzontal de la nau
	private yPos: number;	// Posició vertical de la nau
	private nau: SVGElement;

	constructor() {
		// Inicialitzar valors
		this.xPos = 320; // Posició horitzontal de la nau
		this.yPos = 460; // Posició vertical de la nau

		// Moure la nau a la posició inicial
		this.nau = document.getElementById("nau") as unknown as SVGElement;
		this.nau.setAttribute("transform", "translate(" + this.xPos + " " + this.yPos + ")");
	}
}