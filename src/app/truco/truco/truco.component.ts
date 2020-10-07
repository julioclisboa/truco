import { Component, OnInit, ViewChild } from '@angular/core';

import { NgForm } from '@angular/forms';

import { Carta, TrucoService } from '../shared';

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

  //----------------------------------------------
  selecionaEu(posicao: number) {
    let cartaSelecionada = this.minhasCartas[posicao];
    this.minhasCartas = this.minhasCartas.filter((carta) => carta.idCarta != cartaSelecionada.idCarta);

    this.configuraJogada(cartaSelecionada);
  }

  continua() {
    this.trucoService.verificaGanhador(this.carta1, this.carta2);
    if (this.trucoService.empate) {
      this.pcPontos += 1;
    } else {
      if (this.trucoService.carta1Vence) {
        this.meusPontos += 1
      }
    }

    this.zeraRodada();
  }

  //----------------------------------------------
  selecionaPC(posicao: number) {
    let cartaSelecionada = this.cartasComputador[posicao];
    this.cartasComputador = this.cartasComputador.filter((carta) => carta.idCarta != cartaSelecionada.idCarta);

    this.configuraJogada(cartaSelecionada);
  }

  //----------------------------------------------
  configuraJogada(carta: Carta) {
    if (!this.carta1) {
      this.carta1 = carta;
      this.carta1Img = carta.urlFoto;
    } else {

      if (!this.carta2) {
        this.carta2 = carta;
        this.carta2Img = carta.urlFoto;
      }
    }

    console.log("Recebido a carta", carta);
    console.log("Carta 1", this.carta1);
    console.log("Carta 2", this.carta2);
  }

  zeraRodada() {
    this.carta1 = null;
    this.carta2 = null;
    this.carta1Img = '';
    this.carta2Img = '';
  }

}
