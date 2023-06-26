import { Extension } from '@codemirror/state'
import { EditorView } from '@codemirror/view'

export function getFontSizeThemeExt(fontSize: number): Extension {
  const FontSizeTheme = EditorView.theme({
    '&': {
      fontSize: `${fontSize}px`
    }
  })
  return [FontSizeTheme]
}

export function handleScroll(
  event: WheelEvent,
  sizeStateSetter: React.Dispatch<React.SetStateAction<number>>
): void {
  if (event.ctrlKey) {
    event.preventDefault() // Prevents the page from zooming
    sizeStateSetter((oldFontSize) => oldFontSize + Math.sign(event.deltaY) * -1)
  }
}
