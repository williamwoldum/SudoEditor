interface BtnProps {
  msg: string
  onClick?: (e: React.MouseEvent) => void
}

const defaultProps: BtnProps = {
  msg: 'Blank',
  onClick: () => {
    console.log('Nothing happened')
  }
}

function Btn(props: BtnProps): JSX.Element {
  const { msg, onClick } = props
  return (
    <>
      <button
        onClick={onClick ?? defaultProps.onClick}
        className="px-2 text-xs font-bold bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400 hover:bg-gray-300 dark:hover:bg-gray-600"
      >
        {msg}
      </button>
    </>
  )
}

export default Btn
