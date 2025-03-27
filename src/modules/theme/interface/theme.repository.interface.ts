import { ThemeEntity } from '@theme/entities/theme.entity';
import { ThemeLogEntity } from '@theme/entities/theme-log.entity';

export interface ThemeRepositoryBase {
  findById(id: string): Promise<ThemeEntity | null>;
  getRandomTheme(): Promise<ThemeEntity>;
  getLastLog(): Promise<ThemeLogEntity | null>;
  saveLog(themeEntity: ThemeEntity): Promise<void>;
}