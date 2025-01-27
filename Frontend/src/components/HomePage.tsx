import React from 'react'
import SidebarMenu from './SIdebar'
import { useNavigate } from 'react-router-dom'

const HomePage:React.FC = () => {
  const navigate=useNavigate()
  return (
    <>
    <SidebarMenu>
    <div>
        <h1 className='  text-3xl font-bold text-center text-slate-900 '>Welcome To Inventory Management</h1>
        <div  className=" cursor-pointer mt-8 grid grid-cols-1  md:grid-cols-1   gap-6">
          <div onClick={()=>navigate('/customers')} className="bg-blue-100 p-4  space-y-4 text-center h-48 w-1/2 rounded-lg shadow-md hover:shadow-lg transition duration-300 ease-in-out">
            <h2 className="text-blue-700 font-bold text-3xl mt-8">Customers</h2>
            <p className="text-blue-500 text-lg mt-1">View and manage all Customers</p>
          </div>
          <div onClick={()=>navigate('/products')} className=" space-y-4 cursor-pointer bg-green-100 p-4 rounded-lg h-48 w-1/2 text-center items-center  align-middle shadow-md hover:shadow-lg transition duration-300 ease-in-out">
            <h2 className="text-green-700 font-bold  mt-8 text-3xl">Products</h2>
            <p className="text-green-500 text-lg mt-1">View all your avaliable products</p>
          </div>
          <div onClick={()=>navigate('/sale-reports')} className=" space-y-4 cursor-pointer text-center bg-yellow-100 p-4 h-48 w-1/2 rounded-lg shadow-md hover:shadow-lg transition duration-300 ease-in-out">
            <h2 className="text-yellow-700 mt-8 font-bold text-3xl">Reports</h2>
            <p className="text-yellow-500 text-lg mt-1">View business reports</p>
          </div>
        </div>
    </div>
    </SidebarMenu>
    </>
  )
}

export default HomePage