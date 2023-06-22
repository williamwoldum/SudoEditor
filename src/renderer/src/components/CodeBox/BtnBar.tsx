import { useEffect, useRef } from 'react'
import Btn from '../shared/Btn'
import { SudokuHandler, CompilationExport } from '@renderer/models/SudokuHandler'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const api: any = window.api

interface BtnBarProps {
  codeContent: string
  setCodeContent: (content: string) => void
  setTerminalContent: React.Dispatch<React.SetStateAction<string>>
  setCompileSuccess: React.Dispatch<React.SetStateAction<boolean>>
  setSudokuHandler: React.Dispatch<React.SetStateAction<SudokuHandler | undefined>>
}

function BtnBar(props: BtnBarProps): JSX.Element {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const { codeContent, setCodeContent, setTerminalContent, setCompileSuccess, setSudokuHandler } =
    props

  useEffect(() => {
    loadDefaultHandler()
  }, [])

  async function loadDefaultHandler(): Promise<void> {
    const newSudokuHandler = await getSudokuHandler()
    setSudokuHandler(newSudokuHandler)
  }

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
        const content = await api.readFile(file.path)
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
    setTerminalContent('')
    try {
      compile(true)
    } catch (error) {
      if (error instanceof Error) {
        setCompileSuccess(false)
        setTerminalContent(error.message)
        console.log(`Error: ${error.message}`)
      }
    }
  }

  async function handleRun(): Promise<void> {
    setTerminalContent('')
    try {
      compile(false)
      const newSudokuHandler = await getSudokuHandler()
      setSudokuHandler(newSudokuHandler)
    } catch (error) {
      if (error instanceof Error) {
        setCompileSuccess(false)
        setTerminalContent(error.message)
        console.log(`Error: ${error.message}`)
      }
    }
  }

  async function compile(justCheckForCompilation: boolean): Promise<void> {
    justCheckForCompilation

    const inputPath = 'temp_compiles/toBeCompiled.sudocode'
    const outputPath = justCheckForCompilation
      ? 'temp_compiles/testCompiled.js'
      : 'temp_compiles/compiled.js'
    const command = `java -jar resources/SdkrCompiler.jar -i ${inputPath} -o ${outputPath}`

    await api.writeFile(inputPath, codeContent)

    const resultBuffer = await api.execSync(command)
    const stdout = String.fromCharCode.apply(null, resultBuffer)

    if (stdout === '') {
      setTerminalContent('Compiled successfully')
      setCompileSuccess(true)
    } else {
      setTerminalContent(stdout)
      setCompileSuccess(false)
    }
  }

  async function getSudokuHandler(): Promise<SudokuHandler> {
    const module: CompilationExport = await import('../../../../../temp_compiles/compiled.js')
    const handlerClass = module.Sudoku
    // @ts-ignore needs to be looked at
    return new handlerClass()
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
          <Btn msg="Run" onClick={handleRun} />
        </div>
      </div>
    </>
  )
}

export default BtnBar
