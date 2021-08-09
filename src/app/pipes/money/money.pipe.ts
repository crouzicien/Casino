import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'money'
})
export class MoneyPipe implements PipeTransform {
  transform(value: any, ...args: any[]): any {

    if (value != null) {
      value = Math.round(value)
      let formate = '';

      if (value.toString().length >= 1 && value.toString().length < 5) {
        formate = value
      }
      else if (value.toString().length >= 5 && value.toString().length < 7) {
        formate = value / 1000 + 'K';
      }else if(value.toString().length >= 7 && value.toString().length < 9){
        formate = value / 1000000 + 'M';
      }
      return formate;
    }


  }

}
