import * as React from 'react';
import { Popover, Paper, Typography, Link } from '@mui/material';
import LinkIcon from '@mui/icons-material/Link';

const DEFAULT_MAX_URL_CHARS = 20;

export function LinkPopover(props: {
  url: string;
  open: boolean;
  maxUrlChars?: number;
  onClose: () => void;
  x: number;
  y: number;
}) {
  const maxUrlChars = props.maxUrlChars ?? DEFAULT_MAX_URL_CHARS;
  const urlShort =
    props.url.length <= maxUrlChars
      ? props.url
      : props.url.slice(0, maxUrlChars - 3).concat('...');

  const hasProto = props.url.startsWith('http');

  const urlToFollow = hasProto ? props.url : `http://${props.url}`;

  return (
    <Popover
      open={props.open}
      onClose={props.onClose}
      anchorReference="anchorPosition"
      anchorPosition={{
        left: props.x,
        top: props.y,
      }}
      transitionDuration={0}
    >
      <Paper
        elevation={3}
        sx={{
          padding: '1em',
          display: 'flex',
          alignItems: 'center',
        }}
      >
        <LinkIcon sx={{ marginRight: 1 }} />
        <Link
          title={urlToFollow}
          href={urlToFollow}
          component="a"
          rel="noopener noreferrer"
          target="_blank"
        >
          {urlShort}
        </Link>
      </Paper>
    </Popover>
  );
}
