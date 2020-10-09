import { Carta } from '.';

export class Rodada {

    primeiraVence: boolean;
    segundaVence: boolean;
    empate: boolean;

    private _primeiraCarta: Carta;
    private _segundaCarta: Carta;

    constructor(
        primeiraCarta: Carta,
        segundaCarta: Carta
    ) {
        this._primeiraCarta = primeiraCarta;
        this._segundaCarta = segundaCarta;
    }

    public verificaVencedor(): boolean {
        if (this._primeiraCarta && this._segundaCarta) {
            if (this._primeiraCarta.valor > this._segundaCarta.valor) {
                this.primeiraVence = true;
                this.segundaVence = false;
                this.empate = false;
            } else {
                if (this._segundaCarta.valor > this._primeiraCarta.valor) {
                    this.primeiraVence = false;
                    this.segundaVence = true;
                    this.empate = false;
                } else {
                    this.primeiraVence = false;
                    this.segundaVence = false;
                    this.empate = true;
                }
            }
            return true;
        } else {
            return false;
        }
    }

    /*
    set numRodada(numRodada: number) { this._numRodada = numRodada }
    set empate(empate: boolean) { this._empate = empate }
    set primeiraVence(primeiraVence: boolean) { this.primeiraVence = primeiraVence }
    set segundaVence(segundaVence: boolean) { this.segundaVence = segundaVence }
    set primeiraCarta(primeiraCarta: Carta) { this._primeiraCarta = primeiraCarta }
    set segundaCarta(segundaCarta: Carta) { this._segundaCarta = segundaCarta }
    
    get numRodada() { return this._numRodada }
    get empate() { return this._empate }
    get primeiraVence() { return this.primeiraVence }
    get segundaVence() { return this.segundaVence }
    get primeiraCarta() { return this._primeiraCarta }
    get segundaCarta() { return this._segundaCarta }
   */

}