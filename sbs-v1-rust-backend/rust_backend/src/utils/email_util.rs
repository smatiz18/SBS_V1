// use std::env;

// use lettre::{transport::smtp::authentication::Credentials, Message, SmtpTransport};

// const SBS_V1_EMAIL: &str = "sportsbettingsanbox@gmail.com";
// const PASSWORD: &str = get_email_password();
// pub fn send_email(
//     from: &str, 
//     to: &str, 
//     subject: &str, 
//     body: &str
// ) -> Result<(), Box<dyn std::error::Error>> {
//     let email = Message::builder()
//         .from(from.parse().unwrap())
//         .to(to.parse().unwrap())
//         .subject(subject)
//         .body(String::from(body))
//         .unwrap();

//     // Set up SMTP transport with credentials
//     let creds = Credentials::new(
//         SBS_V1_EMAIL.to_string(), 
//         PASSWORD.to_string(),
//     );

//     let mailer = SmtpTransport::relay("SBS_V1_EMAIL")
//         .unwrap()
//         .credentials(creds)
//         .build();

//     match mailer::send(&email) {
//         Ok(_) => print!("pee"),
//         Err(e) => print!("poop")
//     }
// }

// pub fn get_email_password() -> &str {
//     let email_password: &str = &env::var("SPORTS_BETTING_SANDBOX_EMAIL_PW").expect("You must set the SPORTS_BETTING_SANDBOX_EMAIL_PW environment var!");
//     return email_password;
// }

