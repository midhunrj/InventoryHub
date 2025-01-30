import { CustomerModel, ICustomer } from "../models/customers";

class CustomerRepository{
    async newCustomer(data:ICustomer):Promise<ICustomer>
    {
        const customer=await CustomerModel.create(data)
        return customer
    }

    async getAll():Promise<ICustomer[]>{
        return await CustomerModel.find()
    }

    async getById(id:string):Promise<ICustomer|null>
    {
        return await CustomerModel.findById(id)
    }

    async search(query:string):Promise<ICustomer[]>
    {
        const inventory=await CustomerModel.find({$text:{$search:query}})

        return inventory
    }

    async update(productId:string,data:Partial<ICustomer>):Promise<ICustomer|null>
    {
        const customer=await CustomerModel.findByIdAndUpdate(productId,data,
            {new:true})

            return customer
    }

    async delete(id:string):Promise<void>
    {
        await CustomerModel.findByIdAndDelete(id)
    }
}

export default new CustomerRepository()