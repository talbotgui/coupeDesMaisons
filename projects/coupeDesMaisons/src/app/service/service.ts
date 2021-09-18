import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { environment } from '../../environments/environment';
import { Adulte, AnneeScolaire, Bareme, Decision, Groupe } from '../model/model';
import { Evenement } from './evenement';

/**
 * Classe traitant de toutes les logiques.
 */
@Injectable()
export class Service {

    private anneeChargee = new AnneeScolaire();
    private utilisateurConnecte = new Adulte();

    /** Constructeur pour injection des dépendances */
    constructor(private evenement: Evenement) { }

    public seConnecter(utilisateur: string, motDePasse: string): Observable<boolean> {

        // Bouchon
        this.utilisateurConnecte = new Adulte();
        this.utilisateurConnecte.id = 'rogue'
        this.utilisateurConnecte.nom = 'le professeur Rogue';
        this.utilisateurConnecte.photo = '/assets/images/rogue.png';
        this.evenement.lancerEvenementConnexion(this.utilisateurConnecte);

        // Chargement des données
        this.chargerAnneeEnCours();

        // this.evenement.lancerEvenementConnexion();
        return of(true);
    }

    public seDeconnecter(utilisateur: string, motDePasse: string): Observable<boolean> {
        //TODO: à implémenter
        //this.chargerAnneeEnCours()
        // this.evenement.lancerEvenementDeconnexion();
        return of(true);
    }


    public ajouterUneDecision(decision: Decision): Observable<boolean> {
        // Ajout de la décision
        if (!this.anneeChargee.decisions) {
            this.anneeChargee.decisions = [];
        }
        this.anneeChargee.decisions.push(decision);

        // Recalcul des points
        if (this.anneeChargee.groupes) {
            this.anneeChargee.groupes.forEach(g => {
                if (decision.idGroupe == g.id && decision.points) {
                    g.scoreCalcule += decision.points;
                }
            });
        }
        return of(true);
    }

    public supprimerUneDeMesDecision(id: string): Observable<boolean> {
        //TODO: à implémenter
        return of(true);
    }

    private gererMessageDerreur(message: string): void {
        //TODO: à implémenter
    }

    /** Chargement d'une année à la suite d'une connexion */
    private chargerAnneeEnCours(): void {

        // Bouchon
        if (environment.bouchon) {
            this.creerAnneeBouchon();
        }

        // Calcul
        if (this.anneeChargee && this.anneeChargee.decisions && this.anneeChargee.groupes) {

            // Création d'une map de groupe
            const groupes = new Map<string, Groupe>();
            this.anneeChargee.groupes.forEach(g => {
                g.scoreCalcule = 0;
                if (g.id) {
                    groupes.set(g.id, g);
                }
            });

            // Calcul du score à partir des décisions
            this.anneeChargee.decisions.forEach(d => {
                if (d.idGroupe && d.points) {
                    const groupe = groupes.get(d.idGroupe);
                    if (groupe) {
                        groupe.scoreCalcule += d.points;
                    }
                }
            })
        }

        // Notification
        this.evenement.lancerEvenementAnneeChargee(this.anneeChargee);
    }

    /** Créer un bouchon d'année */
    private creerAnneeBouchon(): void {
        this.anneeChargee = new AnneeScolaire();
        this.anneeChargee.adultes.push(this.utilisateurConnecte);
        for (var i = 1; i < 4; i++) {
            const groupe = new Groupe();
            groupe.id = 'g' + i;
            groupe.nom = 'Groupe ' + i;
            groupe.photo = '/assets/images/rogue.png';
            this.anneeChargee.groupes.push(groupe);
        }
        for (var i = +100; i >= -100; i -= 10) {
            const bareme = new Bareme();
            bareme.id = 'b' + i;
            bareme.libelle = i + ' points';
            bareme.points = i;
            this.anneeChargee.baremes.push(bareme);
        }
    }
}
