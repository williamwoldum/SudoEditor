import Btn from '../shared/Btn'
import AnsiToHtml from './AnsiToHtml'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const api: any = window.api

function handeViewOutput(): void {
  api.viewOutput()
}

interface TerminalProps {
  content: string
  compileSuccess: boolean
}

function Terminal(props: TerminalProps): JSX.Element {
  const { content, compileSuccess } = props

  return (
    <>
      <div className="px-1 flex justify-between items-center dark:bg-gray-600 bg-gray-200">
        <p className="text-xs p-0 my-1 text-gray-400 font-bold">Terminal output</p>
        <div>{compileSuccess ? <Btn msg="View output" onClick={handeViewOutput} /> : ''}</div>
      </div>
      <div className="dark:bg-gray-800 h-full pb-5">
        <AnsiToHtml ansiContent={content} />
      </div>
    </>
  )
}

export default Terminal
