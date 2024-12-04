import { Component } from '@angular/core';
import { HeaderComponent } from '../shared/header/header.component';
import { RouterModule } from '@angular/router';
import { FooterComponent } from '../shared/footer/footer.component';

@Component({
  selector: 'app-landingpage',
  standalone: true,
  imports: [
    HeaderComponent,
    RouterModule,
    FooterComponent
  ],
  templateUrl: './landingpage.component.html',
  styleUrl: './landingpage.component.scss'
})
export class LandingpageComponent {

}
