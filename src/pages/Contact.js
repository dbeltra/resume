import React from "react";
import TabContent from "../components/tab-content";

const Code = `use lettre::{Message, SmtpTransport, Transport};
use lettre::transport::smtp::authentication::Credentials;
use lettre_email::Email;

#[tokio::main]
async fn main() -> Result<(), Box<dyn std::error::Error>> {
    // Define your own sender
    let sender = "your_email@example.com";
    let recipient = "dbeltra@gmail.com";
    let subject = "Hello David!";
    let body = "Hello, I just wanted to contact you 😊";

    // Create the email message
    let email = Message::builder()
        .from(sender.parse()?)
        .to(recipient.parse()?)
        .subject(subject)
        .body(body.to_string())?;

    // SMTP server details
    let smtp_server = "smtp.gmail.com";
    let smtp_port = 587;
    let smtp_password = "your_email_password";

    // Set up SMTP client
    let creds = Credentials::new(sender.to_string(), smtp_password.to_string());
    let mailer = SmtpTransport::relay(smtp_server)?
        .credentials(creds)
        .port(smtp_port)
        .build();

    // Contact me!
    match mailer.send(&email).await {
        Ok(_) => println!("Email sent successfully!"),
        Err(e) => println!("Failed to send email: {:?}", e),
    }

    Ok(())
}
`;

const ContactContent = () => {
  return <div></div>;
};

const Contact = () => {
  return (
    <TabContent
      code={Code}
      language="rust"
      Title="Contact Me"
      Content={ContactContent}
    ></TabContent>
  );
};

export default Contact;
