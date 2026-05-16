import { CreatePageVisits, PageVisitsRow } from "../../types/page-visits.types";
import { Repository } from "../base/Repository";


export class PageVisitsRepository extends Repository<PageVisitsRow, PageVisitsRow, CreatePageVisits> {
  constructor() {
    super("pageVisits", "analytics");
  } 
}