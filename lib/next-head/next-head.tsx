import * as React from 'react';
import Head from 'next/head';

export function NextHead(
  props: React.PropsWithChildren<{
    title: string;
    titleKey: string;
  }>
) {
  return (
    <Head>
      <title>{props.title}</title>
      <meta property="og:title" content={props.title} key={props.titleKey} />
      {props.children}
    </Head>
  );
}
