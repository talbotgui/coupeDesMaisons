import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Observable, of } from 'rxjs';
import { map, mergeMap } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { Adulte, AnneeScolaire, Bareme, Decision, Groupe } from '../model/model';

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

    /** Données chargées */
    private annee = new AnneeScolaire();

    /** Constructeur pour injection des dépendances */
    constructor(private firestore: AngularFirestore) { }

    /** Chargement de toutes les données */
    public chargerDonnees(): Observable<AnneeScolaire | undefined> {

        // Si le bouchon est actif
        if (environment.bouchon) {
            this.creerDonneesBouchon()
            return of(this.annee);
        }

        // Initialisation du lien Firebase si ce n'est pas déjà fait
        if (!this.observablesInitialises) {
            // { idField: 'id' } permet de récupérer l'ID du document Firestore dans l'attribut 'id'
            // @see https://jsmobiledev.com/article/angularfire-idfield/
            this.adultes = this.firestore.collection<Adulte>('adultes').valueChanges({ idField: 'id' });
            this.decisions = this.firestore.collection<Decision>('decisions').valueChanges({ idField: 'id' });
            this.groupes = this.firestore.collection<Groupe>('groupes').valueChanges({ idField: 'id' });
            this.baremes = this.firestore.collection<Bareme>('baremes').valueChanges({ idField: 'id' });
            this.observablesInitialises = true;
        }

        // Requête chargeant toutes les données
        return this.adultes.pipe(
            map(adultes => { this.annee.adultes = adultes; return this.annee; }),
            mergeMap(() => this.baremes.pipe(map(baremes => { this.annee.baremes = baremes; return this.annee; }))),
            mergeMap(() => this.groupes.pipe(map(groupes => { this.annee.groupes = groupes; return this.annee; }))),
            mergeMap(() => this.decisions.pipe(map(decisions => { this.annee.decisions = decisions; return this.annee; })))
        );
    }

    /** Créer un bouchon d'année */
    private creerDonneesBouchon(): void {
        for (var i = 1; i < 4; i++) {
            const groupe = new Groupe();
            groupe.id = 'g' + i;
            groupe.nom = 'Groupe ' + i;
            groupe.photo = '/assets/images/rogue.png';
            this.annee.groupes.push(groupe);
        }
        for (var i = +100; i >= -100; i -= 10) {
            const bareme = new Bareme();
            bareme.id = 'b' + i;
            bareme.libelle = i + ' points';
            bareme.points = i;
            this.annee.baremes.push(bareme);
        }
    }
}
