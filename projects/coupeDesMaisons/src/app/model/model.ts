export class AnneeScolaire {
  public adultes: Adulte[] = [];
  public groupes: Groupe[] = [];
  public decision: Decision[] = [];
}

export class Adulte {
  public id?: string;
  public nom?: string;
  public photo?: string;
}

export class Groupe {
  public id?: string;
  public nom?: string;
  public photo?: string;
}

export class Decision {
  public id?: string;
  public points?: number;
  public bareme?: Bareme;
  public groupe?: Groupe;
  public adulte?: Adulte;
}

export class Bareme {
  public id?: string;
  public libelle?: string;
  public points?: number;
}