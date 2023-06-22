import { Route, Routes, BrowserRouter } from 'react-router-dom'
import Home from './components/Pages/Home'
import ViewOutput from './components/Pages/ViewOutput'
import { useEffect, useState } from 'react'

function App(): JSX.Element {
  const [darkModeEnabled, setDarkModeEnabled] = useState(localStorage.darkModeEnabled ?? true)

  useEffect(() => {
    const root = window.document.documentElement
    if (darkModeEnabled) {
      root.classList.add('dark')
    } else {
      root.classList.remove('dark')
    }
    localStorage.darkModeEnabled = darkModeEnabled
  }, [darkModeEnabled])

  function toggleDarkMode(e: React.MouseEvent): void {
    const toggle = e.target as HTMLInputElement
    setDarkModeEnabled(toggle.checked)
  }

  return (
    <div className="h-screen">
      <BrowserRouter>
        <Routes>
          <Route
            path="/"
            element={<Home toggleDarkMode={toggleDarkMode} darkModeEnabled={darkModeEnabled} />}
          />
          <Route path="/view-output" element={<ViewOutput darkModeEnabled={darkModeEnabled} />} />
        </Routes>
      </BrowserRouter>
    </div>
  )
}

export default App
