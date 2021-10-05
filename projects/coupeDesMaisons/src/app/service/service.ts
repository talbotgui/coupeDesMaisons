import { Injectable, OnInit } from '@angular/core';
import { SwUpdate } from '@angular/service-worker';
import { Observable, of } from 'rxjs';
import { map, mergeMap, tap } from 'rxjs/operators';
import { Adulte, AnneeScolaire, Decision, Groupe } from '../model/model';
import { Auth } from './auth';
import { Dao } from './dao';
import { Evenement } from './evenement';


/**
 * Classe traitant de toutes les logiques.
 */
@Injectable()
export class Service implements OnInit {

    private anneeChargee = new AnneeScolaire();
    private utilisateurConnecte: Adulte | undefined = new Adulte();

    /** Constructeur pour injection des dépendances */
    constructor(private evenement: Evenement, private auth: Auth, private dao: Dao, private maj: SwUpdate) { }

    /** A l'initialisation du composant */
    public ngOnInit(): void {
        // Surveillance des versions de l'application
        this.verifierMiseAjourDeLapplication();
    }

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
                                console.error('Erreur de connexion-aucun adulte correspondant à l\'utilisateur ' + utilisateur.id);
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
                    // Reset des données du service
                    this.utilisateurConnecte = undefined;
                    this.anneeChargee = new AnneeScolaire();
                    this.calculerScoresApresChargementDeLannee();
                    // Notification
                    this.evenement.lancerEvenementAnneeChargee(this.anneeChargee);
                }
            })
        )
    }

    /** Ajout d'une décision */
    public ajouterUneDecision(decision: Decision): Observable<boolean> {
        return this.dao.ajouterUneDecision(decision)
    }

    public supprimerUneDeMesDecisions(id: string): Observable<boolean> {
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
