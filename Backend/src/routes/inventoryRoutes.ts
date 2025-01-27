 import { Router } from "express";
import inventoryController from "../controllers/inventoryController";
import verifyToken from "../middleware/userMiddleware";
import customerController from "../controllers/customerController";
import salesController from "../controllers/salesController";

 const userRouter=Router()

 userRouter.post('/login', inventoryController.login)
 userRouter.get('/auth/refreshToken',inventoryController.refreshAccessToken)
 userRouter.get('/products',verifyToken,inventoryController.getProductsList)
 userRouter.post('/add-product',verifyToken,inventoryController.createProduct)
 userRouter.delete('/delete-product/:id',verifyToken,inventoryController.deleteProduct)
 userRouter.put('/update-product/:_id',verifyToken,inventoryController.updateProduct)
 userRouter.post('/add-customer',verifyToken,customerController.AddNewCustomer)
 userRouter.get('/customers',verifyToken,customerController.getCustomerList)
 userRouter.post('/update-customer',verifyToken,customerController.updateCustomer)
//  userRouter.get('/sales',verifyToken,salesController.getSaleList)
userRouter.get('/sales-report',verifyToken,salesController.salesReport)
 userRouter.post('/add-sale',verifyToken,salesController.AddNewSale)


 export default userRouter