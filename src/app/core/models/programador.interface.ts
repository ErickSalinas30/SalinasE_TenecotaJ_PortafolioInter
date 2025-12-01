export interface Programador {
  uid: string;
  displayName: string;
  photoURL?: string;
  email: string;
  specialty?: string; // O 'especialidad' si prefieres todo español
  description?: string; // O 'descripcion'
  role: 'admin' | 'programador' | 'usuario';
}