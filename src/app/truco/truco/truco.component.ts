import { Component, OnInit, ViewChild } from '@angular/core';

import { Carta, JogoTrucoService } from '../shared';

@Component({
  selector: 'app-truco',
  templateUrl: './truco.component.html',
  styleUrls: ['./truco.component.css']
})
export class TrucoComponent implements OnInit {

  readonly urlCartaVirada: string = `/assets/cartas/VIRADA.png`;

  tentosValendo: number = 0;
  tentosJogador: number = 0;
  tentosComputador: number = 0;

  vencedor1Rodada: string = '';
  vencedor2Rodada: string = '';
  vencedor3Rodada: string = '';

  cartasJogador: Carta[];
  cartasComputador: Carta[];

  cartaRodadaJogador: string = '';
  cartaRodadaComputador: string = '';
  cartaVira: string = '';
  jogoIniciado: boolean = false;

  constructor(
    private trucoService: JogoTrucoService
  ) { }

  ngOnInit(): void {
  }

  iniciaJogo(limpo: boolean) {
    if (!this.jogoIniciado) {
      this.trucoService.iniciaJogo(limpo, true);
      this.jogoIniciado = true;
    } else {
      if (confirm('Deseja iniciar um novo jogo ?')) {
        this.trucoService.finalizaRodada();
        this.trucoService.iniciaJogo(limpo, true);
        this.jogoIniciado = true;
      }
    }
    this.atribuiVariaveis();
  }

  //-------------------------------------------------------------------------------------------
  atribuiVariaveis(): void {
    this.tentosValendo = this.trucoService.pontosRodada;
    this.tentosJogador = this.trucoService.tentosUsuario;
    this.tentosComputador = this.trucoService.tentosComputador;

    this.cartasJogador = this.trucoService.aCartasJogador;
    this.cartasComputador = this.trucoService.aCartasComputador;

    this.vencedor1Rodada = this.retornaNomeVencedor(0);
    this.vencedor2Rodada = this.retornaNomeVencedor(1);
    this.vencedor3Rodada = this.retornaNomeVencedor(2);

    this.cartaRodadaJogador = (this.trucoService.cartaJogador) ? this.trucoService.cartaJogador.urlFoto : '';
    this.cartaRodadaComputador = (this.trucoService.cartaComputador) ? this.trucoService.cartaComputador.urlFoto : '';
    this.cartaVira = this.trucoService.cartaVira.urlFoto;
  }

  //-------------------------------------------------------------------------------------------
  retornaNomeVencedor(rodada: number): string {
    let vencedorNome: string = '';
    if (this.trucoService.rodadas && this.trucoService.rodadas[rodada]) {
      if (this.trucoService.rodadas[rodada].empate) {
        vencedorNome = 'EMPATE';
      } else {
        vencedorNome = this.trucoService.rodadas[rodada].primeiraVence ? 'USUARIO' : 'PC';
      }
    }
    return vencedorNome;
  }

  //-------------------------------------------------------------------------------------------
  selecionaCarta(posicaoCarta: number, foiJogador: boolean, simulacao?: boolean): void {
    let carta = null;

    if (foiJogador == !this.trucoService.vezJogador) {
      if (!simulacao) {
        alert("NÃO É SUA VEZ!");
      }
    } else {
      if (foiJogador) {
        carta = this.cartasJogador[posicaoCarta];
      } else {
        carta = this.cartasComputador[posicaoCarta];
      }

      this.trucoService.selecionaCarta(carta, foiJogador);
      this.atribuiVariaveis();
    }

    if (this.trucoService.vezComputador && !simulacao) {
      this.simulaVezPc();
    }
  }

  //-------------------------------------------------------------------------------------------
  execJogada(): void {
    this.trucoService.validaRodadas();
    if (this.trucoService.acabouARodada) {
      this.trucoService.finalizaRodada();
      this.trucoService.iniciaRodada();
    } else {
      this.trucoService.limpaCartas();
    }
    this.simulaVezPc();
    this.atribuiVariaveis();
  }
  
  //-------------------------------------------------------------------------------------------
  pedeTruco(euJogando: boolean): void{
    if(euJogando && this.trucoService.vezJogador){
      
    }
  }

  //-------------------------------------------------------------------------------------------
  simulaVezPc() {
    let segundos = 1 * 1000;

    if (this.trucoService.vezComputador) {
      setTimeout(() => {
        console.log("------------- SIMULANDO A VEZ DO PC -------------");

        /*
        let posicaoCarta = Math.floor(Math.random() * this.cartasComputador.length);
        this.selecionaCarta(posicaoCarta, false, true);
        */
       this.selecionaCarta( this.verificaCarta(), false, true );

        this.trucoService.vezComputador = false;
        this.trucoService.vezJogador = true;
      }, segundos);
    }
  }

  //-------------------------------------------------------------------------------------------
  verificaCarta(): number {

    let posicaoCarta = 0;
    let idCarta = 0;
    let menorValor = 0;

    //console.log(this.trucoService.aCartasComputador);

    if (this.trucoService.cartaJogador) {
      this.trucoService.aCartasComputador.map((carta,posic) => {

        //Se a carta vence a carta do jogador
        if (carta.valor > this.trucoService.cartaJogador.valor) {

          //se a carta é menor que a anterior
          if (carta.valor < menorValor || menorValor == 0) {
            posicaoCarta = posic;
            idCarta = carta.valor;
            menorValor = carta.valor;
          }
        }
      })
    } else {
      this.trucoService.aCartasComputador.map((carta,posic) => {
        if (carta.valor < menorValor || menorValor == 0) {
          posicaoCarta = posic;
          idCarta = carta.valor;
          menorValor = carta.valor;
        }
      })
    }

    return posicaoCarta;
  }


}
