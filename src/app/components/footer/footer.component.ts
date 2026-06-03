import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslationService } from '../../services/translation.service';
import { LogoComponent } from '../logo/logo.component';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule, LogoComponent],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.css'
})
export class FooterComponent {
  readonly ts = inject(TranslationService);

  readonly socialLinks = [
    { platform: 'Instagram', icon: '📸', handle: 'Fonyuy_samuel', url: 'https://instagram.com/Fonyuy_samuel' },
    { platform: 'Facebook',  icon: '👥', handle: 'Fonyuy_samuel', url: 'https://facebook.com/Fonyuy_samuel' },
    { platform: 'Twitter / X', icon: '🐦', handle: '@Fonyuy_samuel', url: 'https://twitter.com/Fonyuy_samuel' },
  ];

  readonly quickLinks = [
    { label: 'nav.firstAid', target: 'first-aid' },
    { label: 'nav.symptoms', target: 'symptoms' },
    { label: 'nav.diseases', target: 'diseases' },
    { label: 'nav.healthTips', target: 'health-tips' },
    { label: 'nav.articles', target: 'articles' },
    { label: 'nav.misconceptions', target: 'misconceptions' },
  ];

  scrollTo(id: string): void {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  }

  currentYear = new Date().getFullYear();
}
