import { Injectable, computed, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { Auth, authState, signInWithEmailAndPassword, signOut } from '@angular/fire/auth';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly auth = inject(Auth);
  private readonly ADMIN_EMAIL = 'fonyuysamuel57@gmail.com';

  private readonly user = toSignal(authState(this.auth), { initialValue: null });
  readonly isAdmin = computed(() => this.user() !== null);

  async login(password: string): Promise<boolean> {
    try {
      await signInWithEmailAndPassword(this.auth, this.ADMIN_EMAIL, password);
      return true;
    } catch {
      return false;
    }
  }

  async logout(): Promise<void> {
    await signOut(this.auth);
  }
}
