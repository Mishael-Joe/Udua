import DOMPurify from 'isomorphic-dompurify';

export function formatText(str: string): string {
  // Replace *text* with <strong> for bold
  str = str.replace(/\*(.*?)\*/g, '<strong>$1</strong>');

  // Replace _text_ with <em> for italics
  str = str.replace(/_(.*?)_/g, '<em>$1</em>');

  // Replace ~text~ with <u> for underline
  str = str.replace(/~(.*?)~/g, '<u>$1</u>');

  // Replace -text- with <s> for strikethrough
  str = str.replace(/-(.*?)-/g, '<s>$1</s>');

  // Replace `text` with <code> for inline code
  str = str.replace(/`(.*?)`/g, '<code>$1</code>');

  // Unordered list (matches lines starting with '*' or '-')
  str = str.replace(/(?:^|\n)[*-]\s+(.*?)(?=\n|$)/g, '<li>$1</li>');
  str = str.replace(/(<li>.*<\/li>)/g, '<ul>$1</ul>');

  // Ordered list (matches lines starting with numbers followed by a period)
  str = str.replace(/(?:^|\n)(\d+)\.\s+(.*?)(?=\n|$)/g, '<li>$2</li>');
  str = str.replace(/(<li>.*<\/li>)/g, '<ol>$1</ol>');

  // Indentation (matches lines starting with one or more tabs or spaces)
  str = str.replace(/\n(\t| {4})(.*?)(?=\n|$)/g, '<blockquote style="margin-left: 20px;">$2</blockquote>');

  // Sanitize the resulting HTML
  return DOMPurify.sanitize(str);
}
