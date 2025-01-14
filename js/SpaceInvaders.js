import "https://code.jquery.com/jquery-3.7.1.js";
import { Destructor } from "./Destructor.js";
import { Exercit } from "./Exercit.js";
import { directions } from "./interfaces.js";
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
function nauMovement(destructor) {
    let pressedKeys = new Set();
    let movementInterval = null;
    $(document)
        .on('mousemove', (e) => {
        destructor.setxPos(e.clientX);
    })
        .on('keydown', (event) => {
        pressedKeys.add(event.code);
        if (!movementInterval) {
            // Inicia el movimiento continuo si no hay un intervalo en ejecución
            movementInterval = setInterval(() => {
                handleMovement(destructor, pressedKeys);
            }, 30);
        }
    })
        .on('keyup', (event) => {
        pressedKeys.delete(event.code);
        // Detener el movimiento si no hay teclas relevantes presionadas
        if (pressedKeys.size === 0 && movementInterval !== null) {
            clearInterval(movementInterval);
            movementInterval = null;
        }
    });
}
function handleMovement(destructor, pressedKeys) {
    const leftPressed = pressedKeys.has('KeyA') || pressedKeys.has('ArrowLeft');
    const rightPressed = pressedKeys.has('KeyD') || pressedKeys.has('ArrowRight');
    // Si ambas teclas están presionadas, no hacer nada
    if (leftPressed && rightPressed)
        return;
    // Mueve la nave en la dirección correspondiente
    if (leftPressed) {
        destructor.moveNau(directions.LEFT);
    }
    else if (rightPressed) {
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
function disparar(destructor) {
    $(document)
        .on('click', () => {
        let b = document.getElementById("bala");
        if (!b)
            destructor.disparar();
    })
        .on('keydown', (event) => {
        if (event.code === 'Space' || event.code === 'Enter') {
            let b = document.getElementById("bala");
            if (!b)
                destructor.disparar();
        }
        ;
    })
        .on('contextmenu', (event) => {
        if (!event.shiftKey) {
            // Prevenir el menú contextual si Shift no está presionado
            event.preventDefault();
            // Disparar al hacer clic derecho sin Shift
            const b = document.getElementById("bala");
            if (!b)
                destructor.disparar();
        }
    });
}
function alienDestruction() {
    const bala = document.querySelector("#bala");
    if (!bala)
        return;
    $("use[id^='a']").each((i, e) => {
        const alienRect = e.getBoundingClientRect();
        const balaRect = bala.getBoundingClientRect();
        const collision = !(balaRect.right < alienRect.left ||
            balaRect.left > alienRect.right ||
            balaRect.bottom < alienRect.top ||
            balaRect.top > alienRect.bottom);
        if (collision) {
            e.remove();
            bala.remove();
        }
    });
}
init();
//# sourceMappingURL=SpaceInvaders.js.map