import mongoose,{Document,Schema} from "mongoose";

export interface ICustomer extends Document
{
    name:string,
    address:string,
    mobile:number
}

const CustomerSchema=new Schema<ICustomer>({
    name:{type:String,required:true},
    address:{type:String,required:true},
    mobile:{type:Number,required:true}
})

export const CustomerModel=mongoose.model<ICustomer>('customer',CustomerSchema)