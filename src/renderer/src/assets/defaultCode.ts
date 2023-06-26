const defaultCode = `Cell[] getBox (Number index) {
    Number rowIndex = (index - 1) / 3 * 3 + 1;
    Number colIndex = (index - 1) % 3 * 3 + 1;
    return (rowIndex:colIndex => (rowIndex + 2):(colIndex + 2));
}

constraint uniqueCollection (Cell[] cells) {
    for Number i in Range(1, Len(cells)) {
        for Number j in Range(i + 1, Len(cells)) {
            assert Val(cells[i]) != Val(cells[j]) involves [cells[i], cells[j]] msg 'The two cells are not unique';
        }
    }
}

@verify ();
@explanation ('All numbers in each row, column and box must be unique');
constraint standardSudoku () {
    for Number i in Range(1, 9) {
        apply uniqueCollection(i:1->i:9);         #row
        apply uniqueCollection(1:i->9:i);         #col
        apply uniqueCollection(getBox(i));        #box
    }
}

# //@verify (27, 2:1=>3:3);
# //@explanation ('All cells in a cage must be unique and sum to the small digit in the corner');
# //constraint killerCage (Number expectedSum, Cell[] cells) {
# //    apply uniqueCollection(cells);
# //    assert Sum(cells) == expectedSum involves [cells] msg 'Killer cage did not sum to expected sum';
# //}
`
export default defaultCode
