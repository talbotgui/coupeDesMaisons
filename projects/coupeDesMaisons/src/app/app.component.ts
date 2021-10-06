import { Component, OnInit } from '@angular/core';
import { AbstractComponent } from './abstract/abstract.component';
import { Adulte } from './model/model';
import { Evenement } from './service/evenement';
import { Service } from './service/service';

@Component({ selector: 'app-root', templateUrl: './app.component.html', styleUrls: ['./app.component.css'] })
export class AppComponent extends AbstractComponent implements OnInit {

  /** Référence à l'utiliateur connecté (utilisé pour conditionner des affichages) */
  public utilisateurConnecte?: Adulte;

  /** Flag définissant la vue affichée */
  public vueBlasonAffichee = true;

  /** Constructeur pour injection des dépendances */
  constructor(private service: Service, private evenement: Evenement) { super(); }

  // Appel au Repository à l'initialisation du composant
  public ngOnInit(): void {

    // A la connexion/déconnexion d'un utilisateur
    const sub = this.evenement.obtenirObservableDeConnexionOuDeconnexion()
      .subscribe(utilisateurConnecte => this.utilisateurConnecte = utilisateurConnecte);
    this.declarerSouscription(sub);
  }
}
