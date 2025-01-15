import "https://code.jquery.com/jquery-3.7.1.js";
import { COLUMNES, FILES, WIDTH, HEIGHT, ALIENSPEED } from "./config.js";
import { gameOver } from "./SpaceInvaders.js";
export class Exercit {
    xPos; // Posició horitzontal de l'exèrcit d'aliens
    yPos; // Posició vertical de l'exèrcit d'aliens
    aliensWidth;
    aliensHeight;
    exercit;
    direction; // Direcció del moviment (1 = dreta, -1 = esquerra)
    constructor() {
        // Inicialitzar valors
        this.direction = 1; // Inicialitzar la direcció a dreta
        this.xPos = 90; // Posició horitzontal de l'exèrcit d'aliens
        this.yPos = 40; // Posició vertical de l'exèrcit d'aliens
        // Posicionar l'exèrcit dels aliens
        this.exercit = document.getElementById("aliens");
        this.exercit.setAttribute("transform", "translate(" + this.xPos + " " + this.yPos + ")");
        this.aliensWidth = this.exercit.getBoundingClientRect().width;
        this.aliensHeight = this.exercit.getBBox().height;
        // Moure l'alien original fora de l'àrea de joc
        document.getElementById("alien").setAttribute("transform", "translate(-20 -15)");
        // Crear còpies de l'alien original
        for (let i = 0; i < FILES; i++) {
            for (let j = 0; j < COLUMNES; j++) {
                this.exercit.innerHTML += "<use id='a" + i + j + "' href='#alien' transform='translate(" + (j * 60 + 40) + " " + (i * 40 + 30) + ")'></use>";
            }
        }
    }
    aliensMoviment() {
        let newYPos = this.yPos;
        const joc = document.getElementById('joc').getBoundingClientRect();
        const allAliens = document.getElementById('aliens');
        const nave = document.querySelector("#nau");
        if (!nave)
            return;
        const naveRect = nave.getBoundingClientRect();
        const aliensRec = allAliens.getBoundingClientRect();
        $("use[id^='a']").each((i, e) => {
            const alienRect = e.getBoundingClientRect();
            const collisionNave = !(alienRect.right < naveRect.left ||
                alienRect.left > naveRect.right ||
                alienRect.bottom < naveRect.top ||
                alienRect.top > naveRect.bottom);
            if (collisionNave || alienRect.bottom >= HEIGHT + 7) {
                allAliens.remove();
                nave.remove();
                gameOver();
            }
        });
        if (aliensRec.right >= joc.right) {
            this.direction = -ALIENSPEED; // Cambiar la dirección a izquierda
        }
        else if (Math.floor(aliensRec.left) <= joc.left + 1) {
            this.direction = ALIENSPEED; // Cambiar la dirección a derecha
        }
        let newXPos = this.xPos + 10 * this.direction;
        if (this.yPos + this.exercit.getBBox().height <= HEIGHT) {
            newYPos = this.yPos + 1;
        }
        this.xPos = newXPos, WIDTH - this.getAliensWidth() - 50;
        this.yPos = newYPos, HEIGHT - this.getAliensHeight();
        this.exercit.setAttribute("transform", `translate(${this.xPos} ${this.yPos})`);
    }
    startMoviment() {
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
}
//# sourceMappingURL=Exercit.js.map