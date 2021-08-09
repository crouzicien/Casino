import { Component, OnInit, ViewChild, ViewChildren, ElementRef, AfterViewInit, QueryList, Renderer2 } from '@angular/core';


function getRandomArbitrary(min, max) {
  return Math.random() * (max - min) + min;
}
function clone(obj, clones?) {
  // Makes a deep copy of 'obj'. Handles cyclic structures by
  // tracking cloned obj's in the 'clones' parameter. Functions 
  // are included, but not cloned. Functions members are cloned.
  var new_obj,
    already_cloned,
    t = typeof obj,
    i = 0,
    l,
    pair;

  clones = clones || [];

  if (obj === null) {
    return obj;
  }

  if (t === "object" || t === "function") {

    // check to see if we've already cloned obj
    for (i = 0, l = clones.length; i < l; i++) {
      pair = clones[i];
      if (pair[0] === obj) {
        already_cloned = pair[1];
        break;
      }
    }

    if (already_cloned) {
      return already_cloned;
    } else {
      if (t === "object") { // create new object
        new_obj = new obj.constructor();
      } else { // Just use functions as is
        new_obj = obj;
      }

      clones.push([obj, new_obj]); // keep track of objects we've cloned

      for (const key in obj) { // clone object members
        if (obj.hasOwnProperty(key)) {
          new_obj[key] = clone(obj[key], clones);
        }
      }
    }
  }
  return new_obj || obj;
}

@Component({
  selector: 'app-machine',
  templateUrl: './machine.component.html',
  styleUrls: ['./machine.component.scss']
})


export class MachineComponent implements OnInit, AfterViewInit {
  @ViewChildren("colonne") colonneElm: QueryList<ElementRef>
  @ViewChildren("porte") portesElm: QueryList<ElementRef>
  @ViewChildren('soundFinColonne') soundFinColonneElm: QueryList<ElementRef>
  @ViewChildren('soundEnflammeColonne') soundEnflammeColonneElm: QueryList<ElementRef>
  @ViewChildren('soundBonus') soundBonusElm: QueryList<ElementRef>
  @ViewChild('soundSpinButton', { static: false }) soundSpinButtonElm: ElementRef
  @ViewChild('soundMusique', { static: false }) soundMusiqueElm: ElementRef

  private nmbElementsPerColumn = 3;
  private nmbColonne = 5
  public gains: number = null;
  public detailGains = null;
  private panier = []

  public fourchetteNmbTours = {
    min: 30,
    max: 40
  }

  public bet = {
    liste: [1, 2, 5, 10, 15, 20, 25, 50, 75, 100, 200, 250, 300],
    current: 1,
    plus() {
      let index = this.liste.findIndex(x => x == this.current)
      if (index == this.liste.length - 1) return
      else this.current = this.liste[index + 1]
    },

    minus() {
      let index = this.liste.findIndex(x => x == this.current)
      if (index == 0) return
      else this.current = this.liste[index - 1]
    }
  }

