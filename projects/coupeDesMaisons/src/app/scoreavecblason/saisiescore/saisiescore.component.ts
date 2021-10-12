import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AbstractComponent } from '../../abstract/abstract.component';
import { Bareme, Groupe, SaisieScoreDto } from '../../model/model';
import { Service } from '../../service/service';

@Component({ selector: 'app-saisiescore', templateUrl: './saisiescore.component.html', styleUrls: ['./saisiescore.component.css'] })
export class SaisieScoreComponent extends AbstractComponent implements OnInit {

  /** Donnée saisie : barème */
  public bareme?: Bareme;
  /** Donnée saisie : groupe */
  public groupe?: Groupe;
  /** Données de référence*/
  public groupes: Groupe[] = [];
  /** Données de référence*/
  public baremes: Bareme[] = [];
  /** Flag action en cours */
  public sauvegardeEnCours = false;

  /** Constructeur pour injection des dépendances */
  constructor(private service: Service, private dialogRef: MatDialogRef<SaisieScoreComponent>, @Inject(MAT_DIALOG_DATA) private saisieDto: SaisieScoreDto) { super(); }

  /** A l'initialisation du composant */
  public ngOnInit(): void {
    if (this.saisieDto.annee) {
      this.groupes = this.saisieDto.annee.groupes;
      this.baremes = this.saisieDto.annee.baremes;
      this.baremes.sort((a, b) => (a && b && a.points && b.points) ? a.points - b.points : -1);
    }
  }

  /** Ajout/retrait de points à un groupe */
  public ajouterScore(): void {
    // Sauvegarde
    if (this.bareme && this.groupe && this.saisieDto.adulteConnecte && this.saisieDto.adulteConnecte.id) {
      this.sauvegardeEnCours = true;
      const sub = this.service.ajouterUneDecision(this.bareme, this.groupe, this.saisieDto.adulteConnecte.id).subscribe(resultat => {
        if (resultat) {
          this.dialogRef.close();
          this.sauvegardeEnCours = false;
        }
      });
      this.declarerSouscription(sub);
    }
  }
}
