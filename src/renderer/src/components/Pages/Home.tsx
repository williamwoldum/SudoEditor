import CodeBox from '../CodeBox/CodeBox'
import GridBox from '../GridBox/GridBox'
import { ReactNode, useState } from 'react'
import SplitPane, { Pane } from 'split-pane-react'
import 'split-pane-react/esm/themes/default.css'
import { SudokuHandler } from '@renderer/models/SudokuHandler'

interface HomeProps {
  darkModeEnabled: boolean
  toggleDarkMode: (e: React.MouseEvent) => void
}

function Home(props: HomeProps): JSX.Element {
  const { darkModeEnabled, toggleDarkMode } = props

  const [codeInFocus, setCodeInFocus] = useState(false)
  const [paneSizes, setPaneSizes] = useState([50, 50])
  const [sudokuHandler, setSudokuHandler] = useState<SudokuHandler | undefined>()

  return (
    <div className="h-screen dark:bg-gray-800">
      <SplitPane
        split="vertical"
        sizes={paneSizes}
        onChange={setPaneSizes}
        sashRender={(): ReactNode => undefined}
      >
        <Pane minSize={300} className="border-r dark:border-r-gray-600 border-r-gray-200">
          <CodeBox
            onFocusChange={setCodeInFocus}
            darkModeEnabled={darkModeEnabled}
            setSudokuHandler={setSudokuHandler}
          />
        </Pane>
        <Pane minSize={100}>
          <GridBox
            sudokuHandler={sudokuHandler}
            codeInFocus={codeInFocus}
            darkModeEnabled={darkModeEnabled}
            toggleDarkMode={toggleDarkMode}
          />
        </Pane>
      </SplitPane>
    </div>
  )
}

export default Home
