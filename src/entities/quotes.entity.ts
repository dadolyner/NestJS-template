// Quotes Entity
import { Entity, PrimaryGeneratedColumn, Column, BaseEntity, ManyToOne } from 'typeorm'
import { Users } from './users.entity'

@Entity({ name: 'quotes' })
export class Quotes extends BaseEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string

    @Column()
    quote: string
    
    @Column()
    created_at: Date

    @Column()
    updated_at: Date

    @Column()
    userId: string

    @ManyToOne(() => Users, (user) => user.quote, { onDelete: 'RESTRICT', onUpdate: 'CASCADE' })
	user: Users;
}