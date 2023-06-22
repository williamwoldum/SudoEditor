import { Assertion, Cell } from '@renderer/models/SudokuHandler'
import * as _ from 'lodash'

interface ConstraintBoxProps {
  ruleBreaks: Record<string, Assertion[]>
  runtimeErrors: Record<string, string[]>
  setSelectedFunc: (newSelection: number[]) => void
}

function ConstraintBox(props: ConstraintBoxProps): JSX.Element {
  const { ruleBreaks, runtimeErrors, setSelectedFunc } = props

  function getCellIdx(cell: Cell): number {
    return (cell.row - 1) * 9 + (cell.col - 1)
  }

  function getRuleBreaks(rule: string, key: number): JSX.Element {
    return (
      <div key={key} className="space-y-[2px]">
        <p className="font-bold text-xs dark:text-gray-400 text-gray-500">
          {_.startCase(rule.slice(1))}
        </p>
        {ruleBreaks[rule].map((assertion, idx) => (
          <p
            key={idx}
            className="text-xs dark:text-gray-400 text-gray-500 cursor-pointer hover:font-bold w-fit"
          >
            <span
              onClick={(): void => setSelectedFunc(assertion.cells.map((cell) => getCellIdx(cell)))}
            >
              {assertion.message}
            </span>

            {assertion.cells.map((cell, idx) => (
              <span
                key={idx}
                onClick={(): void => setSelectedFunc([getCellIdx(cell)])}
                className="font-bold text-xs dark:text-gray-400 text-gray-500 dark:bg-gray-600 bg-gray-200 ml-1 px-1 cursor-pointer"
              >
                {cell.toString()}
              </span>
            ))}
          </p>
        ))}
      </div>
    )
  }

  return (
    <>
      <div className="w-full h-28 bg-gray-100 dark:bg-gray-700 overflow-y-scroll p-2 space-y-1 cus-light-scrollbars">
        {Object.keys(runtimeErrors).length !== 0 ? (
          Object.keys(runtimeErrors).map((error, idx) => (
            <p key={idx} className="text-red-400 font-bold text-xs">
              {runtimeErrors[error]}
            </p>
          ))
        ) : Object.keys(ruleBreaks).length !== 0 ? (
          Object.keys(ruleBreaks).map((rule, idx) => getRuleBreaks(rule, idx))
        ) : (
          <p className="italic text-xs dark:text-gray-500 text-gray-400">No constraints broken</p>
        )}
      </div>
    </>
  )
}

export default ConstraintBox
