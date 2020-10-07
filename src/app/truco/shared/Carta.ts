export class Carta {

    manilha: boolean = false;
    emUso: boolean = false;
    idCarta: number = 0;
    carta: string = '';
    nipe: string = '';
    valor: number = 0;
    vira: boolean = false;
    imagem: string = '';
    urlFoto: string = '';

    constructor(
        id?: number,carta?: string, nipe?: string, valor?: number
    ) {
        this.carta = carta;
        this.nipe = nipe;
        this.valor = valor,
        this.idCarta = id;
        this.imagem = `${nipe}_${carta}`;
        this.urlFoto = `/assets/cartas/${this.imagem}.png`;
    }
}