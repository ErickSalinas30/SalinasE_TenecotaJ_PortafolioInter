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

  users$!: Observable<Programador[]>;
  
  // Variables para edición (Tabla)
  editingId: string | null = null;
  editForm: any = {};

  // Variables para creación (Modal)
  showCreateModal = false;
  newUser: any = { displayName: '', email: '', role: 'programador', specialty: '', description: '', horarios: '' };

  // NUEVO: Lista de horas fijas para el ComboBox
  listaHorarios: string[] = [
    '08:00', '09:00', '10:00', '11:00', '12:00', 
    '13:00', '14:00', '15:00', '16:00', '17:00'
  ];

  ngOnInit() {
    const usersRef = collection(this.firestore, 'users');
    this.users$ = collectionData(usersRef, { idField: 'uid' }) as Observable<Programador[]>;
  }

  // --- MÉTODOS DE EDICIÓN ---
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
        // Guardamos el horario seleccionado
        horarios: this.editForm.horarios || 'No asignado'
      });
      alert('Usuario actualizado correctamente');
      this.cancelEdit();
    } catch (error) {
      console.error(error);
      alert('Error al actualizar');
    }
  }

  async deleteUser(uid: string) {
    if(confirm('¿Estás seguro de eliminar este usuario?')) {
      const userRef = doc(this.firestore, `users/${uid}`);
      await deleteDoc(userRef);
    }
  }

  // --- MÉTODOS DE CREACIÓN (MODAL) ---
  toggleCreateModal() {
    this.showCreateModal = !this.showCreateModal;
    if (this.showCreateModal) {
      this.newUser = { displayName: '', email: '', role: 'programador', specialty: '', description: '', horarios: '' };
    }
  }

  async createUser() {
    if (!this.newUser.displayName || !this.newUser.email) {
      alert('El nombre y el correo son obligatorios');
      return;
    }
    try {
      const usersRef = collection(this.firestore, 'users');
      await addDoc(usersRef, {
        displayName: this.newUser.displayName,
        email: this.newUser.email,
        role: this.newUser.role,
        specialty: this.newUser.specialty || '',
        description: this.newUser.description || '',
        horarios: this.newUser.horarios || '',
        photoURL: '',
        createdAt: new Date()
      });
      alert('Usuario creado exitosamente');
      this.toggleCreateModal();
    } catch (error) {
      console.error(error);
      alert('Error al crear usuario');
    }
  }
}