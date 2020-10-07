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

  cartaVira: Carta;
  cartaManilha: string;
  minhasCartas: Carta[];
  cartasComputador: Carta[];

  empate: boolean;
  minhaVez: boolean = true;

  minhaCarta: Carta;
  cartaAdversario: Carta;

  rodadasTruco: Rodada[];
  rodada: number = 1;
  rodadaFinal: boolean;

  private cartas: Carta[] = [];
  private sequencia: any[];
  private baralhoLimpo: boolean;

  meusPontos: number = 0;
  pontosComputador: number = 0;
  tentosValendo: number = 1;

  constructor() { }

  iniciaJogo(limpo: boolean): void {

    console.log("INICIA JOGO");

    this.cartas = [];
    this.minhasCartas = [];
    this.cartasComputador = [];
    this.rodadasTruco = [];
    this.baralhoLimpo = limpo;
    this.sequencia = (limpo) ? this.sequenciaLimpo : this.sequenciaSujo;
    this.cartaManilha = '';
    this.empate = false;
    this.rodadaFinal = false;
    this.montaCartas();
    this.sorteiaIDManilha();

    this.geraMinhasCartas();
    this.geraCartasPC();

    //console.log("Cartas", this.cartas);
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
      let minhacarta = this.geraCartaAleatoria();
      minhacarta.viraAoContrario();
      this.cartasComputador.push(minhacarta);
    }
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
      this.cartaAdversario.desviraCarta();
    }

    console.log("Carta Jogada", cartaSelecionada);

    if (this.minhaCarta && this.cartaAdversario) {
      this.rodada++;
      rodada = new Rodada(this.rodada, this.minhaCarta, this.cartaAdversario);
      if (rodada.verificaVencedor()) {
        console.log("Eu venci?", rodada.primeiraVence);
        if (rodada.empate) {
          this.mudaAVez();
        } else {
          this.minhaVez = rodada.primeiraVence;
        }
        this.limpaARodada(rodada);
      } else {
        console.log("Sem vencedor");
      }

      console.log("Rodadas", this.rodadasTruco);
      this.validaAsRodadas();

    } else {
      this.mudaAVez();
    }
  }

  //-----------------------------------------------------------
  limpaARodada(rodada?: Rodada) {
    this.minhaCarta = null;
    this.cartaAdversario = null;
    if (rodada) {
      this.rodadasTruco.push(rodada);
    }
  }

  //-----------------------------------------------------------
  validaAsRodadas(): void {
    let qtdVitoriasEu = 0;
    let qtdVitoriasPC = 0;
    let minhaVitoria: boolean = false;
    let minhaDerrota: boolean = false;
    let teveEmpate: boolean = false;

    if (this.rodadasTruco.length > 1) {
      console.log("Inicio validação da rodada");

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
          minhaVitoria = this.rodadasTruco[1].primeiraVence;
          minhaDerrota = !minhaVitoria;
        }

        console.log("Minha Vitoria?", minhaVitoria);
      } else {
        if (qtdVitoriasEu == 2 || qtdVitoriasPC == 2) {
          minhaVitoria = qtdVitoriasEu == 2;
          minhaDerrota = !minhaVitoria;
          console.log("Minha Vitoria?", minhaVitoria);
        }
      }

      if (minhaVitoria || minhaDerrota) {
        this.somaPontos(minhaVitoria);
        this.rodadasTruco = [];
        this.mudaAVez();
      }
    }
  }

  somaPontos(venci: boolean) {
    if (venci) {
      this.meusPontos += this.tentosValendo;
    } else {
      this.pontosComputador += this.tentosValendo
    }
    this.tentosValendo = 1;
    this.limpaARodada();
  }

}
