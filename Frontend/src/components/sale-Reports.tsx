// import React, { useEffect, useState } from "react";
// import { FaTrash } from "react-icons/fa";
// // import {  billingProductService, getAllCustomersService, getAllProductService } from "../services/userService";
// import { toast } from "sonner";



// function Sales() {
//   const [customers, setCustomers] = useState([]);
//   const [products, setProducts] = useState([]);
//   const [searchQuery, setSearchQuery] = useState("");
//   const [selectedCustomer, setSelectedCustomer] = useState(null);
//   const [billingProducts, setBillingProducts] = useState([]);
//   const [selectedProductId, setSelectedProductId] = useState("");
//   const [quantity, setQuantity] = useState(1);
//   const [paymentType, setPaymentType] = useState("Cash");
//   const [totalBill, setTotalBill] = useState(0);

  
//   useEffect(() => {
//       fetchAllProduct()
//       fetchAllCustomers()
//   },[])


//   const fetchAllCustomers = async() => {
//     // try {
//     //   const response = await getAllCustomersService();
//     //   if(response.success){
       
//     //    setCustomers(response.customers)
//     //   }else{
//     //     toast.error("Failed to Fetch customers")
//     //   }
     
//     // } catch (error) {
//     //    console.log("Error in fetchAllCustomers: ", error)
//     // }
//  }
//   const fetchAllProduct = async () => {
//     // try {
//     //   const response = await getAllProductService();
//     //   if (response.success) {
        
//     //     setProducts(response.products);
//     //   } else {
//     //     toast.error(response.message || 'Failed to fetch products.');
//     //   }
//     // } catch (error) {
//     //   console.error('Error in fetchAllProduct:', error);
//     //   toast.error('Something went wrong while fetching products.');
//     // }
//   };

//   const filteredCustomers = customers.filter((customer) =>
//     customer.name.toLowerCase().includes(searchQuery.toLowerCase())
//   );

//   const handleCustomerSelect = (customer) => {
//     setSelectedCustomer(customer);
//     setSearchQuery("");
//   };

//   const handleAddProduct = () => {
//     if (!selectedProductId) return toast.warning("Please select a product!");

//     const product = products.find((p) => p._id === selectedProductId);
//     if (!product) return;

//     if (quantity > product.quantity) {
//       return toast.warning(
//         `Only ${product.quantity} units available for ${product.product}`
//       );
//     }

//     const newProduct = {
//       _id: product._id,
//       product: product.product,
//       quantity,
//       price: product.price,
//       subtotal: product.price * quantity,
//     };

//     setBillingProducts([...billingProducts, newProduct]);
//     setSelectedProductId("");
//     setQuantity(1);
//     setPaymentType("Cash");
//   };

//   const handleRemoveProduct = (index) => {
//     const updatedBillingProducts = billingProducts.filter(
//       (_, i) => i !== index
//     );
//     setBillingProducts(updatedBillingProducts);
//   };

//   const validateDetails = () => {
//        if(!selectedCustomer){
//           toast.error("Please Select a Customer!!");
//           return false
//        }
//        if(billingProducts.length === 0){
//           toast.error("Please add products");
//           return false
//        }

//        return true
//   }

//   const calculateTotalBill = async() => {
//     if(!validateDetails()){
//         return 
//     }

//     const total = billingProducts.reduce((sum, item) => sum + item.subtotal, 0);
//     setTotalBill(total);

//     const data = {
//         customersId:selectedCustomer._id,
//         billingProducts,
//         paymentType,
//         totalAmout:total
//     }
//     console.log("Selected product: ", billingProducts);
//     console.log('This is selected customers: ', selectedCustomer._id);

//     //const response = await billingProductService(data);
//     // if(response.success){
//     //   toast.success("Sale recorded successfully!");

//     //   setSelectedCustomer(null);
//     //   setBillingProducts([])
//     // }

    
//   };

//   return (
//     <div className="p-4">
//       <div className="flex items-center p-4 bg-gray-100 rounded-md shadow-md">
//         <h1 className="text-2xl font-bold font-mono mx-auto">Billing</h1>
//       </div>

//       <div className="mt-4">
//         <h2 className="mb-2 text-lg font-semibold">Select Customer:</h2>
//         <div className="relative">
//           <input
//             type="text"
//             className="w-[50%] p-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
//             placeholder="Search for a customer..."
//             value={searchQuery}
//             onChange={(e) => setSearchQuery(e.target.value)}
//           />
//           {searchQuery && (
//             <ul className="absolute w-[50%] bg-white border border-gray-300 rounded-md shadow-md max-h-48 overflow-y-auto z-10">
//               {filteredCustomers.length > 0 ? (
//                 filteredCustomers.map((customer) => (
//                   <li
//                     key={customer._id}
//                     className="p-2 hover:bg-blue-500 hover:text-white cursor-pointer"
//                     onClick={() => handleCustomerSelect(customer)}
//                   >
//                     {customer.name}
//                   </li>
//                 ))
//               ) : (
//                 <li className="p-2 text-gray-500">No customers found</li>
//               )}
//             </ul>
//           )}
//         </div>
//       </div>

