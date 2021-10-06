/**
 * Classe utilitaire pour les petites manipulations en tout genre.
 */
export class Utils {
    /** Création d'un nombre utilisable en tri à partir de la date */
    public static creerDateTechnique(date: string | undefined): number | undefined {
        if (date) {
            const sp = date.split('/');
            if (sp.length === 3) {
                return parseInt(sp[2] + sp[1] + sp[0]);
            }
        }
        return undefined;
    }

    /** Créer la date du jour en string formattée */
    public static creerDateFormatee(): string {
        const d = new Date();
        return ((d.getDay() < 10) ? '0' : '') + d.getDay() + '/' + ((d.getMonth() < 10) ? '0' : '') + d.getMonth() + '/' + d.getFullYear();
    }

}