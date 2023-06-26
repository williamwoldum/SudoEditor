import { EditorView } from '@codemirror/view'
import { EditorState } from '@codemirror/state'

const customCommentKey = EditorView.domEventHandlers({
  keydown: (event, view) => {
    if (event.ctrlKey && event.key === 'q') {
      const tr = view.state.update({ changes: customCommentChange(view.state) })
      view.dispatch(tr)
      return true // Prevent the event from being handled further
    }
    return false // Let other keydown handlers handle the event
  }
})

function customCommentChange(state: EditorState): { from: number; to: number; insert: string }[] {
  const changes: { from: number; to: number; insert: string }[] = []

  // Go through each selected range
  for (const range of state.selection.ranges) {
    const { from, to } = range

    for (let pos = from; pos <= to; ) {
      const line = state.doc.lineAt(pos)
      const text = line.text

      if (text.startsWith('# //')) {
        // Uncomment line
        changes.push({ from: line.from, to: line.from + 4, insert: '' })
      } else {
        // Comment line
        changes.push({ from: line.from, to: line.from, insert: '# //' })
      }

      pos = line.to + 1 // Move to the start of the next line
    }
  }

  return changes
}

export default customCommentKey