  public spinButton = {
    locked: false
  }
  private schemaLines = [
    // 1
    [
      1, 1, 1, 1, 1
    ],
    [
      2, 2, 2, 2, 2
    ],
    [
      0, 0, 0, 0, 0
    ],
    [
      2, 1, 0, 1, 2
    ],
    [
      0, 1, 2, 1, 0
    ],
    [
      1, 2, 2, 2, 1
    ],
    [
      1, 0, 0, 0, 1
    ],
    [
      2, 2, 1, 0, 0
    ],
    [
      0, 0, 1, 2, 2
    ],
    [
      1, 0, 1, 2, 1
    ],
    // 2
    [
      1, 2, 1, 0, 1
    ],
    [
      2, 1, 1, 1, 2
    ],
    [
      0, 1, 1, 1, 0
    ],
    [
      2, 1, 2, 1, 2
    ],
    [
      0, 1, 0, 1, 0
    ],
    [
      1, 1, 2, 1, 1
    ],
    [
      1, 1, 0, 1, 1
    ],
    [
      2, 2, 0, 2, 2
    ],
    [
      0, 0, 2, 0, 0
    ],
    [
      2, 0, 0, 0, 2
    ],
    // 3
    [
      0, 2, 2, 2, 0
    ],
    [
      1, 0, 2, 0, 1
    ],
    [
      1, 2, 0, 2, 1
    ],
    [
      2, 0, 2, 0, 2
    ],
    [
      0, 2, 0, 2, 0
    ],
    [
      2, 0, 1, 2, 0
    ],
    [
      0, 2, 1, 0, 2
    ],
    [
      1, 2, 0, 1, 0
    ],
    [
      2, 0, 1, 0, 2
    ],
    [
      0, 1, 2, 2, 1
    ],
    // 4
    [
      2, 1, 0, 0, 1
    ],
    [
      1, 2, 1, 2, 1
    ],
    [
      1, 0, 1, 0, 1
    ],
    [
      2, 1, 2, 1, 0
    ],
    [
      0, 1, 0, 2, 2
    ],
    [
      0, 2, 2, 1, 0
    ],
    [
      1, 0, 0, 2, 2
    ],
    [
      2, 2, 1, 1, 0
    ],
    [
      0, 0, 2, 1, 2
    ],
    [
      0, 0, 2, 2, 2
    ],


    // 5
    [
      0, 0, 1, 0, 1
    ],
    [
      2, 2, 0, 1, 2
    ],
    [
      1, 1, 2, 1, 0
    ],
    [
      1, 2, 2, 0, 1
    ],
    [
      1, 0, 2, 2, 0
    ],
    [
      0, 2, 2, 0, 2
    ],
    [
      2, 1, 1, 0, 1
    ],
    [
      2, 1, 0, 2, 0
    ],
    [
      2, 0, 2, 1, 0
    ],
    [
      1, 1, 0, 0, 1
    ],
  ]
  public colonnes = []
  private symboles = {
    liste: [
      [
        { label: "portraitFemme", values: { "2": 2, "3": 10, "4": 50, "5": 150 }, win: false, photo() { return this.win ? 'licorne2.gif' : 'licorne2.png' } },
        { label: "portraitVolcan", values: null, win: false, photo() { return this.win ? 'licorne.gif' : 'licorne.png' } }
      ],
      [
        { label: "pieceBonus", values: null, win: false, photo() { return this.win || this.cligne ? 'gif10.gif' : 'gif10.png' } }
      ],
      [
        { label: "planetPrice", values: () => { return this.bet.current * 10000 }, win: false, photo() { return this.win ? 'gif8.gif' : 'gif8.png' } },
        { label: "planetPrice", values: () => { return this.bet.current * 20000 }, win: false, photo() { return this.win ? 'gif8.gif' : 'gif8.png' } },
        { label: "planetPrice", values: () => { return this.bet.current * 30000 }, win: false, photo() { return this.win ? 'gif8.gif' : 'gif8.png' } },
        { label: "planetPrice", values: () => { return this.bet.current * 30000 }, win: false, photo() { return this.win ? 'gif8.gif' : 'gif8.png' } },
        { label: "planetPrice", values: () => { return this.bet.current * 40000 }, win: false, photo() { return this.win ? 'gif8.gif' : 'gif8.png' } },
      ],
      [
        { label: "objBouclier", values: { "3": 5, "4": 30, "5": 100 }, win: false, photo() { return 'banana.png' } },
        { label: "objChard", values: { "3": 5, "4": 25, "5": 100 }, win: false, photo() { return 'strawberry.png' } },
        { label: "objVase", values: { "3": 5, "4": 25, "5": 100 }, win: false, photo() { return 'cherry.png' } },
        { label: "objCollier", values: { "3": 5, "4": 20, "5": 75 }, win: false, photo() { return 'blueberry.png' } },
      ],
      [
        { label: "carteA", values: { "3": 5, "4": 10, "5": 50 }, win: false, photo() { return 'b.png' } },
        { label: "carteK", values: { "3": 5, "4": 10, "5": 50 }, win: false, photo() { return 'a2.png' } },
        { label: "carteQ", values: { "3": 5, "4": 10, "5": 50 }, win: false, photo() { return 'd.png' } },
        { label: "carteJ", values: { "3": 5, "4": 10, "5": 50 }, win: false, photo() { return 'c.png' } },
      ],
    ],
    pioche() {
      let indexType, indexElm
      let type = getRandomArbitrary(0, 100)
      let elm = getRandomArbitrary(0, 100)

      // PORTRAIT
      if (type >= 0 && type <= 15) {
        indexType = 0
        // Femme
        if (elm <= 50) indexElm = 0
        // Volcan
        if (elm > 50 && elm <= 100) indexElm = 1
      }

      // BONUS
      else if (type > 15 && type <= 25) {
        indexType = 1
        // Piece
        indexElm = 0
      }

      // PLANETES
      else if (type > 25 && type <= 35) {
        indexType = 2
        // x1
        if (elm <= 20) indexElm = 0
        // x2
        if (elm > 20 && elm <= 40) indexElm = 1
        // x3
        if (elm > 40 && elm <= 60) indexElm = 2
        // x4
        if (elm > 60 && elm <= 80) indexElm = 3
        // x5
        if (elm > 80 && elm <= 100) indexElm = 4
      }

      // OBJETS
      else if (type > 35 && type <= 85) {
        indexType = 3
        // Bouclier 
        if (elm <= 25) indexElm = 0
        // Collier 
        if (elm > 25 && elm <= 50) indexElm = 1
        // Vase
        if (elm > 50 && elm <= 75) indexElm = 2
        // Chard
        if (elm > 75 && elm <= 100) indexElm = 3
      }
      // CARTES
      else if (type > 85 && type <= 100) {
        indexType = 4
        // K 
        if (elm <= 25) indexElm = 0
        // A 
        if (elm > 25 && elm <= 50) indexElm = 1
        // J
        if (elm > 50 && elm <= 75) indexElm = 2
        // Q
        if (elm > 75 && elm <= 100) indexElm = 3
      }

      return this.liste[indexType][indexElm]
    }
  }
  private templateColonne = {
    id: null, nmbTours: null, liste: [], HTMLelement: null, sound: {}, start(toursMin, toursMax) {

      return new Promise(async (resolve, reject) => {

        this.nmbTours = getRandomArbitrary(toursMin, toursMax)
        let latency = 50

        let i = 0
        let interval = setInterval(() => {
          if (i == 0 && this.liste.length == 3) {
            let pioche = this.pioche()
            if (pioche.label == 'pieceBonus' && this.liste.find(x => x.label == 'pieceBonus') != undefined) {
              while (pioche.label == 'pieceBonus') pioche = this.pioche()
            }
            this.liste.push(clone(pioche))
          }


          let arrTmp = clone(this.liste)
          let pioche = this.pioche()

          if (pioche.label == 'pieceBonus' && this.liste.find(x => x.label == 'pieceBonus') != undefined) {
            while (pioche.label == 'pieceBonus') pioche = this.pioche()
          }
          arrTmp.unshift(clone(pioche))
          arrTmp.splice(arrTmp.length - 1, 1)
          this.liste = arrTmp

          i += 1

          // SI 2 bonues sont déja sortis
          this.enflamme(this.id, this.sound)

          if (i >= this.nmbTours) {
            let liste = [this.liste[1], this.liste[2], this.liste[3]]

            // Si bonus, on le fait clignoter
            let bonus = liste.find(x => x.label == 'pieceBonus')
            if(bonus != undefined){
              bonus.cligne = true
              this.sound.bonus.nativeElement.play()
              // Jouer son
              // setTimeout(() => {
              //   bonus.cligne = false
                
              // }, 1000);
            }

            this.determineListe(liste, this.id)

            resolve({ liste: liste, index: i + 2 });
            this.pushPanier(liste)
            this.liste.splice(this.liste[2], 1)

            this.sound.fin.nativeElement.play()
            this.sound.enflamme.nativeElement.pause()
            this.bounce(this.HTMLelement.nativeElement)
            clearInterval(interval)
          }
        }, latency)
      })
    },

    determineListe: (liste, id) => {
      this.renderer.removeClass(this.colonnes[id].HTMLelement.nativeElement, 'enflamme')

      liste.map(elm => {

        if (elm.label == 'pieceBonus' && this.colonnes.length - id >= 2 && this.panier.find(x => x.label == 'pieceBonus') != undefined) {
          // Faire du bruit
          // rallonger toutes les colonnes suivantes
          let e = 1
          for (let i = id; i < this.colonnes.length; i++) {
            const colonneSuivante = this.colonnes[i];
            colonneSuivante.nmbTours += 30 * e
            e++
          }

        }
      })
    },

    enflamme: (id, sound) => {
      // console.log(this.panier.length, id)
      if (this.panier.filter(x => x.label == 'pieceBonus').length >= 2 && this.panier.length == 3 * id) {
        // Animer la colonne 
        sound.enflamme.nativeElement.play()
        this.renderer.addClass(this.colonnes[id].HTMLelement.nativeElement, 'enflamme')
      }

    },
    pushPanier: (results) => {
      results.map(x => this.panier.push(x))
    },
    pioche: () => {
      return this.symboles.pioche()
    },
    bounce: (HTMLelement) => {
      setTimeout(() => {
        this.renderer.addClass(HTMLelement, 'stop')
        setTimeout(() => {
          this.renderer.removeClass(HTMLelement, 'stop')
        }, 500);
      }, 40);
    }

  }
  private affichageWinners = {
    interval: null,

    reset() {
      clearInterval(this.interval)
    },
    start(winners) {

      if (winners.length == 0) return
      winners[0].elements.map(e => e.win = true)
      this.changeDetailGain(winners[0])

      let i = 1
      this.interval = setInterval(() => {
        if (i == winners.length) i = 0

        winners.map(winner => winner.elements.map(e => e.win = false))
        winners[i].elements.map(e => e.win = true)
        this.changeDetailGain(winners[i])
        i++
      }, 2000)

    },
    changeDetailGain: (winner) => {
      let total = winner.startElm.values[winner.nmb] * this.bet.current * 1000
      this.detailGains = `${winner.startElm.label} x${winner.nmb} = $${total}`
    }

  }
  public portes = {
    opened: false,
    open() {
      this.opened = true
      this.move('open')
    },
    close() {
      this.opened = false
      this.move('close')
    },

    move: (state) => {

      if (state == 'open') {
        let i = 0
        this.portesElm.forEach(x => {
          if (i == 0) this.renderer.setStyle(x.nativeElement, 'transform', 'translate3d(-50vw, 0, 0)')
          if (i == 1) this.renderer.setStyle(x.nativeElement, 'transform', 'translate3d(+50vw, 0,0)')
          i++
        })
      } else if (state == 'close') {
        let i = 0
        this.portesElm.forEach(x => {
          if (i == 0) this.renderer.setStyle(x.nativeElement, 'transform', 'translate3d(0, 0, 0)')
          if (i == 1) this.renderer.setStyle(x.nativeElement, 'transform', 'translate3d(0, 0, 0)')
          i++
        })
      }

    }
  }

