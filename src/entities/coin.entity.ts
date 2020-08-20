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

    @Column("int",{ 
        nullable:true,  
        name:"ValueUSD"
    })
    ValueUSD:number;
    
}
    
    