import { IInventory } from './../models/inventory';

import inventoryRepository from '../repositories/inventoryRepository';
import { User } from '../Types/Inventory';
import authconfig from '../config/authConfig';
import { accessSync } from 'fs';

class InventoryService{
    async login(email:string,password:string):Promise<{userLog:User,accessToken:string,refreshToken:string}|null>
    {
        let userHashPass=await authconfig.hashPassword(password)
        let userLog={email,password}
       const user= await inventoryRepository.login(email)
        if(user && await authconfig.compare(password,userHashPass))
        {
            let payload={userId:email}
          const accessToken=await authconfig.generateAccessToken(payload)
          const refreshToken=await authconfig.generateRefreshToken(payload)
          console.log(accessToken,refreshToken,"sss");
          
            return {userLog,accessToken,refreshToken}
        }

        return null
         
    }
    async fetchProducts():Promise<IInventory[]>
    {
        return await inventoryRepository.getAll()
    }
    async create(data:IInventory):Promise<IInventory>
    {
        console.log(data,"datakjsngksgn");
        
        return  await inventoryRepository.create(data)
    }
    async refreshAccessToken(refreshToken: string) {
        try {
            const decoded = await authconfig.verifyRefreshToken(refreshToken);
            if (!decoded) throw new Error("Invalid refresh token");
    
            const accessToken = await authconfig.generateAccessToken({ userId: decoded.userId,  });
            console.log("Generated new access token:", accessToken);  // Check new token generation
            return accessToken;
        } catch (error) {
            console.error("Error during token refresh:", error);  // Log the error
            throw new Error("Failed to refresh access token");
        }
    }

    async update(productId:string,data:Partial<IInventory>):Promise<IInventory|null>
    {
        return await inventoryRepository.update(productId,data)
    }
    async getByProduct(productId:string):Promise<IInventory|null>
    {
        return await inventoryRepository.getById(productId)
    }
    async getAll():Promise<IInventory[]>
    {
        return inventoryRepository.getAll()
    }
    async search(query:string):Promise<IInventory[]>{
        return inventoryRepository.search(query)
    }

    async deleteProduct(productId:string):Promise<void>
    {
        return inventoryRepository.delete(productId)
    }
    
}

export default new InventoryService()