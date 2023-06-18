import { useRef } from 'react'
import Btn from '../shared/Btn'

const fs = window.require('fs').promises
const cp = window.require('child_process')

interface BtnBarProps {
  codeContent: string
  setCodeContent: (content: string) => void
  setTerminalContent: React.Dispatch<React.SetStateAction<string>>
}

function BtnBar(props: BtnBarProps): JSX.Element {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const { codeContent, setCodeContent, setTerminalContent } = props

  function handleSave(content: string): void {
    const element = document.createElement('a')
    const file = new Blob([content], { type: 'text/plain' })
    element.href = URL.createObjectURL(file)
    element.download = 'mySudoku.sudocode'
    document.body.appendChild(element)

    element.addEventListener('click', () => {
      document.body.removeChild(element)
    })

    element.addEventListener('abort', () => {
      document.body.removeChild(element)
      setTerminalContent('Failed to save')
    })

    element.click()
  }

  async function handleOpen(e: React.ChangeEvent<HTMLInputElement>): Promise<void> {
    const file = e.target.files?.[0]
    if (file) {
      try {
        const content = await fs.readFile(file.path, 'utf8')
        setCodeContent(content)
        setTerminalContent(`Successfully opened: ${file.path}`)
        e.target.value = ''
        window.document.title = `SudoCode editor - ${file.name}`
      } catch (error) {
        if (error instanceof Error) {
          console.log(`Error: ${error.message}`)
        }
      }
    }
  }

  async function handleCompile(): Promise<void> {
    try {
      const filePath = 'temp_compiles/input.sudocode'
      const command = `java -jar resources/SdkrCompiler.jar -i ${filePath} -o temp_compiles/compiled.js`

      await fs.writeFile(filePath, codeContent)
      const resultBuffer = await cp.execSync(command)
      const stdout = String.fromCharCode.apply(null, resultBuffer)
      setTerminalContent(stdout)
      console.log(stdout)
    } catch (error) {
      if (error instanceof Error) {
        setTerminalContent(error.message)
        console.log(`Error: ${error.message}`)
      }
    }
  }

  return (
    <>
      <div className="py-1 px-1 flex justify-between dark:bg-gray-600 bg-gray-200">
        <div className="space-x-1">
          <Btn msg="Open" onClick={(): void => fileInputRef?.current?.click()} />
          <Btn msg="Save" onClick={(): void => handleSave(codeContent)} />
          <input
            ref={fileInputRef}
            type="file"
            accept=".sudocode"
            className="hidden"
            onChange={handleOpen}
          />
        </div>
        <div className="space-x-1">
          <Btn msg="Compile" onClick={handleCompile} />
          <Btn msg="Run" />
        </div>
      </div>
    </>
  )
}

export default BtnBar