//       <div className="mt-8">
//         <h2 className="mb-4 text-lg font-semibold">Add Products to Billing:</h2>
//         <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
//           <select
//             className="p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
//             value={selectedProductId}
//             onChange={(e) => setSelectedProductId(e.target.value)}
//           >
//             <option value="" disabled>
//               Select Product
//             </option>
//             {products.map((product) => (
//               <option key={product._id} value={product._id}>
//                 {product.product}
//               </option>
//             ))}
//           </select>

//           <input
//             type="number"
//             min="1"
//             max="100"
//             className="p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
//             placeholder="Quantity"
//             value={quantity}
//             onChange={(e) => setQuantity(Number(e.target.value))}
//           />

//           <button
//             onClick={handleAddProduct}
//             className="p-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none"
//           >
//             Add
//           </button>
//         </div>
//       </div>

//       <div className="mt-8">
//         <div className="flex flex-col md:flex-row items-center justify-evenly bg-gray-100 p-4 rounded-md shadow-md">
//           <h2 className="text-lg font-semibold mb-2 md:mb-0">Billing Details</h2>
//           {selectedCustomer && (
//             <div className="text-lg">
//               <span>Selected Customer: </span>
//               <span className="font-bold font-mono">
//                 {selectedCustomer.name}
//               </span>
//             </div>
//           )}
//         </div>

//         {billingProducts.length > 0 ? (
//           <table className="w-full mt-4 border-collapse border border-gray-300">
//             <thead>
//               <tr className="bg-gray-100">
//                 <th className="p-2 border text-left border-gray-300">Product Name</th>
//                 <th className="p-2 border text-center border-gray-300">Price</th>
//                 <th className="p-2 border text-center border-gray-300">Quantity</th>
//                 <th className="p-2 border text-center border-gray-300">SubTotal</th>
//                 <th className="p-1 border text-center border-gray-300">Remove</th>
//               </tr>
//             </thead>
//             <tbody>
//               {billingProducts.map((product, index) => (
//                 <tr key={index}>
//                   <td className="p-2 border  border-gray-300">
//                     {product.product}
//                   </td>
//                   <td className="p-2 border text-center border-gray-300">₹{product.price}</td>
//                   <td className="p-2 border text-center border-gray-300">
//                     {product.quantity}
//                   </td>
//                   <td className="p-2 border text-center border-gray-300">
//                     ₹{product.subtotal}
//                   </td>
//                   <td className="p-1 border text-center border-gray-300">
//                     <button
//                       onClick={() => handleRemoveProduct(index)}
//                       className="text-red-500 hover:text-red-700"
//                     >
//                       <FaTrash />
//                     </button>
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//             <tfoot>
//               <tr className="bg-gray-200 ">
//                 <td colSpan="3" className="p-2 text-left font-bold">
//                   Total Amount
//                 </td>
//                 <td className="p-2 text-center font-bold">
//                   ₹
//                   {billingProducts.reduce(
//                     (sum, item) => sum + item.subtotal,
//                     0
//                   )}
//                 </td>
//                 <td className="p-2"></td>
//               </tr>
//             </tfoot>
//           </table>
//         ) : (
//           <p className="mt-4 text-gray-500">No products added to billing yet.</p>
//         )}
//       </div>

//       <div className="mt-4 flex items-center justify-end space-x-4">
//         <label className="text-lg font-semibold" htmlFor="paymentType">
//           Payment Type:
//         </label>
//         <select
//           id="paymentType"
//           className="p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
//           value={paymentType}
//           onChange={(e) => setPaymentType(e.target.value)}
//         >
//           <option value="Cash">Cash</option>
//           <option value="Card">Card</option>
//           <option value="UPI">UPI</option>
//         </select>
//         <button
//           onClick={calculateTotalBill}
//           className="p-2 bg-green-500 text-white rounded-md hover:bg-green-600 focus:outline-none"
//         >
//           Generate Bill
//         </button>
//       </div>

//       {/* {totalBill > 0 && (
//         <div className="mt-4 p-4 bg-gray-100 rounded-md shadow-md flex">
//           <h3 className="text-xl font-semibold">Total Bill: ₹{totalBill}</h3>
//         </div>
//       )} */}
//     </div>
//   );
// }

// export default Sales


