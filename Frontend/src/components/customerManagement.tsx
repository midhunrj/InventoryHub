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
import { userAuthenticate } from '../utils/userInterceptor';
import { toast } from 'sonner';
export type CustomerType={
  id?:string
  _id?:string
  name:string,
  address:string,
  mobile:number
}

const CustomerManagement = () => {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [currentCustomer, setcurrentCustomer] = useState<CustomerType | null>(null);
  const [Customers, setCustomers] = useState<CustomerType[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [newCustomer, setNewCustomer] = useState({
    name: '',
    address: '',
    mobile: ''
  });
  const [currentPage, setCurrentPage] = useState(1);
  const customersPerPage = 10;

  const fetchCustomers=async()=>{
    const response=await userAuthenticate.get('/customers')
    setCustomers(response.data)
  }

  const handleInputChange = (e:React.ChangeEvent<HTMLInputElement|HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setNewCustomer({ ...newCustomer, [name]: value });
  };
useEffect(()=>{
   fetchCustomers()
},[])
  const filteredCustomers = Customers.filter(Customer => 
    Customer.name.toLowerCase().includes(searchTerm.toLowerCase())
  );
  const totalPages = Math.ceil(filteredCustomers.length / customersPerPage);
  const startIndex = (currentPage - 1) * customersPerPage;
  const CustomerDatas = filteredCustomers.slice(startIndex, startIndex + customersPerPage);

  const handleDeleteCustomer = async (id:string) => {
    try {
      await userAuthenticate.delete(`/delete-customer/${id}`);
      setCustomers(Customers.filter((customer) => customer._id !== id)); // Update frontend state
      toast.success("Product deleted successfully!");
    } catch (error) {
      console.error("Error deleting product:", error);
      toast.error("Failed to delete product.");
    }
  };
  
  const handleUpdateCustomer = async (updatedCustomer: CustomerType) => {
    try {
      const response = await userAuthenticate.put(`/update-customer/${updatedCustomer._id}`, updatedCustomer);
      setCustomers(
        Customers.map((customer) =>
          customer._id === updatedCustomer._id ? response.data : customer
        )
      ); // Update frontend state
      toast.success("Product updated successfully!");
    } catch (error) {
      console.error("Error updating product:", error);
      toast.error("Failed to update product.");
    }
  };
  
  const handleAddCustomer = async() => {
    // setCustomers([
    //   ...Customers, 
    //   { ...newCustomer, id: Customers.length + 1 }
    // ]);
   console.log("glsgslkgm");
   
    const response=await userAuthenticate.post('/add-customer',newCustomer)
    setCustomers([...Customers,
        response.data
    ])

    setIsAddModalOpen(false);
  };

  return (
    <>
    <SidebarMenu>
      <div className="bg-gray-50 min-h-screen p-8">
        <div className="container mx-auto">
          {/* Page Header */}
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-4xl font-extrabold text-gray-800">Customer Management</h1>
            <Button 
              color="primary" 
              startContent={<FaPlus />}
              onClick={() => setIsAddModalOpen(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-2 rounded-lg transition-colors duration-300"
            >
              Add New Customer
            </Button>
          </div>

          {/* Search Bar */}
          <div className="mb-6">
            <Input
              isClearable
              className="
                w-full 
                bg-white 
                border 
                border-gray-300 
                rounded-xl 
                shadow-md 
                hover:shadow-lg 
                focus:border-blue-500 
                transition-all 
                duration-300
              "
              placeholder="Search Customers..."
              startContent={<FaSearch className="text-gray-500" />}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {/* Customer Table */}
          <div className="bg-white shadow-lg rounded-xl overflow-hidden">
            <Table 
              aria-label="Customer management table"
              className="w-full"
            >
              <TableHeader className="bg-gray-100">
                <TableColumn className="text-center py-4 font-bold text-gray-700">NAME</TableColumn>
                <TableColumn className="text-center py-4 font-bold text-gray-700">ADDRESS</TableColumn>
                <TableColumn className="text-center py-4 font-bold text-gray-700">MOBILE</TableColumn>
                <TableColumn className="text-center py-4 font-bold text-gray-700">ACTIONS</TableColumn>
              </TableHeader>
              <TableBody 
                emptyContent=
                  //<div className="text-center p-8 text-gray-500">
                    "No Customers found"
              >
                {CustomerDatas.map((Customer) => (
                  <TableRow 
                    key={Customer.mobile} 
                    className="hover:bg-gray-50 transition-colors duration-200"
                  >
                    <TableCell className="p-4 text-gray-800">{Customer.name}</TableCell>
                    <TableCell 
                      className="p-4 text-gray-600 max-w-xs truncate"
                      title={Customer.address}
                    >
                      {Customer.address}
                    </TableCell>
                    <TableCell className="p-4 text-gray-800">{Customer.mobile}</TableCell>
                    <TableCell>
                      <div className="flex justify-center space-x-2">
                        <Button 
                          isIconOnly 
                          color="warning" 
                          variant="light"
                          className="hover:bg-yellow-100 rounded-full"
                          onPress={()=>{
                            setIsEditModalOpen(true)
                            setcurrentCustomer(Customer)
                          }
                          }
                        >
                          <FaEdit />
                        </Button>
                        <Button 
                          isIconOnly 
                          color="danger" 
                          variant="light"
                          className="hover:bg-red-100 rounded-full"
                          onPress={()=>handleDeleteCustomer(Customer._id!)}
                        >
                          <FaTrash />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        {/* Add Customer Modal */}
        <Modal 
        className='z-10 backdrop-blur-sm'
          isOpen={isAddModalOpen} 
          onOpenChange={setIsAddModalOpen}
          placement="top-center"
        >
          <ModalContent
          className="bg-white p-6 rounded-lg shadow-lg relative z-10">
            {(onClose) => (
              <>
                <ModalHeader className="flex text-center text-2xl flex-col gap-1">
                  Add New Customer
                </ModalHeader>
                <ModalBody className=''>
                 <div className='flex gap-4 items-center justify-between'>
                 <label className="w-32 font-medium text-gray-700"> Name</label> 
                 <Input
                        name="name"
                        placeholder="Enter Customer name"
                        value={newCustomer.name}
                        onChange={handleInputChange}
                        variant="bordered"
                      />
                    </div>
                    <div className="flex gap-4 items-center mb-4">
                      <label className="w-32 font-medium text-gray-700">Address</label>
                      <Textarea
                        name="address"
                        placeholder="Enter Address"
                        value={newCustomer.address}
                        onChange={handleInputChange}
                        variant="bordered"
                      />
                    </div>
                    <div className="flex gap-4 items-center">
                      <label className="w-32 font-medium text-gray-700">Mobile</label>
                      <Input
                        name="mobile"
                        type="number"
                        placeholder="Enter Mobile Number"
                        value={newCustomer.mobile}
                        onChange={handleInputChange}
                        variant="bordered"
                      /></div>
                </ModalBody>
                <ModalFooter>
                  <Button 
                    className='bg-red-600 cursor-pointer text-white rounded-lg'
                    variant="flat" 
                    onPress={onClose}
                  >
                    Cancel
                  </Button>
                  <Button 
                    className='bg-blue-600 cursor-pointer text-white rounded-lg' 
                    onPress={() => {
                      handleAddCustomer()
                      onClose();
                    }}
                  >
                    Add Customer
                  </Button>
                </ModalFooter>
              </>
            )}
          </ModalContent>
        </Modal>


        
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
          <h1 className='text-2xl font-medium'>Edit Customer</h1>
        </ModalHeader>
        <ModalBody>
        <div className='flex items-center gap-4'>
              <label htmlFor="name" className="w-1/3 text-right font-medium">
            Name
          </label>
          <Input
          
            value={currentCustomer?.name || ''}
            onChange={(e) =>
              setcurrentCustomer({ ...currentCustomer, name: e.target.value } as  CustomerType)
            }
          /></div>
          <div className='flex items-center gap-4'>
              <label htmlFor="address" className="w-1/3 text-right font-medium">
            Address
          </label>
          <Textarea
            
            value={currentCustomer?.address || ''}
            onChange={(e) =>
              setcurrentCustomer({ ...currentCustomer, address: e.target.value } as CustomerType)
            }
          /></div>
          <div className='flex items-center gap-4'>
              <label htmlFor="mobile" className="w-1/3 text-right font-medium">
            Mobile
          </label>
          <Input
            type="number"
            value={currentCustomer?.mobile.toString() }
            onChange={(e) =>
              setcurrentCustomer({ ...currentCustomer, mobile: Number(e.target.value) } as CustomerType)
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
              if (currentCustomer) handleUpdateCustomer(currentCustomer);
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
<div className="flex justify-center text-white mt-6 space-x-4">
              <Button
                isDisabled={currentPage === 1} 
                onPress={() => setCurrentPage(currentPage - 1)}
                className={`${currentPage==1?`px-4 py-2 rounded-md bg-blue-500   cursor-not-allowed hidden opacity-80` :`px-4 py-2 bg-blue-500 hover:bg-blue-700 rounded-md`}`}
              >
                Previous
              </Button>
              <span className="px-4 py-2 bg-blue-500 hover:bg-blue-700 text-white rounded-md">
                 {currentPage}
              </span>
              <Button
                isDisabled={currentPage === totalPages}
                onPress={() => setCurrentPage(currentPage + 1)}
                className=" px-4 py-2 bg-blue-500 hover:bg-blue-700 rounded-md"
              >
                Next
              </Button>
            </div>
      </div>
    </div>
    </SidebarMenu>
    </>
  );
};

export default CustomerManagement;