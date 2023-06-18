import CodeMirror from '@uiw/react-codemirror'
import { nord } from '@uiw/codemirror-theme-nord'
import { githubLight } from '@uiw/codemirror-theme-github'
import { langs } from '@uiw/codemirror-extensions-langs'
import defaultCode from '../../assets/defaultCode'
import BtnBar from './BtnBar'
import SplitPane, { Pane } from 'split-pane-react'
import 'split-pane-react/esm/themes/default.css'
import { ReactNode, useState } from 'react'
import Terminal from './Terminal'

interface CodeBoxProps {
  onFocusChange: React.Dispatch<React.SetStateAction<boolean>>
  darkModeEnabled: boolean
}

function CodeBox(props: CodeBoxProps): JSX.Element {
  const { onFocusChange, darkModeEnabled } = props
  const [paneSizes, setPaneSizes] = useState([80, 20])
  const [codeContent, setCodeContent] = useState(defaultCode)
  const [terminalContent, setTerminalContent] = useState('')
  const theme = darkModeEnabled ? nord : githubLight

  return (
    <>
      <BtnBar
        codeContent={codeContent}
        setCodeContent={setCodeContent}
        setTerminalContent={setTerminalContent}
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
            extensions={[langs.javascript()]}
            onChange={(content): void => setCodeContent(content)}
            onFocus={(): void => onFocusChange(true)}
            onBlur={(): void => onFocusChange(false)}
          />
        </Pane>
        <Pane minSize={100}>
          <Terminal content={terminalContent} />
        </Pane>
      </SplitPane>
    </>
  )
}

export default CodeBox
