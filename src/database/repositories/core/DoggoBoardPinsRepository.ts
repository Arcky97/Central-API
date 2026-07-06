import { CreateDoggoBoardPin, DoggoBoardPinsRow, PublicDoggoBoardPin, UpdateDoggoBoardPin } from "../../types/doggo-board-pins.type";
import { Repository } from "../base/Repository";

export class DoggoBoardPinsRepository extends Repository<DoggoBoardPinsRow, CreateDoggoBoardPin, UpdateDoggoBoardPin, PublicDoggoBoardPin> {
  constructor() {
    super("doggoBoardPins", "core");
  } 
}