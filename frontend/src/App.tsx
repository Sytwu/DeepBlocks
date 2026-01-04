import { ReactFlowProvider } from 'reactflow'
import { AppLayout } from './components/layout/AppLayout'
import { ToastProvider } from './contexts/ToastContext'
import { ToastContainer } from './components/ui/ToastContainer'
import './index.css'

function App() {
  return (
    <ReactFlowProvider>
      <ToastProvider>
        <AppLayout />
        <ToastContainer />
      </ToastProvider>
    </ReactFlowProvider>
  )
}

export default App
