import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { Service } from '../../service/service';


@Component({ selector: 'app-saisiescore', templateUrl: './saisiescore.component.html', styleUrls: ['./saisiescore.component.css'] })
export class SaisieScoreComponent {

  /** Constructeur pour injection des dépendances */
  constructor(private service: Service, private dialogRef: MatDialogRef<SaisieScoreComponent>) { }

}
