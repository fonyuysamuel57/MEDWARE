import { Component } from '@angular/core';
import { NavbarComponent } from './components/navbar/navbar.component';
import { HeroComponent } from './components/hero/hero.component';
import { FirstAidComponent } from './components/first-aid/first-aid.component';
import { SymptomsComponent } from './components/symptoms/symptoms.component';
import { DiseasesComponent } from './components/diseases/diseases.component';
import { HealthTipsComponent } from './components/health-tips/health-tips.component';
import { ArticlesComponent } from './components/articles/articles.component';
import { MisconceptionsComponent } from './components/misconceptions/misconceptions.component';
import { FooterComponent } from './components/footer/footer.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    NavbarComponent,
    HeroComponent,
    FirstAidComponent,
    SymptomsComponent,
    DiseasesComponent,
    HealthTipsComponent,
    ArticlesComponent,
    MisconceptionsComponent,
    FooterComponent,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'MEDWARE';
}
