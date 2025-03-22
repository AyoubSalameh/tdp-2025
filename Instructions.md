# Popcorn Palace API

## Content:
- [Endpoints](#api-endpoints)
    - [Movies](#movies)
    - [Showtimes](#showtimes)
    - [Bookings](#bookings)

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
    "starttime": "2025-02-14T12:47:46.125Z",
    "endtime": "2025-02-14T15:47:46.125Z"
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
| Showtime Id | string |

Example Response:
```json
{
    "id": 1,
    "price": "20.20",
    "movieid": 4,
    "theater": "Sample Theater",
    "starttime": "2025-02-14T12:47:46.125Z",
    "endtime": "2025-02-14T15:47:46.125Z"
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
    "starttime": "2025-02-14T12:47:46.125Z",
    "endtime": "2025-02-14T15:47:46.125Z"
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
| Showtime Id | string |

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
| Showtime Id | string |

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
    "showtimeId": 2,
    "seatNumber": 11,
    "userId":"84438967-f68f-4fa0-b620-0f08217e76af"
}
```

Status Codes:
| Status Code | Description | Meaning |
| :--- | :--- | :--- |
| 200 | `OK` | Success |
| 400 | `BAD REQUEST` | Invalid Parameters, or Seat Already Booked |
| 404 | `NOT FOUND` | Showtime Not Found |


