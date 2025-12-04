import { Navbar } from '@/components/layout/Navbar'
import { HomePage } from '@/pages/HomePage'
import { Task1Page } from '@/pages/Task1Page'
import { Task2Page } from '@/pages/Task2Page'
import { Task3Page } from '@/pages/Task3Page'
import { BrowserRouter, Route, Routes } from 'react-router-dom'

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-background">
        <Navbar />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/task-1" element={<Task1Page />} />
          <Route path="/task-2" element={<Task2Page />} />
          <Route path="/task-3" element={<Task3Page />} />
        </Routes>
      </div>
    </BrowserRouter>
  )
}

export default App
