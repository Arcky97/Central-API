import { CreateInfraction, InfractionsRow, PublicInfraction, UpdateInfraction } from "../../types/infractions.type";
import { Repository } from "../base/Repository";

export class InfractionsRepository extends Repository<InfractionsRow, CreateInfraction, UpdateInfraction, PublicInfraction>{
  constructor() {
    super("infractions", "core");
  }
}