import { Request, Response } from "express"
import customerService from "../services/customerService"

class CustomerController{
    async AddNewCustomer(req:Request,res:Response)
 {
  try {
    console.log(req.body,"jj");
    
    const data=req.body
    const customer=await customerService.createCustomer(data)
    res.status(201).json(customer)
  } catch (error:any) {
    console.log(error,"error in creating customer")
    res.status(500).json({message:"Error creating the customer"})
    
  }
 }

 async getCustomerList(req:Request,res:Response)
    {
        try {
            const customerData=await customerService.fetchCustomers()
            res.status(200).json(customerData)
        } catch (error) {
            console.log(error,"error in fetching all customer list")
    res.status(500).json({message:"Error in fetching all customer list"})
        }
    }

    async search(req: Request, res: Response) {
        try {
          const query = req.query.query as string;
          const results = await customerService.search(query);
          res.status(200).json(results);
        } catch (error) {
          res.status(500).json({ message: "Error searching customer" });
        }
      }

      async updateCustomer(req:Request,res:Response)
 {
    try {
        const {id}=req.params
        const data=req.body
        const inventory=await customerService.update(id as string,data)
        if (!inventory) {
            res.status(404).json({ message:"customer not found" });
            return
          }
          res.status(200).json(inventory);
    } catch (error:any) {
        console.log(error,"error in updating customer")
        res.status(500).json({message:"Error updating the customer"})
         
    }
 }
    
}

export default new CustomerController()