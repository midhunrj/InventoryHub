import { ICustomer } from "../models/customers";
import customerRepository from "../repositories/customerRepository";

class CustomerService{
    async createCustomer(data:ICustomer):Promise<ICustomer>
    {
        return  await customerRepository.newCustomer(data)
    }
    async fetchCustomers():Promise<ICustomer[]>
    {
        return await customerRepository.getAll()
    }
    async getByCustomer(productId:string):Promise<ICustomer|null>
    {
        return await customerRepository.getById(productId)
    }
    async search(query:string):Promise<ICustomer[]>{
        return customerRepository.search(query)
    }
    async update(customerId:string,data:Partial<ICustomer>):Promise<ICustomer|null>
    {
        return await customerRepository.update(customerId,data)
    }
    async deleteCustomer(customerId:string):Promise<void>
    {
        return customerRepository.delete(customerId)
    }
    
}

export default new CustomerService()