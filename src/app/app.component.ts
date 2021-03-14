import { Component } from '@angular/core';
import * as data from '../assets/pistas/brasil.json';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  title = 'motor-racing-manager';

  waypoints: any = null
  properties: any = null

  voltaAtual: number = 1
 
  jogadores = [
    {
      x: 272.21954,
      y: 69.086914,
      xCircuit: 272.21954,
      yCircuit: 69.086914,
      waypoint: 1,
      poder: 4,
      volta: 1
    },
    {
      x: 272.21954,
      y: 69.086914,
      xCircuit: 272.21954,
      yCircuit: 69.086914,
      waypoint: 1,
      poder: 3,
      volta: 1
    }
  ]

  startTimer(tempo: number) {
  }

  constructor() {
    this.waypoints = data.default.features[0].geometry.coordinates
    this.properties = data.default.features[0].properties
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
    let xWaypoint = this.waypoints[jogador.waypoint][0]
    let yWaypoint = this.waypoints[jogador.waypoint][1]

    let distanciaX = jogador.x - xWaypoint
    let diminuirX = distanciaX < 0 
    distanciaX = diminuirX ? distanciaX * -1 : distanciaX
    let distanciaY = jogador.y - yWaypoint
    let diminuirY = distanciaY < 0 
    distanciaY = diminuirY ? distanciaY * -1 : distanciaY

    let totalDistancia = distanciaY + distanciaX

    let porcentagemX = distanciaX / totalDistancia 
    let porcentagemY = distanciaY / totalDistancia

    let xAMover = porcentagemX * jogador.poder
    let yAMover = porcentagemY * jogador.poder
   
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
      if (this.waypoints.length - 1 == jogador.waypoint) {
        jogador.waypoint = 0
        jogador.volta += 1
        if (jogador.volta > this.voltaAtual) {
          this.voltaAtual += 1
        }
      } else {
        jogador.waypoint += 1
      }
    }

    jogador.xCircuit = 560 / 955 * jogador.x - 6
    jogador.yCircuit = 560 / 955 * jogador.y - 6
  }
}