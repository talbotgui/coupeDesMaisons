import { HttpClient } from '@angular/common/http';
import { Injectable, OnDestroy } from '@angular/core';
import { AngularFireMessaging } from '@angular/fire/compat/messaging';
import { Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { AbstractComponent } from '../abstract/abstract.component';
import { GestionnaireErreur } from './erreur';

/**
 * Classe traitant tous les aspects de notification.
 * @see https://github.com/angular/angularfire/blob/master/docs/messaging/messaging.md
 */
@Injectable()
export class Notification extends AbstractComponent implements OnDestroy {

    /** Constructeur pour injection des dépendances */
    constructor(private gestionnaireErreur: GestionnaireErreur, private afMessaging: AngularFireMessaging, private http: HttpClient) { super(); }

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
            tap(token => {
                if (!!token && token != null) {
                    this.demarrerEcoute();
                }
            })
        );
    }

    /** Envoi d'une notification  */
    public notifierSaisieDecision(titre: string, contenu: string, tokens: string[]): Observable<boolean> {

        // Si aucun token, pas de requête
        if (!tokens || tokens.length === 0) {
            return of(true);
        }

        //@see https://firebase.google.com/docs/cloud-messaging/http-server-ref
        const url = 'https://fcm.googleapis.com/fcm/send';
        const message = {
            "notification": { "title": titre, "body": contenu },
            "registration_ids": tokens
        };
        const options = {
            headers: {
                "Authorization": environment.firebase.messagingKey,
                "Content-Type": 'application/json',
            }
        }

        // envoi du message
        return this.http.post(url, message, options).pipe(

            //logstap(reponse=>console.log(reponse)),
            // renvoi d'un boolean
            map(reponse => !!reponse)
        );
    }

    /** Démarrage de l'écoute des notifications Firebase */
    private demarrerEcoute(): void {
        const sub = this.afMessaging.messages.subscribe((message) => {
            console.log('notification reçue:', message);
        });
        // pour détruire la souscription à la destruction du composant
        this.declarerSouscription(sub);
    }
}
