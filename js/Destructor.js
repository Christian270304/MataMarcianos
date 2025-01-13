import { directions } from "./interfaces.js";
import { Bala } from "./Bala.js";
import { WIDTH } from "./config.js";
export class Destructor {
    xPos; // Posició horitzontal de la nau
    yPos; // Posició vertical de la nau
    nauWidth;
    nauHeight;
    nau;
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
    moveNau(direction) {
        // Calcula la nueva posición provisionalmente
        const newXPos = this.xPos + (direction === directions.RIGHT ? 30 : -30);
        // Restringe el valor entre 0 y el WIDTH del area de juego
        this.xPos = Math.max(0 + this.getNauWidth(), Math.min(newXPos, WIDTH - this.getNauWidth()));
        // Actualiza la posición transformada de la nave
        this.nau.setAttribute("transform", `translate(${this.xPos} ${this.yPos})`);
    }
    disparar() {
        let bala = new Bala();
        bala.setxPos((this.xPos - this.getNauWidth() / 2) + 5);
        bala.setyPos(this.yPos - this.getNauHeight());
        let balaInterval = setInterval(() => {
            bala.setyPos(bala.getyPos() - 10);
            if (bala.getyPos() < 0 + bala.getBalaHeight()) {
                clearInterval(balaInterval);
                document.getElementById("joc").removeChild(bala.getBala());
            }
        }, 100);
        document.getElementById("joc").appendChild(bala.getBala());
    }
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