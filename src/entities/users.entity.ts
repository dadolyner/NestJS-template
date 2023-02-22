// Users Entity
import { Entity, PrimaryGeneratedColumn, Column, BaseEntity, Unique, OneToMany } from 'typeorm'
import * as bcrypt from 'bcrypt'
import { Quotes } from './quotes.entity'

@Entity({ name: 'users' })
@Unique(['email'])
export class Users extends BaseEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string

    @Column()
    first_name: string

    @Column()
    last_name: string

    @Column()
    email: string

    @Column()
    salt: string

    @Column()
    password: string

    @Column('jsonb', { nullable: true, default: {} })
    settings: {
        roles: string[]
    }

    @Column()
    verified: boolean

    @Column()
    avatar: string
    
    @Column()
    created_at: Date

    @Column()
    updated_at: Date

    @OneToMany(() => Quotes, (quote) => quote.user, { onDelete: 'RESTRICT', onUpdate: 'CASCADE' })
    quote: Quotes[];

    // Validate user password
    async validatePassword(password: string): Promise<boolean> { return await bcrypt.hash(password, this.salt) === this.password }

    // Generate salt for hashing
    async generateSalt(): Promise<string> { return await bcrypt.genSalt() }

    // Hash user password
    async hashPassword(password: string, salt: string): Promise<string> { return await bcrypt.hash(password, salt) }
}