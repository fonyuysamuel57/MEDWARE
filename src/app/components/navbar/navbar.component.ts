import { Component, inject, signal, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TranslationService } from '../../services/translation.service';
import { SearchService } from '../../services/search.service';
import { LogoComponent } from '../logo/logo.component';
import { Symptom } from '../../models/types';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, FormsModule, LogoComponent],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent {
  readonly ts = inject(TranslationService);
  private readonly searchSvc = inject(SearchService);

  searchQuery = signal('');
  searchResults = signal<Symptom[]>([]);
  showResults = signal(false);
  menuOpen = signal(false);
  scrolled = signal(false);

  @HostListener('window:scroll')
  onScroll(): void {
    this.scrolled.set(window.scrollY > 60);
  }

  onSearch(value: string): void {
    this.searchQuery.set(value);
    const results = this.searchSvc.searchSymptoms(value, this.ts.getLang());
    this.searchResults.set(results);
    this.showResults.set(value.trim().length >= 2);
  }

  clearSearch(): void {
    this.searchQuery.set('');
    this.searchResults.set([]);
    this.showResults.set(false);
  }

  scrollTo(sectionId: string): void {
    const el = document.getElementById(sectionId);
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    this.menuOpen.set(false);
  }

  toggleMenu(): void {
    this.menuOpen.update(v => !v);
  }

  getDiseasesLabel(symptom: Symptom): string {
    const list = this.ts.getLang() === 'fr' ? symptom.diseasesFr : symptom.diseases;
    return list.join(', ');
  }
}