  public affichageGeant = {
    text : null,
    create(text){
      this.text = text
      setTimeout(() => {
        this.text = null
      }, 5000);
    }
  }

  private pieceBonus = {
    inProgress : false,
    currentUpgrades : [],
    start(){
      setTimeout(() => {
        this.inProgress = true
      }, 4000);
      this.launch()
    },
    launch : () => {
      this.affichageGeant.create('PIECES BONUS')
      setTimeout(() => {
        this.portes.close()
        setTimeout(() => {
          this.portes.open()
        }, 2000);
      }, 2000);
    },
    endJeuDeLois(upgrades){
      this.currentUpgrades = upgrades
      this.inProgress = false
      console.log(this.currentUpgrades)
    }

  }


  constructor(private renderer: Renderer2) {
  }

  ngOnInit() {
    for (let i = 0; i < this.nmbColonne; i++) {
      let cloneTmp = clone(this.templateColonne)
      cloneTmp.id = i
      this.colonnes.push(cloneTmp)
    }

    // INIT
    this.colonnes.map(colonne => {
      for (let i = 0; i < this.nmbElementsPerColumn; i++) {
        colonne.liste.push(clone(this.symboles.pioche()))
      }
    })

  }

  ngAfterViewInit() {
    let i = 0
    this.colonneElm.forEach(elm => { this.colonnes[i].HTMLelement = elm; i++ })
    let e = 0
    this.soundFinColonneElm.forEach(elm => { this.colonnes[e].sound.fin = elm; e++ })
    let a = 0
    this.soundEnflammeColonneElm.forEach(elm => { this.colonnes[a].sound.enflamme = elm; a++ })
    let b = 0
    this.soundBonusElm.forEach(elm => { this.colonnes[b].sound.bonus = elm; b++ })
    //DEBUG
    setTimeout(() => {
      this.portes.open()
    }, 100);
  }




