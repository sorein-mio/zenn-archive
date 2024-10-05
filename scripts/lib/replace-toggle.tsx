export function replaceToggle(inputContent: string): string {
  return inputContent.replace(/:::details (.*?)\n([\s\S]*?):::/g, '<details><summary>$1</summary>\n\n$2</details>')
}
