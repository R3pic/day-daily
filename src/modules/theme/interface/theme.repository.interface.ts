import { ThemeEntity } from '@theme/entities';

export interface ThemeRepositoryBase {
  findById(id: number): Promise<ThemeEntity | null>;
  getRandomTheme(): Promise<ThemeEntity>;
}