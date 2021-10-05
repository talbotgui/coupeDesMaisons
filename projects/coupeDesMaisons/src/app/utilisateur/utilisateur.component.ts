import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { AbstractComponent } from '../abstract/abstract.component';
import { Adulte } from '../model/model';
import { Evenement } from '../service/evenement';
import { ConnexionComponent } from './connexion/connexion.component';
import { DeconnexionComponent } from './deconnexion/deconnexion.component';

@Component({ selector: 'app-utilisateur', templateUrl: './utilisateur.component.html', styleUrls: ['./utilisateur.component.css'] })
export class UtilisateurComponent extends AbstractComponent implements OnInit {

  private static MAT_DIALOG_CONFIG = Object.assign(new MatDialogConfig(), { height: '320px', width: '255px', disableClose: true });

  /** Information de l'utilisateur connecté */
  public utilisateurConnecte?: Adulte;

  /** Constructeur pour injection des dépendances */
  constructor(private dialog: MatDialog, private evenement: Evenement) { super(); }

  // Appel au Repository à l'initialisation du composant
  public ngOnInit(): void {

    // A la connexion/déconnexion d'un utilisateur
    const sub = this.evenement.obtenirObservableDeConnexionOuDeconnexion()
      .subscribe(utilisateurConnecte => {
        // Sauvegarde du statut
        this.utilisateurConnecte = utilisateurConnecte;
        // ouverture de la dialg de connexion à la déconnexion et au chargement de la page
        if (!utilisateurConnecte) {
          console.log('réouverture de la dialog de connexion post déconnexion', utilisateurConnecte);
          this.ouvrirPopupConnexion();
        }
      });
    this.declarerSouscription(sub);
  }

  /** ouverture de la DIALOG de connexion */
  public ouvrirPopupConnexion(): void {
    this.dialog.open(ConnexionComponent, UtilisateurComponent.MAT_DIALOG_CONFIG);
  }

  /** ouverture de la DIALOG de déconnexion */
  public ouvrirPopupDeconnexion(): void {
    this.dialog.open(DeconnexionComponent, { data: this.utilisateurConnecte });
  }
}
