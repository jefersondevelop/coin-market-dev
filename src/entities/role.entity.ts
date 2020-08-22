import { Entity, BaseEntity, PrimaryGeneratedColumn, Column, OneToOne, ManyToMany, JoinTable, OneToMany, JoinColumn } from 'typeorm';
import { User } from './user.entity';

@Entity("Role",{schema:"public" })
export class Role extends BaseEntity {

    @PrimaryGeneratedColumn({
        name: 'Id',
        type: 'int'
    })
    Id:number;

    @Column("varchar",{ 
        nullable:false,
        name:"Name"
    })
    Name:string;    

    @Column("varchar",{ 
        nullable:true,  
        name:"Description"
    })
    Description:string;
    
    @OneToOne(type => User, user => user.role)
    user:User;

}
    
    