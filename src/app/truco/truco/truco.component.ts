import { Component, OnInit, ViewChild } from '@angular/core';

import { NgForm } from '@angular/forms';

import { Carta, TrucoService, Rodada } from '../shared';

@Component({
  selector: 'app-truco',
  templateUrl: './truco.component.html',
  styleUrls: ['./truco.component.css']
})
export class TrucoComponent implements OnInit {

  urlCartaVirada: string;
  urlImagem: string;
  cartaVira: Carta;
  minhasCartas: Carta[] = [];
  cartasComputador: Carta[] = [];

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
    this.urlCartaVirada = `/assets/cartas/VIRADA.png`;
    this.minhasCartas = this.trucoService.minhasCartas;
    this.cartasComputador = this.trucoService.cartasComputador;
  }

  continua() {
    let aleatorio = Math.floor(Math.random() * this.cartasComputador.length);
    this.selecionaCarta(aleatorio, false);
  }

  selecionaCarta(posicao: number, euJogando: boolean) {

    if ((euJogando && this.trucoService.minhaVez) || (!euJogando && !this.trucoService.minhaVez)) {
      this.trucoService.selecionaCarta(posicao);
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
      this.trataVencedoresRodada();

    } else {
      alert("Não é sua vez!");
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
