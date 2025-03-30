const contactStyle = {
    fontSize: "25px",
    lineHeight: "1.6"
};

function Contact() {
    return (
        <div style={contactStyle}>
            <h2>Contact Us</h2>
            <p>
                Have questions or feedback? We'd love to hear from you!
            </p>
            <p>
                📧 Email: support@example.com
                <br />
                ☎️ Phone: +1 (555) 123-4567
                <br />
                📍 Address: 123 Web Street, Code City, Developerland
            </p>
            <p>
                You can also reach out to us through our social media handles or use the contact form on our site.
            </p>
        </div>
    );
}

export default Contact;
