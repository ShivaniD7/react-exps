function Home() {
    return (
        <div style={homeStyle}>
            <h1>Main Content</h1>
            <h3>Welcome to the Home Page</h3>
            <p>
                This is the central hub of our website where you'll find the latest updates, featured content,
                and quick links to everything we offer.
            </p>
            <p>
                Whether you're here to learn, explore new features, or simply stay informed — we’re glad to have you!
            </p>
            <ul>
                <li>✅ Easy navigation through the sidebar</li>
                <li>📄 Informative About and Contact sections</li>
                <li>🚀 Fast and responsive design</li>
            </ul>
            <p>
                Stay tuned for more exciting updates, tutorials, and interactive components. We’re constantly working
                to improve your experience!
            </p>
        </div>
    );
}

const homeStyle = {
    fontSize: "25px",
    lineHeight: "1.6",
};

export default Home;
