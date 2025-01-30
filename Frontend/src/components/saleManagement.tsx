import React, { useState, useEffect } from 'react';
import { 
  FaSearch, 
  FaPlus, 
  FaTrash
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
  Autocomplete,
  AutocompleteItem
} from '@heroui/react';
import { userAuthenticate } from '../utils/userInterceptor';
import SidebarMenu from './SIdebar';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';

type SaleType = {
  id?: string;
  productName: string;
  customerName: string;
  price: number;
  quantity: number;
  totalAmount: number;
}

type ProductType = {
    _id:string
    name:string
    description:string
    quantity:number
    price:number
}

type CustomerType = {
    _id:string
        name:string,
        address:string,
        mobile:number
}

type BillItemType = {
  productId: string;
  productName: string;
  customerName:string
  customerId:string;
  price: number;
  quantity: number;
  totalAmount: number;
  paymentType?:string
}

const SalesManagement = () => {
  const [sales, setSales] = useState<SaleType[]>([]);
  const [products, setProducts] = useState<ProductType[]>([]);
  const [customers, setCustomers] = useState<CustomerType[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [paymentType, setPaymentType] = useState<string>('');
  const [billItems, setBillItems] = useState<BillItemType[]>([]);
  const [currentBill, setCurrentBill] = useState({
    productId: '',
    customerId: '',
    quantity: 1,
    productName: '',
    customerName: '',
    price: 0
  });

  const fetchInitialData = async () => {
    try {
      const [ productsResponse, customersResponse] = await Promise.all([
        //userAuthenticate.get('/sales'),
        userAuthenticate.get('/products'),
        userAuthenticate.get('/customers')
      ]);
       
     // setSales(salesResponse.data);
     console.log(productsResponse,customersResponse,"all response ");
     
      setProducts(productsResponse.data);
      setCustomers(customersResponse.data);
    } catch (error) {
      console.error('Failed to fetch initial data', error);
    }
  };
  console.log(customers,"customers");

  useEffect(() => {
    fetchInitialData();
    
    
  }, []);

  useEffect(() => {
    console.log("Updated currentBill:", currentBill);
  }, [currentBill]);

  const handleGenerateBill = () => {
    // Validate inputs
    console.log("current Bill",currentBill);
    
    if (!currentBill.productId || !currentBill.customerId) {
      toast.error('Please select a product and customer');
      return;
    }
    if (currentBill.quantity <= 0) {
        toast.error('Quantity must be greater than 0');
        return;
      }
     const productExist= billItems.find((c)=>c.productId==currentBill.productId)
    if(productExist)
    {
    const updatedBill=billItems.map((p)=>p.productId==currentBill.productId?{...p,totalAmount:p.totalAmount+p.price*currentBill.quantity,quantity:p.quantity+currentBill.quantity}:p)
    setBillItems(updatedBill)
    }
    else{
    const newBillItem = {
      productId: currentBill.productId,
      customerId:currentBill.customerId,
      productName: currentBill.productName,
      customerName:currentBill.customerName,
      price: currentBill.price,
      quantity: currentBill.quantity,
      totalAmount: currentBill.price * currentBill.quantity
    };

    // Add to bill items
    setBillItems([...billItems, newBillItem]);
    }
    // Reset current bill selection
    setCurrentBill({
        ...currentBill,
      productId: '',
      
      quantity: 1,
      productName: '',
      price: 0
    });
  };
  const navigate=useNavigate()
  const handleConfirmSale = async () => {
    if (billItems.length === 0) {
      toast.error('No items in the bill');
      return;
    }
  
    if (!paymentType) {
      toast.error('Please select a payment method');
      return;
    }
  
    try {
    
      const saleData = {
        customer: currentBill.customerId, 
        items: billItems.map(item => ({
          productId: item.productId,
          quantity: item.quantity,
          price: item.price,
        })),
        payment: paymentType, 
        totalAmount: billItems.reduce((total, item) => total + item.totalAmount, 0), 
      };
  
    
      const response = await userAuthenticate.post('/add-sale', saleData);
  console.log(response.data,"response data");
  
      
      setBillItems([]);
      setCurrentBill({
        productId: '',
        customerId: '',
        quantity: 1,
        productName: '',
        customerName: '',
        price: 0,
      });
      setPaymentType('');

      navigate('/sale-reports')
      toast.success('Sale confirmed successfully!');
    } catch (error) {
      console.error('Failed to confirm sale', error);
      toast.error('Failed to confirm sale');
    }
  };
  
  const filteredSales = sales.filter(sale => 
    sale.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    sale.customerName.toLowerCase().includes(searchTerm.toLowerCase())
  );
console.log(filteredSales,"filtered sales");
// useEffect(()=>{
// console.log('check thec currennt bikk',currentBill.productName);
// },[currentBill])

  return (
    <>
    <SidebarMenu>
    
    <div className="bg-gray-50 min-h-screen p-8">
      <div className="container mx-auto">
     

             {billItems.length > 0 && (
            <>
          <div className="bg-white shadow-lg rounded-xl overflow-hidden mb-8">
            <Table aria-label="Current bill items">
              <TableHeader className="bg-gray-100">
              <TableColumn className="text-center py-4 font-bold text-gray-700">CUSTOMER</TableColumn>
                <TableColumn className="text-center py-4 font-bold text-gray-700">PRODUCT</TableColumn>
                <TableColumn className="text-center py-4 font-bold text-gray-700">PRICE</TableColumn>
                <TableColumn className="text-center py-4 font-bold text-gray-700">QUANTITY</TableColumn>
                <TableColumn className="text-center py-4 font-bold text-gray-700">TOTAL AMOUNT</TableColumn>
                <TableColumn className="text-center py-4 font-bold text-gray-700">Actions</TableColumn>
              </TableHeader>
              <TableBody>
                {billItems.map((item, index) => (
                  <TableRow key={index} className="hover:bg-gray-50 transition-colors duration-200">
                    <TableCell className="p-4 text-gray-800 text-center">{item.customerName}</TableCell>
                                        <TableCell className="p-4 text-gray-800 text-center">{item.productName}</TableCell>
                    <TableCell className="p-4 text-gray-800 text-center">₹{item.price.toFixed(2)}</TableCell>
                    <TableCell className="p-4 text-gray-800 text-center">{item.quantity}</TableCell>
                    <TableCell className="p-4 text-gray-800 text-center">₹{item.totalAmount.toFixed(2)}</TableCell>
                    <TableCell className="p-4 text-gray-800 text-center" onClick={()=>setBillItems((prev)=>prev.filter((item,i)=>i!==index))}><FaTrash/></TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            <div className='flex mt-4 justify-end items-center'><Button 
           color="success"
           onPress={handleConfirmSale}
           disabled={billItems.length === 0}
         >
           Confirm Sale
         </Button></div>
          </div>
           {/* <div className='flex justify-end items-center'><Button 
           color="success"
           onPress={handleConfirmSale}
           disabled={billItems.length === 0}
         >
           Confirm Sale
         </Button></div> */}
         <div className="flex justify-end mt-4 space-x-4">
  <div className='flex items-center space-x-4 mt-4'><label htmlFor="paymentType" className="block font-medium  text-slate-800">
    Payment 
  </label>
  <select
    id="paymentType"
    className="border rounded h-fit  border-gray-300  shadow-cyan-100 px-4 py-2 w-fit"
    value={paymentType}
    onChange={(e) => setPaymentType(e.target.value)}
  >
    <option value="" disabled>
      Select
    </option>
    <option value="Cash">Cash</option>
    <option value="UPI">UPI</option>
    <option value="Card">Card</option>
  </select>
</div>
  <button
    onClick={handleConfirmSale}
    className="bg-blue-500 text-white py-2 px-4 rounded mt-4"
  >
    Confirm Bill
  </button>
</div>

 </>
        )}

        
        <div className="bg-white shadow-lg rounded-xl p-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Generate Bill</h2>
          <div className="grid grid-cols-3 gap-4">
        
            <div>
              <label className="block mb-2 text-gray-700">Customer</label>
              <Autocomplete
                
                className="w-full text-black"
                
                onSelectionChange={(key) => {
                  const customer = customers.find(c => c._id == (key));
                  if (customer) {
                    if (currentBill.customerId && currentBill.customerId !== customer._id.toString()) {
                      console.log("Selected Customer:", customer);
                        if (confirm('Selecting a new customer will clear the current bill. Do you want to proceed?')) {
                      
                          setBillItems([]);
                          setCurrentBill({
                            ...currentBill,
                            customerId: customer._id.toString(),
                            customerName: customer.name,
                          });
                        }
                      } else {
                    setCurrentBill(prev => ({
                      ...prev,
                      customerId: customer._id.toString(),
                      customerName: customer.name
                    }));
                  }
                }}}
              >
                {customers.length>0?(customers.map((customer) => (
                  <AutocompleteItem 
                    key={customer._id} 
                    className='bg-white w-full h-fit'
                    value={customer._id.toString()}
                  >
                    {customer.name}
                  </AutocompleteItem>
                ))):null}
              </Autocomplete>
            </div>

        
            <div>
  <label className="block mb-2 text-gray-700">Product</label>
  <Autocomplete
    className="w-full text-black "
    // value={currentBill.productName}
    style={{ color: "black" }} 
    onSelectionChange={(key) => {
      const product = products.find((p) => p._id === key);
      if (product) {
        console.log("Selected Product:", product); // Debugging
        setCurrentBill((prev) => ({
          ...prev,
          productId: product._id,
          productName: product.name, // Update product name
          price: product.price,
        }));
      }
    }}
  >
    {/* {currentBill.customerName} */}
    {products.length > 0
      ? products.map((product) => (
          <AutocompleteItem
            key={product._id}
            className="bg-white w-full h-fit"
            value={product._id.toString()}
            textValue={product.name}
          >
            {product.name} - ₹{product.price.toFixed(2)} 
          </AutocompleteItem>
        ))
      : null}
  </Autocomplete>

</div>
            {/* Quantity Input */}
            <div>
              <label className="block mb-2 text-gray-700">Quantity</label>
              <Input
                type="number"
                min={1}
                value={currentBill.quantity.toString()}
                onChange={(e) => setCurrentBill(prev => ({
                  ...prev,
                  quantity: parseInt(e.target.value)
                }))}
                className="w-full"
                variant="bordered"
              />
            </div>

            
            <div className="col-span-3 flex justify-end mt-4">
              <Button 
                color="primary"
                className='bg-green-600 rounded-md text-gray-100 hover:text-white hover:bg-green-700'
                onPress={handleGenerateBill}
                startContent={<FaPlus />}
                disabled={!currentBill.productId || !currentBill.customerId}
              >
                Add to Bill
              </Button>
              {/* <Button 
                color="success"
                onPress={handleConfirmSale}
                disabled={billItems.length === 0}
              >
                Confirm Sale
              </Button> */}
            </div>
          </div>
        </div>
      </div>
    </div>
    </SidebarMenu>
    </>
  );
};

export default SalesManagement;