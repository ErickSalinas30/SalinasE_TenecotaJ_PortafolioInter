import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Firestore, collection, query, where, getDocs, addDoc } from '@angular/fire/firestore';
import { Auth } from '@angular/fire/auth';
import { Programador } from '../../core/models/programador.interface';
import { Asesoria } from '../../core/models/asesoria.interface';

@Component({
  selector: 'app-agendar',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './agendar.component.html',
  styleUrls: ['./agendar.component.scss']
})
export class AgendarComponent implements OnInit {
  private firestore = inject(Firestore);
  private auth = inject(Auth);
  private router = inject(Router);

  programadores: Programador[] = [];
  
  // --- NUEVO: Lista de horas fijas de 8:00 a 17:00 ---
  horariosDisponibles: string[] = [
    '08:00', '09:00', '10:00', '11:00', '12:00', 
    '13:00', '14:00', '15:00', '16:00', '17:00'
  ];

  solicitud: any = {
    programadorId: '',
    fecha: '',
    hora: '', // Aquí se guardará una de las horas de la lista
    tema: ''
  };

  ngOnInit() {
    this.cargarProgramadores();
  }

  async cargarProgramadores() {
    const usersRef = collection(this.firestore, 'users');
    const q = query(usersRef, where('role', '==', 'programador'));
    const snapshot = await getDocs(q);
    
    this.programadores = snapshot.docs.map(doc => ({
      uid: doc.id,
      ...doc.data()
    } as Programador));
  }

  async enviarSolicitud() {
    const user = this.auth.currentUser;

    if (!user) {
      alert('Debes iniciar sesión para agendar una asesoría.');
      this.router.navigate(['/login']);
      return;
    }

    if (!this.solicitud.programadorId || !this.solicitud.fecha || !this.solicitud.hora || !this.solicitud.tema) {
      alert('Por favor completa todos los campos.');
      return;
    }

    const progSeleccionado = this.programadores.find(p => p.uid === this.solicitud.programadorId);

    const nuevaAsesoria: Asesoria = {
      clienteId: user.uid,
      clienteNombre: user.displayName || 'Usuario Anónimo',
      clienteEmail: user.email || '',
      programadorId: this.solicitud.programadorId,
      programadorNombre: progSeleccionado?.displayName || 'Desconocido',
      fecha: this.solicitud.fecha,
      hora: this.solicitud.hora,
      tema: this.solicitud.tema,
      estado: 'Pendiente'
    };

    try {
      await addDoc(collection(this.firestore, 'asesorias'), nuevaAsesoria);
      alert('¡Solicitud enviada! El programador revisará tu petición.');
      this.router.navigate(['/']); 
    } catch (error) {
      console.error(error);
      alert('Error al enviar la solicitud.');
    }
  }
}