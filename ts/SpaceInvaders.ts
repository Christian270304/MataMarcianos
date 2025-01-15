import "https://code.jquery.com/jquery-3.7.1.js";
declare let $: any;

import { Destructor } from "./Destructor.js";
import { Exercit } from "./Exercit.js";
import { directions } from "./interfaces.js";
///////////////////////////////////////////////////////////
// Alumnes: Christian Torres y Daniela Gamez
///////////////////////////////////////////////////////////



/**
 * Inicializa el juego Space Invaders creando el botón de "Start" y asignando el
 * evento de click para iniciar el juego.
 * */
function init() {
	const svg = $("svg");
	const svgRect = svg[0].getBoundingClientRect();

	// Crear botón de "Start"
	const playButton = $("<button>")
		.attr("id", "playButton")
		.css({
			position: "absolute",
			zIndex: 5,
			fontSize: "24px",
			color: "black",
			transform: "translate(-50%, 30%)",
			left: `${svgRect.left + svgRect.width / 2}px`,
			top: `${svgRect.top + svgRect.height / 2}px`,
			display: "block"
		})
		.text("Start");

	$("body").append(playButton);

	playButton.on("click", () => {
		playButton.remove();
		// Evitar que se dispare inmediatamente el inicio del juego
		setTimeout(initGame, 100);
	});
}


function initGame() {
	const audio = new Audio("sounds/spaceinvaders.mpeg");
	audio.loop = true;
	audio.play();

	$("#nau").css("display", "block");
	let destructor = new Destructor();
	let exercit = new Exercit();

	win();
	setInterval(win, 20);
	startAliensMovement(exercit);
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
			const joc = $('#joc')[0] as SVGGElement;
			const jocRect = joc.getBoundingClientRect();
			const relativeX = e.clientX - jocRect.left;
			destructor.setxPos(relativeX);
		})
		.on('keydown', (event: KeyboardEvent) => {
			pressedKeys.add(event.code);

			if (!movementInterval) {
				movementInterval = setInterval(() => {
					handleMovement(destructor, pressedKeys);
				}, 30);
			}
		})
		.on('keyup', (event: KeyboardEvent) => {
			pressedKeys.delete(event.code);

			if (pressedKeys.size === 0 && movementInterval !== null) {
				clearInterval(movementInterval);
				movementInterval = null;
			}
		});
}

/**
 * Maneja el movimiento de la nave en función de las teclas presionadas.
 * 
 * Verifica si se ha presionado alguna de las teclas de movimiento (A, D, Flecha izquierda o Flecha derecha)
 * y en caso de que se haya presionado alguna, mueve la nave en esa dirección.
 * Si se han presionado las dos teclas de movimiento, no se hace nada.
 * 
 * @param destructor Destructor que se va a mover.
 * @param pressedKeys Conjunto de teclas presionadas.
 */
function handleMovement(destructor: Destructor, pressedKeys: Set<string>) {
	const leftPressed = pressedKeys.has('KeyA') || pressedKeys.has('ArrowLeft');
	const rightPressed = pressedKeys.has('KeyD') || pressedKeys.has('ArrowRight');

	
	if (leftPressed && rightPressed) return;

	if (leftPressed) {
		destructor.moveNau(directions.LEFT);
	} else if (rightPressed) {
		destructor.moveNau(directions.RIGHT);
	}
}
/**
	 * Comprueba si la bala ha chocado con algún alien y en caso de que así sea, 
	 * elimina la bala y el alien que ha chocado y reproduce el sonido de destrucción del alien.
	 * 
	 */
function alienDestruction(): void {
	const bala = $("#bala")[0] as SVGGElement; // Seleccionamos el elemento bala con jQuery y aseguramos el tipo
	
	if (!bala) return;

	$("use[id^='a']").each((i: number, e: HTMLElement) => {
		const alienRect = e.getBoundingClientRect();
		const balaRect = bala.getBoundingClientRect();

		const collision = !(
			balaRect.right < alienRect.left ||
			balaRect.left > alienRect.right ||
			balaRect.bottom < alienRect.top ||
			balaRect.top > alienRect.bottom
		);
		
		if (collision) {
			
			const audio = new Audio("sounds/invaderkilled.wav");
			audio.play();
			$(e).remove(); // Eliminar el alien usando jQuery
			$(bala).remove(); // Eliminar la bala usando jQuery
		}
	});
}

