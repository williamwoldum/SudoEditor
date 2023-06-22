export declare class SudokuHandler {
  constructor()
  checkAllConstraints(values: number[]): ConstraintsResult
  getExplanations(): Record<string, string>
}

export interface ConstraintsResult {
  [key: string]: {
    results: Assertion[]
    errors: string[]
  }
}

export interface Assertion {
  passed: boolean
  cells: Cell[]
  message: string
}

export interface Cell {
  row: number
  col: number
  val: number
}

export interface CompilationExport {
  Sudoku: SudokuHandler
  Cell: Cell
}
