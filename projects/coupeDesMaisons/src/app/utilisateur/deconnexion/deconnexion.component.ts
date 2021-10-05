import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AbstractComponent } from '../../abstract/abstract.component';
import { Adulte } from '../../model/model';
import { Service } from '../../service/service';

@Component({ selector: 'app-deconnexion', templateUrl: './deconnexion.component.html', styleUrls: ['./deconnexion.component.css'] })
export class DeconnexionComponent extends AbstractComponent {

  /** Flag de requête en cours */
  public deconnexionEnCours = false;
  public miseAjourEnCours = false;

  /** Constructeur pour injection des dépendances */
  constructor(private service: Service, private dialogRef: MatDialogRef<DeconnexionComponent>, @Inject(MAT_DIALOG_DATA) public utilisateurConnecte: Adulte) { super(); }

  /** Mise à jour de l'application */
  public mettreAjour(): void {
    this.miseAjourEnCours = true;
    this.service.mettreAjourLapplication();
  }

  /** Action de connexion si les champs sont renseignés (protection supp) */
  public seDeconnecter(): void {
    this.deconnexionEnCours = true;
    const sub = this.service.seDeconnecter().subscribe(estConnecte => {
      if (estConnecte) {
        this.deconnexionEnCours = false;
        this.dialogRef.close();
      }
    });
    this.declarerSouscription(sub);
  }
}
