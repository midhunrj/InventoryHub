import { Request, Response } from "express"
import saleService from "../services/saleService";


class SaleController{
    async AddNewSale(req:Request,res:Response)
 {
  try {
    console.log(req.body,"jj");
    
    const data=req.body
    const Sale=await saleService.createSale(data)
    res.status(201).json(Sale)
  } catch (error:any) {
    console.log(error,"error in creating Sale")
    res.status(500).json({message:"Error creating the Sale"})
    
  }
 }

 async getSaleList(req:Request,res:Response)
    {
        try {
            const SaleData=await saleService.fetchSales()
            res.status(200).json(SaleData)
        } catch (error) {
            console.log(error,"error in fetching all Sale list")
    res.status(500).json({message:"Error in fetching all Sale list"})
        }
    }

    async search(req: Request, res: Response) {
        try {
          const query = req.query.query as string;
          const results = await saleService.search(query);
          res.status(200).json(results);
        } catch (error) {
          res.status(500).json({ message: "Error searching Sale" });
        }
      }

      async updateSale(req:Request,res:Response)
 {
    try {
        const {id}=req.params
        const data=req.body
        const inventory=await saleService.update(id as string,data)
        if (!inventory) {
            res.status(404).json({ message:"Sale not found" });
            return
          }
          res.status(200).json(inventory);
    } catch (error:any) {
        console.log(error,"error in updating Sale")
        res.status(500).json({message:"Error updating the Sale"})
         
    }
 }

 async salesReport(req:Request,res:Response)
 {
    try {
        console.log(req.query,"shhshksbbs");
        
        const { type, startDate, endDate, page = 1, selectedId } = req.query;
    const limit = 10; // Number of items per page
    const skip = (parseInt(page as string) - 1) * limit;

   
  const salesData=await saleService.getSalesReport(req.query)
  console.log("salesData",salesData);
  
    const {sales,totalSales}=salesData
    res.status(200).json({sales,totalPages:Math.ceil(totalSales/limit)})
    } catch (error) {
        console.log(error,"error in fetching Sale")
        res.status(500).json({message:"Error fetching the Sale"})
          
    }
 }
    
}

export default new SaleController()