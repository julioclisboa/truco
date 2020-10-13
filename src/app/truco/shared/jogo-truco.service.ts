import { Injectable } from '@angular/core';

import { Carta } from '../shared/carta-model';
import { Rodada } from '../shared/rodada-model';

@Injectable({
  providedIn: 'root'
})
export class JogoTrucoService {

  private readonly nipes = ["O", "E", "C", "P"];
  private readonly sequenciaLimpo = ["Q", "J", "K", "A", "2", "3"];
  private readonly sequenciaSujo = ["4", "5", "6", "7", "Q", "J", "K", "A", "2", "3"];
  private readonly somaTruco = 3;
  private sequencia: any[];

  cartaVira: Carta;
  cartaManilha: string;
  cartaJogador: Carta;
  cartaComputador: Carta;
  cartas: Carta[];

  aCartasJogador: Carta[];
  aCartasComputador: Carta[];
  rodadas: Rodada[] = [];
  rodadaAtual: Rodada;

  jogadorComecou: boolean;
  vezJogador: boolean;
  vezComputador: boolean;
  jogadorGanhouRodada: boolean;
  computadorGanhouRodada: boolean;
  acabouARodada: boolean = false;
  baralhoLimpo: boolean;

  pontosRodada: number = 1;
  tentosUsuario: number = 0;
  tentosComputador: number = 0;

  constructor() {
  }

  //-------------------------------------------------------------------------------------------
  iniciaJogo(baralhoLimpo: boolean, jogadorComecou: boolean): void {
    console.log(">>> INICIO DO JOGO");

    this.baralhoLimpo = baralhoLimpo;
    this.jogadorComecou = jogadorComecou;
    this.vezJogador = jogadorComecou;
    this.vezComputador = !this.vezJogador;
    this.pontosRodada = 1;
    this.tentosComputador = 0;
    this.tentosUsuario = 0;

    this.montaCartas(this.baralhoLimpo);
    this.iniciaRodada();
  }

  //-------------------------------------------------------------------------------------------
  iniciaRodada(): void {
    console.log(">>> INICIO DA RODADA");
    this.montaCartas(this.baralhoLimpo);
    this.geraCartasJogador();
    this.geraCartasComputador();
    this.sorteiaManilha();

    console.log(`> Virou: ${this.cartaVira.carta} de ${NipesBaralho[this.cartaVira.nipe]}`);
  }

  //-------------------------------------------------------------------------------------------
  finalizaRodada(): void {
    console.log(">>> FINAL DA RODADA");

    this.rodadaAtual = null;
    this.rodadas = [];
    this.cartaComputador = null;
    this.cartaJogador = null;
    this.aCartasComputador = [];
    this.aCartasJogador = [];
    this.pontosRodada = 1;
    this.acabouARodada = false;
    this.jogadorGanhouRodada = false;
    this.computadorGanhouRodada = false;

    this.inverteQuemComecouJogo();

    this.cartas.map((carta) => this.marcaComoUsada(carta.idCarta, false));
    this.cartas.map((carta) => this.marcaManilha(carta.idCarta, false));
  }

  //-------------------------------------------------------------------------------------------
  inverteQuemComecouJogo(): void{
    this.jogadorComecou = !this.jogadorComecou;
    this.vezJogador = this.jogadorComecou;
    this.vezComputador = !this.vezJogador;
  }

  //-------------------------------------------------------------------------------------------
  private montaCartas(baralhoLimpo) {
    let sequencial = 0;
    this.sequencia = (baralhoLimpo) ? this.sequenciaLimpo : this.sequenciaSujo;

    this.cartas = [];
    for (let i = 0; i < this.sequencia.length; i++) {
      for (let z = 0; z < this.nipes.length; z++) {
        let valor = i + 10;
        let carta = new Carta(sequencial, this.sequencia[i], this.nipes[z], valor);
        this.cartas.push(carta);
        sequencial++;
      }
    }
  }

  //-------------------------------------------------------------------------------------------
  private geraCartasJogador(): void {
    this.aCartasJogador = [];
    for (let i = 0; i < 3; i++) {
      let minhacarta = this.geraCartaAleatoria();
      this.aCartasJogador.push(minhacarta);
    }
  }

  //-------------------------------------------------------------------------------------------
  private somaPontos(jogadorGanhou: boolean): void {
    if (jogadorGanhou) {
      this.tentosUsuario += this.pontosRodada;
    } else {
      this.tentosComputador += this.pontosRodada;
    }
  }

  //-------------------------------------------------------------------------------------------
  private geraCartasComputador(): void {
    this.aCartasComputador = [];
    for (let i = 0; i < 3; i++) {
      //let minhacarta = this.geraCartaForte();
      let minhacarta = this.geraCartaAleatoria();
      minhacarta.viraAoContrario();
      this.aCartasComputador.push(minhacarta);
    }
  }

