import mongoose,{Document,Schema} from 'mongoose'

export interface IInventory extends Document{
 name:string
 description:string
 quantity:number
 price:number  
}

const InventorySchema=new Schema<IInventory>({
    name:{type:String,required:true},
    description:{type:String,required:true},
    quantity:{type:Number,required:true},
    price:{type:Number,required:true},

})

export const InventoryModel=mongoose.model<IInventory>('inventory',InventorySchema)