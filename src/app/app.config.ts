import { ApplicationConfig, isDevMode } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideClientHydration } from '@angular/platform-browser';

import { routes } from './app.routes'; // Asumiendo que tus rutas están aquí
import { environment } from '../environments/environment'; // Importar la configuración

// AngularFire Imports
import { provideFirebaseApp, initializeApp } from '@angular/fire/app';
import { provideAuth, getAuth } from '@angular/fire/auth';
import { provideFirestore, getFirestore } from '@angular/fire/firestore';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideClientHydration(),

    // --- CONEXIÓN A FIREBASE ---
    provideFirebaseApp(() => initializeApp(environment.firebaseConfig)),
    provideAuth(() => getAuth()), // Habilita Autenticación
    provideFirestore(() => getFirestore()), // Habilita Base de Datos Firestore
    

  ]
};