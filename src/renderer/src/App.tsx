import CodeBox from './components/CodeBox/CodeBox'
import GridBox from './components/GridBox/GridBox'
import { ReactNode, useEffect, useState } from 'react'
import SplitPane, { Pane } from 'split-pane-react'
import 'split-pane-react/esm/themes/default.css'

function App(): JSX.Element {
  const [darkModeEnabled, setDarkModeEnabled] = useState(localStorage.darkModeEnabled)
  const [codeInFocus, setCodeInFocus] = useState(false)
  const [paneSizes, setPaneSizes] = useState([50, 50])

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
    <>
      {/* <div className="h-screen w-24 absolute left-1/2 top-0 bg-red-400">asd</div> */}
      <div className="h-screen dark:bg-gray-800">
        <SplitPane
          split="vertical"
          sizes={paneSizes}
          onChange={setPaneSizes}
          sashRender={(): ReactNode => undefined}
        >
          <Pane minSize={300} className="border-r dark:border-r-gray-600 border-r-gray-200">
            <CodeBox onFocusChange={setCodeInFocus} darkModeEnabled={darkModeEnabled} />
          </Pane>
          <Pane minSize={100}>
            <GridBox
              codeInFocus={codeInFocus}
              darkModeEnabled={darkModeEnabled}
              toggleDarkMode={toggleDarkMode}
            />
          </Pane>
        </SplitPane>
      </div>
    </>
  )
}

export default App
