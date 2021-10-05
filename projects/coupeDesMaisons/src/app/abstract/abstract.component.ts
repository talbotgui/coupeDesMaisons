import { Directive, OnDestroy } from "@angular/core";
import { Subscription } from "rxjs";

/**
 * Classe abstraite pour tout composant voulant gérer correction les souscriptions et notamment leur destruction quand les composants Angular sont détruits.
 */
@Directive()
export class AbstractComponent implements OnDestroy {

    /** Liste des souscriptions réalisées par le composant concrêt et à détruire */
    private souscriptions: Subscription[] = [];

    /** Déclaration d'une souscription */
    public declarerSouscription(s: Subscription): void {
        this.souscriptions.push(s);
    }

    /** Destruction des souscriptions créées */
    public detruireLesSouscriptions(): void {
        this.souscriptions.forEach(s => s.unsubscribe());
    }

    /** A la destruction du composant, on détruit ses souscriptions */
    public ngOnDestroy(): void {
        this.detruireLesSouscriptions();
    }
}