import {Component} from '@angular/core';
import {RouterOutlet} from '@angular/router';
import {NavBarComponent} from './components/nav-bar/nav-bar.component';
import {MessageService} from 'primeng/api';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, NavBarComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
  providers: [MessageService]
})
export class AppComponent {
  title = 'OrdemS';
}
