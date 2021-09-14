import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Adulte, AnneeScolaire, Bareme, Decision, Groupe } from '../model/model';
import { Evenement } from './evenement';

/**
 * Classe traitant de toutes les logiques.
 */
@Injectable()
export class Service {

    /** Constructeur pour injection des dépendances */
    constructor(private evenement: Evenement) { }

    public seConnecter(utilisateur: string, motDePasse: string): Observable<void> {
        //TODO: à implémenter
        // this.chargerAnneeEnCours();
        // this.evenement.lancerEvenementConnexion();
        const adulteConnecte = new Adulte();
        adulteConnecte.nom = 'le professeur Rogue';
        adulteConnecte.photo = '/assets/images/rogue.png';
        this.evenement.lancerEvenementConnexion(adulteConnecte);

        const annee = new AnneeScolaire();
        annee.adultes.push(adulteConnecte);
        for (var i = 0; i < 4; i++) {
            const groupe = new Groupe();
            groupe.nom = 'Groupe ' + i;
            annee.groupes.push(groupe);
        }
        for (var i = 0; i < 10; i++) {
            const bareme = new Bareme();
            bareme.libelle = 'Bareme ' + i;
            bareme.points = i * 10 - 50;
            annee.baremes.push(bareme);
        }
        const decision = new Decision();
        decision.adulte = adulteConnecte;
        decision.bareme = annee.baremes[0];
        decision.groupe = annee.groupes[0];
        decision.points = 10;
        annee.decisions.push(decision);
        this.evenement.lancerEvenementAnneeChargee(annee);
        return of();
    }

    public seDeconnecter(utilisateur: string, motDePasse: string): Observable<void> {
        //TODO: à implémenter
        //this.chargerAnneeEnCours()
        // this.evenement.lancerEvenementDeconnexion();
        return of();
    }


    public ajouterUneDecision(): Observable<void> {
        //TODO: à implémenter
        return of();
    }

    public supprimerUneDeMesDecision(id: string): Observable<void> {
        //TODO: à implémenter
        return of();
    }

    private gererMessageDerreur(message: string): void {
        //TODO: à implémenter
    }

    /** Chargement d'une année à la suite d'une connexion */
    private chargerAnneeEnCours(): AnneeScolaire {
        //TODO: à implémenter
        return new AnneeScolaire();
    }
}
