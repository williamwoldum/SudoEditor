import Btn from '../shared/Btn'
import AnsiToHtml from './AnsiToHtml'

interface TerminalProps {
  content: string
}

function Terminal(props: TerminalProps): JSX.Element {
  const { content } = props

  return (
    <>
      <div className="px-1 flex justify-between items-center dark:bg-gray-600 bg-gray-200">
        <p className="text-xs p-0 m-0 text-gray-400 font-bold">Terminal output</p>
        <div className="space-x-1">
          <Btn msg="View output" />
        </div>
      </div>
      <div className="dark:bg-gray-800 h-min">
        <AnsiToHtml ansiContent={content} />
      </div>
    </>
  )
}

export default Terminal
