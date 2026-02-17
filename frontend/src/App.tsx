
import { AuthProvider, ThemeProvider } from './common/context'
import ThemeRoutes from './routes/Routes'

// Flaticons
import './../node_modules/@flaticon/flaticon-uicons/css/all/all.css'

// Theme.scss
import './assets/scss/theme.scss'
import './assets/css/index.css'
import './assets/css/dark-mode-fix.css'


function App() {



  return (
    <ThemeProvider>
      <AuthProvider>
        <ThemeRoutes />
      </AuthProvider>
    </ThemeProvider>
  )
}

export default App
