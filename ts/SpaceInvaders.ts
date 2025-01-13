import "https://code.jquery.com/jquery-3.7.1.js";
declare let $: any;

import { Destructor } from "./Destructor.js";
import { Exercit } from "./Exercit.js";
import { directions } from "./interfaces.js";
///////////////////////////////////////////////////////////
// Alumnes: Christian Torres y Daniela Gamez
///////////////////////////////////////////////////////////

function init() {
	// Crear la nau i l'exèrcit dels aliens
	let destructor = new Destructor();
	let exercit = new Exercit();

	nauMovement(destructor);
	disparar(destructor);
	
}

function nauMovement(destructor:Destructor) {
	$(document)
	.on('mousemove',(e:MouseEvent)=>{
		destructor.setxPos(e.clientX);
	})
	.on('keydown', (event:KeyboardEvent) =>{
		if (event.code === 'KeyA' || event.code === 'ArrowLeft') destructor.moveNau(directions.LEFT);
		if (event.code === 'KeyD' || event.code === 'ArrowRight') destructor.moveNau(directions.RIGHT);
	});
}

function disparar(destructor:Destructor) {
	
	$(document)
	.on('click', () => {
		let bala = document.getElementById("bala") as unknown as SVGGElement;
		if (!bala) destructor.disparar();
	})
	.on('keydown', (event:KeyboardEvent) => {
		if (event.code === 'Space' || event.code === 'Enter') {
			let bala = document.getElementById("bala") as unknown as SVGGElement;
			if (!bala) destructor.disparar()
		};
	})
	.on('contextmenu', (event: MouseEvent) => {
		if (!event.shiftKey) {
			// Prevenir el menú contextual si Shift no está presionado
			event.preventDefault();

			// Disparar al hacer clic derecho sin Shift
			const bala = document.getElementById("bala") as unknown as SVGGElement;
			if (!bala) destructor.disparar();
		}
	});
}

init();
