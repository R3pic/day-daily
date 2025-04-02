import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'themes' })
export class ThemeEntity {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({ type: 'varchar', length: 255, nullable: false, unique: true })
  text: string;
}