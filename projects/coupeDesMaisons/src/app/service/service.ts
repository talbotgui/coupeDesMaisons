import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { Adulte, AnneeScolaire, Decision, Groupe } from '../model/model';
import { Auth } from './auth';
import { Dao } from './dao';
import { Evenement } from './evenement';


/**
 * Classe traitant de toutes les logiques.
 */
@Injectable()
export class Service {

    private anneeChargee = new AnneeScolaire();
    private utilisateurConnecte = new Adulte();

    /** Constructeur pour injection des dépendances */
    constructor(private evenement: Evenement, private auth: Auth, private dao: Dao) { }

    /** Connexion avec un login et un mot de passe */
    public seConnecter(utilisateur: string, motDePasse: string): Observable<boolean> {
        return this.auth.seConnecter(utilisateur, motDePasse).pipe(
            map(utilisateur => {
                // Si la connexion est OK
                if (!!utilisateur) {
                    // Chargement des données
                    this.dao.chargerDonnees().subscribe(annee => {
                        if (annee) {
                            this.anneeChargee = annee;
                            // Recherche de l'utilisateur connecté dans les adultes de la base
                            const adulteConnecte = annee.adultes.find(a => a.id === utilisateur.id);
                            // Lancement de l'évènement de connexion avec l'adulte trouvé
                            if (adulteConnecte) {
                                this.utilisateurConnecte = adulteConnecte;
                                this.evenement.lancerEvenementConnexion(this.utilisateurConnecte);
                                // Calcul des scores
                                this.calculerScoresApresChargementDeLannee();
                                // Notification
                                this.evenement.lancerEvenementAnneeChargee(annee);
                            } else {
                                console.error('Erreur de connexion-aucun adulte correspondant à l\'utilisateur');
                            }
                        } else {
                            console.error('Erreur de connexion-aucune année chargée');
                        }
                    });
                } else {
                    console.error('Erreur de connexion-auth');
                }

                return !!utilisateur;
            })
        );
    }

    public seDeconnecter(utilisateur: string, motDePasse: string): Observable<boolean> {
        //TODO: à implémenter
        //this.chargerAnneeEnCours()
        // this.evenement.lancerEvenementDeconnexion();
        return of(true);
    }


    public ajouterUneDecision(decision: Decision): Observable<boolean> {
        // Ajout de la décision
        if (!this.anneeChargee.decisions) {
            this.anneeChargee.decisions = [];
        }
        this.anneeChargee.decisions.push(decision);

        // Recalcul des points
        if (this.anneeChargee.groupes) {
            this.anneeChargee.groupes.forEach(g => {
                if (decision.idGroupe == g.id && decision.points) {
                    g.scoreCalcule += decision.points;
                }
            });
        }
        return of(true);
    }

    public supprimerUneDeMesDecision(id: string): Observable<boolean> {
        //TODO: à implémenter
        return of(true);
    }

    /** Calcul du score de chaque groupe après le chargement de l'année */
    private calculerScoresApresChargementDeLannee() {
        if (this.anneeChargee && this.anneeChargee.decisions && this.anneeChargee.groupes) {

            // Création d'une map de groupe
            const groupes = new Map<string, Groupe>();
            this.anneeChargee.groupes.forEach(g => {
                g.scoreCalcule = 0;
                if (g.id) {
                    groupes.set(g.id, g);
                }
            });

            // Calcul du score à partir des décisions
            this.anneeChargee.decisions.forEach(d => {
                if (d.idGroupe && d.points) {
                    const groupe = groupes.get(d.idGroupe);
                    if (groupe) {
                        groupe.scoreCalcule += d.points;
                    }
                }
            });

            // log des scores
            this.anneeChargee.groupes.forEach(g => console.log('Groupe "' + g.nom + '" a ' + g.scoreCalcule + ' points'));
        }
    }
}