  //-------------------------------------------------------------------------------------------
  private geraCartaAleatoria(): Carta {
    let id = this.geraIDNaoUsado();
    let carta = this.cartas.find((carta) => carta.idCarta == id);
    this.marcaComoUsada(carta.idCarta);
    return carta;
  }

  //-------------------------------------------------------------------------------------------
  private sorteiaManilha(): void {
    this.cartaVira = this.geraCartaAleatoria();
    this.marcaComoUsada(this.cartaVira.idCarta);
    this.marcaComoManilha();
  }

  //-------------------------------------------------------------------------------------------
  private marcaComoManilha() {
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
        this.marcaManilha(carta.idCarta, true);
      } else {
        this.marcaManilha(carta.idCarta, false);
      }
    })
  }

  //-------------------------------------------------------------------------------------------
  private marcaManilha(id: number, manilha: boolean = true) {
    this.cartas.map((carta, posicao) => {
      if (carta.idCarta == id) {
        this.cartas[posicao].manilha = manilha;
      }
    })
  }

  //-------------------------------------------------------------------------------------------
  private aumentaValor(id: number) {
    this.cartas.map((carta, posicao) => {
      if (carta.idCarta == id) {
        this.cartas[posicao].valor += 100 + posicao;
      }
    })
  }

  //-------------------------------------------------------------------------------------------
  private marcaComoUsada(id: number, usada: boolean = true) {
    this.cartas.map((carta, posicao) => {
      if (carta.idCarta == id) {
        this.cartas[posicao].emUso = usada;
      }
    })
  }

  //-------------------------------------------------------------------------------------------
  private geraIDNaoUsado(): number {
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

  //-------------------------------------------------------------------------------------------
  selecionaCarta(cartaSelecionada: Carta, usuarioJogando: boolean): void {
    if (usuarioJogando) {
      this.cartaJogador = cartaSelecionada;
      this.aCartasJogador = this.aCartasJogador.filter((carta) => carta.idCarta != cartaSelecionada.idCarta);

      console.log(`MINHA Carta: ${cartaSelecionada.carta} de ${NipesBaralho[cartaSelecionada.nipe]}`);
    } else {
      this.cartaComputador = cartaSelecionada;
      this.cartaComputador.desviraCarta();
      this.aCartasComputador = this.aCartasComputador.filter((carta) => carta.idCarta != cartaSelecionada.idCarta);

      console.log(`PC Carta: ${cartaSelecionada.carta} de ${NipesBaralho[cartaSelecionada.nipe]}`);
    }

    if (this.cartaJogador && this.cartaComputador) {
      this.rodadaAtual = new Rodada(this.cartaJogador, this.cartaComputador);
      this.rodadaAtual.verificaVencedor();
    } else {
      this.mudaAVez();
    }
  }

  //-------------------------------------------------------------------------------------------
  validaRodadas(): void {
    this.rodadas.push(this.rodadaAtual);

    let qtdVitoriasJogador: number = this.rodadas.filter((rodada) => rodada.primeiraVence).length;
    let qtdVitoriasComputador: number = this.rodadas.filter((rodada) => rodada.segundaVence).length;
    let numRodadaAtual: number = this.rodadas.length;

    switch (numRodadaAtual) {

      //----------------------------------------
      // VALIDA A PRIMEIRA RODADA
      //----------------------------------------
      case 1:
        console.log(" > Validando a rodada 1...");
        if (this.rodadaAtual.empate) {
          this.jogadorGanhouRodada = false;
          this.computadorGanhouRodada = false;
          this.acabouARodada = false;
          console.log("Empate! Tera proxima rodada");
          this.mudaAVez();
        } else {
          this.jogadorGanhouRodada = this.rodadaAtual.primeiraVence;
          this.computadorGanhouRodada = !this.jogadorGanhouRodada;
          this.acabouARodada = false;
          (this.jogadorGanhouRodada) ? console.log("== JOGADOR == ganhou") : console.log("== PC == ganhou");
        }
        break;

      //----------------------------------------
      // VALIDA A SEGUNDA RODADA
      //----------------------------------------
      case 2:
        console.log(" > Validando a rodada 2...");
        // SE A PRIMEIRA FOI EMPATE
        if (this.rodadas[0].empate) {

          // SE A SEGUNDA FOI EMPATE
          if (this.rodadaAtual.empate) {
            this.jogadorGanhouRodada = false;
            this.computadorGanhouRodada = false;
            this.acabouARodada = false;

            console.log("2 Empates! Tera proxima rodada");

            // SEGUNDA NAO TEVE EMPATE, SAIU ALGUM VENCEDOR
          } else {
            this.jogadorGanhouRodada = this.rodadaAtual.primeiraVence;
            this.computadorGanhouRodada = !this.jogadorGanhouRodada;
            this.acabouARodada = true;

            (this.jogadorGanhouRodada) ? console.log("== JOGADOR == ganhou") : console.log("== PC == ganhou");
          }

          // PRIMEIRA NAO FOI EMPATE
        } else {

          // SE ALGUEM VENCEU 2 TEM UM VENCEDOR
          if (qtdVitoriasJogador > 1 || qtdVitoriasComputador > 1) {
            this.jogadorGanhouRodada = qtdVitoriasJogador > 1;
            this.computadorGanhouRodada = qtdVitoriasComputador > 1;
            this.acabouARodada = true;

            (this.jogadorGanhouRodada) ? console.log("== JOGADOR == ganhou") : console.log("== PC == ganhou");

            // 1 VITORIA PARA CADA, VAI PARA A PROXIMA RODADA
          } else {
            if (this.rodadaAtual.empate) {
              this.jogadorGanhouRodada = this.rodadas[0].primeiraVence;
              this.computadorGanhouRodada = !this.jogadorGanhouRodada;
              this.acabouARodada = true;

              (this.jogadorGanhouRodada) ? console.log("== JOGADOR == ganhou") : console.log("== PC == ganhou");
            } else {

              this.jogadorGanhouRodada = this.rodadaAtual.primeiraVence;
              this.computadorGanhouRodada = !this.jogadorGanhouRodada;
              this.acabouARodada = false;

              console.log("1 Vitoria para cada! Tera proxima rodada");
            }
          }
        }
        break;

      //----------------------------------------
      // VALIDA A TERCEIRA RODADA
      //----------------------------------------
      case 3:
        console.log(" > Validando a rodada 3...");

        // SE JOGADOR TIVER MAIS VITORIA ELE VENCEU
        if (qtdVitoriasJogador > 1 || qtdVitoriasComputador > 1) {
          this.jogadorGanhouRodada = qtdVitoriasJogador > 1;
          this.computadorGanhouRodada = !this.jogadorGanhouRodada;
          this.acabouARodada = true;

          (this.jogadorGanhouRodada) ? console.log("== JOGADOR == ganhou") : console.log("== PC == ganhou");

          // QUEM FEZ A PRIMEIRA GANHA
        } else {
          this.jogadorGanhouRodada = this.rodadas[0].primeiraVence;
          this.computadorGanhouRodada = !this.jogadorGanhouRodada;
          this.acabouARodada = true;

          console.log("Empate! Quem fez a primeira ganha.");
          (this.jogadorGanhouRodada) ? console.log("== JOGADOR == ganhou") : console.log("== PC == ganhou");
        }

        this.acabouARodada = true;
        break;
      default:
        this.finalizaRodada();
    }

    if(this.computadorGanhouRodada){
      this.vezComputador = true;
      this.vezJogador = false;
    } else {
      if(this.jogadorGanhouRodada){
        this.vezComputador = false;
        this.vezJogador = true;
      }
    }

    if (this.acabouARodada) {
      this.somaPontos(this.jogadorGanhouRodada);
      if(this.tentosComputador >= 12 || this.tentosUsuario >= 12){
        this.finalizaRodada();
        this.iniciaJogo(this.baralhoLimpo,!this.jogadorComecou);
      }
    }

    console.log("");
  }

  //-------------------------------------------------------------------------------------------
  mudaAVez(): void {
    this.vezJogador = !this.vezJogador;
    this.vezComputador = !this.vezComputador;
    //(this.vezComputador) ? console.log("VEZ DO PC") : console.log("VEZ DO JOGADOR");
  }

  //-------------------------------------------------------------------------------------------
  limpaCartas(): void {
    this.cartaJogador = null;
    this.cartaComputador = null;
  }

  //-------------------------------------------------------------------------------------------
  teveGanhador(): boolean {
    let empateRodada: boolean = false;
    let teveGanhador: boolean = false;

    if (this.cartaJogador && this.cartaComputador) {
      if (this.cartaJogador.valor == this.cartaComputador.valor) {
        empateRodada = true;
        this.jogadorGanhouRodada = false;
        this.computadorGanhouRodada = false;
      } else {
        teveGanhador = true;
        this.jogadorGanhouRodada = (this.cartaJogador.valor > this.cartaComputador.valor);
        this.computadorGanhouRodada = !this.jogadorGanhouRodada;
      }
    }

    return teveGanhador;
  }

}


enum NipesBaralho {
  O = "Ouros",
  E = "Espada",
  C = "Copas",
  P = "Paus"
}