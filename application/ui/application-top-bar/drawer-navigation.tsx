import * as React from 'react';
import Link from 'next/link';
import {
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Divider,
} from '@mui/material';
import {
  DinnerDining,
  Info,
  Quiz,
  ConnectWithoutContact,
} from '@mui/icons-material';

export function DrawerNavigation() {
  return (
    <List>
      <Link href="/" passHref>
        <ListItem disablePadding>
          <ListItemButton>
            <ListItemIcon>
              <DinnerDining />
            </ListItemIcon>
            <ListItemText primary="Pasta" />
          </ListItemButton>
        </ListItem>
      </Link>
      <Divider />
      <Link href="/faq" passHref>
        <ListItem disablePadding>
          <ListItemButton>
            <ListItemIcon>
              <Quiz />
            </ListItemIcon>
            <ListItemText primary="FAQ" />
          </ListItemButton>
        </ListItem>
      </Link>
      <Link href="/contact" passHref>
        <ListItem disablePadding>
          <ListItemButton>
            <ListItemIcon>
              <ConnectWithoutContact />
            </ListItemIcon>
            <ListItemText primary="Contact" />
          </ListItemButton>
        </ListItem>
      </Link>
      <Link href="/about" passHref>
        <ListItem disablePadding>
          <ListItemButton>
            <ListItemIcon>
              <Info />
            </ListItemIcon>
            <ListItemText primary="About" />
          </ListItemButton>
        </ListItem>
      </Link>
    </List>
  );
}