import React, { useState, useEffect } from 'react';
import * as XLSX from "xlsx";
import { jsPDF } from "jspdf";
import "jspdf-autotable"
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
  AutocompleteItem,
  Select,
  SelectItem
} from '@heroui/react';
import { 
  FaFilter, 
  FaCalendar 
} from 'react-icons/fa';
import { userAuthenticate } from '../utils/userInterceptor';
import "./css/spinner.css"
import SidebarMenu from './SIdebar';
import { ProductData } from './products';
import { CustomerType } from './customerManagement';
interface Item {
  productId: ProductData;
  quantity: number;
  price:number}
type SaleDataType={
  customer:CustomerType,
  items:Item[]
  date:Date

  payment:'Cash'|'Card'|'Online'
  totalAmount:number

}
// Types for different report configurations
type SaleReportType = {
  id: number;
  productName: string;
  customerName: string;
  date: string;
  quantity: number;
  totalAmount: number;
}

type ReportFilterType = {
  type: 'product' | 'sales' | 'customerLedger';
  startDate: string;
  endDate: string;
  selectedId?: number;
}

const SalesReportManagement = () => {
  // State management
  const [sales, setSales] = useState<SaleReportType[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [customers, setCustomers] = useState<any[]>([]);
  const [reportFilter, setReportFilter] = useState<ReportFilterType>({
    type: 'customerLedger',
    startDate: '',
    endDate: '',
  });
  
  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedItem, setSelectedItem] = useState<string | null>(null);

  // Fetch initial data and reports
  const fetchReportData = async () => {
    try {
      // Fetch products, customers, and initial sales report
      const [productsResponse, customersResponse, salesResponse] = await Promise.all([
        userAuthenticate.get('/products'),
        userAuthenticate.get('/customers'),
        userAuthenticate.get('/sales-report', { 
          params: {
            page: currentPage,
            type: reportFilter.type,
            startDate: reportFilter.startDate,
            endDate: reportFilter.endDate,
            selectedId: selectedItem
          }
        })
      ]);
       console.log(productsResponse.data,customersResponse.data,salesResponse.data,"all responses from backend");
       
      setProducts(productsResponse.data);
      setCustomers(customersResponse.data);
      const salesData = salesResponse.data.sales.flatMap((sale:SaleDataType) =>
        sale.items.map((item) => ({
          productName: item.productId.name,
          customerName: sale.customer.name,
          date: new Date(sale.date).toLocaleDateString(),
          quantity: item.quantity,
          totalAmount: item.price * item.quantity,
        }))
      );
  
      setSales(salesData);
      setTotalPages(salesResponse.data.totalPages);
    
    } catch (error) {
      console.error('Failed to fetch report data', error);
    }
  };


  useEffect(() => {
    fetchReportData();
  }, [currentPage, reportFilter, selectedItem]);
console.log(reportFilter,"reportfilterddgd",);

  // Handle report type change
  const handleReportTypeChange = (type: ReportFilterType['type']) => {
    console.log("selected report",type);
    console.log("bhjbjhbjh");
    
    setReportFilter(prev => ({
      ...prev,
      type,
      selectedId: undefined
    }));
    setSelectedItem(null);
  };


  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(
      sales.map((sale) => ({
        Product: sale.productName,
        Customer: sale.customerName,
        Date: sale.date,
        Quantity: sale.quantity,
        "Total Amount": sale.totalAmount,
      }))
    );
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Sales Report");

    XLSX.writeFile(workbook, "Sales_Report.xlsx");
  };

  const exportToPDF = () => {
    const pdf = new jsPDF();
    pdf.text("Sales Report", 14, 10);

    const tableData = sales.map((sale) => [
      sale.productName,
      sale.customerName,
      sale.date,
      sale.quantity,
      `₹${sale.totalAmount.toFixed(2)}`,
    ]);

    pdf.autoTable({
      head: [["Product", "Customer", "Date", "Quantity", "Total Amount"]],
      body: tableData,
    });

    pdf.save("Sales_Report.pdf");
  };

  
  const renderSelectionComponent = () => {
    switch(reportFilter.type) {
      case 'product':
        return (
         
             <div className='relative'>
              {!selectedItem && (
              <label className="absolute m-2 text-sm text-gray-500">
                Select Product
              </label>
            )}
            <Autocomplete
              //label="select product"
              
              className="max-w-xs"
              classNames={{
                listbox: "bg-black z-20 rounded-lg gap-2 border border-gray-300 shadow-md",
                popoverContent: "bg-white rounded-md "
              }}
              onSelectionChange={(key) => setSelectedItem(key!)}
            >
              {products.map(product => (
                <AutocompleteItem 
                  key={product._id} 
                  value={product._id.toString()}
                >
                  {product.name}
                </AutocompleteItem>
              ))}
            </Autocomplete>
            </div>
          //</div>
        );
      case 'sales':
        return (
          
          <></>
        );
      case 'customerLedger':
        return (
          <div className="relative">
            {!selectedItem && (
              <label className="absolute m-2 text-sm text-gray-500">
                Select Customer for Ledger
              </label>
            )}
            <Autocomplete
              className="w-full"
              classNames={{
                listbox: "bg-white border border-gray-300 shadow-md",
                popoverContent: "bg-white"
              }}
              onSelectionChange={(key) => setSelectedItem(key)}
            >
              {customers.map(customer => (
                <AutocompleteItem 
                  key={customer._id} 
                  value={customer._id.toString()}
                >
                  {customer.name}
                </AutocompleteItem>
              ))}
            </Autocomplete>
          </div>
        );
      default:
        return 'select Product';
    }
  };

  return (
    <SidebarMenu>
      <div className="bg-gray-50 min-h-screen p-8">
        <div className="container mx-auto">
          {/* Report Type and Date Filters */}
          <div className="flex  justify-between items-center mb-6">
            <div className='flex space-x-4 w-full' >
              <div className='relative flex flex-col w-1/2'>
                <div className=' w-fit items-center space-x-2 gap-2'>
                    <label htmlFor='reportType' className='  block mb-2 text-sm font-medium' >Select Report </label>
                    <select
                    id='reportType'
                className='w-full bg-white border border-gray-300 rounded-md px-4 py-2 gap-2'
                value={reportFilter.type}
       
                 onChange={(e) => handleReportTypeChange(e.target.value as ReportFilterType['type'])}
                style={{
                    backgroundColor: 'white',
                    width: '100%',
                  }}
              >
                <option  className="bg-white hover:bg-gray-100 text-black px-2 py-1 w-full" value="product">Product Report</option>
                <option  className="bg-white hover:bg-gray-100 text-black px-2 py-1 w-full" value="sales">Sales Report</option>
                <option className="bg-white hover:bg-gray-100 text-black px-2 py-1 w-full" value="customerLedger">Customer Ledger</option>
              </select>
              </div>
              </div>
               </div>

               <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4 w-full">
          <div className="flex flex-col w-1/2">
            <label htmlFor="startDate" className="block mb-2 text-sm font-medium">
              Start Date
            </label>
            <Input
              id="startDate"
              type="date"
              value={reportFilter.startDate}
              onChange={(e) =>
                setReportFilter((prev) => ({ ...prev, startDate: e.target.value }))
              }
              startContent={<FaCalendar />}
              className="w-full"
            />
          </div>

          <div className="flex flex-col w-1/2">
            <label htmlFor="endDate" className="block mb-2 text-sm font-medium">
              End Date
            </label>
            <Input
              id="endDate"
              type="date"
              value={reportFilter.endDate}
              onChange={(e) =>
                setReportFilter((prev) => ({ ...prev, endDate: e.target.value }))
              }
              startContent={<FaCalendar />}
              className="w-full"
            />
          </div>
        
      </div>
    </div>
          
          <div className=" flex w-full flex-wrap md:flex-nowrap gap-4">
            {renderSelectionComponent()}
          </div>

          
          <div className="bg-white shadow-lg rounded-xl mt-4 overflow-hidden">
            <Table aria-label="Sales Report Table">
              <TableHeader>
                <TableColumn>Product</TableColumn>
                <TableColumn>Customer</TableColumn>
                <TableColumn>Date</TableColumn>
                <TableColumn>Quantity</TableColumn>
                <TableColumn>Total Amount</TableColumn>
              </TableHeader>
              <TableBody>
                {sales.map((sale,index) => (
                  <TableRow key={index}>
                    <TableCell>{sale.productName}</TableCell>
                    <TableCell>{sale.customerName}</TableCell>
                    <TableCell>{sale.date}</TableCell>
                    <TableCell>{sale.quantity}</TableCell>
                    <TableCell>₹{sale.totalAmount.toFixed(2)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          <div className="flex justify-end mt-4 space-x-2">
            <button
              onClick={exportToExcel}
              className="p-2 bg-green-500 text-white rounded-md"
            >
              Download Excel
            </button>
            <button
              onClick={exportToPDF}
              className="p-2 bg-red-500 text-white rounded-md"
            >
              Download PDF
            </button>
          </div>
          {/* Pagination */}
          <div className="flex justify-center mt-8 space-x-4">
            <Button 
             className='bg-blue-500 cursor-pointer rounded-md text-white'
         
              disabled={currentPage === 1}
              onPress={() => setCurrentPage(prev => prev - 1)}
            >
              Previous
            </Button>
            <span className="self-center cursor-pointer px-4 py-2 rounded-lg bg-blue-500 text-white">
               {currentPage}
            </span>
            <Button 
            className='bg-blue-500 cursor-pointer rounded-md text-white'
              disabled={currentPage === totalPages}
              onPress={() => setCurrentPage(prev => prev + 1)}
            >
              Next
            </Button>
          </div>
        </div>
      </div>
    </SidebarMenu>
  );
};

export default SalesReportManagement;