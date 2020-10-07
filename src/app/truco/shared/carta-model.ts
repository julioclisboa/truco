export class Carta {

    manilha: boolean = false;
    emUso: boolean = false;
    virada: boolean = false;
    idCarta: number = 0;
    carta: string = '';
    nipe: string = '';
    valor: number = 0;
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
        this.virada = false;
    }

    isManilha(): void{
        this.manilha = true;
    }

    isUsed(): void {
        this.emUso = true;
    }

    viraAoContrario(): void{
        this.virada = true;
        this.urlFoto = `/assets/cartas/VIRADA.png`;
    }

    desviraCarta(): void{
        this.virada = false;
        this.urlFoto = `/assets/cartas/${this.imagem}.png`;
    }
}