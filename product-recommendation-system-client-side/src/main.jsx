import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router";
import Root from './Root/Root';
import Home from './Pages/Home';
import SignUp from './Access/SignUp';
import Login from './Access/Login';
import AuthProvider from './Auth/AuthProvider';
import Queries from './Pages/Queries';
import RecommendationsForMe from './Pages/RecommendationsForMe';
import MyQueries from './Pages/MyQueries';
import MyRecommendatons from './Pages/MyRecommendatons';
import PrivateRoute from './PrivateRoute/PrivateRoute';
import AddQueries from './Pages/AddQueries';
import ViewDetails from './Pages/ViewDetails';
import UpdateDetails from './Pages/UpdateDetails';
import QueryCardHome from './Pages/QueryCardHome';

const router = createBrowserRouter([
  {
    path: "/",
    Component: Root,
    children: [
      {
        index: true,
        loader: () => fetch('https://productrecommendationsystem.vercel.app/addquery'),
        Component: Home
      },
      {
        path: "/queries",
        Component: Queries
      },
      {
        path: "/queriescardhome",
        loader: () => fetch('https://productrecommendationsystem.vercel.app/addquery'),
        Component: QueryCardHome
      },
      {
        path: "/recommendationsforme",
        element: <PrivateRoute>
          <RecommendationsForMe></RecommendationsForMe>
        </PrivateRoute>
      },
      {
        path: "/viewdetails/:id",
        loader: ({ params }) => fetch(`https://productrecommendationsystem.vercel.app/addquery/${params.id}`),
        Component: ViewDetails
      },
      {
        path: "/updatedetails/:id",
        loader: ({ params }) => fetch(`https://productrecommendationsystem.vercel.app/addquery/${params.id}`),
        Component: UpdateDetails
      },
      {
        path: "/myqueries",
        loader: () => fetch('https://productrecommendationsystem.vercel.app/addquery'),
        element: <PrivateRoute>
          <MyQueries></MyQueries>
        </PrivateRoute>
      },
      {
        path: "/addqueries",
        element: <PrivateRoute>
          <AddQueries></AddQueries>
        </PrivateRoute>
      },
      {
        path: "/myrecommendations",
        element: <PrivateRoute>
          <MyRecommendatons></MyRecommendatons>
        </PrivateRoute>
      },
      {
        path: "/signup",
        Component: SignUp
      },
      {
        path: "/login",
        Component: Login
      }
    ]
  },
]);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  </StrictMode>,
)