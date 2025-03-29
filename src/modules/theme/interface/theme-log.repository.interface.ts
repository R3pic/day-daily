import { ThemeEntity, ThemeLogEntity } from '@theme/entities';

export interface ThemeLogRepositoryBase {
  getLastLog(): Promise<ThemeLogEntity | null>;
  saveLog(themeEntity: ThemeEntity): Promise<void>;
}