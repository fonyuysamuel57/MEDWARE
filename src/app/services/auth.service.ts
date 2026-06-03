import { Injectable, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly _isAdmin = signal<boolean>(false);
  private readonly ADMIN_PASSWORD = 'medware2025';

  readonly isAdmin = this._isAdmin.asReadonly();

  login(password: string): boolean {
    if (password === this.ADMIN_PASSWORD) {
      this._isAdmin.set(true);
      return true;
    }
    return false;
  }

  logout(): void {
    this._isAdmin.set(false);
  }
}
