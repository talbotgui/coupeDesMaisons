import { Injectable } from '@angular/core';

/**
 * Classe traitant les erreurs.
 */
@Injectable()
export class GestionnaireErreur {


    public gererMessageDerreur(erreur: object): void {
        console.error(erreur);
    }
}
