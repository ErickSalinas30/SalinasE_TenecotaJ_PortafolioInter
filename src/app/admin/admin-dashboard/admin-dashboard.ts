import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Firestore, collection, collectionData, doc, updateDoc, deleteDoc } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { Programador } from '../../core/models/programador.interface';
import { FormsModule } from '@angular/forms'; // Necesario para editar inputs

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule], // Importamos FormsModule para los formularios
  templateUrl: './admin-dashboard.html',
  styleUrls: ['./admin-dashboard.scss']
})
export class AdminDashboard implements OnInit {
  private firestore = inject(Firestore);

  // Observable de usuarios
  users$!: Observable<Programador[]>;
  
  // Variables para edición rápida
  editingId: string | null = null;
  editForm: any = {};

  ngOnInit() {
    // 1. Traer TODOS los usuarios (Admins, Programadores y Normales)
    const usersRef = collection(this.firestore, 'users');
    this.users$ = collectionData(usersRef, { idField: 'uid' }) as Observable<Programador[]>;
  }

  // Activar modo edición para un usuario
  startEdit(user: Programador) {
    this.editingId = user.uid;
    // Copiamos los datos para no modificar la vista hasta guardar
    this.editForm = { ...user }; 
  }

  // Cancelar edición
  cancelEdit() {
    this.editingId = null;
    this.editForm = {};
  }

  // Guardar cambios en Firebase
  async saveUser() {
    if (!this.editingId) return;

    const userRef = doc(this.firestore, `users/${this.editingId}`);
    
    try {
      await updateDoc(userRef, {
        displayName: this.editForm.displayName,
        role: this.editForm.role,
        specialty: this.editForm.specialty || '', // Guardar vacío si no hay nada
        description: this.editForm.description || ''
      });
      alert('Usuario actualizado correctamente');
      this.cancelEdit();
    } catch (error) {
      console.error(error);
      alert('Error al actualizar');
    }
  }

  // Eliminar usuario (Opcional)
  async deleteUser(uid: string) {
    if(confirm('¿Estás seguro de eliminar este usuario del sistema?')) {
      const userRef = doc(this.firestore, `users/${uid}`);
      await deleteDoc(userRef);
    }
  }
}