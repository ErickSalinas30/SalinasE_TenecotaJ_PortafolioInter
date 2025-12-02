export interface Programador {
  uid: string;
  displayName: string;
  photoURL?: string;
  email: string;
  specialty?: string;
  description?: string;
  horarios?: string; // <--- Esta es la línea que te falta
  role: 'admin' | 'programador' | 'usuario';
  createdAt?: any; // Agregamos esto también por si acaso
}