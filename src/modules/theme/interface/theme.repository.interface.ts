import { ThemeEntity } from '@theme/entities';

export interface ThemeRepositoryBase {
  findById(id: string): Promise<ThemeEntity | null>;
  getRandomTheme(): Promise<ThemeEntity>;
}