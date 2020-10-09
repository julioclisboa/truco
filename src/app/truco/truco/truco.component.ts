import { Component, OnInit, ViewChild } from '@angular/core';

import { NgForm } from '@angular/forms';

import { Carta, TrucoService, Rodada } from '../shared';

@Component({
  selector: 'app-truco',
  templateUrl: './truco.component.html',
  styleUrls: ['./truco.component.css']
})
export class TrucoComponent implements OnInit {

  readonly urlCartaVirada: string = `/assets/cartas/VIRADA.png`;
  urlImagem: string;
  cartaVira: Carta;
  minhasCartas: Carta[] = [];
  cartasComputador: Carta[];

  carta1Img: string = '';
  carta2Img: string = '';
  carta1: Carta;
  carta2: Carta;

  meusPontos: number = 0;
  pcPontos: number = 0;
  tentosValendo: number = 1;

  primeiraRodada: string = '';
  segundaRodada: string = '';
  terceiraRodada: string = '';
  rodadasJogo: Rodada[];

  constructor(
    private trucoService: TrucoService
  ) { }

  ngOnInit(): void {
  }

  iniciaJogo(limpo: boolean) {
    this.trucoService.iniciaJogo(limpo);
    this.cartaVira = this.trucoService.cartaVira;
    this.urlImagem = `/assets/cartas/${this.cartaVira.imagem}.png`;
    this.minhasCartas = this.trucoService.minhasCartas;
    this.cartasComputador = this.trucoService.cartasComputador;
  }

  limpaARodada(): void {
    this.trucoService.limpaARodada();
    if (this.trucoService.finalDaRodada) {
      this.trucoService.iniciaJogo(true);
    }
    this.ajustaMesa();
    this.simulaPCJogando(false);
  }

  ajustaMesa(): void {
    this.carta1 = this.trucoService.minhaCarta;
    this.carta2 = this.trucoService.cartaAdversario;
    this.carta1Img = (this.carta1) ? this.carta1.urlFoto : '';
    this.carta2Img = (this.carta2) ? this.carta2.urlFoto : '';

    this.minhasCartas = this.trucoService.minhasCartas;
    this.cartasComputador = this.trucoService.cartasComputador;
    this.cartaVira = this.trucoService.cartaVira;
    this.urlImagem = this.trucoService.cartaVira.urlFoto;

    this.meusPontos = this.trucoService.meusPontos;
    this.pcPontos = this.trucoService.pontosComputador;
    this.tentosValendo = this.trucoService.tentosValendo;
    this.primeiraRodada = '';
    this.segundaRodada = '';
    this.trataVencedoresRodada();
  }

  selecionaCarta(posicao: number, euJogando: boolean) {
    if ((euJogando && this.trucoService.minhaVez) || (!euJogando && !this.trucoService.minhaVez)) {
      this.trucoService.selecionaCarta(posicao);
      this.ajustaMesa();
    } else {
      alert("Não é sua vez!");
    }

    //SIMULA O PC JOGANDO ERRO TA AQUI
    if (euJogando) {
      this.simulaPCJogando(euJogando);
      //setInterval(this.simulaPCJogando.bind(this), 1000);
    }
  }

  simulaPCJogando(euJogando): void {
    if (euJogando) {
      //console.log('.............................................eu jogando');
    } else {
      //console.log('.............................................clique do botao');
    }

    //console.log('.............................................Final Rodada',this.trucoService.finalDaRodada);
    if (!this.trucoService.finalDaRodada) {
      if (!this.trucoService.minhaVez) {

        console.log('');
        console.log("SIMULA O PC JOGANDO");
        console.log("Minha: ", this.trucoService.minhaCarta);
        console.log("DELE: ", this.trucoService.cartaAdversario);
        console.log('SERVICO',this.trucoService);
        console.log('');

        let idCartaPC = Math.floor(Math.random() * this.cartasComputador.length);
        this.selecionaCarta(idCartaPC, false);
      }
    }

    //console.log('.............................................Final Rodada',this.trucoService.finalDaRodada);
    //console.log('.............................................Minha Vez',this.trucoService.minhaVez);
  }

  pedeTruco(): void {
    if (this.trucoService.minhaVez) {

    }
  }

  //----------------------------------------------
  trataVencedoresRodada(): void {
    this.rodadasJogo = this.trucoService.rodadasTruco;
    if (this.rodadasJogo[0]) {
      if (this.rodadasJogo[0].empate) {
        this.primeiraRodada = 'EMPATE';
      } else {
        this.primeiraRodada = (this.rodadasJogo[0].primeiraVence) ? 'USUARIO' : 'PC';
      }
    } else {
      this.primeiraRodada = '';
    }

    if (this.rodadasJogo[1]) {
      if (this.rodadasJogo[1].empate) {
        this.segundaRodada = 'EMPATE';
      } else {
        this.segundaRodada = (this.rodadasJogo[1].primeiraVence) ? 'USUARIO' : 'PC';
      }
    } else {
      this.segundaRodada = '';
    }

    if (this.rodadasJogo[2]) {
      if (this.rodadasJogo[2].empate) {
        this.terceiraRodada = 'EMPATE';
      } else {
        this.terceiraRodada = (this.rodadasJogo[2].primeiraVence) ? 'USUARIO' : 'PC';
      }
    } else {
      this.terceiraRodada = '';
    }
  }

}
