import { Injectable } from '@angular/core';

import { Carta } from './Carta';

@Injectable({
  providedIn: 'root'
})
export class TrucoService {

  private readonly nipes = ["O", "E", "C", "P"];
  private readonly sequenciaLimpo = ["Q", "J", "K", "A", "2", "3"];
  private readonly sequenciaSujo = ["4", "5", "6", "7", "Q", "J", "K", "A", "2", "3"];

  cartaVira: Carta;
  cartaManilha: string;
  minhasCartas: Carta[];
  cartasComputador: Carta[];

  carta1Img: string = '';
  carta2Img: string = '';
  carta1: Carta;
  carta2: Carta;

  carta1Vence: boolean;
  carta2Vence: boolean;
  empate: boolean;

  rodada: number = 1;
  rodada1: boolean;
  rodada2: boolean;
  rodada3: boolean;

  private cartas: Carta[] = [];
  private sequencia: any[];
  private baralhoLimpo: boolean;
  private quantCartas: number;

  meusPontos: number = 0;
  pontosComputador: number = 0;
  tentosValendo: number = 1;

  constructor() { }

  iniciaJogo(limpo: boolean): void {
    this.cartas = [];
    this.minhasCartas = [];
    this.cartasComputador = [];
    this.baralhoLimpo = limpo;
    this.sequencia = (limpo) ? this.sequenciaLimpo : this.sequenciaSujo;
    this.cartaManilha = '';
    this.carta1Vence = false;
    this.carta2Vence = false;
    this.empate = false;
    this.rodada1 = false;
    this.rodada2 = false;
    this.rodada3 = false;
    this.montaCartas();
    this.sorteiaIDManilha();

    this.geraMinhasCartas();
    this.geraCartasPC();

    //console.log("Cartas",this.cartas);
  }

  montaCartas() {
    this.quantCartas = (this.baralhoLimpo) ? this.nipes.length * 6 : this.nipes.length * 10;
    let sequencial = 0;

    for (let i = 0; i < this.sequencia.length; i++) {
      for (let z = 0; z < this.nipes.length; z++) {
        let valor = i + 10;
        let carta = new Carta(sequencial, this.sequencia[i], this.nipes[z], valor);
        this.cartas.push(carta);
        sequencial++;
      }
    }
  }

  marcaComoManilha() {
    let sequencial = 0;
    for (let i = 0; i < this.sequencia.length; i++) {
      sequencial++;
      if (this.sequencia[i] == this.cartaVira.carta) {
        this.cartaManilha = (sequencial == this.sequencia.length) ? this.sequencia[0] : this.sequencia[sequencial];
      }
    }
    sequencial = 0;
    this.cartas.map((carta) => {
      if (carta.carta == this.cartaManilha) {
        this.aumentaValor(carta.idCarta);
        this.marcaManilha(carta.idCarta);
      }
    })
  }

  sorteiaIDManilha(): void {
    this.cartaVira = this.geraCartaAleatoria();
    this.marcaComoUsada(this.cartaVira.idCarta);
    this.marcaComoManilha();
  }

  geraIDNaoUsado(): number {
    let id = 0;
    let continua = true;

    while (continua) {
      id = Math.floor(Math.random() * this.cartas.length);
      let carta = this.cartas.find((carta) => carta.idCarta == id);
      if (!carta.emUso) {
        continua = false;
      }
    }

    return id;
  }

  marcaComoUsada(id: number) {
    this.cartas.map((carta, posicao) => {
      if (carta.idCarta == id) {
        this.cartas[posicao].emUso = true;
      }
    })
  }

  //----------------------------------------------
  marcaManilha(id: number) {
    this.cartas.map((carta, posicao) => {
      if (carta.idCarta == id) {
        this.cartas[posicao].manilha = true;
      }
    })
  }

  //----------------------------------------------
  aumentaValor(id: number) {
    this.cartas.map((carta, posicao) => {
      if (carta.idCarta == id) {
        this.cartas[posicao].valor += 100 + posicao;
      }
    })
  }

  geraMinhasCartas(): void {
    for (let i = 0; i < 3; i++) {
      let minhacarta = this.geraCartaAleatoria();
      this.minhasCartas.push(minhacarta);
    }
  }

  geraCartasPC(): void {
    for (let i = 0; i < 3; i++) {
      let minhacarta = this.geraCartaAleatoria();
      this.cartasComputador.push(minhacarta);
    }
  }

  geraCartaAleatoria(): Carta {
    let id = this.geraIDNaoUsado();
    let carta = this.cartas.find((carta) => carta.idCarta == id);
    this.marcaComoUsada(carta.idCarta);
    return carta;
  }

  verificaGanhador(carta1: Carta, carta2: Carta): void {

    let temVencedor = false;

    if (carta1 && carta2) {
      if (carta1.valor > carta2.valor) {
        console.log("Carta 1 Ganhou!");
        this.carta1Vence = true;
        this.carta2Vence = false;
        this.empate = false;
        temVencedor = true;
      } else if (carta1.valor == carta2.valor) {
        console.log("Empate");
        this.carta1Vence = false;
        this.carta2Vence = false;
        this.empate = true;
      } else {
        console.log("Carta 2 Ganhou!");
        this.carta1Vence = false;
        this.carta2Vence = true;
        this.empate = false;
        temVencedor = true;
      }
    }
  }

}
