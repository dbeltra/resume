import React from "react";
import TabContent from "../components/TabContent";

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
  return (
    <div>
      <p className="text-sm">
        Whether you want to discuss a new project, need help with development,
        or have a general inquiry, feel free to reach out! I’m always open to
        networking and exploring exciting opportunities.
      </p>
      <div className="mt-4">
        <div className="text-lg">Email</div>
        <div>
          📧 [{" "}
          <a href="mailto:dbeltra@gmail.com" className="text-primary">
            dbeltra@gmail.com
          </a>{" "}
          ]
        </div>
        <div>For the quickest response, send me an email!</div>
      </div>
      <div className="mt-4">
        <div className="text-lg">LinkedIn</div>
        <div>
          🔗 [{" "}
          <a
            href="https://www.linkedin.com/in/dbeltra/"
            className="text-primary"
          >
            linkedin.com/in/dbeltra/
          </a>{" "}
          ]
        </div>
        <div>Let’s connect professionally and grow our networks.</div>
      </div>
      <div className="mt-4">
        <div className="text-lg">Github</div>
        <div>
          🐙 [{" "}
          <a href="https://github.com/dbeltra" className="text-primary">
            github.com/dbeltra
          </a>{" "}
          ]
        </div>
        <div>Check out my projects, repositories, and contributions.</div>
      </div>
      <div className="mt-4">
        <div className="text-lg">Location</div>
        <div>
          🌍 Based in [{" "}
          <a
            href="https://maps.app.goo.gl/24XNJgR73jtXfqDq9/"
            className="text-primary"
          >
            Barcelona, Spain
          </a>{" "}
          ]
        </div>
        <div>Available for remote work.</div>
      </div>
    </div>
  );
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
