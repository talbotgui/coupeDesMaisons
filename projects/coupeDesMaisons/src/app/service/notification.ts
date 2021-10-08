import { Injectable, OnDestroy } from '@angular/core';
import { AngularFireMessaging } from '@angular/fire/compat/messaging';
import { Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { AbstractComponent } from '../abstract/abstract.component';
import { GestionnaireErreur } from './erreur';

/**
 * Classe traitant tous les aspects de notification.
 * @see https://github.com/angular/angularfire/blob/master/docs/messaging/messaging.md
 */
@Injectable()
export class Notification extends AbstractComponent implements OnDestroy {

    /** Constructeur pour injection des dépendances */
    constructor(private gestionnaireErreur: GestionnaireErreur, private afMessaging: AngularFireMessaging) { super(); }

    /** Demande d'autorisation de notification */
    public demanderPermissionNotification(): Observable<boolean> {
        // Log
        console.log('demanderPermissionNotification');

        // Demande de permission et activation
        return this.afMessaging.requestToken.pipe(
            // Si tout se passe bien
            map(() => {
                this.gestionnaireErreur.afficherMessage('merci pour votre permission', 'INFO');
                return true;
            }),
            // en cas d'erreur
            catchError((error) => {
                this.gestionnaireErreur.gererMessageDerreur(error);
                return of(false);
            }),
        )
    }

    /** Retrait de l'autorisation de notification */
    public verifierNotificationsAutorisees(): Observable<string | null> {
        // log
        console.log('verifierNotificationsAutorisees');

        // lit le token
        return this.afMessaging.getToken.pipe(
            //log
            tap(token => console.log('token', token)),
            // return true si un token est présent
            // démarre l'écoute si le token est présent
            tap(token => { if (token) { this.demarrerEcoute(); } })
        );
    }

    /** Démarrage de l'écoute des notifications Firebase */
    private demarrerEcoute(): void {
        const sub = this.afMessaging.messages.subscribe((message) => {
            console.log(message);
            console.log(message);
            console.log(message);
            console.log(message);
            console.log(message);
        });
        // pour détruire la souscription à la destruction du composant
        this.declarerSouscription(sub);
    }
}
