import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import {BrowserRouter} from 'react-router-dom'
import './index.css'
import App from './App.jsx'
import { ClerkProvider } from '@clerk/clerk-react'
import axios from 'axios';



axios.defaults.baseURL = import.meta.env.VITE_BASE_URL;
const clerkPubKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;


createRoot(document.getElementById('root')).render(
  
  <StrictMode>
    <ClerkProvider publishableKey={clerkPubKey}>
    <BrowserRouter>
    <App />
    </BrowserRouter>
    </ClerkProvider>
  </StrictMode>,
)
