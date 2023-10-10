import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity({
  name: 'person',
})
export class Person {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    length: '25',
  })
  name: string;
}
