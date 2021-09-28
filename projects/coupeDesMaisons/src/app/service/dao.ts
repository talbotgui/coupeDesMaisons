import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/compat/firestore';
import { from, Observable, of } from 'rxjs';
import { catchError, map, mergeMap } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { Adulte, AnneeScolaire, Bareme, Decision, Groupe } from '../model/model';
import { GestionnaireErreur } from './erreur';

/**
 * Classe traitant tous les appels à la base de données de Firebase.
 */
@Injectable()
export class Dao {

    /** L'observable d'objets métier */
    private observablesInitialises = false;
    private adultes: Observable<Adulte[]> = of([]);
    private decisions: Observable<Decision[]> = of([]);
    private groupes: Observable<Groupe[]> = of([]);
    private baremes: Observable<Bareme[]> = of([]);

    /** Collection firebase des décisions */
    private firebaseDecisions?: AngularFirestoreCollection<Decision>;

    /** Constructeur pour injection des dépendances */
    constructor(private gestionnaireErreur: GestionnaireErreur, private firestore: AngularFirestore) { }

    /** Stockage d'une décision */
    public ajouterUneDecision(decision: Decision): Observable<boolean> {
        // Appel à Firebase
        if (this.firebaseDecisions) {
            return from(this.firebaseDecisions.add(Object.assign({}, decision))).pipe(map(d => !!d))
                // Gestion d'erreur
                .pipe(catchError(erreur => {
                    this.gestionnaireErreur.gererMessageDerreur('Erreur à l\'ajout des données', erreur);
                    return of(false);
                }));
        } else {
            return of(false);
        }
    }

    /** Chargement de toutes les données */
    public chargerDonnees(): Observable<AnneeScolaire | undefined> {

        // Initialisation du lien Firebase si ce n'est pas déjà fait
        if (!this.observablesInitialises) {
            // { idField: 'id' } permet de récupérer l'ID du document Firestore dans l'attribut 'id'
            // @see https://jsmobiledev.com/article/angularfire-idfield/
            this.firebaseDecisions = this.firestore.collection<Decision>(environment.collections.decisions);
            this.decisions = this.firebaseDecisions.valueChanges({ idField: 'id' });
            this.adultes = this.firestore.collection<Adulte>(environment.collections.adultes).valueChanges({ idField: 'id' });
            this.groupes = this.firestore.collection<Groupe>(environment.collections.groupes).valueChanges({ idField: 'id' });
            this.baremes = this.firestore.collection<Bareme>(environment.collections.baremes).valueChanges({ idField: 'id' });
            this.observablesInitialises = true;
        }

        // Requête chargeant toutes les données
        const anneeChargee = new AnneeScolaire();
        return this.adultes.pipe(
            map(adultes => { anneeChargee.adultes = adultes; return anneeChargee; }),
            mergeMap(() => this.baremes.pipe(map(baremes => { anneeChargee.baremes = baremes; return anneeChargee; }))),
            mergeMap(() => this.groupes.pipe(map(groupes => { anneeChargee.groupes = groupes; return anneeChargee; }))),
            mergeMap(() => this.decisions.pipe(map(decisions => { anneeChargee.decisions = decisions; return anneeChargee; }))),
            catchError(erreur => {
                this.gestionnaireErreur.gererMessageDerreur('Erreur au chargement des données', erreur);
                return of(anneeChargee);
            })
        );
    }
}
