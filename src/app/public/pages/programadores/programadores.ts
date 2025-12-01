import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Firestore, collection, query, where, collectionData } from '@angular/fire/firestore';
import { Observable } from 'rxjs';

// CORRECCIÓN AQUÍ: Importamos la interfaz con el nombre correcto
import { Programador } from '../../../core/models/programador.interface';

@Component({
  selector: 'app-programadores',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './programadores.html',
  styleUrls: ['./programadores.scss']
})
export class Programadores implements OnInit {
  private firestore = inject(Firestore);
  
  // Usamos la interfaz 'Programador'
  programmers$!: Observable<Programador[]>;
  loading = true;

  ngOnInit() {
    this.fetchProgrammers();
  }

  fetchProgrammers() {
    const usersRef = collection(this.firestore, 'users');
    // Buscamos users donde el rol sea 'programador'
    const q = query(usersRef, where('role', '==', 'programador'));

    this.programmers$ = collectionData(q, { idField: 'uid' }) as Observable<Programador[]>;
    
    this.loading = false;
  }
}