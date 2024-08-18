
/*const router = createBrowserRouter(
    createRoutesFromElements(
        <Route path='/' element={<App/>}
        ></Route>
    )
)

ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
      <RouterProvider router={router}/>
    </React.StrictMode>,
  )
  */

  import React from 'react';
  import { Provider } from 'react-redux';
  import { createBrowserRouter, createRoutesFromElements, Route, RouterProvider } from 'react-router-dom';
  import { createRoot } from 'react-dom/client'; // Import createRoot from 'react-dom/client'
  import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
  import "./index.css"
  import App from './App';
  import store from '../src/store/store'; // Ensure you have your Redux store configured properly
  
const queryClient = new QueryClient();

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<App />} />
  )
);

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <Provider store={store}>
        <RouterProvider router={router} />
      </Provider>
    </QueryClientProvider>
  </React.StrictMode>
);


