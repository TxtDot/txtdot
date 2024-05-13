// eslint-disable-next-line @typescript-eslint/no-namespace
export namespace JSX {
  export type Element = string;
  export interface IntrinsicElements {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    [elemName: string]: any;
  }
}

export function createElement(
  name: string,
  props: { [id: string]: string },
  ...content: string[]
) {
  props = props || {};
  const propsstr = Object.keys(props)
    .map((key) => {
      const value = props[key];
      if (key === 'className') return `class=${value}`;
      else return `${key}=${value}`;
    })
    .join(' ');
  return `<${name} ${propsstr}>${content.join('')}</${name}>`;
}
