import React from "react";
import { useTranslation } from "react-i18next";
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
  const { t } = useTranslation();
  const contactText = t("contactDescription", {
    returnObjects: true,
  });

  return (
    <div>
      <div className="text-sm mb-4">
        {contactText.map((paragraph, index) => (
          <p
            key={index}
            className="mt-2"
            dangerouslySetInnerHTML={{ __html: paragraph }}
          ></p>
        ))}
      </div>
      <div className="">
        <div className="text-lg">{t("contactEmail")}</div>
        <div>
          📧 [{" "}
          <a href="mailto:dbeltra@gmail.com" className="text-primary">
            dbeltra@gmail.com
          </a>{" "}
          ]
        </div>
        <div>{t("contactEmailText")}</div>
      </div>
      <div className="mt-4">
        <div className="text-lg">{t("contactLinkedin")}</div>
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
        <div>{t("contactLinkedinText")}</div>
      </div>
      <div className="mt-4">
        <div className="text-lg">{t("contactGithub")}</div>
        <div>
          🐙 [{" "}
          <a href="https://github.com/dbeltra" className="text-primary">
            github.com/dbeltra
          </a>{" "}
          ]
        </div>
        <div>{t("contactGithubText")}</div>
      </div>
      <div className="mt-4">
        <div className="text-lg">{t("contactLocation")}</div>
        <div>🌍 {t("contactLocationPlace")}</div>
        <div>{t("contactLocationText")}</div>
      </div>
    </div>
  );
};

const Contact = () => {
  const { t } = useTranslation();

  return (
    <TabContent
      code={Code}
      language="rust"
      Title={t("contactTitle")}
      Content={ContactContent}
    ></TabContent>
  );
};

export default Contact;
