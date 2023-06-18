export default class GridCell {
  value: number
  isLocked: boolean
  isBroken = false
  row: number
  col: number
  box: number
  idx: number
  name: string
  neighbors: number[]
  orthogonal: number[]

  constructor(value: number, isLocked: boolean, row: number, col: number) {
    this.value = value
    this.isLocked = isLocked
    this.row = row
    this.col = col
    this.box = this.calcBoxIdx(row, col)
    this.idx = row * 9 + col
    this.name = `R${row + 1}C${col + 1}`
    this.neighbors = this.getNeighbors(row, col)
    this.orthogonal = this.getOrthogonal(row, col)
  }

  public checkIfOrthogonal(otherCell: GridCell): boolean {
    return this.orthogonal.includes(otherCell.idx)
  }

  public checkIfNeighbors(otherCell: GridCell): boolean {
    return this.neighbors.includes(otherCell.idx)
  }

  private calcBoxIdx(row: number, col: number): number {
    const bRow = Math.floor(row / 3)
    const bCol = Math.floor(col / 3)
    const bIdx = bRow * 3 + bCol
    return bIdx
  }

  private getNeighbors(row: number, col: number): number[] {
    const neighbors: number[] = []

    for (let y = -1; y < 2; y++) {
      for (let x = -1; x < 2; x++) {
        if (y === 0 && x === 0) continue

        const newCol = col + x
        const newRow = row + y

        if (newCol < 0 || newCol >= 9) continue
        if (newRow < 0 || newRow >= 9) continue

        neighbors.push(newRow * 9 + newCol)
      }
    }
    return neighbors
  }

  private getOrthogonal(row: number, col: number): number[] {
    const neighbors: number[] = []

    for (let y = -1; y < 2; y++) {
      for (let x = -1; x < 2; x++) {
        if (y === 0 && x === 0) continue
        if (Math.abs(y) === Math.abs(x)) continue

        const newCol = col + x
        const newRow = row + y

        if (newCol < 0 || newCol >= 9) continue
        if (newRow < 0 || newRow >= 9) continue

        neighbors.push(newRow * 9 + newCol)
      }
    }
    return neighbors
  }
}
