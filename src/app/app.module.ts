import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { MachineComponent } from './components/machine/machine.component';
import { MoneyPipe } from './pipes/money/money.pipe';
import { RollsMoneyDirective } from './directives/rollsMoney/rolls-money.directive';
import { JeuDeLoisComponent } from './components/jeu-de-lois/jeu-de-lois.component';
import { MultiSpinsComponent } from './components/multi-spins/multi-spins.component';

@NgModule({
  declarations: [
    AppComponent,
    MachineComponent,
    MoneyPipe,
    RollsMoneyDirective,
    JeuDeLoisComponent,
    MultiSpinsComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
