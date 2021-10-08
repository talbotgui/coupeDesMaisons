import { isPlatformServer } from '@angular/common';
import { Inject, Injectable, OnDestroy, PLATFORM_ID } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { trace } from '@angular/fire/compat/performance';
import { UserCredential } from '@firebase/auth-types';
import { from, Observable, of, Subscription } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
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
        // Appel à Firebase
        return from(this.auth.signInWithEmailAndPassword(utilisateur, motDePasse)).pipe(
            // Transformation de l'objet UserCredential en Adulte
            map((resultat: UserCredential) => {
                if (resultat.user && resultat.user.email) {
                    const utilisateurConnecte = new Adulte();
                    utilisateurConnecte.id = resultat.user.email;
                    return utilisateurConnecte;
                } else {
                    this.gestionnaireErreur.gererMessageDerreur('Erreur de connexion');
                    return undefined;
                }
            }),
            // Gestion d'erreur
            catchError(erreur => {
                this.gestionnaireErreur.gererMessageDerreur('Erreur de connexion', erreur);
                return of(undefined);
            })
        );
    }

    /** Appels à Firebase pour se déconnecter */
    public seDeconnecter(): Observable<boolean> {
        return from(this.auth.signOut()).pipe(
            // Transformation du retour en boolean
            map(() => true),
            // Gestion d'erreur
            catchError(erreur => {
                this.gestionnaireErreur.gererMessageDerreur('Erreur de déconnexion', erreur);
                return of(false);
            })
        );
    }

    /** Récupération de l'utilisateur connecté */
    public recupererLoginUtilisateurConnecte(): Observable<string | undefined> {
        if (this.auth.user) {
            return this.auth.user.pipe(map(u => (u && u.email) ? u.email : undefined));
        } else {
            return of(undefined);
        }
    }
}
