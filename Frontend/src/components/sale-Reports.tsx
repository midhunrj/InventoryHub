import React, { useState, useEffect } from 'react';
import * as XLSX from "xlsx";
import  jsPDF  from "jspdf";
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

const SalesReportManagement:React.FC = () => {
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
              onSelectionChange={(key) => setSelectedItem(String(key))}
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
              onSelectionChange={(key) => setSelectedItem(String(key))}
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
                {sales.slice().reverse().map((sale,index) => (
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
          
          <div className="flex justify-center mt-8 space-x-4">
            <Button 
             className={`${currentPage==1?`px-4 py-2 rounded-md bg-blue-500   cursor-not-allowed hidden  opacity-80`:`bg-blue-500 cursor-pointer rounded-md text-white`}`}
         
              isDisabled={currentPage === 1}
              onPress={() => setCurrentPage(prev => prev - 1)}
            >
              Previous
            </Button>
            <span className="self-center cursor-pointer px-4 py-2 rounded-lg bg-blue-500 text-white">
               {currentPage}
            </span>
            <Button 
            className='bg-blue-500 cursor-pointer rounded-md text-white'
              isDisabled={currentPage === totalPages}
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