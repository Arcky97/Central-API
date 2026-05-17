import { CreatePageVisit, PageVisit } from "../../types/page-visits.type";
import { Repository } from "../base/Repository";

export class PageVisitsRepository extends Repository<PageVisit, PageVisit, CreatePageVisit> {
  constructor() {
    super("pageVisits", "analytics");
  } 
}