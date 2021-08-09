import { Component, OnInit, AfterViewInit, ViewChildren, QueryList, ElementRef, Renderer2 } from '@angular/core';


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
  selector: 'app-multi-spins',
  templateUrl: './multi-spins.component.html',
  styleUrls: ['./multi-spins.component.scss']
})
export class MultiSpinsComponent implements OnInit, AfterViewInit {
  @ViewChildren("colonne") colonneElm: QueryList<ElementRef>
  @ViewChildren('soundFinColonne') soundFinColonneElm: QueryList<ElementRef>

  private panier = []

  public jeux = []
  public nmbJeux = 4

  public colonnes = []
  private symboles = {
    liste: [
      [
        { label: "portraitFemme", values: { "2": 2, "3": 10, "4": 50, "5": 150 }, win: false, photo() { return this.win ? 'licorne2.gif' : 'licorne2.png' } },
        { label: "portraitVolcan", values: null, win: false, photo() { return this.win ? 'licorne.gif' : 'licorne.png' } }
      ],
      [],
      [],
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
      if (type <= 20) {
        indexType = 0
        // Femme
        if (elm <= 50) indexElm = 0
        // Volcan
        if (elm > 50 && elm <= 100) indexElm = 1
      }

      // OBJETS
      else if (type > 20 && type <= 85) {
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
            if (bonus != undefined) {
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
  constructor(private renderer: Renderer2) { }

  ngOnInit() {
    for (let e = 0; e < this.nmbJeux; e++) {
      this.jeux.push(
        { 
          id: e ,
          colonnes : [],
          HTMLelement : null
        }
      )

      for (let i = 0; i < 5; i++) {
        let cloneTmp = clone(this.templateColonne)
        cloneTmp.id = i
        this.jeux[e].colonnes.push(cloneTmp)
      }

      // INIT
      this.jeux[e].colonnes.map(colonne => {
        for (let i = 0; i < 3; i++) {
          colonne.liste.push(clone(this.symboles.pioche()))
        }
      })
    }


  }
  ngAfterViewInit() {
    let colonneElm = []
    this.colonneElm.forEach(x => colonneElm.push(x))
    
    let soundFinColonneElm = []
    this.soundFinColonneElm.forEach(x => soundFinColonneElm.push(x))


    console.log(this.colonneElm)

    let nmbTours = 0
    for (let b = 0; b < this.nmbJeux; b++) {

      for (let e = 0; e < 5; e++) {
        this.jeux[b].colonnes[e].HTMLelement = colonneElm[nmbTours];
        this.jeux[b].colonnes[e].HTMLelement = soundFinColonneElm[nmbTours];
        nmbTours ++
      }



    }



  }

}
