import React from 'react'    
import {Form, Input, Button, Textarea} from "@heroui/react";

import SidebarMenu from './SIdebar'
import { FaAlignLeft } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { userAuthenticate } from '../utils/userInterceptor';
type FormDataType = {
    name: string;
    description: string;
    quantity:number;
    price:number;
  };
const NewProduct:React.FC = () => {
  const [submitted, setSubmitted] = React.useState<FormDataType|null>(null);
  const [errors, setErrors] = React.useState<Record<string,string>>({});

  // Real-time password validation
  const validateForm = (data: Record<string, string | number>) => {
    const newErrors: Record<string, string> = {};

    if (!data.name) {
      newErrors.name = "Product name is required";
    }

    if (!data.description) {
      newErrors.description = "Description is required";
    }

    if (!data.quantity || Number(data.quantity) <= 0) {
      newErrors.quantity = "Quantity must be a positive number";
    }

    if (!data.price || Number(data.price) <= 0) {
      newErrors.price = "Price must be a positive number";
    }

    return newErrors;
  };

  const onSubmit =async (e:React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const data =new FormData(e.currentTarget)

   const formData:FormDataType={
    name:data.get('name') as string,
    description:data.get('description') as string,
    quantity:Number(data.get('quantity')),
    price:Number(data.get("price"))
   }
    
    const newErrors:Record<string,string> = validateForm(formData);

    
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    try {
        const response = await userAuthenticate.post('/add-product', formData);
  
        if (response.status === 201) {
          setSubmitted(formData);
          navigate('/products');
        } else {
          console.error('Failed to submit the product', response.data);
        }
      } catch (error) {
        console.error('Error occurred while submitting the product', error);
      }
    setErrors({});
    setSubmitted(formData);
  };
const navigate=useNavigate()
  return (
    <>
    <SidebarMenu>
      <div className="min-h-screen flex">
        {/* Sidebar takes its space */}
        <div className="flex-grow">
            <div className='flex justify-end'>
            <Button 
            color="primary" 
            startContent={<FaAlignLeft />}
            onClick={() => navigate('/products')}
            className="bg-blue-600 cursor-pointer hover:bg-blue-700 text-white"
          >
             ProductList
          </Button>
            </div>
          <Form
            className="w-full flex  border-gray-300  justify-center gap-10 items-center space-y-4 min-h-screen"
            validationBehavior="native"
            validationErrors={errors}
            onReset={() => setSubmitted(null)}
            onSubmit={onSubmit}
          >
            <div className="flex flex-col p-16 gap-4 -mt-20 max-w-fit shadow-2xl bg-white rounded-md border-gray-300 w-full">
                <h1 className='text-3xl font-semibold -mt-10 text-center'>Add New Product</h1>
              {/* Product Name */}
              <div className='flex items-center gap-4'>
              <label htmlFor="name" className="w-1/3 text-right font-medium">
            Name
          </label>
              <Input
                isRequired
                errorMessage={errors.name}
                
                labelPlacement="outside"
                name="name"
                placeholder="Enter product name"
              />
  </div>
              <div className='flex items-center gap-4'>
              <label htmlFor="description" className="w-1/3 text-right font-medium">
            Description
          </label>
              <Textarea
                isRequired
                errorMessage={errors.description}
            
            
                name="description"
                placeholder="Enter product description"
                rows={3}
              />
              </div>
  
              <div className='flex items-center gap-4'>
              <label htmlFor="quantity" className="w-1/3 text-right font-medium">
            Quantity
          </label>
              <Input
                isRequired
                errorMessage={errors.quantity}
                
                name="quantity"
                placeholder="Enter product quantity"
                type="number"
              />
  </div>
              <div className='flex items-center gap-4'>
              <label htmlFor="price" className="w-1/3 text-right font-medium">
              Price
          </label>
              <Input
                isRequired
                errorMessage={errors.price}
                
                name="price"
                placeholder="Enter product price"
                type="number"
              />
               </div>
              {/* Submit and Reset Buttons */}
              <div className="flex items-center justify-center mt-4 gap-4">
                <Button className="w-fit px-8 py-2 bg-slate-800 h-fit text-white" color="primary" type="submit">
                  Submit
                </Button>
                
              </div>
            </div>
  
            {submitted && (
              <div className="text-small text-default-500 mt-4">
                Submitted data: <pre>{JSON.stringify(submitted, null, 2)}</pre>
              </div>
            )}
          </Form>
        </div>
      </div>
    </SidebarMenu>
  </>
  
  )
}

export default NewProduct