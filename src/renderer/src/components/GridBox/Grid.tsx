import Sketch from 'react-p5'
import p5Types from 'p5'
import GridSudoku from '@renderer/models/GridSudoku'
import { useEffect, useRef } from 'react'

const tileSize = 46
const colors = {
  blue300: '#93c5fd',
  blue700: '#1d4ed8',
  red300: '#fca5a5',
  red700: '#b91c1c',
  gray200: '#e5e7eb',
  gray300: '#d1d5db',
  gray400: '#9ca3af',
  gray500: '#6b7280',
  gray600: '#4b5563',
  gray700: '#374151',
  gray800: '#1f2937'
}
const sudoku = GridSudoku.getEmpty()
let overlayImg: p5Types.Image

interface GridProps {
  codeInFocus: boolean
  darkModeEnabled: boolean
  setResetFunc: React.Dispatch<React.SetStateAction<() => void>>
  setSetOverlayFunc: React.Dispatch<
    React.SetStateAction<(e: React.ChangeEvent<HTMLInputElement>) => void>
  >
}

function Grid(props: GridProps): JSX.Element {
  const { codeInFocus, darkModeEnabled, setResetFunc, setSetOverlayFunc } = props
  const sketchRef = useRef<p5Types | null>(null)

  useEffect(() => {
    setResetFunc(() => () => reset())
    setSetOverlayFunc(() => (e: React.ChangeEvent<HTMLInputElement>) => setOverlay(e))
    sketchRef.current?.redraw()
  }, [darkModeEnabled])

  const reset = (): void => {
    sudoku.reset()
    sketchRef.current?.redraw()
  }

  const setOverlay = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const file = (e.target.files as FileList)[0]

    if (file.type === 'image/png' || file.type === 'image/jpeg') {
      const urlOfImageFile = URL.createObjectURL(file)
      overlayImg = sketchRef.current!.loadImage(urlOfImageFile, () => {
        formatOverlay()
        sketchRef.current?.redraw()
      })
    }
  }

  const formatOverlay = (): void => {
    overlayImg.loadPixels()

    for (let y = 0; y < overlayImg.height; y++) {
      for (let x = 0; x < overlayImg.width; x++) {
        const index = (y * overlayImg.width + x) * 4

        const r = overlayImg.pixels[index + 0]
        const g = overlayImg.pixels[index + 1]
        const b = overlayImg.pixels[index + 2]

        if (r + g + b > 700) {
          overlayImg.pixels[index + 3] = 0
        } else {
          overlayImg.pixels[index + 0] = 156
          overlayImg.pixels[index + 1] = 163
          overlayImg.pixels[index + 2] = 175
        }
      }
    }
    overlayImg.updatePixels()
  }

  const setup = (p5: p5Types, canvasParentRef: Element): void => {
    p5.createCanvas(tileSize * 9 + 2, tileSize * 9 + 2).parent(canvasParentRef)
    p5.cursor('pointer')
    p5.textAlign(p5.CENTER, p5.CENTER)
    p5.noLoop()
    sketchRef.current = p5
  }

  const draw = (p5: p5Types): void => {
    p5.background(darkModeEnabled ? p5.color(colors.gray800) : p5.color(255))
    drawGrid(p5)
    drawOverlay(p5)
    drawDigits(p5)
    drawSelection(p5)
  }

  const drawOverlay = (p5: p5Types): void => {
    if (overlayImg !== undefined) {
      p5.image(overlayImg, 0, 0, p5.width, p5.height)
    }
  }

  const placeDigit = (idx: number, digit: number): void => {
    if (!sudoku.cells[idx].isLocked) {
      sudoku.cells[idx].value = digit
    }
  }

  const drawGrid = (p5: p5Types): void => {
    p5.stroke(darkModeEnabled ? p5.color(colors.gray700) : p5.color(colors.gray300))
    for (let i = 0; i < 10; i++) {
      p5.strokeWeight(i % 3 === 0 ? 2 : 1)
      p5.line(i * tileSize + 1, 1, i * tileSize + 1, p5.height + 1)
      p5.line(1, i * tileSize + 1, p5.width + 1, i * tileSize + 1)
    }
  }

  const drawDigits = (p5: p5Types): void => {
    p5.noStroke()
    p5.textSize(20)

    sudoku.cells.forEach((cell) => {
      if (darkModeEnabled) {
        cell.isLocked ? p5.fill(p5.color(colors.gray400)) : p5.fill(p5.color(colors.blue300))
        if (cell.isBroken) p5.fill(p5.color(colors.red300))
      } else {
        cell.isLocked ? p5.fill(p5.color(colors.gray600)) : p5.fill(p5.color(colors.blue700))
        if (cell.isBroken) p5.fill(p5.color(colors.red700))
      }

      if (cell.value > 0) {
        p5.text(
          cell.value,
          cell.col * tileSize + 1 + tileSize / 2,
          cell.row * tileSize + 1 + tileSize / 2
        )
      }
    })
  }

  const drawSelection = (p5: p5Types): void => {
    const edges: Array<[number, number]> = []
    const allSelected = sudoku.selected

    allSelected.forEach((selected) => {
      const orthogonal = sudoku.cells[selected].orthogonal

      orthogonal.forEach((orthogonal) => {
        if (!allSelected.includes(orthogonal)) {
          edges.push([selected, orthogonal])
        }
      })

      const cell = sudoku.cells[selected]
      const color = p5.color(colors.gray400)
      color.setAlpha(5)
      p5.fill(color)
      p5.square(cell.col * tileSize + 1, cell.row * tileSize + 1, tileSize)
    })

    const strokeWeight = 2

    p5.strokeCap(p5.SQUARE)
    p5.strokeWeight(strokeWeight)
    p5.stroke(darkModeEnabled ? p5.color(colors.gray500) : p5.color(colors.gray400))

    edges.forEach((edge) => {
      const selected = sudoku.cells[edge[0]]
      const orthogonal = sudoku.cells[edge[1]]

      const selectedIsTop = selected.idx === orthogonal.idx - 9
      const selectedIsLeft = selected.idx === orthogonal.idx - 1
      const selectedIsBottom = orthogonal.idx === selected.idx - 9
      const selectedIsRight = orthogonal.idx === selected.idx - 1

      let sx, sy, ex, ey

      if (selectedIsTop) {
        sx = selected.col * tileSize - strokeWeight / 2
        ex = (selected.col + 1) * tileSize + strokeWeight / 2
        sy = ey = orthogonal.row * tileSize
      } else if (selectedIsLeft) {
        sx = ex = orthogonal.col * tileSize
        sy = selected.row * tileSize - strokeWeight / 2
        ey = (selected.row + 1) * tileSize + strokeWeight / 2
      } else if (selectedIsBottom) {
        sx = selected.col * tileSize - strokeWeight / 2
        ex = (selected.col + 1) * tileSize + strokeWeight / 2
        sy = ey = selected.row * tileSize
      } else if (selectedIsRight) {
        sx = ex = selected.col * tileSize
        sy = selected.row * tileSize - strokeWeight / 2
        ey = (selected.row + 1) * tileSize + strokeWeight / 2
      } else {
        throw Error('Given cells are not orthogonal')
      }

      p5.line(sx + 1, sy + 1, ex + 1, ey + 1)
    })
  }

  const mousePressed = (p5: p5Types): void => {
    if (mouseInBounds(p5) && !codeInFocus) {
      const row = Math.floor((p5.mouseY + 1) / tileSize)
      const col = Math.floor((p5.mouseX + 1) / tileSize)
      const idx = row * 9 + col

      if (p5.keyIsDown(p5.SHIFT) && !sudoku.selected.includes(idx)) {
        sudoku.selected.unshift(idx)
      } else if (p5.keyIsDown(p5.SHIFT)) {
        sudoku.selected.splice(sudoku.selected.indexOf(idx), 1)
      } else sudoku.selected = [idx]
      p5.draw()
    }
  }

  const mouseReleased = (p5: p5Types): void => {
    if (!mouseInBounds(p5)) {
      sudoku.selected = []
      p5.draw()
    }
  }

  const mouseDragged = (p5: p5Types): void => {
    if (mouseInBounds(p5) && !codeInFocus) {
      const row = Math.floor((p5.mouseY + 1) / tileSize)
      const col = Math.floor((p5.mouseX + 1) / tileSize)
      const idx = row * 9 + col
      if (!sudoku.selected.includes(idx)) {
        sudoku.selected.push(idx)
      }
      p5.draw()
    }
  }

  const doubleClicked = (p5: p5Types): void => {
    if (mouseInBounds(p5) && !codeInFocus) {
      const row = Math.floor((p5.mouseY + 1) / tileSize)
      const col = Math.floor((p5.mouseX + 1) / tileSize)
      const idx = row * 9 + col
      const cell = sudoku.cells[idx]
      sudoku.selected = sudoku.cells
        .filter((selected) => selected.value === cell.value)
        .map((selected) => selected.idx)
      p5.draw()
    }
  }

  const keyPressed = (p5: p5Types): void => {
    if (codeInFocus) return
    const selected = sudoku.selected
    const key = parseInt(p5.key)
    if (key >= 0 && key <= 9) {
      selected.forEach((selected) => {
        placeDigit(selected, key)
      })
      p5.draw()
    } else if (p5.keyCode === p5.BACKSPACE || p5.keyCode === p5.DELETE) {
      selected.forEach((selected) => {
        placeDigit(selected, 0)
      })
      p5.draw()
    } else if (p5.keyCode === p5.ESCAPE) {
      sudoku.selected = []
      p5.draw()
    } else if (
      (selected.length > 0 && p5.keyCode === p5.LEFT_ARROW) ||
      p5.keyCode === p5.RIGHT_ARROW ||
      p5.keyCode === p5.UP_ARROW ||
      p5.keyCode === p5.DOWN_ARROW
    ) {
      const cell = sudoku.cells[selected[0]]
      let row = 0
      let col = 0

      switch (p5.keyCode) {
        case p5.LEFT_ARROW:
          row = cell.row
          col = cell.col === 0 ? 8 : cell.col - 1
          break
        case p5.RIGHT_ARROW:
          row = cell.row
          col = cell.col === 8 ? 0 : cell.col + 1
          break
        case p5.UP_ARROW:
          row = cell.row === 0 ? 8 : cell.row - 1
          col = cell.col
          break
        case p5.DOWN_ARROW:
          row = cell.row === 8 ? 0 : cell.row + 1
          col = cell.col
          break
        default:
          break
      }

      const idx = row * 9 + col

      if (p5.keyIsDown(p5.SHIFT) && !selected.includes(idx)) {
        selected.unshift(idx)
      } else if (p5.keyIsDown(p5.SHIFT)) {
        selected.unshift(selected.splice(selected.indexOf(idx), 1)[0])
      } else sudoku.selected = [idx]
      p5.draw()
    }
  }

  const mouseInBounds = (p5: p5Types): boolean =>
    p5.mouseX >= 0 && p5.mouseX <= p5.width - 4 && p5.mouseY >= 0 && p5.mouseY <= p5.height - 4

  return (
    <Sketch
      setup={setup}
      draw={draw}
      mousePressed={mousePressed}
      mouseReleased={mouseReleased}
      mouseDragged={mouseDragged}
      doubleClicked={doubleClicked}
      keyPressed={keyPressed}
    />
  )
}

export default Grid
