import { CreateDoggoBoardSettings, DoggoBoardSettingsRow, PublicDoggoBoardSettings, UpdateDoggoBoardSettings } from "../../types/doggo-board-settings.type";
import { Repository } from "../base/Repository";

export class DoggoBoardSettingsRepository extends Repository<DoggoBoardSettingsRow, CreateDoggoBoardSettings, UpdateDoggoBoardSettings, PublicDoggoBoardSettings> {
  constructor() {
    super("doggoBoardSettings", "core");
  }
}