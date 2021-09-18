import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Adulte } from '../model/model';
import { Evenement } from '../service/evenement';
import { SaisieScoreComponent } from './saisiescore/saisiescore.component';


@Component({ selector: 'app-scoreavecblason', templateUrl: './scoreavecblason.component.html', styleUrls: ['./scoreavecblason.component.css'] })
export class ScoreAvecBlasonComponent implements OnInit {

  public utilisateurConnecte?: Adulte;
  private dateClicPrecedent?: Date;


  /** Constructeur pour injection des dépendances */
  constructor(private dialog: MatDialog, private evenement: Evenement) { }

  /** Appel au Repository à l'initialisation du composant */
  ngOnInit(): void {

    // A la connexion/déconnexion d'un utilisateur
    this.evenement.obtenirObservableDeConnexionOuDeconnexion()
      .subscribe(utilisateurConnecte => this.utilisateurConnecte = utilisateurConnecte);
  }

  /** Affichage de la popup de saisie des scores si le code est OK */
  public afficherSaisieDeScore(): void {
    // Si un clic précédent est enregistré
    if (this.dateClicPrecedent) {

      // Si le délai entre les deux clics est de moins d'une seconde
      const delaiDepuisDernierClic = (new Date()).getTime() - this.dateClicPrecedent.getTime();
      if (delaiDepuisDernierClic < 1000) {

        // ouverture de la DIALOG de connexion
        this.dialog.open(SaisieScoreComponent, { height: '310px', width: '255px' });
      }
    }
    // Dans tous les cas, on enregistre le clic
    this.dateClicPrecedent = new Date();
  }
}
