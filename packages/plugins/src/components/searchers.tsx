import { JSX } from '@txtdot/sdk';

export function PageFooter({
  page,
  previous,
  next,
}: {
  page: number;
  previous: string | false;
  next: string | false;
}) {
  return (
    <>
      {page !== 1 ? <a href={previous}>Previous </a> : <></>}| {page} |
      <a href={next}> Next</a>
    </>
  );
}

export function ResultItem({
  url,
  title,
  content,
}: {
  url: string;
  title: string;
  content: string;
}) {
  return (
    <>
      <a href={url}>{title}</a>
      <p>{content}</p>
    </>
  );
}
