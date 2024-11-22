import {Component, LOCALE_ID} from '@angular/core';
import {registerLocaleData} from '@angular/common';
import localePt from '@angular/common/locales/pt';

registerLocaleData(localePt, 'pt-BR');

@Component({
  selector: 'app-pagina-inicial',
  standalone: true,
  imports: [
  ],
  templateUrl: './pagina-inicial.component.html',
  styleUrl: './pagina-inicial.component.css',
  providers: [{ provide: LOCALE_ID, useValue: 'pt-BR' }]
})
export class PaginaInicialComponent{
}
