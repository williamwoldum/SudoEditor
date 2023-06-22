import CodeMirror from '@uiw/react-codemirror'
import { nord } from '@uiw/codemirror-theme-nord'
import { githubLight } from '@uiw/codemirror-theme-github'
import { langs } from '@uiw/codemirror-extensions-langs'
import defaultCode from '../../assets/defaultCode'
import BtnBar from './BtnBar'
import SplitPane, { Pane } from 'split-pane-react'
import 'split-pane-react/esm/themes/default.css'
import { ReactNode, useEffect, useState } from 'react'
import Terminal from './Terminal'
import { SudokuHandler } from '@renderer/models/SudokuHandler'
import { Extension } from '@codemirror/state'
import { EditorView } from '@codemirror/view'

interface CodeBoxProps {
  onFocusChange: React.Dispatch<React.SetStateAction<boolean>>
  darkModeEnabled: boolean
  setSudokuHandler: React.Dispatch<React.SetStateAction<SudokuHandler | undefined>>
}

function CodeBox(props: CodeBoxProps): JSX.Element {
  const { onFocusChange, darkModeEnabled, setSudokuHandler } = props
  const [paneSizes, setPaneSizes] = useState([80, 20])
  const [codeContent, setCodeContent] = useState(defaultCode)
  const [terminalContent, setTerminalContent] = useState('')
  const [compileSuccess, setCompileSuccess] = useState(false)
  const [fontSize, setFontSize] = useState(14)

  const FontSizeTheme = EditorView.theme({
    '&': {
      fontSize: `${fontSize}px`
    }
  })

  const FontSizeThemeExtension: Extension = [FontSizeTheme]
  const theme = darkModeEnabled ? nord : githubLight

  useEffect(() => {
    const options = { passive: false }
    window.addEventListener('wheel', handleScroll, options)

    return () => {
      window.removeEventListener('wheel', handleScroll)
    }
  }, [])

  function handleScroll(event: WheelEvent): void {
    if (event.ctrlKey) {
      event.preventDefault() // Prevents the page from zooming
      setFontSize((oldFontSize) => oldFontSize + Math.sign(event.deltaY) * -1)
    }
  }

  return (
    <>
      <BtnBar
        codeContent={codeContent}
        setCodeContent={setCodeContent}
        setTerminalContent={setTerminalContent}
        setCompileSuccess={setCompileSuccess}
        setSudokuHandler={setSudokuHandler}
      />
      <SplitPane
        split="horizontal"
        sizes={paneSizes}
        onChange={setPaneSizes}
        sashRender={(): ReactNode => undefined}
      >
        <Pane minSize={300} className="border-r dark:border-r-gray-700 border-r-gray-200">
          <CodeMirror
            className="h-full overflow-y-hidden"
            height="100%"
            theme={theme}
            value={codeContent}
            extensions={[langs.javascript(), FontSizeThemeExtension]}
            onChange={(content): void => setCodeContent(content)}
            onFocus={(): void => onFocusChange(true)}
            onBlur={(): void => onFocusChange(false)}
          />
        </Pane>
        <Pane minSize={100}>
          <Terminal content={terminalContent} compileSuccess={compileSuccess} />
        </Pane>
      </SplitPane>
    </>
  )
}

export default CodeBox
