import { Component } from '@angular/core';
import * as data from '../assets/pistas/brasil.json';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  title = 'motor-racing-manager';

  circuito: any = null
  pitlane: any = null
  properties: any = null

  voltaAtual: number = 1
 
  jogadores = [
    {
      waypoint: 1,
      poder: 3,
      volta: 1,
      entrarPit: true,
      noPit: false,
      carNumber: 50,
      largada: 1
    },
    {
      waypoint: 1,
      poder: 3,
      volta: 1,
      entrarPit: false,
      noPit: false,
      carNumber: 14,
      largada: 9
    },
    {
      waypoint: 1,
      poder: 3,
      volta: 1,
      entrarPit: false,
      noPit: false,
      carNumber: 22,
      largada: 4
    }
  ]

  startTimer(tempo: number) {
  }

  constructor() {
    this.circuito = data.default.features[0].geometry.coordinates
    this.pitlane = data.default.features[0].geometry.pitLane
    this.properties = data.default.features[0].properties
    
    let {x1, y1, x2, y2} = this.properties.retaLargada

    this.jogadores.forEach(it => {
      it.x = ((x1 - x2) / 20 * it.largada) + x2
      it.y = ((y1 - y2) / 20 * it.largada) + y2
      this.print(it)
    })

    this.iniciarCorrida()
  }

  iniciarCorrida() {
    setInterval(() => {
      this.jogadores.forEach(it => {
        this.moverJogador(it)
      });
    }, 10)
  }

  moverJogador(jogador: any) {
    let waypoints = jogador.noPit ? this.pitlane : this.circuito 
    let xWaypoint = waypoints[jogador.waypoint][0]
    let yWaypoint = waypoints[jogador.waypoint][1]

    let distanciaX = jogador.x - xWaypoint
    let diminuirX = distanciaX < 0 
    distanciaX = diminuirX ? distanciaX * -1 : distanciaX
    let distanciaY = jogador.y - yWaypoint
    let diminuirY = distanciaY < 0 
    distanciaY = diminuirY ? distanciaY * -1 : distanciaY

    let totalDistancia = distanciaY + distanciaX

    let porcentagemX = distanciaX / totalDistancia 
    let porcentagemY = distanciaY / totalDistancia

    let poder = 2 / (Math.floor(Math.random() * 10) + 1)

    let xAMover = porcentagemX * (jogador.poder + poder) 
    let yAMover = porcentagemY * (jogador.poder + poder) 
   
    if (jogador.noPit) {
      xAMover /= 3
      yAMover /= 3
    }

    let chegouX = false
    let chegouY = false

    if (distanciaX < xAMover) {
      jogador.x = xWaypoint
      chegouX = true
    } else if (distanciaY < yAMover) {
      jogador.y = yWaypoint
      chegouY = true
    }
    
    if (!chegouX)
      if (diminuirX) 
        jogador.x += xAMover
      else
        jogador.x -= xAMover

    if (!chegouY)
      if (diminuirY) 
        jogador.y += yAMover
      else
        jogador.y -= yAMover
    
    if (jogador.x == xWaypoint && jogador.y == yWaypoint) {
      if (waypoints.length - 1 == jogador.waypoint) {
        jogador.waypoint = 0
        jogador.volta += 1
        if (jogador.volta > this.voltaAtual) {
          this.voltaAtual += 1
        }
        if (jogador.noPit) {
          jogador.noPit = false
          jogador.waypoint = this.properties.saidaNoPit
        }
      } else {
        if (jogador.entrarPit && jogador.waypoint == this.properties.entradaNoPit) {
          jogador.noPit = true
          jogador.waypoint = 0
          jogador.volta += 1
        }
        jogador.waypoint += 1
      }
    }
    this.print(jogador)
  }

  print(jogador: any) {
    jogador.xCircuit = 560 / 955 * jogador.x - 6
    jogador.yCircuit = 560 / 955 * jogador.y - 6
  }
}