  public start() {
    if (this.spinButton.locked) return


    this.affichageWinners.reset()
    this.gains = null
    this.detailGains = null
    this.panier = []
    this.soundMusiqueElm.nativeElement.play()
    this.soundSpinButtonElm.nativeElement.play()
    this.spinButton.locked = true



    let promiseArray = []
    let decalage = 50
    for (let i = 0; i < this.colonnes.length; i++) {
      setTimeout(() => {
        let p = this.colonnes[i].start(Math.round(this.fourchetteNmbTours.min * ((i + 1) / 4)), Math.round(this.fourchetteNmbTours.max * ((i + 1) / 4)))
        promiseArray.push(p)
      }, i * decalage)
    }

    setTimeout(() => {
      Promise.all(promiseArray).then((values) => setTimeout(() => {
        this.fin(values)
      }, 1500));
    }, decalage * this.colonnes.length);
  }


  private fin(values) {
    let lines = []
    let line1 = [], line2 = [], line3 = []

    values.map(x => {
      line1.push(x.liste[0])
      line2.push(x.liste[1])
      line3.push(x.liste[2])
    })
    lines = [line1, line2, line3]


    this.calcBonus(lines)
    this.calcStandard(lines)
    this.spinButton.locked = false
  }





  private calcBonus(lines) {
    console.log("Calcule des bonus")
    let bonus = lines.flat().filter(x => x.label == 'pieceBonus')
    if (bonus.length >= 3) {
      console.log(bonus)
      bonus.map(x => x.win = true)
      console.log('LANCEMENT DU BONUS')
      this.pieceBonus.start()
    }


  }

