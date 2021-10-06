export class AnneeScolaire {
  public adultes: Adulte[] = [];
  public groupes: Groupe[] = [];
  public decisions: Decision[] = [];
  public baremes: Bareme[] = [];
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
  public scoreCalcule: number = 0;
}

export class Decision {
  public id?: string;
  public date?: string;
  public points?: number;
  public idBareme?: string;
  public idGroupe?: string;
  public idAdulte?: string;

  public dateTech?: number;
}

export class Bareme {
  public id?: string;
  public libelle?: string;
  public points?: number;
}

export class SaisieScoreDto {
  public annee?: AnneeScolaire;
  public adulteConnecte?: Adulte;
}