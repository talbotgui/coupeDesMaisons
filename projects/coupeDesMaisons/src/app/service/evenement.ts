import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Adulte } from '../model/model';

/**
 * Classe traitant de toutes les logiques.
 */
@Injectable()
export class Evenement {

    /** Les subject */
    private connectionOuDeconnection = new BehaviorSubject<Adulte | undefined>(undefined);

    /** Les méthodes de récupération des observables */
    public obtenirObservableDeConnexionOuDeconnection(): Observable<Adulte | undefined> {
        return this.connectionOuDeconnection.asObservable();
    }

    /** Les méthodes pour lancer des évènements */
    public lancerEvenementConnection(adulte: Adulte): void {
        this.connectionOuDeconnection.next(adulte);
    }
    public lancerEvenementCeconnection(): void {
        this.connectionOuDeconnection.next(undefined);
    }

}
