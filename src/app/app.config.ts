import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getAuth, provideAuth } from '@angular/fire/auth';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';
import { getStorage, provideStorage } from '@angular/fire/storage';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }), 
    provideFirebaseApp(
      () => initializeApp(
        {
          "projectId":"medware-4c955",
          "appId":"1:203119931295:web:a5b532340cfb02d16917aa",
          "storageBucket":"medware-4c955.firebasestorage.app",
          "apiKey":"AIzaSyDojVvdBrMfMzz7SERVq4IHmjHrDjW9VwQ",
          "authDomain":"medware-4c955.firebaseapp.com",
          "messagingSenderId":"203119931295",
          "measurementId":"G-YSPYTZG099",
        }
      )
    ),
    provideAuth(() => getAuth()), 
    provideFirestore(() => getFirestore()), 
    provideStorage(() => getStorage())
  ]
};
