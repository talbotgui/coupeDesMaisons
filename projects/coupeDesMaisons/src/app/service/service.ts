import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Adulte, AnneeScolaire } from '../model/model';
import { Evenement } from './evenement';

/**
 * Classe traitant de toutes les logiques.
 */
@Injectable()
export class Service {

    /** Année chargée en mémoire suite à une connexion */
    private anneeScolaire?: AnneeScolaire;
    private adulteConnecte?: Adulte;



    /** Constructeur pour injection des dépendances */
    constructor(private evenement: Evenement) { }

    public seConnecter(utilisateur: string, motDePasse: string): Observable<void> {
        //TODO: à implémenter
        // this.chargerAnneeEnCours();
        // this.evenement.lancerEvenementConnection();
        return of();
    }

    public seDeconnecter(utilisateur: string, motDePasse: string): Observable<void> {
        //TODO: à implémenter
        //this.chargerAnneeEnCours()
        // this.evenement.lancerEvenementDeconnection();
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
