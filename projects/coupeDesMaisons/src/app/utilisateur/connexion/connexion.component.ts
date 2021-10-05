import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { AbstractComponent } from '../../abstract/abstract.component';
import { Service } from '../../service/service';


@Component({ selector: 'app-connexion', templateUrl: './connexion.component.html', styleUrls: ['./connexion.component.css'] })
export class ConnexionComponent extends AbstractComponent {

  /** Nom d'utilisateur dans le formulaire */
  public nomUtilisateur?: string;

  /** Mot de passe */
  public motDePasse?: string;

  /** Flag de requête en cours */
  public connexionEnCours = false;

  /** Constructeur pour injection des dépendances */
  constructor(private service: Service, private dialogRef: MatDialogRef<ConnexionComponent>) { super(); }

  /** Action de connexion si les champs sont renseignés (protection supp) */
  public seConnecter(): void {
    // Si les champs sont saisis
    if (this.nomUtilisateur && this.motDePasse) {
      // Flag "enCours"
      this.connexionEnCours = true;

      // Call back pour ne pas gérer la souscription ici car le dialog est détruit alors qu'on a besoin de conserver la souscription pour mettre à jour régulièrement les données.
      const callback = (estConnecte: boolean) => {
        this.connexionEnCours = false;
        if (estConnecte) {
          console.log('Utilisateur connecté, fermeture de la dialog');
          this.dialogRef.close();
        }
      };

      // Appel au service
      this.service.seConnecter(this.nomUtilisateur, this.motDePasse, callback);
    }
  }
}
