import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AbstractComponent } from '../abstract/abstract.component';
import { Adulte, AnneeScolaire, SaisieScoreDto } from '../model/model';
import { Evenement } from '../service/evenement';
import { SaisieScoreComponent } from './saisiescore/saisiescore.component';


@Component({ selector: 'app-scoreavecblason', templateUrl: './scoreavecblason.component.html', styleUrls: ['./scoreavecblason.component.css'] })
export class ScoreAvecBlasonComponent extends AbstractComponent implements OnInit {

  public utilisateurConnecte?: Adulte;
  public annee?: AnneeScolaire;
  private dateClicPrecedent?: Date;
  public largeurCol = 12;
  public colDeltaGauche = 0;
  public colDeltaDroite = 0;

  /** Constructeur pour injection des dépendances */
  constructor(private dialog: MatDialog, private evenement: Evenement) { super(); }

  /** Appel au Repository à l'initialisation du composant */
  public ngOnInit(): void {

    // A la connexion/déconnexion d'un utilisateur
    const sub1 = this.evenement.obtenirObservableDeConnexionOuDeconnexion()
      .subscribe(utilisateurConnecte => this.utilisateurConnecte = utilisateurConnecte);
    this.declarerSouscription(sub1);

    // Au chargement d'une année
    const sub2 = this.evenement.obtenirObservableAnneeChargee()
      .subscribe(annee => {
        this.annee = annee;
        if (this.annee && this.annee.groupes) {
          this.largeurCol = 12 / this.annee.groupes.length;
          this.colDeltaGauche = (12 - (this.annee.groupes.length * this.largeurCol)) / 2;
          this.colDeltaDroite = 12 - (this.annee.groupes.length * this.largeurCol) - this.colDeltaGauche;
        }
      });
    this.declarerSouscription(sub2);
  }

  /** Affichage de la popup de saisie des scores si le code est OK */
  public afficherSaisieDeScore(): void {
    // Si un clic précédent est enregistré
    if (this.dateClicPrecedent) {

      // Si le délai entre les deux clics est de moins d'une seconde
      const delaiDepuisDernierClic = (new Date()).getTime() - this.dateClicPrecedent.getTime();
      if (delaiDepuisDernierClic < 1000) {

        // ouverture de la DIALOG de connexion
        const dto = new SaisieScoreDto();
        dto.adulteConnecte = this.utilisateurConnecte;
        dto.annee = this.annee;
        this.dialog.open(SaisieScoreComponent, { height: '325px', width: '255px', data: dto });
      }
    }
    // Dans tous les cas, on enregistre le clic
    this.dateClicPrecedent = new Date();
  }
}