function win(){
	const allAliens = document.getElementById('aliens') as unknown as SVGGElement;
	const nave = document.querySelector<SVGGElement>("#nau") as unknown as SVGGElement;
	if (allAliens.children.length === 0) {
		// Crear texto de Win
		const textGameOver = $(document.createElementNS("http://www.w3.org/2000/svg", "text"))
		.attr({x: "50%",y: "50%","font-size": "24",fill: "red","text-anchor": "middle"})
		.text("WIN");

		$("#joc").append(textGameOver);
		// Crear botón de Replay
		const svg = $("svg");
		const svgRect = svg[0].getBoundingClientRect();

		const replayButton = $("<button>")
			.css({
				position: "absolute",
				zIndex: 5,
				fontSize: "24px",
				color: "white",
				transform: "translate(-50%, 30%)",
				left: `${svgRect.left + svgRect.width / 2}px`,
				top: `${svgRect.top + svgRect.height / 2}px`,
				display: "block"
			})
			.text("Replay")
			.on("click", () => {
				location.reload();
			});

		$("body").append(replayButton);
		// Eliminar la nave
		nave.remove();
		}
}

/**
 * Inicia el movimiento continuo de los aliens.
 *
 * Utiliza un intervalo para mover el ejército de aliens
 * continuamente en la dirección actual determinada por el objeto Exercit.
 *
 * @param aliens Instancia de Exercit que representa el ejército de aliens.
 */

function startAliensMovement(aliens: Exercit) {
	setInterval(() => {
		aliens.aliensMoviment();
	}, 100);
}

/**
 * Asigna los eventos para disparar una bala desde la nave.
 * 
 * La bala se dispara cuando se hace clic, se presiona la barra espaciadora
 * o la tecla Enter. También se puede disparar haciendo clic derecho 
 * cuando la tecla Shift no está presionada.
 * 
 * @param destructor Instancia de Destructor que lanza las balas.
 */

function disparar(destructor: Destructor) {
	$(document)
		.on('click', () => {
			let b = document.getElementById("bala") as unknown as SVGGElement;
			const aliens = document.getElementById("aliens") as unknown as SVGGElement;
			const nave = document.getElementById("nau") as unknown as SVGGElement;
			if (!b && aliens && nave) destructor.disparar();
		
		})
		.on('keydown', (event: KeyboardEvent) => {
			if (event.code === 'Space' || event.code === 'Enter') {
				let b = document.getElementById("bala") as unknown as SVGGElement;
				const aliens = document.getElementById("aliens") as unknown as SVGGElement;
				const nave = document.getElementById("nau") as unknown as SVGGElement;

				if (!b && aliens && nave) destructor.disparar();
			};
		})
		.on('contextmenu', (event: MouseEvent) => {
			if (!event.shiftKey) {
				// Prevenir el menú contextual si Shift no está presionado
				event.preventDefault();

				// Disparar al hacer clic derecho sin Shift
				const b = document.getElementById("bala") as unknown as SVGGElement;
				const aliens = document.getElementById("aliens") as unknown as SVGGElement;
				const nave = document.getElementById("nau") as unknown as SVGGElement;

				if (!b && aliens && nave) destructor.disparar();
			}
		});
}




/**
 * Finaliza el juego mostrando un mensaje de "GAME OVER" en el centro de la pantalla y
 * reproduciendo un sonido asociado. También genera un botón de "Replay" que permite
 * reiniciar el juego al hacer clic.
 */

export function gameOver(): void {
	// Crear texto de Game Over
	const textGameOver = $(document.createElementNS("http://www.w3.org/2000/svg", "text"))
		.attr({
			x: "50%",
			y: "50%",
			"font-size": "24",
			fill: "red",
			"text-anchor": "middle"
		})
		.text("GAME OVER");

	$("#joc").append(textGameOver);

	// Reproducir sonido de Game Over
	const audio = new Audio("sounds/gameover.wav");
	audio.play();

	// Crear botón de Replay
	const svg = $("svg");
	const svgRect = svg[0].getBoundingClientRect();

	const replayButton = $("<button>")
		.css({
			position: "absolute",
			zIndex: 5,
			fontSize: "24px",
			color: "black",
			transform: "translate(-50%, 30%)",
			left: `${svgRect.left + svgRect.width / 2}px`,
			top: `${svgRect.top + svgRect.height / 2}px`,
			display: "block"
		})
		.text("Replay")
		.on("click", () => {
			location.reload();
		});

	$("body").append(replayButton);
}


/** estetico */

$(document).ready(function () {
/**
 * Genera "estrellas" en el fondo de la pantalla
 * 
 * @param {number} count Número de estrellas que se van a generar
 * @param {string} className Clase CSS para el elemento <div> que representará a la estrella
 */
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
