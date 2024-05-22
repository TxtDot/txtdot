import { Engine, EngineParseError, Route } from '@txtdot/sdk';

const AI = new Engine('Ai', 'Engine for parsing content with LLM', []);

AI.route('*path', async (input, ro: Route<{ path: string }>) => {
  let conversation = [
    {
      role: 'system',
      content:
        'You are a super intelligence that turns a junk HTML page into a beautiful output without style classes, etc. You return only the necessary information in HTML form. You are not allowed to use any styles, scripts, etc. Your output should contain only pure HTML tags.',
    },
    {
      role: 'user',
      content: input.data,
    },
  ];

  const content = await fetch(process.env.COMPLETIONS_URL || '', {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      Authorization: `Bearer ${process.env.KEY}`,
    },
    body: JSON.stringify({
      model: process.env.MODEL,
      messages: conversation,
    }),
  })
    .then((r) => r.json())
    .then((r) => {
      conversation.push(r.choices[0].message);
      conversation.push({
        role: 'system',
        content: 'Now you need to generate title. Write it without explanation',
      });
      return r.choices[0].message.content;
    })
    .catch((e) => {
      throw new EngineParseError(e);
    });

  const title = await fetch(process.env.COMPLETIONS_URL || '', {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      Authorization: `Bearer ${process.env.KEY}`,
    },
    body: JSON.stringify({
      model: process.env.MODEL,
      messages: conversation,
    }),
  })
    .then((r) => r.json())
    .then((r) => r.choices[0].message.content)
    .catch((e) => {
      throw new EngineParseError(e);
    });

  return {
    content,
    title,
  };
});

export default AI;
