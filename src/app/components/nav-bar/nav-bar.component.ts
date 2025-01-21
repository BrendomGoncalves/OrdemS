import {Component, OnInit} from '@angular/core';
import {ToolbarModule} from 'primeng/toolbar';
import {RouterLink, RouterLinkActive} from '@angular/router';
import {SidebarModule} from 'primeng/sidebar';
import {Button} from 'primeng/button';
import {TooltipModule} from 'primeng/tooltip';

@Component({
  selector: 'app-nav-bar',
  standalone: true,
  imports: [
    ToolbarModule,
    RouterLink,
    SidebarModule,
    Button,
    RouterLinkActive,
    TooltipModule
  ],
  templateUrl: './nav-bar.component.html',
  styleUrl: './nav-bar.component.scss'
})
export class NavBarComponent{
  // sidebarVisible3: boolean = false;
}
