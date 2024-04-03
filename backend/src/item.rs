use actix_web::{
    dev::ServiceRequest,
    get, post,
    web::{self, Json},
    HttpRequest, HttpResponse, Responder,
};
use clerk_rs::{apis::users_api::User, validators::actix::clerk_authorize};
use num_traits::cast::ToPrimitive;
use serde::{Deserialize, Serialize};
use sqlx::{Pool, Postgres};

use crate::AppState;

#[derive(sqlx::FromRow, Serialize)]
struct Item {
    pub id: i32,
    pub description: String,
    /// Clerk identifier of Author
    pub user_id: String,
    pub user_name: String,
    pub price_usd: i32,
    pub rating: Option<i32>,
}
#[derive(Deserialize)]
struct ItemNew {
    pub description: String,
    pub price_usd: i32,
}

#[derive(sqlx::FromRow, Serialize)]
struct Judgement {
    pub id: i32,
    pub rating: i32,
    pub comment: String,
    /// Clerk identifier of Author
    pub user_id: String,
    pub user_name: String,
}
#[derive(Deserialize)]
struct JudgementNew {
    pub rating: String,
    pub comment: String,
}

#[derive(sqlx::FromRow, Serialize)]
struct ItemFull {
    pub id: i32,
    pub description: String,
    /// Clerk identifier of Author
    pub user_id: String,
    pub user_name: String,
    pub price_usd: i32,
    pub rating: Option<i32>,
    pub judgements: Vec<Judgement>,
}

#[post("/")]
async fn add_item(
    req: HttpRequest,
    params: web::Form<ItemNew>,
    state: web::Data<AppState>,
    pool: web::Data<Pool<Postgres>>,
) -> impl Responder {
    let srv_req = ServiceRequest::from_request(req);
    let jwt = match clerk_authorize(&srv_req, &state.client, true).await {
        Ok(value) => value.1,
        Err(e) => return e,
    };

    let Ok(user) = User::get_user(&state.client, &jwt.sub).await else {
        return HttpResponse::InternalServerError().json(serde_json::json!({
            "message": "Unable to retrieve user",
        }));
    };
    let Some(user_id) = user.id else {
        return HttpResponse::InternalServerError().json(serde_json::json!({
            "message": "Unable to retrieve user id.",
        }));
    };

    let Ok(rows) = sqlx::query!("INSERT INTO items(description, price_usd, user_id, user_name) VALUES ($1, $2, $3, $4) RETURNING id",
    &params.description,
    &params.price_usd,
    user_id,
    &user.last_name.unwrap().unwrap())
    .fetch_one(&**pool)
        .await
        .map_err(|e| {
            return HttpResponse::InternalServerError().json(serde_json::json!({
             "message": "Unable to create item.",
            }));
        }
    ) else {
        return HttpResponse::InternalServerError().json(serde_json::json!({
            "message": "Unable to create item.",
           }));
    };

    HttpResponse::Ok().json(rows.id)
}

#[get("/items")]
pub async fn get_items(pool: web::Data<Pool<Postgres>>) -> impl Responder {
    let Ok(all_items) = sqlx::query!(
        r#"SELECT items.id, description, items.user_id, price_usd, items.user_name, AVG(rating) as rating
        FROM items
        JOIN judgements on judgements.item_id = items.id group by items.id;"#)
    .fetch_all(&**pool)
    .await
    else {
        return HttpResponse::InternalServerError().json(serde_json::json!({
            "message": "Unable to retrieve all items",
        }));
    };
    let all_items = all_items
        .into_iter()
        .map(|record| Item {
            id: record.id,
            description: record.description,
            user_id: record.user_id,
            user_name: record.user_name,
            price_usd: record.price_usd,
            rating: record.rating.and_then(|r| r.to_i32()),
        })
        .collect::<Vec<Item>>();

    HttpResponse::Ok().json(all_items)
}

#[get("/items/{id}")]
pub async fn get_item_full(
    pool: web::Data<Pool<Postgres>>,
    id: web::Path<i32>,
    state: web::Data<AppState>,
    req: HttpRequest,
) -> impl Responder {
    let Ok(item) = sqlx::query!(
        r#"SELECT items.id, description, items.user_id, price_usd, items.user_name, AVG(rating) as rating
        FROM items
        JOIN judgements on judgements.item_id = items.id
        WHERE items.id = $1
        group by items.id;"#, *id)
    .fetch_one(&**pool)
    .await
    else {
        return HttpResponse::InternalServerError().json(serde_json::json!({
            "message": "Unable to retrieve all items",
        }));
    };
    let Ok(judgements) = sqlx::query_as!(
        Judgement,
        "SELECT id, comment, user_id, rating, user_name FROM judgements WHERE item_id = $1",
        (*id)
    )
    .fetch_all(&**pool)
    .await
    else {
        return HttpResponse::InternalServerError().json(serde_json::json!({
            "message": "Unable to retrieve all items",
        }));
    };
    let item_full = ItemFull {
        id: item.id,
        description: item.description,
        user_id: item.user_id,
        user_name: item.user_name,
        price_usd: item.price_usd,
        rating: item.rating.and_then(|r| r.to_i32()),
        judgements,
    };
    HttpResponse::Ok().json(item_full)
}
