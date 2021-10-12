import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/compat/firestore';
import { from, Observable, of } from 'rxjs';
import { catchError, map, mergeMap, tap } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { AbstractComponent } from '../abstract/abstract.component';
import { Adulte, AnneeScolaire, Bareme, Decision, Groupe } from '../model/model';
import { GestionnaireErreur } from './erreur';

/**
 * Classe traitant tous les appels à la base de données de Firebase.
 */
@Injectable()
export class Dao extends AbstractComponent {

    /** L'observable d'objets métier */
    private observablesInitialises = false;
    private adultes: Observable<Adulte[]> = of([]);
    private decisions: Observable<Decision[]> = of([]);
    private groupes: Observable<Groupe[]> = of([]);
    private baremes: Observable<Bareme[]> = of([]);

    /** Collection firebase  */
    private firebaseDecisions?: AngularFirestoreCollection<Decision>;
    private firebaseAdultes?: AngularFirestoreCollection<Adulte>;

    /** Constructeur pour injection des dépendances */
    constructor(private gestionnaireErreur: GestionnaireErreur, private firestore: AngularFirestore) { super(); }

    /** Liste de tous les tokens de tous les utilisateurs sauf l'utilisateur passé en paramètre */
    public listerTokensUtilisateursSauf(idAdulte: string): Observable<string[]> {
        return this.adultes.pipe(map(liste => liste.filter(a => a.id !== idAdulte && a.token).map(a => a.token as string)));
    }

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

    /** Suppression d'une décision */
    public supprimerUneDecision(id: string): Observable<boolean> {
        // Appel à Firebase
        if (this.firebaseDecisions) {
            return from(this.firebaseDecisions.doc(id).delete()).pipe(
                // Transformation
                map(() => true),
                // Gestion d'erreur
                catchError(erreur => {
                    this.gestionnaireErreur.gererMessageDerreur('Erreur à l\'ajout des données', erreur);
                    return of(true);
                }));
        } else {
            return of(true);
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
            this.firebaseAdultes = this.firestore.collection<Adulte>(environment.collections.adultes);
            this.adultes = this.firebaseAdultes.valueChanges({ idField: 'id' });
            this.groupes = this.firestore.collection<Groupe>(environment.collections.groupes).valueChanges({ idField: 'id' });
            this.baremes = this.firestore.collection<Bareme>(environment.collections.baremes).valueChanges({ idField: 'id' });
            this.observablesInitialises = true;
        }

        // Requête chargeant toutes les données
        const anneeChargee = new AnneeScolaire();
        return this.decisions.pipe(
            map(decisions => { anneeChargee.decisions = decisions; return anneeChargee; }),
            mergeMap(() => this.baremes.pipe(map(baremes => { anneeChargee.baremes = baremes; return anneeChargee; }))),
            mergeMap(() => this.groupes.pipe(map(groupes => { anneeChargee.groupes = groupes; return anneeChargee; }))),
            mergeMap(() => this.adultes.pipe(map(adultes => { anneeChargee.adultes = adultes; return anneeChargee; }))),
            catchError(erreur => {
                this.gestionnaireErreur.gererMessageDerreur('Erreur au chargement des données', erreur);
                return of(anneeChargee);
            })
        );
    }

    /** Sauvegarde du token de l'utilisateur en base */
    public mettreAjourTokenUtilisateurConnecte(idAdulte: string, token: string): Observable<string> {
        return this.adultes.pipe(
            tap(adultes => {
                // Vérification que ce token n'est pas déjà associé à un autre utilisateur (cas d'une déconnexion avec le token qui reste dans la navigateur)
                adultes.filter(a => a.token === token && a.id != idAdulte).forEach(a => {
                    if (this.firebaseAdultes) {
                        console.log(a.id + ' a le même token');
                        this.firebaseAdultes.doc(a.id).update({ token: '' });
                    }
                });

                // Appel à Firebase pour sauvegarder le token de l'utilisateur connecté (s'il est différent)
                adultes.filter(a => a.id == idAdulte).forEach(a => {
                    if (a.token != token && this.firebaseAdultes) {
                        this.firebaseAdultes.doc(idAdulte).update({ token });
                    }
                });
            }),
            map(() => token)
        );
    }
}
