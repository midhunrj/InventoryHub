// import { useState } from 'react'
// import reactLogo from './assets/react.svg'
// import viteLogo from '/vite.svg'
import { Route, Routes } from 'react-router-dom'

import Login from './components/login'
import { Toaster } from 'sonner'
import HomePage from './components/HomePage'
import NewProduct from './components/newProduct'
//import ProductManagementPage from './components/products'

//import CustomerManagement from './components/customerManagement'
import UserProtected from './protected/userProtected'
import ProductManagementPage from './components/products'
import CustomerManagement from './components/customerManagement'
import SalesManagement from './components/saleManagement'
import Sales from './components/dummySales'
import SalesReportManagement from './components/dummySales'

function App() {


  return (
    <>
      <Toaster/>
      <Routes>
        <Route path='/' element={<Login/>}></Route>
        <Route path='/home' element={<UserProtected><HomePage/></UserProtected>}></Route>
        <Route path='/new-product' element={<UserProtected><NewProduct/></UserProtected>}></Route>
        <Route path='/products' element={<UserProtected><ProductManagementPage/></UserProtected>}></Route>
        <Route path='/customers' element={<UserProtected><CustomerManagement/></UserProtected>}></Route>
        <Route path='/sales' element={<UserProtected><SalesManagement/></UserProtected>}></Route>
        <Route path='/sale-reports' element={<UserProtected><SalesReportManagement/></UserProtected>}></Route>
      </Routes>
    </>
  )
}

export default App
