import { Entity, JoinColumn, BaseEntity, PrimaryGeneratedColumn, Column, OneToOne, ManyToMany, JoinTable, OneToMany } from 'typeorm';
import { Role } from './role.entity';

@Entity("User",{schema:"public" })
export class User extends BaseEntity {

    @PrimaryGeneratedColumn({
        name: 'Id',
        type: 'int'
    })
    Id:number;

    @Column("varchar",{ 
        nullable:false,
        name:"Password",
        select: false
    })
    Password:string;
        

    @Column("varchar",{ 
        nullable:false,
        name:"Email"
    })
    Email:string;
        

    @Column("int",{ 
        nullable:true,
        default: 1,
        name:"Status"
    })
    Status:number;
    
    @OneToOne(type => Role, role => role.user)
    @JoinColumn({name: 'roleId'})
    role:Role;

}
    
    