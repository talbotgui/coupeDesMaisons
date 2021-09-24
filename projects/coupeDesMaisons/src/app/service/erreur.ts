import { Injectable } from '@angular/core';

/**
 * Classe traitant les erreurs.
 */
@Injectable()
export class GestionnaireErreur {

    /** Affichage d'un message à l'utilisateur en fonction du type d'erreur */
    public gererMessageDerreur(erreur: object): void {
        console.error(erreur);
    }
}
