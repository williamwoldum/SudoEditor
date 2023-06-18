import GridCell from './GridCell'

export default class GridSudoku {
  cells: GridCell[]
  selected: number[] = []

  constructor(cells: GridCell[]) {
    if (cells.length !== 81) {
      throw Error()
    }
    this.cells = cells
  }

  public reset(): void {
    this.cells.forEach((cell) => {
      if (!cell.isLocked) cell.value = 0
    })
  }

  public getNums(): number[] {
    return this.cells.map((cell) => cell.value)
  }

  public getNumsGrid(): number[][] {
    const numGrid: number[][] = []
    for (let y = 0; y < 9; y++) {
      const row: number[] = []
      for (let x = 0; x < 9; x++) {
        row.push(this.cells[y * 9 + x].value)
      }
      numGrid.push(row)
    }
    return numGrid
  }

  static getEmpty(): GridSudoku {
    const cells: GridCell[] = []
    for (let y = 0; y < 9; y++) {
      for (let x = 0; x < 9; x++) {
        cells.push(new GridCell(0, false, y, x))
      }
    }

    return new GridSudoku(cells)
  }

  static set(numGrid: number[][]): GridSudoku {
    const cells: GridCell[] = []
    for (let y = 0; y < 9; y++) {
      for (let x = 0; x < 9; x++) {
        const val = numGrid[y][x]
        const cell = new GridCell(val, false, y, x)
        if (val > 0) cell.isLocked = true
        cells.push(cell)
      }
    }

    return new GridSudoku(cells)
  }
}
