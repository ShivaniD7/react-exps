import React, { Component } from 'react'

export class Footer extends Component {
    render() {
        return (
            <footer style={footerStyle}>
                <p>This is Footer</p>
            </footer>
        )
    }
}

const footerStyle = {
    background: "#333",
    color: "#fff",
    textAlign: "center",
    padding: "0px",
    border: "0px",
    width: "100%",
    position: "fixed",
    bottom: 0,
    left: 0,
    fontSize: "25px"
};
export default Footer