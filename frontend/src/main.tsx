import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { BrowserRouter } from 'react-router-dom'
import { Provider } from 'react-redux'
import { appStore } from './store/store.ts'
import { PersistGate } from 'redux-persist/integration/react'
import { persistor } from "./store/store.ts";


createRoot(document.getElementById('root')!).render(
  <BrowserRouter>

    <Provider store={appStore} >
      <PersistGate persistor={persistor}>
        <App />
      </PersistGate>

    </Provider>
  </BrowserRouter>
)
