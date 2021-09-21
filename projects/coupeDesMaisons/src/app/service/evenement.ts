import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Adulte, AnneeScolaire } from '../model/model';

/**
 * Classe traitant de toutes les logiques.
 */
@Injectable()
export class Evenement {

    /** Les subject */
    private connexionOuDeconnexion = new BehaviorSubject<Adulte | undefined>(undefined);
    private anneeChargee = new BehaviorSubject<AnneeScolaire | undefined>(undefined);

    /** Les méthodes de récupération des observables */
    public obtenirObservableDeConnexionOuDeconnexion(): Observable<Adulte | undefined> {
        return this.connexionOuDeconnexion.asObservable();
    }
    public obtenirObservableAnneeChargee(): Observable<AnneeScolaire | undefined> {
        return this.anneeChargee.asObservable();
    }

    /** Les méthodes pour lancer des évènements */
    public lancerEvenementConnexion(adulte: Adulte): void {
        console.log('Connexion réussie de ' + adulte.id);
        this.connexionOuDeconnexion.next(adulte);
    }
    public lancerEvenementDeconnexion(): void {
        this.connexionOuDeconnexion.next(undefined);
    }
    public lancerEvenementAnneeChargee(annee: AnneeScolaire): void {
        console.log('Année chargée : ', annee);
        this.anneeChargee.next(annee);
    }

}
