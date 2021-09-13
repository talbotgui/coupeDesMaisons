import { Pipe, PipeTransform } from '@angular/core';

/** @see https://webcake.co/looping-over-maps-and-sets-in-angular-2s-ngfor/ */
@Pipe({ name: 'mapValues' })
export class MapValuesPipe implements PipeTransform {

  transform(value: any, args?: any[]): Array<{ key: string, val: string }> {
    const returnArray: any[] = [];

    if (value) {
      value.forEach((entryVal: any, entryKey: any) => {
        returnArray.push({
          key: entryKey,
          val: entryVal
        });
      });
    }

    return returnArray;
  }
}

@Pipe({ name: 'attributesToMap' })
export class AttributesToMapPipe implements PipeTransform {

  transform(value: any, args?: any[]): Array<{ key: string, val: string }> {
    const returnArray = [];

    for (const prop in value) {
      if (value.hasOwnProperty(prop)) {
        returnArray.push({ key: prop, val: value[prop] });
      }
    }
    return returnArray;
  }
}
