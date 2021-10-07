import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AbstractComponent } from '../../abstract/abstract.component';
import { Adulte } from '../../model/model';
import { Service } from '../../service/service';

@Component({ selector: 'app-deconnexion', templateUrl: './deconnexion.component.html', styleUrls: ['./deconnexion.component.css'] })
export class DeconnexionComponent extends AbstractComponent implements OnInit {

  /** Flag de requête en cours */
  public deconnexionEnCours = false;
  public miseAjourEnCours = false;

  /** Flag conditionnant l'affichage des boutons de notification */
  public notificationsActivees: boolean | undefined;

  /** Constructeur pour injection des dépendances */
  constructor(private service: Service, private dialogRef: MatDialogRef<DeconnexionComponent>, @Inject(MAT_DIALOG_DATA) public utilisateurConnecte: Adulte) { super(); }

  /** A l'initialisation du composant */
  public ngOnInit(): void {
    this.verifierEtatNotification();
  }

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

  /** Demander la permission de recevoir des notifications */
  public demanderPermissionNotification(): void {
    const sub = this.service.demanderPermissionNotification().subscribe(() => this.verifierEtatNotification());
    this.declarerSouscription(sub);
  }

  /** Vérification de l'état des notifications et modification du bouton si besoin */
  private verifierEtatNotification(): void {
    const sub = this.service.verifierNotificationsAutorisees().subscribe(notificationsActivees => this.notificationsActivees = notificationsActivees)
    this.declarerSouscription(sub);
  }
}
