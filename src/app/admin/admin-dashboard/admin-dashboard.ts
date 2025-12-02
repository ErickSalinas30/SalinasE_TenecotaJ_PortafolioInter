import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Firestore, collection, collectionData, doc, updateDoc, deleteDoc, addDoc } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { Programador } from '../../core/models/programador.interface';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin-dashboard.html',
  styleUrls: ['./admin-dashboard.scss']
})
export class AdminDashboard implements OnInit {
  private firestore = inject(Firestore);

  // Observable de usuarios
  users$!: Observable<Programador[]>;
  
  // Variables para edición rápida (Tabla)
  editingId: string | null = null;
  editForm: any = {};

  // VARIABLES PARA CREAR NUEVO USUARIO (MODAL)
  showCreateModal = false;
  newUser: any = {
    displayName: '',
    email: '',
    role: 'programador',
    specialty: '',
    description: '',
    horarios: ''
  };

  ngOnInit() {
    // 1. Traer TODOS los usuarios
    const usersRef = collection(this.firestore, 'users');
    this.users$ = collectionData(usersRef, { idField: 'uid' }) as Observable<Programador[]>;
  }

  // --- LÓGICA DE EDICIÓN (Tabla) ---
  startEdit(user: Programador) {
    this.editingId = user.uid;
    this.editForm = { ...user }; 
  }

  cancelEdit() {
    this.editingId = null;
    this.editForm = {};
  }

  async saveUser() {
    if (!this.editingId) return;
    const userRef = doc(this.firestore, `users/${this.editingId}`);
    try {
      await updateDoc(userRef, {
        displayName: this.editForm.displayName,
        role: this.editForm.role,
        specialty: this.editForm.specialty || '',
        description: this.editForm.description || '',
        horarios: this.editForm.horarios || ''
      });
      alert('Usuario actualizado correctamente');
      this.cancelEdit();
    } catch (error) {
      console.error(error);
      alert('Error al actualizar');
    }
  }

  async deleteUser(uid: string) {
    if(confirm('¿Estás seguro de eliminar este usuario del sistema?')) {
      const userRef = doc(this.firestore, `users/${uid}`);
      await deleteDoc(userRef);
    }
  }

  // --- LÓGICA DE CREACIÓN (Modal) ---
  toggleCreateModal() {
    this.showCreateModal = !this.showCreateModal;
    // Reseteamos el formulario al abrir
    if (this.showCreateModal) {
      this.newUser = { 
        displayName: '', 
        email: '', 
        role: 'programador', 
        specialty: '', 
        description: '',
        horarios: ''
      };
    }
  }

  async createUser() {
    if (!this.newUser.displayName || !this.newUser.email) {
      alert('El nombre y el correo son obligatorios');
      return;
    }

    try {
      const usersRef = collection(this.firestore, 'users');
      // Firebase crea un ID automático para este documento
      await addDoc(usersRef, {
        displayName: this.newUser.displayName,
        email: this.newUser.email,
        role: this.newUser.role,
        specialty: this.newUser.specialty || '',
        description: this.newUser.description || '',
        horarios: this.newUser.horarios || '',
        photoURL: '', // Sin foto al inicio
        createdAt: new Date()
      });

      alert('Usuario creado exitosamente');
      this.toggleCreateModal(); // Cerramos modal
    } catch (error) {
      console.error(error);
      alert('Error al crear usuario');
    }
  }
}