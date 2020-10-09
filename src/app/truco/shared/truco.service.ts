import { Injectable } from '@angular/core';

import { Carta } from '../shared/carta-model';
import { Rodada } from '../shared/rodada-model';

@Injectable({
  providedIn: 'root'
})
export class TrucoService {

  private readonly nipes = ["O", "E", "C", "P"];
  private readonly sequenciaLimpo = ["Q", "J", "K", "A", "2", "3"];
  private readonly sequenciaSujo = ["4", "5", "6", "7", "Q", "J", "K", "A", "2", "3"];
  private readonly somaTruco = 3;

  private cartas: Carta[] = [];
  private sequencia: any[];

  cartaVira: Carta;
  minhasCartas: Carta[];
  cartasComputador: Carta[];
  minhaCarta: Carta;
  cartaAdversario: Carta;

  rodadasTruco: Rodada[];

  empate: boolean;
  minhaVez: boolean = true;
  finalDaRodada: boolean;
  euComecei: boolean = false;

  cartaManilha: string;

  rodada: number = 1;
  meusPontos: number = 0;
  pontosComputador: number = 0;
  tentosValendo: number = 1;

  constructor() { }

  iniciaJogo(limpo: boolean): void {

    console.log('---------------------------------------');
    console.log(">>> INICIA JOGO");
    this.cartas = [];
    this.minhasCartas = [];
    this.cartasComputador = [];
    this.rodadasTruco = [];
    this.sequencia = (limpo) ? this.sequenciaLimpo : this.sequenciaSujo;
    this.cartaManilha = '';
    this.empate = false;
    this.finalDaRodada = false;
    this.minhaCarta = null;
    this.cartaAdversario = null;
    this.euComecei = !this.euComecei;
    this.minhaVez = this.euComecei;
    this.montaCartas();
    this.sorteiaIDManilha();

    this.geraCartasPC();
    this.geraMinhasCartas();
    //console.log("Cartas", this.cartas);

    (this.minhaVez) ? console.log(" EU jogo!") : console.log("PC joga!");
  }

