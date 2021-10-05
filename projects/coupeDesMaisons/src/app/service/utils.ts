/**
 * Classe utilitaire pour les petites manipulations en tout genre.
 */
export class Utils {
    /** Créer la date du jour en string formattée */
    public static creerDateFormatee(): string {
        const d = new Date();
        return (d.getDay() < 10) ? '0' : '' + d.getDay() + '/' + (d.getMonth() < 10) ? '0' : '' + d.getMonth() + '/' + d.getFullYear();
    }

}