import { Request,Response } from "express";
import inventoryService from "../services/inventoryService";
export class InventoryController{
    async login(req:Request,res:Response)
    {
    try {
        console.log(req.body,"req.body");
        
        const{email,password}=req.body
        console.log("nnsns");
        
        const user=await inventoryService.login(email,password)
        
        if (!user) {
             res.status(404).json({ error: "Invalid credentials" });
             return
        }
        const {refreshToken}=user
        res.cookie('InventoryRefreshToken', refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production', // Use HTTPS in production
    sameSite: 'none', 
            maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
        });
        
        res.status(200).json(user)
        
    } catch (error) {
        console.log(error,"error in creating product")
    res.status(500).json({message:"Error creating the product"})
    }
    }

    async getProductsList(req:Request,res:Response)
    {
        try {
            const productData=await inventoryService.fetchProducts()
            res.status(200).json(productData)   
        } catch (error) {
            console.log(error,"error in fetching all product list")
    res.status(500).json({message:"Error in fetching all product list"})
        }
    }
 async createProduct(req:Request,res:Response)
 {
  try {
    console.log(req.body,"req.body");
    
    const data=req.body
    const inventory=await inventoryService.create(data)
    res.status(201).json(inventory)
  } catch (error:any) {
    console.log(error,"error in creating product")
    res.status(500).json({message:"Error creating the product"})
    
  }
 }
 
 async refreshAccessToken(req: Request, res: Response){
    try {
        console.log("Request cookies:", req.cookies);  
        const { RefreshToken } = req.cookies;
        console.log("Refresh token from cookies:", RefreshToken);  

        if (!RefreshToken) {
            console.log("No refresh token found");  
            res.status(401).json({ message: "Refresh token is missing" });
            return
        }

        const newAccessToken = await inventoryService.refreshAccessToken(RefreshToken);
        console.log("New Access Token:", newAccessToken); 
        res.status(200).json({ message: "New access token created", accessToken: newAccessToken });

    } catch (error) {
        console.error("Error while refreshing access token:", error);  
        res.status(500).json({ message: "Failed to refresh access token" });
    }
}
 async updateProduct(req:Request,res:Response)
 {
    try {
        const {_id}=req.params
        const data=req.body
        const inventory=await inventoryService.update(_id as string,data)
        if (!inventory) {
            res.status(404).json({ message: "Inventory not found" });
            return
          }
          res.status(200).json(inventory);
    } catch (error:any) {
        console.log(error,"error in updating product")
        res.status(500).json({message:"Error updating the product"})
         
    }
 }

 async deleteProduct(req:Request,res:Response)
 {
    try {
        const {id}=req.params
        await inventoryService.deleteProduct(id as string)
        res.status(204).send()
    } catch (error:any) {
        console.log(error,"error in deleting product")
        res.status(500).json({message:"Error deleting the product"})
    }
 }

 async search(req: Request, res: Response) {
    try {
      const query = req.query.query as string;
      const results = await inventoryService.search(query);
      res.status(200).json(results);
    } catch (error) {
      res.status(500).json({ message: "Error searching inventory" });
    }
  }
}

export default new InventoryController()