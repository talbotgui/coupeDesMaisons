import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { Service } from '../../service/service';


@Component({ selector: 'app-connexion', templateUrl: './connexion.component.html', styleUrls: ['./connexion.component.css'] })
export class ConnexionComponent {

  /** Nom d'utilisateur dans le formulaire */
  public nomUtilisateur?: string;

  /** Mot de passe */
  public motDePasse?: string;

  /** Constructeur pour injection des dépendances */
  constructor(private service: Service, private dialogRef: MatDialogRef<ConnexionComponent>) { }

  /** Action de connexion si les champs sont renseignés (protection supp) */
  public seConnecter(): void {
    if (this.nomUtilisateur && this.motDePasse) {
      this.service.seConnecter(this.nomUtilisateur, this.motDePasse).subscribe(estConnecte => {
        if (estConnecte) {
          this.dialogRef.close();
        }
      });
    }
  }
}
