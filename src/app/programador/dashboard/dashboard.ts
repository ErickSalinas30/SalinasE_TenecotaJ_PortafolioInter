import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Firestore, collection, addDoc, deleteDoc, doc, query, where, collectionData } from '@angular/fire/firestore';
import { Auth } from '@angular/fire/auth';
import { Observable } from 'rxjs';
// Intenta con DOS niveles hacia atrás:
import { Proyecto } from '../../core/models/proyecto.interface';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './dashboard.html',
  styleUrls: ['./dashboard.scss']
})
export class Dashboard implements OnInit {
  private firestore = inject(Firestore);
  private auth = inject(Auth);

  projects$!: Observable<Proyecto[]>;
  currentUser: any;

  // Objeto para el formulario de nuevo proyecto
  newProject: Proyecto = {
    programmerId: '',
    titulo: '',
    descripcion: '',
    tipo: 'Academico',
    tecnologias: '',
    repoUrl: '',
    demoUrl: ''
  };

  ngOnInit() {
    this.currentUser = this.auth.currentUser;
    
    if (this.currentUser) {
      this.loadMyProjects();
    }
  }

  loadMyProjects() {
    const projectsRef = collection(this.firestore, 'projects');
    
    // Query: Traer proyectos donde programmerId == MI_ID
    const q = query(projectsRef, where('programmerId', '==', this.currentUser.uid));
    
    this.projects$ = collectionData(q, { idField: 'id' }) as Observable<Proyecto[]>;
  }

  async addProject() {
    if (!this.newProject.titulo || !this.newProject.descripcion) {
      alert('El título y la descripción son obligatorios');
      return;
    }

    try {
      // Asignamos el ID del dueño
      this.newProject.programmerId = this.currentUser.uid;
      
      const projectsRef = collection(this.firestore, 'projects');
      await addDoc(projectsRef, this.newProject);
      
      alert('Proyecto agregado con éxito');
      this.resetForm();
    } catch (error) {
      console.error(error);
      alert('Error al guardar');
    }
  }

  async deleteProject(projectId: string) {
    if (confirm('¿Eliminar este proyecto? No se puede deshacer.')) {
      const docRef = doc(this.firestore, `projects/${projectId}`);
      await deleteDoc(docRef);
    }
  }

  resetForm() {
    this.newProject = {
      programmerId: '',
      titulo: '',
      descripcion: '',
      tipo: 'Academico',
      tecnologias: '',
      repoUrl: '',
      demoUrl: ''
    };
  }
}