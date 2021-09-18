import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Bareme, Decision, Groupe, SaisieScoreDto } from '../../model/model';
import { Service } from '../../service/service';

@Component({ selector: 'app-saisiescore', templateUrl: './saisiescore.component.html', styleUrls: ['./saisiescore.component.css'] })
export class SaisieScoreComponent implements OnInit {

  public bareme?: Bareme;
  public groupe?: Groupe;
  public groupes: Groupe[] = [];
  public baremes: Bareme[] = [];

  /** Constructeur pour injection des dépendances */
  constructor(private service: Service, private dialogRef: MatDialogRef<SaisieScoreComponent>, @Inject(MAT_DIALOG_DATA) private saisieDto: SaisieScoreDto) { }
  ngOnInit(): void {
    if (this.saisieDto.annee) {
      this.groupes = this.saisieDto.annee.groupes;
      this.baremes = this.saisieDto.annee.baremes;
    }
  }

  /** Ajout/retrait de points à un groupe */
  public ajouterScore(): void {
    if (this.bareme && this.groupe) {

      // Création de l'objet
      const decision = new Decision();
      decision.idAdulte = this.saisieDto.adulteConnecte?.id;
      decision.date = this.creerDateFormatee();
      decision.idGroupe = this.groupe.id;
      decision.idBareme = this.bareme.id;
      decision.points = this.bareme.points;

      // Sauvegarde
      this.service.ajouterUneDecision(decision).subscribe(resultat => {
        if (resultat) {
          this.dialogRef.close();
        }
      });
    }
  }

  /** Créer la date du jour en string formattée */
  private creerDateFormatee(): string {
    const d = new Date();
    return (d.getDay() < 10) ? '0' : '' + d.getDay() + '/' + (d.getMonth() < 10) ? '0' : '' + d.getMonth() + '/' + d.getFullYear();
  }
}
