import * as React from 'react';
import Head from 'next/head';

export function NextHead(
  props: React.PropsWithChildren<{
    title: string;
    key: string;
  }>
) {
  return (
    <Head>
      <title>{props.title}</title>
      <meta property="og:title" content={props.title} key={props.key} />
      {props.children}
    </Head>
  );
}
