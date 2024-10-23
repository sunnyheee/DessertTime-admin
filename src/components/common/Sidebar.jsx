import React from "react";
import {
  Box,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
} from "@mui/material";
import { Link } from "react-router-dom";
import "./Sidebar.css";

const drawerWidth = 200;

export default function Sidebar({ selectedMenu, setSelectedMenu, menuItems }) {
  return (
    <Drawer
      variant="permanent"
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        "& .MuiDrawer-paper": {
          width: drawerWidth,
          boxSizing: "border-box",
          bgcolor: "#EF4444",
        },
      }}
    >
      <Box p={2}>
        <img className="logo" src="/images/adminlogo.svg" alt="Logo" />
      </Box>
      <List sx={{ pt: 2 }}>
        {menuItems.map((item) => (
          <ListItem key={item.text} disablePadding>
            <ListItemButton
              component={Link}
              to={item.path}
              selected={selectedMenu === item.text}
              onClick={() => setSelectedMenu(item.text)}
              sx={{
                "&.Mui-selected": {
                  bgcolor: "#fff",
                  "&:hover": {
                    bgcolor: "#FCDADA",
                  },
                },
              }}
            >
              <ListItemText primary={item.text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Drawer>
  );
}
