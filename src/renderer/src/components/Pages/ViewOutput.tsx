import CodeMirror from '@uiw/react-codemirror'
import { nord } from '@uiw/codemirror-theme-nord'
import { githubLight } from '@uiw/codemirror-theme-github'
import { langs } from '@uiw/codemirror-extensions-langs'
import { useEffect, useState } from 'react'
import beautifier from 'js-beautify'
import { Extension } from '@codemirror/state'
import { EditorView } from '@codemirror/view'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const api: any = window.api

interface ViewOutputProps {
  darkModeEnabled: boolean
}

function ViewOutput(props: ViewOutputProps): JSX.Element {
  const { darkModeEnabled } = props
  const [codeContent, setCodeContent] = useState('')
  const [fontSize, setFontSize] = useState(16)

  const FontSizeTheme = EditorView.theme({
    '&': {
      fontSize: `${fontSize}px`
    }
  })

  const FontSizeThemeExtension: Extension = [FontSizeTheme]

  useEffect(() => {
    getCompiledOutput()

    localStorage.darkModeEnabled = false

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

  async function getCompiledOutput(): Promise<void> {
    const content = await api.readFile(
      './temp_compiles/compiled.js'
    )
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
        extensions={[langs.javascript(), FontSizeThemeExtension, theme]}
      />
    </div>
  )
}

export default ViewOutput
