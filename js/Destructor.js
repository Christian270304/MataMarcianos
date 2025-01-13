import { directions } from "./interfaces.js";
import { WIDTH, BALASPEED } from "./config.js";
export class Destructor {
    xPos; // Posició horitzontal de la nau
    yPos; // Posició vertical de la nau
    nauWidth;
    nauHeight;
    nau;
    /**
     * Constructor de la clase Destructor.
     *
     * Inicializa la posición de la nave en el centro de la pantalla y
     * la situa la altura correspondiente.
     *
     */
    constructor() {
        // Inicialitzar valors
        this.xPos = 320; // Posició horitzontal de la nau
        this.yPos = 460; // Posició vertical de la nau
        // Moure la nau a la posició inicial
        this.nau = document.getElementById("nau");
        this.nau.setAttribute("transform", "translate(" + this.xPos + " " + this.yPos + ")");
        //obtenir dimensions de la nau
        this.nauWidth = this.nau.getBBox().width - 18;
        this.nauHeight = this.nau.getBBox().height;
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
    moveNau(direction) {
        // Calcula la nueva posición provisionalmente
        const newXPos = this.xPos + (direction === directions.RIGHT ? 15 : -15);
        // Restringe el valor entre 0 y el WIDTH del area de juego
        this.xPos = Math.max(0 + this.getNauWidth(), Math.min(newXPos, WIDTH - this.getNauWidth()));
        // Actualiza la posición transformada de la nave
        this.nau.setAttribute("transform", `translate(${this.xPos} ${this.yPos})`);
        this.nau.style.transition = "transform 0.1s ease-out";
    }
    /**
     * Lanza una bala desde la nave actual.
     * La bala sale desde la punta de la nave y se mueve hacia arriba.
     * Si la bala sale de la pantalla, se elimina.
     */
    disparar(bala) {
        bala.setxPos((this.xPos - this.getNauWidth() / 2) + 5);
        bala.setyPos(this.yPos - this.getNauHeight());
        let balaInterval = setInterval(() => {
            bala.setyPos(bala.getyPos() - BALASPEED);
            if (bala.getyPos() < 0 + bala.getBalaHeight()) {
                clearInterval(balaInterval);
                document.getElementById("joc").removeChild(bala.getBala());
            }
        }, 50);
        document.getElementById("joc").appendChild(bala.getBala());
    }
    /**
     * Establece la posición horizontal de la nave en el valor especificado por parámetro.
     * No permite que la nave se salga de la pantalla.
     * @param xpos Nueva posición horizontal de la nave.
     */
    setxPos(xpos) {
        if (xpos < 0 + this.getNauWidth())
            return;
        if (xpos > 640 - this.getNauWidth())
            return;
        this.xPos = xpos;
        this.nau.setAttribute("transform", "translate(" + this.xPos + " " + this.yPos + ")");
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
//# sourceMappingURL=Destructor.js.map