/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-namespace */
export namespace JSX {
  export type Element = string;
  export interface IntrinsicElements {
    [elemName: string]: any;
  }
}

export function createElement(
  name: any,
  props: { [id: string]: any },
  ...inner: any[]
) {
  const content = inner.flat().join('');

  if (typeof name === 'string') {
    props = props || {};
    const propsstr = Object.keys(props)
      .map((key) => {
        const value = props[key];
        if (key === 'className') return `class=${value}`;
        else return `${key}=${value}`;
      })
      .join(' ');

    return inner.length === 0
      ? `<${name} ${propsstr}/>`
      : `<${name} ${propsstr}>${content}</${name}>`;
  } else if (typeof name === 'function') {
    return name(props, content);
  } else {
    return content;
  }
}
