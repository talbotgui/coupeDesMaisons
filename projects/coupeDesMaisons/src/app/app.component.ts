import { Component, OnInit } from '@angular/core';
import { Adulte } from './model/model';
import { Evenement } from './service/evenement';
import { Service } from './service/service';


@Component({ selector: 'app-root', templateUrl: './app.component.html', styleUrls: ['./app.component.css'] })
export class AppComponent implements OnInit {

  public utilisateurConnecte?: Adulte;
  public nomUtilisateur?: string;
  public motDePasse?: string;

  /** Constructeur pour injection des dépendances */
  constructor(private service: Service, private evenement: Evenement) { }

  // Appel au Repository à l'initialisation du composant
  ngOnInit(): void {

    // A la connexion/déconnexion d'un utilisateur
    this.evenement.obtenirObservableDeConnexionOuDeconnection()
      .subscribe(utilisateurConnecte => this.utilisateurConnecte = utilisateurConnecte);
  }
}
