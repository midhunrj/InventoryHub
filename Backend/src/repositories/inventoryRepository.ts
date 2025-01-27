import { IInventory } from "../models/inventory";
import { InventoryModel } from "../models/inventory";

class InventoryRepository{
    async login(email:string):Promise<Boolean>{
        return email==process.env.USER_EMAIL
    }
    async create(data:IInventory):Promise<IInventory>{
        // try{
            const inventory=await InventoryModel.create(data)
          console.log(inventory,"inventory");
          
        return inventory
        // }
        // catch(error)
        // {
        //     console.log(error,"error in creating ");
            
        // }
        // finally{
        //     return inventory
        // }

    }

    async getAll():Promise<IInventory[]>{
        return await InventoryModel.find()
    }

    async getById(id:string):Promise<IInventory|null>
    {
        return await InventoryModel.findById(id)
    }

    async delete(id:string):Promise<void>
    {
        await InventoryModel.findByIdAndDelete(id)
    }

    async search(query:string):Promise<IInventory[]>
    {
        const inventory=await InventoryModel.find({$text:{$search:query}})

        return inventory
    }

    async update(productId:string,data:Partial<IInventory>):Promise<IInventory|null>
    {
        const inventory=await InventoryModel.findByIdAndUpdate(productId,data,
            {new:true})

            return inventory
            
    }
}

export default new InventoryRepository()