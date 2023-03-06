// Quotes Entity
import { Entity, PrimaryGeneratedColumn, Column, BaseEntity, ManyToOne, CreateDateColumn, UpdateDateColumn } from 'typeorm'
import { Users } from './users.entity'

@Entity({ name: 'quotes' })
export class Quotes extends BaseEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string

    @Column({ type: 'varchar', length: 255 })
    quote: string
    
    @CreateDateColumn()
    created_at: Date

    @UpdateDateColumn()
    updated_at: Date

    @Column()
    userId: string

    @ManyToOne(() => Users, (user) => user.quote, { onDelete: 'RESTRICT', onUpdate: 'CASCADE' })
	user: Users;
}