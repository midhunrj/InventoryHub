import mongoose, {Document,Schema, Types} from "mongoose";

export interface ISales{
   customer:Types.ObjectId,
   items:{
    productId:Types.ObjectId,
    quantity:number;
    price:number
   }[],
   date:Date

   payment:'Cash'|'Card'|'Online'
   totalAmount:number

}

const SaleSchema=new Schema<ISales>({
items:[
    {
        productId:{type:Schema.Types.ObjectId,ref:'inventory',required:true},
        quantity:{type:Number,required:true},
        price:{type:Number,required:true}

    }
],
customer:{type:Schema.Types.ObjectId,ref:'customer',required:true},
date:{type:Date,default:Date.now},
payment:{type:String,enum:['Cash','Card','Online'],required:true},
totalAmount:{type:Number,required:true}
},
{timestamps:true}
)

export const SaleModel=mongoose.model<ISales>('sales',SaleSchema)