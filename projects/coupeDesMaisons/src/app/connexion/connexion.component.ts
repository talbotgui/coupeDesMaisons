import { Component, OnInit } from '@angular/core';
import { Adulte } from '../model/model';
import { Evenement } from '../service/evenement';
import { Service } from '../service/service';


@Component({ selector: 'app-connexion', templateUrl: './connexion.component.html', styleUrls: ['./connexion.component.css'] })
export class ConnexionComponent implements OnInit {

  public utilisateurConnecte?: Adulte;
  public nomUtilisateur?: string;
  public motDePasse?: string;

  /** Constructeur pour injection des dépendances */
  constructor(private service: Service, private evenement: Evenement) { }

  // Appel au Repository à l'initialisation du composant
  ngOnInit(): void {

    // A la connexion/déconnexion d'un utilisateur
    this.evenement.obtenirObservableDeConnexionOuDeconnexion()
      .subscribe(utilisateurConnecte => this.utilisateurConnecte = utilisateurConnecte);
  }

  public seConnecter(): void {
    if (this.nomUtilisateur && this.motDePasse) {
      this.service.seConnecter(this.nomUtilisateur, this.motDePasse);
    }
  }
}
