interface style {
  code: string
  args: string[]
}

function convertAnsiToHtml(ansiContent: string): JSX.Element {
  const ansiInfo = ansiContent.split('\u001b[0m').map((span) => {
    const content = span.replaceAll(/\033\[.*?m/g, '')

    const ansiModifiers = Array.from(span.matchAll(/\033\[(.*?)m/g), (match) => match[1])
    const styles: style[] = ansiModifiers.map((modifier) => ({
      code: modifier?.split(';')[0] ?? '',
      args: modifier?.split(';').slice(1) ?? []
    }))
    return { styles, content }
  })

  return (
    <>
      {ansiInfo.map((span, idx) => (
        <span
          key={idx}
          className="text-gray-500 dark:text-gray-300 text-xs font-mono whitespace-pre"
          style={getStyles(span.styles)}
        >
          {span.content}
        </span>
      ))}
    </>
  )
}

function getStyles(styles: style[]): Record<string, string> {
  const styleString: Record<string, string> = {}
  for (const style of styles) {
    switch (style.code) {
      case '1': // bold
        styleString['fontWeight'] = 'bold'
        break
      case '4': // underline
        styleString['textDecoration'] = 'underline'
        break
      case '38': // rgb color
        styleString[
          'textDecorationColor'
        ] = `rgb(${style.args[1]},${style.args[2]},${style.args[3]})`
        styleString['color'] = `rgb(${style.args[1]},${style.args[2]},${style.args[3]})`
        break
    }
  }
  return styleString
}

interface AnsiToHtmlProps {
  ansiContent: string
}

function AnsiToHtml(props: AnsiToHtmlProps): JSX.Element {
  const { ansiContent } = props

  return (
    <div className="overflow-y-auto overflow-x-auto p-3 h-full cus-scrollbars">
      {convertAnsiToHtml(ansiContent)}
    </div>
  )
}

export default AnsiToHtml
