# Popcorn Palace API

## Content:
- [Overview](#overview)
- [Quick Start](#quick-start)
- [Endpoints](#api-endpoints)
    - [Movies](#movies)
    - [Showtimes](#showtimes)
    - [Bookings](#bookings)
- [Testing](#testing)
- [Troubleshooting](#troubleshooting)
- [Future Enhancements](#future-enhancements)

---

## Overview
Popcorn Palace - Movie Ticket Booking System.
This repository implements a movie ticket booking system API, using TypeScript with NestJS, while also using PostgreSQL as the database.
In this project, I used plain SQL queries for the CRUD operations.

---

## Quick Start
To install and run this project, make sure to follow the following steps:

1. Clone the GitHub Repository:
    ```bash
    git clone https://github.com/AyoubSalameh/tdp-2025
    cd tdp-2025
    ```

2. Initialize Docker Container:
    ```bash
    docker compose up -d
    ```

3. Install Dependencies and Run The Project:
    ```bash
    npm i
    npm run start
    ```

The project is now up and running on port 3000 and it's accessible at `http://localhost:3000`.
You can test the API endpoints using Postman or using the cli.

### Stopping the Project:
In order to stop the project, press `ctrl c `.

Then, If you want to reset the data, run:
```bash
docker compose down
```

---

## API Endpoints
### Movies

#### Get All Movies
```http
GET /movies/all
```

Example Response:
```json
[
    {
        "id": 1,
        "title": "Interstellar",
        "genre": "Science fiction",
        "duration": 169,
        "rating": 8.7,
        "releaseYear": 2014
    }
]
```

Status Codes:
| Status Code | Description | Meaning |
| :--- | :--- | :--- |
| 200 | `OK` | Success |

---

#### Add a Movie
```http
POST /movies
```

Example Request:
```json
{
    "title": "Interstellar",
    "genre": "Science fiction",
    "duration": 169,
    "rating": 8.7,
    "releaseYear": 2014
}
```

Example Response:
```json
{
    "id": 1,
    "title": "Interstellar",
    "genre": "Science fiction",
    "duration": 169,
    "rating": 8.7,
    "releaseYear": 2014
}
```
Status Codes:
| Status Code | Description | Meaning |
| :--- | :--- | :--- |
| 200 | `OK` | Success |
| 400 | `BAD REQUEST` | Invalid Body Parameters |

---

#### Update a Movie
```http
POST /movies/update/{currentTitle}
```
Parameters: 
| Parameter | Type |
| :--- | :--- |
| Original Title | string |

Example Request:
```json
{
    "title": "Interstellar",
    "genre": "Science fiction",
    "duration": 169,
    "rating": 8.7,
    "releaseYear": 2014
}
```
Example Response:
```json
{
    "id": 1,
    "title": "Interstellar",
    "genre": "Science fiction",
    "duration": 169,
    "rating": 8.7,
    "releaseYear": 2014
}
```
Status Codes:
| Status Code | Description | Meaning |
| :--- | :--- | :--- |
| 200 | `OK` | Success |
| 400 | `BAD REQUEST` | Invalid Body Parameters |
| 404 | `NOT FOUND` | Movie with given title does not exist |

---

#### Delete a Movie
```http
DELETE /movies/{movieTitle}
```
Parameters: 
| Parameter | Type |
| :--- | :--- |
| Title | string |

Status Codes:
| Status Code | Description | Meaning |
| :--- | :--- | :--- |
| 200 | `OK` | Success |
| 404 | `NOT FOUND` | Movie with given title does not exist|

---

### Showtimes

#### Get All showtimes
```http
GET /showtimes/all
```

Example Response:
```json
[
    {
        "id": 1,
    "price": "20.20",
    "movieid": 4,
    "theater": "Sample Theater",
    "startTime": "2025-02-14T12:47:46.125Z",
    "endTime": "2025-02-14T15:47:46.125Z"
    },
    {
        ...
    }
]
```

Status Codes:
| Status Code | Description | Meaning |
| :--- | :--- | :--- |
| 200 | `OK` | Success |

---

#### Get Specific Showtime

```http
GET /showtimes/{showtimeId}
```

Parameters: 
| Parameter | Type |
| :--- | :--- |
| Showtime Id | number |

Example Response:
```json
{
    "id": 1,
    "price": "20.20",
    "movieid": 4,
    "theater": "Sample Theater",
    "startTime": "2025-02-14T12:47:46.125Z",
    "endTime": "2025-02-14T15:47:46.125Z"
}
```

Status Codes:
| Status Code | Description | Meaning |
| :--- | :--- | :--- |
| 200 | `OK` | Success |
| 404 | `NOT FOUND` | Showtime Not Found |

---

#### Add a Showtime

```https
POST /showtimes
```

Example Request:
```json
{
    "movieId": 4,
    "price":20.2,
    "theater": "Sample Theater",
    "startTime": "2025-02-14T12:47:46.125405Z",
    "endTime": "2025-02-14T15:47:46.125405Z"
}
```

Example Response:
```json
{
    "id": 2,
    "price": "20.20",
    "movieid": 4,
    "theater": "Sample Theater",
    "startTime": "2025-02-14T12:47:46.125Z",
    "endTime": "2025-02-14T15:47:46.125Z"
}
```

Status Codes:
| Status Code | Description | Meaning |
| :--- | :--- | :--- |
| 200 | `OK` | Success |
| 400 | `BAD REQUEST` | Invalid Parameters or Overlapping Showtimes |
| 404 | `NOT FOUND` | Movie Not Found |

---

#### Update a Showtime
```http
POST /showtimes/update/{showtimeId}
```

Parameters: 
| Parameter | Type |
| :--- | :--- |
| Showtime Id | number |

Example Request:
```json
{
    "movieId": 4,
    "price":50.2,
    "theater": "Sample Theater",
    "startTime": "2025-02-14T12:47:46.125405Z",
    "endTime": "2025-02-14T15:47:46.125405Z"
}
```
Status Codes:
| Status Code | Description | Meaning |
| :--- | :--- | :--- |
| 200 | `OK` | Success |
| 400 | `BAD REQUEST` | Invalid Parameters or Overlapping Showtimes |
| 404 | `NOT FOUND` | Showtime or Movie Not Found |

---

#### Delete a Showtime
```http
DELETE /showtimes/{showtimeId}
```

Parameters: 
| Parameter | Type |
| :--- | :--- |
| Showtime Id | number |

Status Codes:
| Status Code | Description | Meaning |
| :--- | :--- | :--- |
| 200 | `OK` | Success |
| 404 | `NOT FOUND` | Showtime Not Found |

 ---

 ### Bookings

 #### Book a Movie Ticket

 Example Request:
 ```json
 {
    "showtimeId": 1,
    "seatNumber": 10,
    "userId":"84438967-f68f-4fa0-b620-0f08217e76af"
}
```

Example Response:
```json
{
    "bookingId": "a0874413-a2dc-4444-829a-f067b084f765"
}
```

Status Codes:
| Status Code | Description | Meaning |
| :--- | :--- | :--- |
| 200 | `OK` | Success |
| 400 | `BAD REQUEST` | Invalid Parameters, or Seat Already Booked |
| 404 | `NOT FOUND` | Showtime Not Found |

---

### Note On Error Handling:
In addition to the status codes listed for each endpoint, the API may return a 500 Internal Server Error if an unexpected issue occurs on the server side.

---

## Testing
In order to test the project endpoints, I've included unit tests aswell as end-2-end (e2e) tests.

### Running unit tests:
```bash
npm run test
```

### Running e2e tests:

```bash
npm run test:e2e
```

Or you could run a single e2e test, for instance:
```bash
npm run test:e2e -- test/movies.e2e-spec.ts
```
---

## Troubleshooting

### 1. Database Connection Issues:
- Check if database container is running:
    ```bash
    docker ps
    ```
- Reset the database:
    ```bash
    docker compose down
    docker compose up -d
    ```
### 2. Port Already in Use:
- find the process that is using port 3000 and kill it:
    ```bash
    lsof -i :3000
    kill -9 <PID>
    ```

---

## Future Enhancements:

### 1. Adding Frontend:
- adding a frontend to the whole project, which can allow users to choose their seats visually, among other things
### 2. Reviews and Ratings:
- allow users to add their rating and reviews of movies they've watched



