import { NativeDateAdapter } from "@angular/material/core";

/**
 * Adapter pour le format de date compatible avec la locale fr-FR.
 * { provide: LOCALE_ID, useValue: 'fr-FR' },
 * { provide: DateAdapter, useClass: MyDateAdapter },
 * @see https://stackoverflow.com/questions/44201050/how-to-implement-md-date-formats-for-datepicker
 */
export class MyDateAdapter extends NativeDateAdapter {
    parse(value: any): Date | null {
        if ((typeof value === 'string') && (value.indexOf('/') > -1)) {
            const str = value.split('/');
            const date = new Date(Number(str[2]), Number(str[1]) - 1, Number(str[0]), 12);
            date.setHours(0, 0, 0, 0);
            return date;
        }
        const timestamp = typeof value === 'number' ? value : Date.parse(value);
        return isNaN(timestamp) ? null : new Date(timestamp);
    }
}