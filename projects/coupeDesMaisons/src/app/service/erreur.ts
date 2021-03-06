import { Injectable } from '@angular/core';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';

/**
 * Classe traitant les erreurs.
 */
@Injectable()
export class GestionnaireErreur {

    private static MAT_SNACK_CONFIG = Object.assign(
        new MatSnackBarConfig(),
        { politeness: 'polite', duration: 5000, horizontalPosition: 'right', verticalPosition: 'bottom' }
    );

    /** Constructeur avec injection de dépendances */
    public constructor(private snackbar: MatSnackBar) { }

    /** Affichage d'un message à l'utilisateur en fonction du type d'erreur */
    public gererMessageDerreur(message: string, erreur?: Error): void {
        const details = erreur ? (' (' + erreur.message + ')') : '';
        this.snackbar.open(message + details, 'Erreur', GestionnaireErreur.MAT_SNACK_CONFIG);
        console.error(message, erreur);
    }

    /** Affichage d'un message */
    public afficherMessage(message: string, titre: string): void {
        this.snackbar.open(message, titre, GestionnaireErreur.MAT_SNACK_CONFIG);
        console.log(message);
    }
}
