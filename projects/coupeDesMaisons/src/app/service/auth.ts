import { isPlatformServer } from '@angular/common';
import { Inject, Injectable, OnDestroy, PLATFORM_ID } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { trace } from '@angular/fire/compat/performance';
import { UserCredential } from '@firebase/auth-types';
import { from, Observable, of, Subscription } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { Adulte } from '../model/model';
import { GestionnaireErreur } from './erreur';

/**
 * Classe traitant tous les appels à la sécurité de Firebase.
 */
@Injectable()
export class Auth implements OnDestroy {

    /** Instance de la surveillance des connexions/déconnexions */
    private readonly userDisposable: Subscription | undefined;

    /** Constructeur pour injection des dépendances */
    constructor(private gestionnaireErreur: GestionnaireErreur, private auth: AngularFireAuth, @Inject(PLATFORM_ID) platformId: object) {

        // Surveillance d'une connexion
        if (!isPlatformServer(platformId)) {
            this.userDisposable = this.auth.authState
                .pipe(trace('auth'), map(u => !!u)).
                subscribe(isLoggedIn => console.log('utilisateur connecté : ' + isLoggedIn));
        }
    }

    /** A la destruction de l'objet */
    public ngOnDestroy(): void {
        if (this.userDisposable) {
            this.userDisposable.unsubscribe();
        }
    }

    /** Connexion avec un login et un mot de passe */
    public seConnecter(utilisateur: string, motDePasse: string): Observable<Adulte | undefined> {

        // Si le bouchon est actif
        if (environment.bouchon) {
            const utilisateurConnecte = new Adulte();
            utilisateurConnecte.id = 'rogue'
            utilisateurConnecte.nom = 'le professeur Rogue';
            utilisateurConnecte.photo = '/assets/images/rogue.png';
            return of(utilisateurConnecte);
        }

        // Appel à Firebase
        return from(this.auth.signInWithEmailAndPassword(utilisateur, motDePasse)).pipe(
            // Transformation de l'objet UserCredential en Adulte
            map((resultat: UserCredential) => {
                if (resultat.user && resultat.user.email) {
                    const utilisateurConnecte = new Adulte();
                    utilisateurConnecte.id = resultat.user.email;
                    return utilisateurConnecte;
                } else {
                    return undefined;
                }
            }),
            // Gestion d'erreur
            catchError(erreur => {
                this.gestionnaireErreur.gererMessageDerreur(erreur);
                return of(undefined);
            })
        );
    }
}