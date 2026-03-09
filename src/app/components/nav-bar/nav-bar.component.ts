import {Component} from '@angular/core';
import {ToolbarModule} from 'primeng/toolbar';
import {RouterLink, RouterLinkActive} from '@angular/router';
import {SidebarModule} from 'primeng/sidebar';
import {TooltipModule} from 'primeng/tooltip';

@Component({
  selector: 'app-nav-bar',
  standalone: true,
  imports: [
    ToolbarModule,
    RouterLink,
    SidebarModule,
    RouterLinkActive,
    TooltipModule
  ],
  templateUrl: './nav-bar.component.html',
  styleUrl: './nav-bar.component.scss'
})
export class NavBarComponent{}
