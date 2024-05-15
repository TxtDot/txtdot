import { Middleware, JSX } from '@txtdot/sdk';

const Highlight = new Middleware(
  'highlight',
  'Highlights code with highlight.js',
  ['*']
);

Highlight.use(async (input, ro, out) => {
  if (out.content.indexOf('<code') !== -1)
    return {
      ...out,
      content: <Highlighter content={out.content} />,
    };

  return out;
});

function Highlighter({ content }: { content: string }) {
  return (
    <>
      <style>
        @import
        "https://cdn.jsdelivr.net/gh/highlightjs/cdn-release@11.9.0/build/styles/atom-one-light.min.css";
        @import
        "https://cdn.jsdelivr.net/gh/highlightjs/cdn-release@11.9.0/build/styles/atom-one-dark.min.css"
        screen and (prefers-color-scheme: dark);
      </style>
      <script
        src="https://cdn.jsdelivr.net/gh/highlightjs/cdn-release@11.9.0/build/highlight.min.js"
        type="text/javascript"
      />
      <script>hljs.highlightAll();</script>
      {content}
    </>
  );
}

export default Highlight;
