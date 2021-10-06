import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AbstractComponent } from '../../abstract/abstract.component';
import { Bareme, Decision, Groupe, SaisieScoreDto } from '../../model/model';
import { Service } from '../../service/service';
import { Utils } from '../../service/utils';

@Component({ selector: 'app-saisiescore', templateUrl: './saisiescore.component.html', styleUrls: ['./saisiescore.component.css'] })
export class SaisieScoreComponent extends AbstractComponent implements OnInit {

  public bareme?: Bareme;
  public groupe?: Groupe;
  public groupes: Groupe[] = [];
  public baremes: Bareme[] = [];

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
    if (this.bareme && this.groupe) {

      // Création de l'objet
      const decision = new Decision();
      decision.idAdulte = this.saisieDto.adulteConnecte?.id;
      decision.date = Utils.creerDateFormatee();
      decision.idGroupe = this.groupe.id;
      decision.idBareme = this.bareme.id;
      decision.points = this.bareme.points;

      // Sauvegarde
      const sub = this.service.ajouterUneDecision(decision).subscribe(resultat => {
        if (resultat) {
          this.dialogRef.close();
        }
      });
      this.declarerSouscription(sub);
    }
  }
}
