import { SnackbarProvider } from 'notistack'
import '../styles/globals.css'
import { StoreProvider } from '../utils/Mystore'

import '@fortawesome/fontawesome-free/css/all.css';

function MyApp({ Component, pageProps }) {
  return (
    <SnackbarProvider anchorOrigin={{vertical: 'top', horizontal: 'center'}}>
      <StoreProvider>
        <Component {...pageProps} />
      </StoreProvider>
    </SnackbarProvider>
  )
};

export default MyApp
