use std::env;

use lettre::{transport::smtp::authentication::Credentials, Message, SmtpTransport, Transport};
use log::{error, info};

const SBS_V1_EMAIL: &str = "sportsbettingsandbox@gmail.com";
const SMTP: &str = "smtp.gmail.com";

pub fn send_email(
    subject: &str, 
    body: &str
) -> Result<(), Box<dyn std::error::Error>> {
    let email = Message::builder()
        .from(SBS_V1_EMAIL.parse()?)
        .to(SBS_V1_EMAIL.parse()?)
        .subject(subject)
        .body(String::from(body))
        .unwrap();

    // Set up SMTP transport with credentials
    let creds = Credentials::new(
        SBS_V1_EMAIL.to_string(), 
        get_email_password(),
    );

    let mailer: SmtpTransport = SmtpTransport::relay(SMTP)
        .unwrap()
        .credentials(creds)
        .build();

    match mailer.send(&email) {
        Ok(_) => {
            info!("{}", format!("Sent email with subject: {} to {}", subject, SBS_V1_EMAIL));
            return Ok(());
        },
        Err(e) => {
            error!("{}", format!("Failed to send email with subject: {} to {}, error: {:?}", subject, SBS_V1_EMAIL, e));
            return Err(Box::new(e));
        }
    }
}

fn get_email_password() -> String {
    let email_password: &str = &env::var("SBS_V1_APP_PW").expect("You must set the SBS_V1_APP_PW environment var!");
    return email_password.to_owned();
}