  private calcStandard(lines) {
    let linesWins = []
    let winners = []

    // console.log('Schema', this.schemaLines[0])
    // console.log('Lines', lines)


    this.schemaLines.map(schema => {

      let startElm = null
      let elements = []
      let nmb = 0

      for (let i = 0; i < this.nmbColonne; i++) {
        let item = lines[schema[i]][i]

        if (startElm == null && item.label != 'portraitVolcan') { startElm = item; }


        if (startElm == null) { elements.push(item); nmb++; }
        else if (item.label == startElm.label && item.label != 'planetPrice' && item.label != 'pieceBonus' || startElm == null || item.label == 'portraitVolcan') {
          elements.push(item)
          nmb++
        }

        else {
          i = 5
        }
      }

      if (startElm.label == 'portraitFemme' && nmb >= 2) {
        linesWins.push({ line: schema, startElm: startElm, elements: elements, nmb: nmb })
      }
      else if (startElm.label != 'portraitFemme' && nmb >= 3) {
        linesWins.push({ line: schema, startElm: startElm, elements: elements, nmb: nmb })
      }

    })


    // linesWins.map(win => {
    //   console.log('GAINS', win.startElm, 'x', win.nmb, win.line)
    // })


    // Reduction à un meilleur résultat pour un obj
    linesWins.map(x => {
      let finded = false

      for (let i = 0; i < winners.length; i++) {
        if (winners[i].startElm.label == x.startElm.label && winners[i].nmb < x.nmb && winners[i].line[0] == x.line[0]) {
          winners[i] = x
          finded = true
        } else if (winners[i].startElm.label == x.startElm.label && winners[i].nmb >= x.nmb && winners[i].line[0] == x.line[0]) finded = true
      }

      if (!finded) winners.push(x)
    })


    // console.log(winners)
    this.affichageWinners.start(winners)

    // Calcule avec les valeurs
    let gains = 0
    winners.map(winner => {
      gains += winner.startElm.values[winner.nmb] * this.bet.current * 1000
    })

    if (gains != 0) this.gains = gains
  }




}
