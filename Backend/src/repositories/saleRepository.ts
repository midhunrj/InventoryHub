import mongoose from "mongoose";
import { CustomerModel } from "../models/customers";
import { InventoryModel } from "../models/inventory";
import { ISales, SaleModel } from "../models/sales"


class SaleRepository{
    async newSale(data:ISales):Promise<ISales>
    {
        console.log("data",data);
        
        const Sale=await SaleModel.create(data)
        console.log(Sale,"sale");
    for (const item of data.items )
    {
        const product=await InventoryModel.findById(item.productId)
        if(product){
        if(product.quantity>=item.quantity)
        {
          product.quantity -=item.quantity
        }
        await product.save()
    }
    }
        
        return Sale
    }

    async getAll():Promise<ISales[]>{
        return await SaleModel.find()
    }

    async getById(id:string):Promise<ISales|null>
    {
        return await SaleModel.findById(id)
    }

    async search(query:string):Promise<ISales[]>
    {
        const inventory=await SaleModel.find({$text:{$search:query}})

        return inventory
    }

    async update(productId:string,data:Partial<ISales>):Promise<ISales|null>
    {
        const Sale=await SaleModel.findByIdAndUpdate(productId,data,
            {new:true})

            return Sale
    }
    async fetchSalesReport(data:any)
    {
        const { type, startDate, endDate, page = 1, selectedId } = data;
        const limit = 10; // Number of items per page
        const skip = (page - 1) * limit;
    
        const query :any= {};
    
        if (startDate && endDate) {
          query.date = { $gte: new Date(startDate), $lte: new Date(endDate) };
        }
    
        if (type === 'product' && selectedId) {
            query['items.productId'] = new mongoose.Types.ObjectId(selectedId);
        }
    
        // Customer filter
        if ((type === 'customer' || type === 'customerLedger') && selectedId) {
            query.customer = new mongoose.Types.ObjectId(selectedId);
        }
    
    
        const totalSales = await SaleModel.countDocuments(query);
        
        const salesData = await SaleModel.find(query)
        .populate('items.productId', 'name') // Populate product details
        .populate('customer', 'name') // Populate customer details
        .skip(skip)
        .limit(limit);
        console.log(salesData,totalSales,"in repository skjfskj");
        
        const sales = salesData.map((sale) => {
            if (type === 'product' && selectedId) {
              // Filter items based on selectedId
              sale.items = sale.items.filter(
                (item) => item.productId && item.productId._id.toString() === selectedId
              );
            }
            return sale;
          });
        return {sales,totalSales}
    }
}

export default new SaleRepository()