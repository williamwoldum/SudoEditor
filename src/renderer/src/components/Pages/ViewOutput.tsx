import CodeMirror from '@uiw/react-codemirror'
import { nord } from '@uiw/codemirror-theme-nord'
import { githubLight } from '@uiw/codemirror-theme-github'
import { langs } from '@uiw/codemirror-extensions-langs'
import { useEffect, useState } from 'react'
import beautifier from 'js-beautify'
import customCommentKey from '@renderer/functions/codeMirrorCommentExt'
import { getFontSizeThemeExt, handleScroll } from '@renderer/functions/codeMirrorScrollToZoomExt'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const api: any = window.api

interface ViewOutputProps {
  darkModeEnabled: boolean
}

function ViewOutput(props: ViewOutputProps): JSX.Element {
  const { darkModeEnabled } = props
  const [codeContent, setCodeContent] = useState('')
  const [fontSize, setFontSize] = useState(16)

  useEffect(() => {
    getCompiledOutput()

    localStorage.darkModeEnabled = false

    const options = { passive: false }
    window.addEventListener('wheel', (e) => handleScroll(e, setFontSize), options)

    return () => {
      window.removeEventListener('wheel', (e) => handleScroll(e, setFontSize))
    }
  }, [])

  async function getCompiledOutput(): Promise<void> {
    const content = await api.readFile('./temp_compiles/compiled.js')
    try {
      const formattedCode = beautifier(content, { indent_size: 2 })
      setCodeContent(formattedCode)
    } catch (error) {
      if (error instanceof Error) {
        console.log(`Error: ${error.message}`)
      }
    }
  }

  const theme = darkModeEnabled ? nord : githubLight

  return (
    <div className="h-full overflow-y-hidden">
      <CodeMirror
        key={fontSize}
        editable={true}
        className="h-full overflow-y-hidden"
        height="100%"
        value={codeContent}
        extensions={[langs.javascript(), getFontSizeThemeExt(fontSize), theme, customCommentKey]}
      />
    </div>
  )
}

export default ViewOutput