  //----------------------------------------------
  montaCartas() {
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

  //----------------------------------------------
  mudaAVez() {
    //(this.minhaVez) ? console.log("Muda para vez do PC") : console.log("Muda para vez do USUARIO");
    this.minhaVez = !this.minhaVez;
  }

  //----------------------------------------------
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

  //----------------------------------------------
  sorteiaIDManilha(): void {
    this.cartaVira = this.geraCartaAleatoria();
    this.marcaComoUsada(this.cartaVira.idCarta);
    this.marcaComoManilha();
    //console.log(`Vira é a carta ${this.cartaVira.carta} de ${NipesBaralho[this.cartaVira.nipe]}`);
  }

  //----------------------------------------------
  tenhoManilha(cartas: Carta[]): boolean {
    return cartas.filter(carta => carta.isManilha).length > 0;;
  }

  //----------------------------------------------
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

  //----------------------------------------------
  marcaComoUsada(id: number) {
    this.cartas.map((carta, posicao) => {
      if (carta.idCarta == id) {
        this.cartas[posicao].isUsed();
      }
    })
  }

  //----------------------------------------------
  marcaManilha(id: number) {
    this.cartas.map((carta, posicao) => {
      if (carta.idCarta == id) {
        this.cartas[posicao].isManilha();
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

  //----------------------------------------------
  geraMinhasCartas(): void {
    for (let i = 0; i < 3; i++) {
      let minhacarta = this.geraCartaAleatoria();
      this.minhasCartas.push(minhacarta);
    }
  }

  //----------------------------------------------
  geraCartasPC(): void {
    for (let i = 0; i < 3; i++) {

      //DESCOMENTAR let minhacarta = this.geraCartaAleatoria();
      //DESCOMENTAR minhacarta.viraAoContrario();
      let minhacarta = this.geraCartaForte();

      this.cartasComputador.push(minhacarta);
    }
  }

  //----------------------------------------------
  geraCartaForte() {
    let cartasFil = this.cartas.filter((carta) => (carta.manilha && !carta.emUso));
    let tamanho = cartasFil.length;
    let cartaForte = cartasFil[tamanho - 1]

    this.marcaComoUsada(cartaForte.idCarta);
    //console.log("Carta Forte",cartaForte);

    return cartaForte;
  }

  //----------------------------------------------
  geraCartaAleatoria(): Carta {
    let id = this.geraIDNaoUsado();
    let carta = this.cartas.find((carta) => carta.idCarta == id);
    this.marcaComoUsada(carta.idCarta);
    return carta;
  }

  //-----------------------------------------------------------
  selecionaCarta(posicao: number) {
    let cartaSelecionada;
    let rodada: Rodada;
    let mensagemCarta: string = '';

    if (this.minhaVez) {
      //console.log("USUARIO joga");
      cartaSelecionada = this.minhasCartas[posicao];
      this.minhasCartas = this.minhasCartas.filter((carta) => carta.idCarta != cartaSelecionada.idCarta);
      this.minhaCarta = cartaSelecionada;
    } else {
      //console.log("COMPUTADOR joga");
      cartaSelecionada = this.cartasComputador[posicao];
      this.cartasComputador = this.cartasComputador.filter((carta) => carta.idCarta != cartaSelecionada.idCarta);
      this.cartaAdversario = cartaSelecionada;
      if (this.cartaAdversario) {
        this.cartaAdversario.desviraCarta();
      }
    }

    //console.log("Carta Jogada", cartaSelecionada);
    if (cartaSelecionada) {
      if (this.minhaVez) {
        mensagemCarta = `MINHA Carta: ${cartaSelecionada.carta} de ${NipesBaralho[cartaSelecionada.nipe]}`
      } else {
        mensagemCarta = `PC Carta: ${cartaSelecionada.carta} de ${NipesBaralho[cartaSelecionada.nipe]}`
      }
      //(cartaSelecionada.manilha) ? console.log(">> MANILHA: " + mensagemCarta) : console.log(mensagemCarta);
      console.log(mensagemCarta);
    }

    if (this.minhaCarta && this.cartaAdversario) {
      this.rodada++;
      rodada = new Rodada(this.rodada, this.minhaCarta, this.cartaAdversario);
      this.rodadasTruco.push(rodada);

      if (rodada.verificaVencedor()) {
        if (rodada.empate) {
          console.log("EMPATE");
          this.mudaAVez();
        } else {
          this.minhaVez = rodada.primeiraVence;
          (rodada.primeiraVence) ? console.log('== EU == venci') : console.log('== PC == venceu');
        }
        console.log('');
      } else {
        console.log("Sem vencedor");
      }
    } else {
      this.mudaAVez();
    }
  }

  //-----------------------------------------------------------
  limpaARodada() {
    this.minhaCarta = null;
    this.cartaAdversario = null;
    this.validaAsRodadas();
  }

  //-----------------------------------------------------------
  validaAsRodadas(): void {
    let qtdVitoriasEu = 0;
    let qtdVitoriasPC = 0;
    let minhaVitoria: boolean = false;
    let minhaDerrota: boolean = false;
    let teveEmpate: boolean = false;

    if (this.rodadasTruco.length > 1 && !this.finalDaRodada) {
      console.log("Inicio validação da rodada: " + this.rodadasTruco.length);

      teveEmpate = this.rodadasTruco.filter((rodada) => rodada.empate).length > 0;
      qtdVitoriasEu = this.rodadasTruco.filter((rodada) => rodada.primeiraVence).length;
      qtdVitoriasPC = this.rodadasTruco.filter((rodada) => rodada.segundaVence).length;

      console.log("Venci", qtdVitoriasEu);
      console.log("Perdi", qtdVitoriasPC);

      if (teveEmpate) {
        console.log("Teve empate");
        if (this.rodadasTruco.length == 3) {
          minhaVitoria = qtdVitoriasEu == 2 || this.rodadasTruco[0].primeiraVence;
          minhaDerrota = !minhaVitoria;
        } else {
          minhaVitoria = this.rodadasTruco[0].primeiraVence;
          minhaDerrota = !minhaVitoria;
        }
        //console.log(this.rodadasTruco);
        console.log("Minha Vitoria?", minhaVitoria);
      } else {
        if (qtdVitoriasEu == 2 || qtdVitoriasPC == 2) {
          minhaVitoria = qtdVitoriasEu == 2;
          minhaDerrota = !minhaVitoria;
          console.log("Minha Vitoria?", minhaVitoria);
        }
      }

      if (minhaVitoria || minhaDerrota) {
        this.finalizaARodada(minhaVitoria);
      }
    }
  }

  //----------------------------------------------
  finalizaARodada(minhaVitoria: boolean): void {
    this.finalDaRodada = true;
    this.somaPontos(minhaVitoria);
    console.log(">>> FINAL DO JOGO");
    console.log('---------------------------------------');
    this.minhaVez = !this.euComecei;
  }

  //----------------------------------------------
  somaPontos(venci: boolean) {
    if (venci) {
      console.log("Soma tento para MIM");
      this.meusPontos += this.tentosValendo;
    } else {
      console.log("Soma tento para PC");
      this.pontosComputador += this.tentosValendo
    }
    this.tentosValendo = 1;
  }

}

enum NipesBaralho {
  O = "Ouros",
  E = "Espada",
  C = "Copas",
  P = "Paus"
}