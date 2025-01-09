export class Destructor {
    xPos; // Posició horitzontal de la nau
    yPos; // Posició vertical de la nau
    nau;
    constructor() {
        // Inicialitzar valors
        this.xPos = 320; // Posició horitzontal de la nau
        this.yPos = 460; // Posició vertical de la nau
        // Moure la nau a la posició inicial
        this.nau = document.getElementById("nau");
        this.nau.setAttribute("transform", "translate(" + this.xPos + " " + this.yPos + ")");
    }
}
//# sourceMappingURL=Destructor.js.map