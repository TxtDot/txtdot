import { Middleware, JSX } from '@txtdot/sdk';

const Highlight = new Middleware(
  'Highlight',
  'Highlights code with highlight.js only when needed',
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
        @import "/static/third-party/styles/atom-one-light.min.css"; @import
        "/static/third-party/styles/atom-one-dark.min.css" screen and
        (prefers-color-scheme: dark);
      </style>
      <script
        src="/static/third-party/scripts/highlight.min.js"
        type="text/javascript"
      />
      <script>hljs.highlightAll();</script>
      {content}
    </>
  );
}

export default Highlight;
