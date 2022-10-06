// Users Entity
import { Entity, PrimaryGeneratedColumn, Column, BaseEntity, Unique } from 'typeorm'
import * as bcrypt from 'bcrypt'


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

    @Column({ nullable: true, default: null })
    refreshToken: string

    @Column('jsonb', { nullable: true, default: {} })
    settings: {
        roles: string[]
    }
    
    @Column()
    created_at: Date

    @Column()
    updated_at: Date

    // Validate user password
    async validatePassword(password: string): Promise<boolean> { return await bcrypt.hash(password, this.salt) === this.password }

    // Generate salt for hashing
    async generateSalt() { return await bcrypt.genSalt() }

    // Hash user password
    async hashPassword(password: string, salt: string) { return await bcrypt.hash(password, salt) }
}