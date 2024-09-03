use actix_web::{web, HttpRequest, HttpResponse, Error};
use awc::Client;
use crate::routes::endpoints::SERVER_URL;

pub async fn proxy(req: HttpRequest, payload: web::Payload) -> Result<HttpResponse, Error> {
    // Define the backend server to which you want to forward requests
    let backend_server_url = SERVER_URL; // Replace with actual backend URL
    let path_and_query = req.uri().path_and_query().map(|pq| pq.as_str()).unwrap_or("");
    let target_url = format!("{}{}", backend_server_url, path_and_query);

    let client = Client::new();
    let mut forwarded_request = client.request_from(target_url, req.head());

    for (key, value) in req.headers() {
        forwarded_request = forwarded_request.insert_header((key.clone(), value.clone()));
    }

    // Convert `SendRequestError` to an appropriate Actix-Web `Error`
    let mut backend_response = forwarded_request
        .send_stream(payload)
        .await
        .map_err(|e| actix_web::error::ErrorInternalServerError(e))?;

    let body = backend_response.body().await.map_err(|e| actix_web::error::ErrorInternalServerError(e))?;

    let mut client_response = HttpResponse::build(backend_response.status());
    for (key, value) in backend_response.headers() {
        client_response.append_header((key.clone(), value.clone()));
    }

    Ok(client_response.body(body))
}
