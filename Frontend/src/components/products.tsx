import React, { useEffect, useState } from 'react';
import { 
  FaPlus, 
  FaEdit, 
  FaTrash, 
  FaSearch 
} from 'react-icons/fa';
import { 
  Input, 
  Button, 
  Table, 
  TableHeader, 
  TableColumn, 
  TableBody, 
  TableRow, 
  TableCell, 
  Modal, 
  ModalContent, 
  ModalHeader, 
  ModalBody, 
  ModalFooter, 
  Textarea
} from '@heroui/react';
import SidebarMenu from './SIdebar';
import { useNavigate } from 'react-router-dom';
import "./css/spinner.css"
import { userAuthenticate } from '../utils/userInterceptor';
import { toast } from 'sonner';
export type ProductData={
  _id:string,
  name:string,
  description:string,
  quantity:number,
  price:number
}
const ProductManagementPage = () => {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
const [currentProduct, setCurrentProduct] = useState<ProductData | null>(null);

  const [products, setProducts] = useState<ProductData[]>([]);

  const handleDeleteProduct = async (id:string) => {
    try {
      await userAuthenticate.delete(`/delete-product/${id}`);
      setProducts(products.filter((product) => product._id !== id)); // Update frontend state
      toast.success("Product deleted successfully!");
    } catch (error) {
      console.error("Error deleting product:", error);
      toast.error("Failed to delete product.");
    }
  };
  
  const handleUpdateProduct = async (updatedProduct: ProductData) => {
    try {
      const response = await userAuthenticate.put(`/update-product/${updatedProduct._id}`, updatedProduct);
      setProducts(
        products.map((product) =>
          product._id === updatedProduct._id ? response.data : product
        )
      ); // Update frontend state
      toast.success("Product updated successfully!");
    } catch (error) {
      console.error("Error updating product:", error);
      toast.error("Failed to update product.");
    }
  };
  
const fetchProducts=async()=>{
    const response=await userAuthenticate.get('/products')
    setProducts(response.data)
}
  useEffect(()=>{
   fetchProducts()
  },[])
  const [searchTerm, setSearchTerm] = useState('');

  const filteredProducts = products.filter(product => 
    product.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // const handleAddProduct = (newProduct) => {
  //   setProducts([
  //     ...products, 
  //     { ...newProduct, id: products.length + 1 }
  //   ]);
  //   setIsAddModalOpen(false);
  // };
const navigate=useNavigate()
  return (
    <>
    <SidebarMenu>
    <div className=" min-h-screen p-8">
      <div className="container mx-auto">
        {/* Page Header */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Product Management</h1>
          <Button 
            color="primary" 
            startContent={<FaPlus />}
            onClick={() => navigate('/new-product')}
            className="bg-blue-600 hover:bg-blue-700 cursor-pointer text-white"
          >
            Add New Product
          </Button>
        </div>

        {/* Search Bar */}
        <div className="mb-6">
          <Input
            isClearable
            radius="lg"
            className="
            bg-white 
            border 
            border-gray-300 
            rounded-lg 
            shadow-md 
            hover:shadow-lg 
            focus:outline-none 
            focus:border-blue-500 
            transition-all 
            duration-300 
            backdrop-blur-sm
            w-fit
          "
            placeholder="Search products..."
            startContent={<FaSearch className="text-black/50 mb-0.5 dark:text-black/90" />}
            value={searchTerm}
            
            onChange={(e) => setSearchTerm(e.target.value)}
        
          />
        </div>

        {/* Product Table */}
        <Table 
          aria-label="Product management table"
          className="shadow-lg rounded-lg overflow-hidden"
        >
          <TableHeader>
            <TableColumn>NAME</TableColumn>
            <TableColumn>DESCRIPTION</TableColumn>
            <TableColumn>QUANTITY</TableColumn>
            <TableColumn>PRICE</TableColumn>
            <TableColumn>ACTIONS</TableColumn>
          </TableHeader>
          <TableBody emptyState={
            <div className="text-center p-4">
              No products found
            </div>
          }>
            {filteredProducts.map((product) => (
              <TableRow key={product._id}>
                <TableCell>{product.name}</TableCell>
                <TableCell>{product.description}</TableCell>
                <TableCell>{product.quantity}</TableCell>
                <TableCell>₹{product.price.toFixed(2)}</TableCell>
                <TableCell>
                  <div className="flex space-x-2">
                    <Button 
                      isIconOnly 
                      color="warning" 
                      variant="light"
                      aria-label="Edit"
                      className='cursor-pointer'
                      onPress={()=>{
                        setCurrentProduct(product);
                        setIsEditModalOpen(true)
                      }}
                    >
                      <FaEdit />
                    </Button>
                    <Button 
                      isIconOnly 
                      color="danger" 
                      variant="light"
                      aria-label="Delete"
                      className='cursor-pointer'
                      onPress={()=>handleDeleteProduct(product._id)}
                    >
                      <FaTrash />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        
        <Modal 
  isOpen={isEditModalOpen} 
  onOpenChange={setIsEditModalOpen}
  placement="top-center"
  className='bg-white z-20'
>
  <ModalContent>
    {(onClose) => (
      <>
        <ModalHeader className="flex text-center flex-col gap-1">
          <h1 className='text-2xl font-medium'>Edit Product</h1>
        </ModalHeader>
        <ModalBody>
        <div className='flex items-center gap-4'>
              <label htmlFor="name" className="w-1/3 text-right font-medium">
            Name
          </label>
          <Input
          
            value={currentProduct?.name || ''}
            onChange={(e) =>
              setCurrentProduct({ ...currentProduct, name: e.target.value } as typeof products[0])
            }
          /></div>
          <div className='flex items-center gap-4'>
              <label htmlFor="description" className="w-1/3 text-right font-medium">
            description
          </label>
          <Textarea
            
            value={currentProduct?.description || ''}
            onChange={(e) =>
              setCurrentProduct({ ...currentProduct, description: e.target.value } as typeof products[0])
            }
          /></div>
          <div className='flex items-center gap-4'>
              <label htmlFor="quantity" className="w-1/3 text-right font-medium">
            Quantity
          </label>
          <Input
            type="number"
            value={currentProduct?.quantity }
            onChange={(e) =>
              setCurrentProduct({ ...currentProduct, quantity: Number(e.target.value) } as ProductData)
            }
          /></div>
          <div className='flex items-center gap-4'>
              <label htmlFor="price" className="w-1/3 text-right font-medium">
            Price
          </label>
          <Input
            type="number"
            
            value={currentProduct?.price}
            onChange={(e) =>
              setCurrentProduct({ ...currentProduct, price: Number(e.target.value) } as typeof products[0])
            }
          /></div>
        </ModalBody>
        <ModalFooter>
          <Button 
            color="danger" 
            variant="flat" 
            onPress={onClose}
            className='bg-red-500 cursor-pointer text-white rounded-lg shadow-md'
          >
            Cancel

          </Button>
          <Button
           
            color="primary" 
            onPress={() => {
              if (currentProduct) handleUpdateProduct(currentProduct);
              onClose();
            }}
            className='bg-blue-500 cursor-pointer text-white rounded-lg shadow-md'
          >
            Update Product
          </Button>
        </ModalFooter>
      </>
    )}
  </ModalContent>
</Modal>

      </div>
    </div>
    </SidebarMenu>
    </>
  );
};

export default ProductManagementPage;