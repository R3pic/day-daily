import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'themes' })
export class ThemeEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 255, nullable: false, unique: true })
  text: string;
}