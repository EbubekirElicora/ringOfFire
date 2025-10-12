import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { provideFirebaseApp, initializeApp } from '@angular/fire/app';
import { provideFirestore, getFirestore } from '@angular/fire/firestore';
import { MatDialogModule } from '@angular/material/dialog';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    importProvidersFrom(
      BrowserAnimationsModule,
      MatDialogModule,
      provideFirebaseApp(() => initializeApp({
        apiKey: "AIzaSyBSyKLRz6Ltsrj9GWQVx2f0ypHuujmVPds",
        authDomain: "ringoffire-4816e.firebaseapp.com",
        databaseURL: "https://ringoffire-4816e-default-rtdb.europe-west1.firebasedatabase.app",
        projectId: "ringoffire-4816e",
        storageBucket: "ringoffire-4816e.appspot.com",
        messagingSenderId: "857008554331",
        appId: "1:857008554331:web:94792c2161f4a1999e1a7e"
      })),
      provideFirestore(() => getFirestore())
    )
  ]
};
