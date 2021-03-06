import { Injectable, OnInit } from '@angular/core';
import { SwUpdate } from '@angular/service-worker';
import { combineLatest, Observable, of } from 'rxjs';
import { map, mergeMap, tap } from 'rxjs/operators';
import { AbstractComponent } from '../abstract/abstract.component';
import { AnneeScolaire, Bareme, Decision, Groupe } from '../model/model';
import { Auth } from './auth';
import { Dao } from './dao';
import { GestionnaireErreur } from './erreur';
import { Evenement } from './evenement';
import { Notification } from './notification';
import { Utils } from './utils';

/**
 * Classe traitant de toutes les logiques.
 */
@Injectable()
export class Service extends AbstractComponent implements OnInit {

    /** Constructeur pour injection des dépendances */
    constructor(private evenement: Evenement, private auth: Auth, private dao: Dao, private maj: SwUpdate, private gestionnaireErreur: GestionnaireErreur, private notification: Notification) { super(); }

    /** A l'initialisation du composant */
    public ngOnInit(): void {
        // Surveillance des versions de l'application
        this.verifierMiseAjourDeLapplication();
    }

    /** Connexion avec un login et un mot de passe */
    public seConnecter(utilisateur: string, motDePasse: string, callback: (e: boolean) => void): void {
        const sub = this.auth.seConnecter(utilisateur, motDePasse).pipe(
            mergeMap(utilisateur => {
                // Si la connexion est OK
                if (!!utilisateur) {
                    // Chargement des données
                    return this.dao.chargerDonnees().pipe(map(annee => {
                        if (annee) {
                            // Recherche de l'utilisateur connecté dans les adultes de la base
                            const adulteConnecte = annee.adultes.find(a => a.id === utilisateur.id);
                            // Lancement de l'évènement de connexion avec l'adulte trouvé
                            if (adulteConnecte) {
                                this.evenement.lancerEvenementConnexion(adulteConnecte);
                                // Calcul des scores
                                this.calculerScoresApresChargementDeLannee(annee);
                                // Notification
                                this.evenement.lancerEvenementAnneeChargee(annee);
                                return true;
                            } else {
                                this.gestionnaireErreur.gererMessageDerreur('Erreur de connexion-aucun adulte correspondant à l\'utilisateur ' + utilisateur.id);
                                return false;
                            }
                        } else {
                            this.gestionnaireErreur.gererMessageDerreur('Erreur de connexion-aucune année chargée');
                            return false;
                        }
                    }));
                } else {
                    // Cas d'erreur géré dans le service. Donc pas de log/toaster en double
                    return of(false);
                }
            })
        )
            // La souscription se fait ici et non dans le composant car ce dernier est détruit
            .subscribe(callback);

        // Stockage de la souscription
        this.declarerSouscription(sub);
    }

    /** Rechargement de l'application pour mAj */
    public mettreAjourLapplication(): void {
        // Fonction dépréciée mais utilisée quand même
        window.location.reload(true);
    }

    /** Rechargement de l'application pour mAj */
    public verifierMiseAjourDeLapplication(): void {
        const majActivee = this.maj.activated;
        // dès qu'une maj est disponible
        this.maj.available.pipe(
            mergeMap(e => {
                console.log('version disponible : ', e);
                return majActivee;
            }),
            map(e => {
                console.log('version isntallée :', e);
                this.mettreAjourLapplication();
            })
        );
    }

    /** Déconnexion */
    public seDeconnecter(): Observable<boolean> {
        return this.auth.seDeconnecter().pipe(
            tap(resultat => {
                if (resultat) {
                    // Notification
                    this.evenement.lancerEvenementDeconnexion();
                    // Supprimer les souscriptions en cours
                    this.detruireLesSouscriptions();
                    // Reset des données du service
                    const anneeChargee = new AnneeScolaire();
                    this.calculerScoresApresChargementDeLannee(anneeChargee);
                    // Notification
                    this.evenement.lancerEvenementAnneeChargee(anneeChargee);
                }
            })
        )
    }

    /** Ajout d'une décision */
    public ajouterUneDecision(bareme: Bareme, groupe: Groupe, idAdulte: string): Observable<boolean> {

        // Création de l'objet métier
        const decision = new Decision();
        decision.idAdulte = idAdulte;
        decision.date = Utils.creerDateFormatee();
        decision.idGroupe = groupe.id;
        decision.idBareme = bareme.id;
        decision.points = bareme.points;

        // Création des informations propres à la notification
        const titre = bareme.points + ' pour ' + groupe.nom;

        // Sauvegarde dans la base de données
        return this.dao.ajouterUneDecision(decision).pipe(

            // Récupération des tokens des utilisateurs ayant activé les notifications
            mergeMap(flagSucces => {

                // Si la sauvegarde est un succès
                if (flagSucces) {
                    return this.dao.listerTokensUtilisateursSauf(idAdulte);
                } else {
                    return of(undefined);
                }
            }),

            // Envoi d'une notification à tout le monde
            mergeMap(tokens => {
                if (tokens) {
                    return this.notification.notifierSaisieDecision(titre, titre, tokens);
                } else {
                    return of(false);
                }
            })
        );
    }

    /** Suppression d'une décision */
    public supprimerUneDeMesDecisions(id: string): Observable<boolean> {
        return this.dao.supprimerUneDecision(id);
    }


    /** Demande d'autorisation de notification */
    public demanderPermissionNotification(): Observable<boolean> {
        return this.notification.demanderPermissionNotification();
    }

    /** Retrait de l'autorisation de notification */
    public verifierNotificationsAutorisees(): Observable<boolean> {
        // on va chercher si une notification est active
        return this.notification.verifierNotificationsAutorisees().pipe(
            // on récupère EN PLUS l'utilisateur connecté
            mergeMap((token) => combineLatest([of(token), this.auth.recupererLoginUtilisateurConnecte()])),
            // Avec les deux infos, on met à jour le token dans la base
            mergeMap(([token, emailUtilisateurConnecte]) => {
                if (token && emailUtilisateurConnecte) {
                    return this.dao.mettreAjourTokenUtilisateurConnecte(emailUtilisateurConnecte, token);
                } else {
                    return of(token)
                }
            }),
            // on renvoi un boolean en sortie
            map((token) => !!token && token != null)
        );
    }

    /** Calcul du score de chaque groupe après le chargement de l'année */
    private calculerScoresApresChargementDeLannee(anneeChargee: AnneeScolaire) {
        if (anneeChargee && anneeChargee.decisions && anneeChargee.groupes) {

            // Création d'une map de groupe
            const groupes = new Map<string, Groupe>();
            anneeChargee.groupes.forEach(g => {
                g.scoreCalcule = 0;
                if (g.id) {
                    groupes.set(g.id, g);
                }
            });

            // Calcul du score à partir des décisions
            anneeChargee.decisions.forEach(d => {
                if (d.idGroupe && d.points) {
                    const groupe = groupes.get(d.idGroupe);
                    if (groupe) {
                        groupe.scoreCalcule += d.points;
                    }
                }
            });

            // log des scores
            anneeChargee.groupes.forEach(g => console.log('Groupe "' + g.nom + '" a ' + g.scoreCalcule + ' points'));
        }
    }
}
