import { ISales } from "../models/sales"
import saleRepository from "../repositories/saleRepository"


class SaleService{
    async createSale(data:ISales):Promise<ISales>
    {
        return  await saleRepository.newSale(data)
    }
    async fetchSales():Promise<ISales[]>
    {
        return await saleRepository.getAll()
    }
    async getBySale(productId:string):Promise<ISales|null>
    {
        return await saleRepository.getById(productId)
    }
    async search(query:string):Promise<ISales[]>{
        return saleRepository.search(query)
    }
    async update(SaleId:string,data:Partial<ISales>):Promise<ISales|null>
    {
        return await saleRepository.update(SaleId,data)
    }
    async getSalesReport(data:any)
    {
        return await saleRepository.fetchSalesReport(data)
    }
}

export default new SaleService()