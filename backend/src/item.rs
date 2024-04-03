use actix_web::{
    dev::ServiceRequest,
    get,
    web::{self},
    HttpRequest, HttpResponse, Responder,
};
use serde::Serialize;
use sqlx::{Pool, Postgres};

use crate::AppState;

#[derive(sqlx::FromRow, Serialize)]
struct Item {
    pub id: i32,
    pub description: String,
    /// Clerk identifier of Author
    pub user_id: String,
    pub price_usd: i32,
}

#[derive(sqlx::FromRow, Serialize)]
struct Judgement {
    pub id: i32,
    pub rating: i32,
    pub comment: String,
    /// Clerk identifier of Author
    pub user_id: String,
}

#[get("/items")]
pub async fn get_items(
    pool: web::Data<Pool<Postgres>>,
    state: web::Data<AppState>,
) -> impl Responder {
    let Ok(all_users) = sqlx::query_as!(
        Item,
        "SELECT id, description, user_id, price_usd FROM items"
    )
    .fetch_all(&**pool)
    .await
    else {
        return HttpResponse::InternalServerError().json(serde_json::json!({
            "message": "Unable to retrieve all items",
        }));
    };

    HttpResponse::Ok().json(
        all_users
            .into_iter()
            .map(|u| u.into())
            .collect::<Vec<Item>>(),
    )
}

// Example endpoint for extracting the calling user
#[get("/users/item/{id}/judgements")]
pub async fn get_judgements(
    pool: web::Data<Pool<Postgres>>,
    id: web::Path<i32>,
    state: web::Data<AppState>,
    req: HttpRequest,
) -> impl Responder {
    let Ok(all_users) = sqlx::query_as!(
        Judgement,
        "SELECT id, comment, user_id, rating FROM judgements WHERE item_id = $1",
        (*id)
    )
    .fetch_all(&**pool)
    .await
    else {
        return HttpResponse::InternalServerError().json(serde_json::json!({
            "message": "Unable to retrieve all items",
        }));
    };

    HttpResponse::Ok().json(
        all_users
            .into_iter()
            .map(|u| u.into())
            .collect::<Vec<Judgement>>(),
    )
}
