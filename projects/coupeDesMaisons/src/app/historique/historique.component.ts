import { Component, OnInit } from '@angular/core';
import { AbstractComponent } from '../abstract/abstract.component';
import { Adulte, Bareme, Decision } from '../model/model';
import { Evenement } from '../service/evenement';
import { Service } from '../service/service';
import { Utils } from '../service/utils';

@Component({ selector: 'app-historique', templateUrl: './historique.component.html', styleUrls: ['./historique.component.css'] })
export class HistoriqueComponent extends AbstractComponent implements OnInit {

  /** Utilisateur connecté */
  public utilisateurConnecte?: Adulte;

  /** Liste des décisions */
  public decisions: Decision[] = [];

  /** Barèmes sous forme de référentiel */
  public baremes: { [index: string]: Bareme } = {};

  /** Adultes sous forme de référentiel */
  public adultes: { [index: string]: Adulte } = {};

  /** Constructeur pour injection des dépendances */
  constructor(private evenement: Evenement, private service: Service) { super(); }

  /** Appel au Repository à l'initialisation du composant */
  public ngOnInit(): void {

    // A la connexion/déconnexion d'un utilisateur
    const sub1 = this.evenement.obtenirObservableDeConnexionOuDeconnexion()
      .subscribe(utilisateurConnecte => this.utilisateurConnecte = utilisateurConnecte);
    this.declarerSouscription(sub1);

    // Au chargement d'une année
    const sub2 = this.evenement.obtenirObservableAnneeChargee().subscribe(annee => {
      // Sauvegarde des données
      if (annee && annee.decisions && annee.baremes) {
        this.decisions = annee.decisions;
        this.decisions.forEach(d => d.dateTech = Utils.creerDateTechnique(d.date));
        this.decisions.sort((a, b) => (a && b && a.dateTech && b.dateTech) ? b.dateTech - a.dateTech : -1);
        this.baremes = {};
        annee.baremes.forEach(b => { if (b.id) { this.baremes[b.id] = b; } });
        this.adultes = {};
        annee.adultes.forEach(a => { if (a.id) { this.adultes[a.id] = a; } });
      }
    });
    this.declarerSouscription(sub2);
  }

  /** Suppression d'une décision */
  public supprimerDecision(d: Decision): void {
    if (d.id) {
      this.service.supprimerUneDeMesDecisions(d.id).subscribe().unsubscribe();
    }
  }
}
