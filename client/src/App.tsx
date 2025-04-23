import {
  createBrowserRouter,
  createRoutesFromElements,
  RouterProvider,
  Route,
} from "react-router-dom";

import RootLayout from "./layout/RootLayout";
import Login from "./pages/Login";
import Product from "./pages/Product";
import Home from "./pages/Home";
import ProtectedRoute from "./components/ProtectedRoute";
import Category from "./pages/Category";
import CreateProduct from "./pages/CreateProduct";
import EditProduct from "./pages/EditProduct";
import CreateCategory from "./pages/CreateCategory";
import EditCategory from "./pages/EditCategory";
import Purchase from "./pages/Purchase";
import CreatePurchase from "./pages/CreatePurchase";
import EditPurchase from "./pages/EditPurchase";
import Sale from "./pages/Sale";
import Revenue from "./pages/Revenue";
import Budget from "./pages/Budget";
import CreateBudget from "./pages/CreateBudget";
import EditBudget from "./pages/EditBudget";
import BudgetDetail from "./pages/BudgetDetail";
import Supplier from "./pages/Supplier";
import Appointment from "./pages/Appointment";
import Prescription from "./pages/Prescription";

const router = createBrowserRouter(
  createRoutesFromElements(
    <>
      <Route path="/login" element={<Login />} />

      <Route path="/" element={<RootLayout />}>
        <Route
          index
          element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          }
        />
        <Route
          path="product"
          element={
            <ProtectedRoute>
              <Product />
            </ProtectedRoute>
          }
        />
        <Route
          path="category"
          element={
            <ProtectedRoute>
              <Category />
            </ProtectedRoute>
          }
        />
        <Route
          path="purchase"
          element={
            <ProtectedRoute>
              <Purchase />
            </ProtectedRoute>
          }
        />
        <Route
          path="product/create"
          element={
            <ProtectedRoute>
              <CreateProduct />
            </ProtectedRoute>
          }
        />
        <Route
          path="product/edit/:id"
          element={
            <ProtectedRoute>
              <EditProduct />
            </ProtectedRoute>
          }
        />
        <Route
          path="category/create"
          element={
            <ProtectedRoute>
              <CreateCategory />
            </ProtectedRoute>
          }
        />
        <Route
          path="category/edit/:id"
          element={
            <ProtectedRoute>
              <EditCategory />
            </ProtectedRoute>
          }
        />
        <Route
          path="purchase/create"
          element={
            <ProtectedRoute>
              <CreatePurchase />
            </ProtectedRoute>
          }
        />
        <Route
          path="purchase/edit/:id"
          element={
            <ProtectedRoute>
              <EditPurchase />
            </ProtectedRoute>
          }
        />
        <Route
          path="budget"
          element={
            <ProtectedRoute>
              <Budget />
            </ProtectedRoute>
          }
        />
        <Route
          path="budget/create"
          element={
            <ProtectedRoute>
              <CreateBudget />
            </ProtectedRoute>
          }
        />
        <Route
          path="budget/edit/:id"
          element={
            <ProtectedRoute>
              <EditBudget />
            </ProtectedRoute>
          }
        />
        <Route
          path="budget/:id"
          element={
            <ProtectedRoute>
              <BudgetDetail />
            </ProtectedRoute>
          }
        />
        <Route
          path="revenue"
          element={
            <ProtectedRoute>
              <Revenue />
            </ProtectedRoute>
          }
        />
        <Route
          path="sale"
          element={
            <ProtectedRoute>
              <Sale />
            </ProtectedRoute>
          }
        />
        <Route
          path="supplier"
          element={
            <ProtectedRoute>
              <Supplier />
            </ProtectedRoute>
          }
        />
        <Route
          path="appointment"
          element={
            <ProtectedRoute>
              <Appointment />
            </ProtectedRoute>
          }
        />
        <Route
          path="prescription"
          element={
            <ProtectedRoute>
              <Prescription />
            </ProtectedRoute>
          }
        />
      </Route>
    </>
  )
);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
