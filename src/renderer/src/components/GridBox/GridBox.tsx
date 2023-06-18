import { useRef, useState } from 'react'
import Btn from '../shared/Btn'
import Grid from './Grid'
import { Collapse } from 'react-collapse'

interface GridBoxProps {
  codeInFocus: boolean
  darkModeEnabled: boolean
  toggleDarkMode: (e: React.MouseEvent) => void
}

function GridBox(props: GridBoxProps): JSX.Element {
  const { codeInFocus, darkModeEnabled, toggleDarkMode } = props
  const [isOpened, setIsOpened] = useState(false)
  const [resetFunc, setResetFunc] = useState<() => void>(() => () => {})
  const [setOverlayFunc, setSetOverlayFunc] = useState<
    (e: React.ChangeEvent<HTMLInputElement>) => void
  >(() => () => {})
  const overlayInputRef = useRef<HTMLInputElement>(null)

  return (
    <>
      <div className="h-full flex flex-col justify-center items-center overflow-y-auto min-w-[500px]  min-h-[700px]">
        <div className="space-y-2 w-min">
          <Collapse isOpened={isOpened}>
            <p>Paragraph of text</p>
            <p>Another paragraph is also OK</p>
            <p>Images and any other content are ok too</p>
          </Collapse>

          <div className="flex h-4 mb-4 w-full justify-between">
            <Btn msg="Constraints" onClick={(): void => setIsOpened(!isOpened)} />
            <div className="flex space-x-1">
              <div className="h-4 mt-[-2px]">
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    onClick={(e): void => toggleDarkMode(e)}
                    className="sr-only peer"
                    defaultChecked
                  />
                  <div className="w-11 h-4 bg-gray-100 outline-none hover:bg-gray-300 after:outline-2 dark:peer-checked:hover:bg-gray-600 dark:peer-checked:bg-gray-700 peer peer-checked:after:translate-x-7 after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-gray-400 dark:after:bg-gray-400 dark:after:border-gray-400  after:h-3 after:w-3  after:transition-all"></div>
                </label>
              </div>
              <Btn msg="Clear" onClick={(): void => resetFunc()} />
              <Btn msg="Add overlay" onClick={(): void => overlayInputRef?.current?.click()} />
              <input
                ref={overlayInputRef}
                type="file"
                accept=".png"
                className="hidden"
                onChange={setOverlayFunc}
              />
            </div>
          </div>

          <Grid
            codeInFocus={codeInFocus}
            darkModeEnabled={darkModeEnabled}
            setResetFunc={setResetFunc}
            setSetOverlayFunc={setSetOverlayFunc}
          />

          <div className="w-full h-28 bg-gray-100 dark:bg-gray-700 overflow-y-scroll p-2 space-y-1 cus-scrollbars">
            <p className="text-xs text-gray-500 italic">No constraints broken</p>
          </div>
        </div>
      </div>
    </>
  )
}

export default GridBox
