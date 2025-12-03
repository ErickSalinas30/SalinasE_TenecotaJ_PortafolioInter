export interface Proyecto {
  id?: string;
  programmerId: string;
  titulo: string;
  descripcion: string;
  tipo: 'Academico' | 'Laboral';
  tecnologias: string;
  repoUrl?: string;
  demoUrl?: string;
  photoURL?: string; // <- opcional
}
