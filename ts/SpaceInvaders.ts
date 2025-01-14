import "https://code.jquery.com/jquery-3.7.1.js";
declare let $: any;

import { Destructor } from "./Destructor.js";
import { Exercit } from "./Exercit.js";
import { directions } from "./interfaces.js";
import { Bala } from "./Bala.js";
///////////////////////////////////////////////////////////
// Alumnes: Christian Torres y Daniela Gamez
///////////////////////////////////////////////////////////

/**
 * Inicializa el juego Space Invaders creando la nave y el ejército de aliens,
 * y asigna los eventos necesarios para el movimiento de la nave y el disparo de balas.
 */

function init() {
	// Crear la nau i l'exèrcit dels aliens
	let destructor = new Destructor();
	let exercit = new Exercit();


	exercit.startMoviment();
	nauMovement(destructor);
	disparar(destructor);
	alienDestruction();
	setInterval(alienDestruction, 20);


}

/**
 * Asigna los eventos para el movimiento de la nave.
 * 
 * El movimiento de la nave se puede realizar con el ratón o con las teclas 'A' y 'D' o con las flechas izquierda y derecha.
 * 
 * @param destructor Destructor que se va a mover.
 */
function nauMovement(destructor: Destructor) {
	let pressedKeys = new Set<string>();
	let movementInterval: number | null = null;
	$(document)
		.on('mousemove', (e: MouseEvent) => {
			destructor.setxPos(e.clientX);
		})
		.on('keydown', (event: KeyboardEvent) => {
			pressedKeys.add(event.code);

			if (!movementInterval) {
				// Inicia el movimiento continuo si no hay un intervalo en ejecución
				movementInterval = setInterval(() => {
					handleMovement(destructor, pressedKeys);
				}, 30);
			}
		})
		.on('keyup', (event: KeyboardEvent) => {
			pressedKeys.delete(event.code);

			// Detener el movimiento si no hay teclas relevantes presionadas
			if (pressedKeys.size === 0 && movementInterval !== null) {
				clearInterval(movementInterval);
				movementInterval = null;
			}
		});
}

function handleMovement(destructor: Destructor, pressedKeys: Set<string>) {
	const leftPressed = pressedKeys.has('KeyA') || pressedKeys.has('ArrowLeft');
	const rightPressed = pressedKeys.has('KeyD') || pressedKeys.has('ArrowRight');

	// Si ambas teclas están presionadas, no hacer nada
	if (leftPressed && rightPressed) return;

	// Mueve la nave en la dirección correspondiente
	if (leftPressed) {
		destructor.moveNau(directions.LEFT);
	} else if (rightPressed) {
		destructor.moveNau(directions.RIGHT);
	}
}

/**
 * Asigna los eventos para disparar una bala desde la nave.
 * 
 * Al hacer clic en cualquier lugar de la pantalla, presionar la tecla 'Space' o 'Enter', o hacer clic derecho sin presionar la tecla 'Shift',
 * se dispara una bala desde la nave actual, siempre y cuando no haya otra bala en el área de juego.
 * 
 * @param destructor Destructor desde el que se va a disparar la bala.
 */
function disparar(destructor: Destructor) {

	$(document)
		.on('click', () => {
			let b = document.getElementById("bala") as unknown as SVGGElement;
			if (!b) destructor.disparar();
		})
		.on('keydown', (event: KeyboardEvent) => {
			if (event.code === 'Space' || event.code === 'Enter') {
				let b = document.getElementById("bala") as unknown as SVGGElement;
				if (!b) destructor.disparar();
			};
		})
		.on('contextmenu', (event: MouseEvent) => {
			if (!event.shiftKey) {
				// Prevenir el menú contextual si Shift no está presionado
				event.preventDefault();

				// Disparar al hacer clic derecho sin Shift
				const b = document.getElementById("bala") as unknown as SVGGElement;
				if (!b) destructor.disparar();
			}
		});
}

function alienDestruction(): void {
	const bala = document.querySelector<SVGGElement>("#bala"); // Seleccionamos el elemento bala correctamente con tipo
	if (!bala) return;

	$("use[id^='a']").each((i: number, e: SVGAElement) => {
		const alienRect = e.getBoundingClientRect();
		const balaRect = bala.getBoundingClientRect();

		const collision = !(
			balaRect.right < alienRect.left ||
			balaRect.left > alienRect.right ||
			balaRect.bottom < alienRect.top ||
			balaRect.top > alienRect.bottom
		);

		if (collision) {
			e.remove();
			bala.remove();
		}
	});
}

/** estetico */

$(document).ready(function () {
	const generateStars = (count: number, className: string) => {
		for (let i = 0; i < count; i++) {
			const x = Math.random() * 2000; // Random x position
			const y = Math.random() * 2000; // Random y position
			$('body').append(
				$('<div class="stars"></div>')
					.addClass(className)
					.css({ top: `${y}px`, left: `${x}px` })
			);
		}
	};

	// Generate stars: small, medium, and big
	generateStars(700, 'small');
	generateStars(100, 'medium');
	generateStars(50, 'big');
});

init();
