import { Component, OnInit, Renderer2, AfterViewInit, ViewChild, ElementRef, Output, EventEmitter } from '@angular/core';


function getRandomArbitrary(min, max) {
  return Math.random() * (max - min) + min;
}


@Component({
  selector: 'app-jeu-de-lois',
  templateUrl: './jeu-de-lois.component.html',
  styleUrls: ['./jeu-de-lois.component.scss']
})

export class JeuDeLoisComponent implements OnInit, AfterViewInit {
  @ViewChild('pion', { static: false }) pionElm: ElementRef
  @Output() end: EventEmitter<any> = new EventEmitter<any>();

  public currentPosition = 0




  private bonus = {
    plateau: [
      {
        label: 'Start',
        color: 'rgb(59, 59, 59)',
        kind: 'start', nmb: null,
        cligne: false
      },
      {
        label: '+1 Tableau',
        color: 'rgb(142, 109, 196)',
        kind: 'tableau', nmb: 1,
        cligne: false
      },
      {
        label: '+3 FreeSpin',
        color: 'rgb(57, 60, 139)',
        kind: 'freeSpin', nmb: 3,
        cligne: false
      },
      {
        label: '+1 Colonne Wild',
        color: 'rgb(35, 37, 85)',
        kind: 'colonne', nmb: 1,
        cligne: false
      },
      {
        label: 'Retour case départ',
        color: 'rgb(182, 153, 26)',
        kind: 'back', nmb: 1,
        cligne: false
      },
      {
        label: '+1 Tableau',
        color: 'rgb(142, 109, 196)',
        kind: 'tableau', nmb: 1,
        cligne: false
      },
      {
        label: '+1 Colonne Wild',
        color: 'rgb(35, 37, 85)',
        kind: 'colonne', nmb: 1,
        cligne: false
      },
      {
        label: '+2 FreeSpin',
        color: 'rgb(57, 60, 139)',
        kind: 'freeSpin', nmb: 2,
        cligne: false
      },
      {
        label: 'Stop',
        color: 'rgb(59, 59, 59)',
        kind: 'stop', nmb: null,
        cligne: false
      }
    ],

    currentList: [
      {
        label: 'Colonne Wild',
        color: 'rgb(35, 37, 85)',
        kind: 'colonne', nmb: 0
      },
      {
        label: 'Tableau',
        color: 'rgb(142, 109, 196)',
        kind: 'tableau', nmb: 1
      },
      {
        label: 'FreeSpin',
        color: 'rgb(57, 60, 139)',
        kind: 'freeSpin', nmb: 4
      },
    ],

    add(index) {
      let bonus = this.plateau[index]
      if (bonus.kind == 'freeSpin' || bonus.kind == 'colonne' || bonus.kind == 'tableau') {
        let bonusCurrent = this.currentList.find(x => x.kind == bonus.kind)
        bonusCurrent.nmb +=  bonus.nmb 

      } else if (bonus.kind == 'back') {

      } else if (bonus.kind == 'stop') {
        setTimeout(() => {
          this.end(this.currentList)
        }, 2000);
      }
    },
    end : (bonus)=> {
      this.end.emit(bonus)
    }

  }




  constructor(private renderer: Renderer2) { }

  ngOnInit() {
  }
  ngAfterViewInit() {

  }

  spin() {
    let i = this.currentPosition

    let vitesse = 50
    let stop = false


    if (i == 8) {
      this.fin(9)
    }
    setTimeout(() => {
      stop = true
    }, getRandomArbitrary(1000, 3000));


    let loop = () => {
      if (i >= this.bonus.plateau.length) i = this.currentPosition + 1

      this.bonus.plateau.map(x => x.cligne = false)
      this.bonus.plateau[i].cligne = true


      if (stop) vitesse = Math.round(vitesse * 1.3)
      if (vitesse <= 500) setTimeout(() => { loop() }, vitesse);
      else { this.fin(i) }
      i++
    }
    loop()
  }


  fin(index) {
    console.log("this.currentPosition", this.currentPosition)
    console.log("Result", index)
    let e = 1
    for (let i = this.currentPosition; i <= index; i++) {
      setTimeout(() => {
        this.renderer.addClass(this.pionElm.nativeElement, 'pose' + (i + 1))
        this.renderer.removeClass(this.pionElm.nativeElement, 'pose' + (i + 0))
        if (i == index) this.bonus.add(index)
      }, 300 * e);
      e++
    }

    this.currentPosition = index
  }
}
