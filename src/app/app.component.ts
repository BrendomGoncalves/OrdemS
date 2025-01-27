import {Component, OnInit} from '@angular/core';
import {RouterOutlet} from '@angular/router';
import {NavBarComponent} from './components/nav-bar/nav-bar.component';
import {MessageService, PrimeNGConfig} from 'primeng/api';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, NavBarComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
  providers: [MessageService,]
})
export class AppComponent implements OnInit {
  title = 'OrdemS';

  constructor(public primengConfig: PrimeNGConfig) {}

  ngOnInit() {
    this.primengConfig.setTranslation({
      dayNames: ["domingo", "segunda-feira", "terça-feira", "quarta-feira", "quinta-feira", "sexta-feira", "sábado"],
      dayNamesShort: ["dom", "seg", "ter", "qua", "qui", "sex", "sáb"],
      dayNamesMin: ["D", "S", "T", "Q", "Q", "S", "S"],
      monthNames: ["janeiro", "fevereiro", "março", "abril", "maio", "junho", "julho", "agosto", "setembro", "outubro", "novembro", "dezembro"],
      monthNamesShort: ["jan", "fev", "mar", "abr", "mai", "jun", "jul", "ago", "set", "out", "nov", "dez"],
    });
  }
}
