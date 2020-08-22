import { Entity, JoinColumn, BaseEntity, PrimaryGeneratedColumn, Column, OneToOne, ManyToMany, JoinTable, OneToMany } from 'typeorm';

@Entity("Coin",{schema:"public" })
export class Coin extends BaseEntity {

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

    @Column("float8",{ 
        nullable:true,  
        name:"Value"
    })
    Value:number;
    
}
    
    