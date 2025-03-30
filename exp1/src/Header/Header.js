import React, { Component } from 'react'

export class Header extends Component {
    render() {
        return (
            <header style={headerStyle}>
                <h1>This is the Header</h1>
            </header>
        )
    }
}

const headerStyle = {
    background: "#333",
    color: "#fff",
    padding: "0px",
    height: "120px",
    border: "0px",
    textAlign: "center",
    width: "100%",
    position: "fixed",
    top: 0,
    left: 0,
    zIndex: 1000,
    fontSize: "21px"
};

export default Header