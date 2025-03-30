import React, { Component } from 'react';
import { NavLink } from 'react-router-dom';

export class Sidebar extends Component {
    render() {
        return (
            <aside style={sidebarStyle}>
                <nav style={{ display: 'flex', flexDirection: 'column' }}>
                    <NavLink
                        to="/"
                        style={({ isActive }) => isActive ? { ...linkStyle, ...activeLinkStyle } : linkStyle}
                    >
                        Home
                    </NavLink>
                    <NavLink
                        to="/about"
                        style={({ isActive }) => isActive ? { ...linkStyle, ...activeLinkStyle } : linkStyle}
                    >
                        About
                    </NavLink>
                    <NavLink
                        to="/contact"
                        style={({ isActive }) => isActive ? { ...linkStyle, ...activeLinkStyle } : linkStyle}
                    >
                        Contact
                    </NavLink>
                </nav>
            </aside>
        );
    }
}

const sidebarStyle = {
    width: "200px",
    background: "#b3aaaa",
    padding: "15px",
    position: "fixed",
    top: "120px", // Below header
    left: 0,
    height: "calc(100vh - 100px)",
    boxSizing: "border-box",
};

const linkStyle = {
    marginBottom: "10px",
    textDecoration: "none",
    color: "black",
    fontSize: "25px",
};

const activeLinkStyle = {
    fontWeight: "bold",
    color: "blue",
};

export default Sidebar;
