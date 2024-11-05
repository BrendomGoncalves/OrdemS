import {Component} from '@angular/core';
import {ToolbarModule} from 'primeng/toolbar';
import {RouterLink, RouterLinkActive} from '@angular/router';
import {SidebarModule} from 'primeng/sidebar';
import {Button} from 'primeng/button';

@Component({
  selector: 'app-nav-bar',
  standalone: true,
  imports: [
    ToolbarModule,
    RouterLink,
    SidebarModule,
    Button,
    RouterLinkActive
  ],
  templateUrl: './nav-bar.component.html',
  styleUrl: './nav-bar.component.css'
})
export class NavBarComponent {
  sidebarVisible3: boolean = false;
}
