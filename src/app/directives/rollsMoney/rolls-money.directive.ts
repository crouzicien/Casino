import { Directive, Renderer2, ElementRef, Input, OnInit } from '@angular/core';

@Directive({
  selector: '[appRollsMoney]'
})
export class RollsMoneyDirective implements OnInit {
  @Input('appRollsMoney') appRollsMoney: number;

  constructor(private el: ElementRef, private renderer: Renderer2) {

  }


  ngOnInit() {
    this.el.nativeElement.innerHTML = 0
    console.log(5 * (this.appRollsMoney.toString().length)*10)
    let i = 0
    let interval = setInterval(() => {
      this.el.nativeElement.innerHTML = this.virgules(i)
      if (i >= this.appRollsMoney) clearInterval(interval)
      i += (this.appRollsMoney/200)
    }, 20)

  }


  private virgules(somme) {
    somme += ''
    let chaine = []
    let e = 1
    for (let i = somme.length - 1; i >= 0; i--) {
      chaine.push(somme[i])
      if (e % 3 == 0 && e != somme.length) chaine.push(',')
      e++
    }

    return '$ ' + chaine.reverse().join('')
  }
}
