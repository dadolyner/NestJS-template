// Users Entity
import { Entity, PrimaryGeneratedColumn, Column, BaseEntity, Unique, OneToMany, CreateDateColumn, UpdateDateColumn, BeforeInsert, BeforeUpdate } from 'typeorm'
import * as bcrypt from 'bcrypt'
import { Quotes } from './quotes.entity'
export type AllowedRoles = 'Admin' | 'Moderator' | 'User' | 'Tester'

@Entity({ name: 'users' })
@Unique(['email'])
export class Users extends BaseEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string

    @Column({ type: 'varchar', length: 100 })
    first_name: string

    @Column({ type: 'varchar', length: 100 })
    last_name: string

    @Column({ type: 'varchar', length: 255, unique: true })
    email: string

    @Column({ type: 'varchar', length: 255 })
    password: string

    @Column({ type: 'varchar', length: 255 })
    salt: string

    @Column({ type: 'varchar', length: 255, nullable: true })
    avatar: string

    @Column('text', { array: true, nullable: true, default: ["User"] })
    roles: AllowedRoles[]

    @Column({ type: 'boolean', default: false })
    verified: boolean

    @CreateDateColumn()
    created_at: Date

    @UpdateDateColumn()
    updated_at: Date

    @OneToMany(() => Quotes, (quote) => quote.user, { onDelete: 'RESTRICT', onUpdate: 'CASCADE' })
    quote: Quotes[]

    // Before insert generate salt and hash password
    @BeforeInsert()
    async hashPassword(): Promise<void> {
        if (this.password) {
            this.salt = await bcrypt.genSalt()
            this.password = await bcrypt.hash(this.password, this.salt)
        }
    }

    // Before update check if password is changed
    @BeforeUpdate()
    async checkPassword(): Promise<void> {
        if (this.password) {
            const user = await Users.findOne({ where: { id: this.id }})
            if (user.password !== this.password) {
                this.salt = await bcrypt.genSalt()
                this.password = await bcrypt.hash(this.password, this.salt)
            }
        }
    }

    // Validate user password
    async validatePassword(password: string): Promise<boolean> { return await bcrypt.hash(password, this.salt) === this.password }
}