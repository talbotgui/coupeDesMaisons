import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Adulte } from '../model/model';
import { Evenement } from '../service/evenement';
import { ConnexionComponent } from './connexion/connexion.component';


@Component({ selector: 'app-utilisateur', templateUrl: './utilisateur.component.html', styleUrls: ['./utilisateur.component.css'] })
export class UtilisateurComponent implements OnInit {

  /** Information de l'utilisateur connecté */
  public utilisateurConnecte?: Adulte;

  /** Constructeur pour injection des dépendances */
  constructor(private dialog: MatDialog, private evenement: Evenement) { }

  // Appel au Repository à l'initialisation du composant
  ngOnInit(): void {

    // A la connexion/déconnexion d'un utilisateur
    this.evenement.obtenirObservableDeConnexionOuDeconnexion()
      .subscribe(utilisateurConnecte => this.utilisateurConnecte = utilisateurConnecte);

    // ouverture de la DIALOG de connexion
    this.dialog.open(ConnexionComponent, { height: '320px', width: '255px' });
  }
}
