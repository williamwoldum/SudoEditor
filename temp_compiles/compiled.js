class Sudoku {
    cells = []

    /* Operators */
    or = (a, b) => a === undefined && b === false ? undefined : a || b
    and = (a, b) => a === undefined && b === false ? false : a && b
    not = (a) => a === undefined ? undefined : !a

    eq = (a, b) => a === undefined || b === undefined ? undefined : a === b
    neq = (a, b) => a === undefined || b === undefined ? undefined : a !== b
    gt = (a, b) => a === undefined || b === undefined ? undefined : a > b
    gte = (a, b) => a === undefined || b === undefined ? undefined : a >= b
    lt = (a, b) => a === undefined || b === undefined ? undefined : a < b
    lte = (a, b) => a === undefined || b === undefined ? undefined : a <= b

    pow = (a, b) => a === undefined || b === undefined ? undefined : Math.pow(a, b)

    mult = (a, b) => a === undefined || b === undefined ? undefined : a * b
    div = (a, b) => {
        if (b === 0) throw new Error('Divide by zero')
        return a === undefined || b === undefined ? undefined : Math.floor(a / b)
    }
    mod = (a, b) => {
        if (b === 0) throw new Error('Modulo by zero')
        return a === undefined || b === undefined ? undefined : a % b
    }

    add = (a, b) => a === undefined || b === undefined ? undefined : a + b
    sub = (a, b) => a === undefined || b === undefined ? undefined : a - b

    /* Subscript */
    subscript = (list, index) => {
        if (list === undefined || index === undefined) {
            return undefined
        } else if (this.lte(index, list.length) && this.gte(index, 1)) {
            return list[index - 1]
        }
        throw new Error('Index out of bounds')
    }

    /* Helpers */
    getCell = (row, col) => {
        if (row === undefined || col === undefined) return undefined
        if (row < 1 || row > 9) throw new Error(`Row must be between 1 and 9 (got ${row})`)
        else if (col < 1 || col > 9) throw new Error(`Column must be between 1 and 9 (got ${col})`)
        return this.cells[(row - 1) * 9 + (col - 1)]
    }
    getCellRangeSingle = (...cells) => {
        if (cells.some(c => c === undefined)) return undefined

        const range = []
        for (let i = 0; i < cells.length - 1; i++) {
            const cell1 = cells[i]
            const cell2 = cells[i + 1]
            let rowStep = 0
            let colStep = 0
            let dist = 0

            if (cell1 === cell2) {
                throw new Error(`${cell1} and ${cell2} are identical`)
            }
            else if (cell1.row === cell2.row) {
                colStep = cell1.col < cell2.col ? 1 : -1
                dist = Math.abs(cell1.col - cell2.col)
            }
            else if (cell1.col === cell2.col) {
                rowStep = cell1.row < cell2.row ? 1 : -1
                dist = Math.abs(cell1.row - cell2.row)
            }
            else if (Math.abs(cell1.row - cell2.row) === Math.abs(cell1.col - cell2.col)) {
                rowStep = cell1.row < cell2.row ? 1 : -1
                colStep = cell1.col < cell2.col ? 1 : -1
                dist = Math.abs(cell1.col - cell2.col)
            }
            else {
                throw new Error(`${cell1} -> ${cell2} is not a valid cell range`)
            }

            for (let j = 0; j < dist; j++) {
                const col = cell1.col + j * colStep
                const row = cell1.row + j * rowStep
                const idx = (row - 1) * 9 + (col - 1)
                range.push(this.cells[idx])
            }
        }
        const last = cells[cells.length - 1]
        range.push(this.cells[(last.row - 1) * 9 + (last.col - 1)])
        return range
    }
    getCellRangeDouble = (cell1, cell2) => {
        if (cell1 === undefined || cell2 === undefined) return undefined
        if (cell1 === cell2) {
            throw new Error(`${cell1} and ${cell2} are identical`)
        }
        return this.cells.filter(c =>
            c.row <= Math.max(cell1.row, cell2.row) &&
            c.row >= Math.min(cell1.row, cell2.row) &&
            c.col <= Math.max(cell1.col, cell2.col) &&
            c.col >= Math.min(cell1.col, cell2.col)
        )
    }
    parseInputCells = (values) => {
        const cells = []
        if (values.length !== 81) throw new Error('Number of input cells is not 81')
        for (const [i, val] of values.entries()) {
            if (![0, 1, 2, 3, 4, 5, 6, 7, 8, 9].includes(val)) {
                throw new Error(val + ' is not a valid cell value')
            }
            const row = Math.floor(i / 9) + 1
            const col = i % 9 + 1
            cells.push(new Cell(row, col, val ? val : undefined))
        }
        return cells
    }
    range = (start, end) => {
        if (start === undefined || end === undefined) return undefined

        const result = []

        for (let i = start; i <= end; i++) {
            result.push(i)
        }
        return result
    }
    assert = (passed, cells, message) => {
        return { passed, cells, message }
    }

    /* ROW, COL, VAL */
    row = (cell) => cell?.row
    col = (cell) => cell?.col
    val = (cell) => cell?.val
    

    _Len = (_cells) => {let _len=0;const temp0 = _cells;if (temp0 === undefined) {_len= undefined;} else {for (let _cell of temp0) {_len=this.add(_len,1);}}return _len;};_Sum = (_cells) => {let _sum=0;const temp1 = _cells;if (temp1 === undefined) {_sum= undefined;} else {for (let _cell of temp1) {_sum=this.add(_sum,this.val(_cell));}}return _sum;};_getBox = (_index) => {let _rowIndex=this.add(this.mult(this.div(this.sub(_index,1),3),3),1);let _colIndex=this.add(this.mult(this.mod(this.sub(_index,1),3),3),1);return this.getCellRangeDouble(this.getCell(_rowIndex,_colIndex),this.getCell(this.add(_rowIndex,2),this.add(_colIndex,2)));};_uniqueCollection = {pred: (_cells) => {const assertions = [];const temp2 = this.range(1,this._Len(_cells));if (temp2 === undefined) {} else {for (let _i of temp2) {const temp2 = this.range(this.add(_i,1),this._Len(_cells));if (temp2 === undefined) {} else {for (let _j of temp2) {assertions.push(this.assert(this.neq(this.val(this.subscript(_cells,_i)),this.val(this.subscript(_cells,_j))),[this.subscript(_cells,_i),this.subscript(_cells,_j)],'The two cells are not unique'));}}}}return assertions;}};_standardSudoku = {explanation: 'All numbers in each row, column and box must be unique',inputs: () => [[]],pred: () => {const assertions = [];const temp4 = this.range(1,9);if (temp4 === undefined) {} else {for (let _i of temp4) {for(const temp4 of this._uniqueCollection.pred(this.getCellRangeSingle(this.getCell(_i,1),this.getCell(_i,9)))) {assertions.push(temp4)}for(const temp5 of this._uniqueCollection.pred(this.getCellRangeSingle(this.getCell(1,_i),this.getCell(9,_i)))) {assertions.push(temp5)}for(const temp6 of this._uniqueCollection.pred(this._getBox(_i))) {assertions.push(temp6)}}}return assertions;}};_killerCage = {explanation: 'All cells in a cage must be unique and sum to the small digit in the corner',inputs: () => [[27,this.getCellRangeDouble(this.getCell(2,1),this.getCell(3,3))]],pred: (_expectedSum,_cells) => {const assertions = [];for(const temp8 of this._uniqueCollection.pred(_cells)) {assertions.push(temp8)}assertions.push(this.assert(this.eq(this._Sum(_cells),_expectedSum),[_cells],'Killer cage did not sum to expected sum'));return assertions;}};


    checkAllConstraints = (values) => {
        this.cells = this.parseInputCells(values)
        const results = {}

        const tlConstraintKeys = Object.keys(this).filter(key => this[key].inputs);

        for (const key of tlConstraintKeys) {
            const constraint = this[key]
            for (const input of constraint.inputs()) {
                results[key] ??= []
                for (const x of constraint.pred(...input)) {
                    results[key].push(x)
                }
            }
        }

        return results
    }
}

class Cell {
    constructor(row, col, val) {
        this.row = row
        this.col = col
        this.val = val
    }
    toString() {
        return `R${this.row}C${this.col}`
    }
}

module.exports = { Sudoku, Cell }

