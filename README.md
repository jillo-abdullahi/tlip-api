# Supply Chain API

This is a REST API for managing supply chain items and their events using Express.js and PostgreSQL.

### API Documentation
Find the documentations for the API on this link:
https://tlip-api.onrender.com/api-docs/#/

## Prerequisites

- Node.js (version 14 or higher)
- PostgreSQL (version 10 or higher)

## Setup

1. Clone this repository:

```bash
git https://github.com/jillo-abdullahi/tlip-api.git
cd tlip-api
```

2. Install dependencies:

```bash
npm install
```

3. Create a `.env` file in the root directory of the project and set the required environment variables for the database connection:

```plaintext
DATABASE_URL=postgres://<DB_USER>:<DB_PASSWORD@localhost:5432/<DB_NAME>
```

Replace `DB_USER`, `DB_PASSWORD`, and `DB_NAME` with your actual PostgreSQL credentials and database name. If your database doesn't require a password, you can leave the `DB_PASSWORD` field empty or remove it from the `.env` file.

4. Run the migrations to set up the database schema:

```bash
npm run migrate up
```

## Running the API locally

To run the API locally, use the following command:

```bash
npm start
```

This command will start the Express server on port 3000 (or the port specified by the `PORT` environment variable). 

Alternatively, simply set up the API using Docker

To build the docker image run
```bash
docker-compose build
```

To start the docker containers run:
```bash
docker-compose up
```

The API can now be accessed at `http://localhost:3000`.

## API Endpoints

The API provides the following main endpoints:

- `POST /items`: Create a new supply chain item
- `PUT /items/:id`: Update a supply chain item's reference data (color, price, etc.)
- `POST /items/:id/events`: Add a new event associated with an item (location, custodian, etc.)
- `GET /items/:id/events`: Query all events of an item
- `GET /items/:id/events/last`: Get the last event of an item (shortcut to know the current location/custodian of the item)

View the api documentation for all endpoints here:
https://tlip-api.onrender.com/api-docs/#/

## Testing

You can test the API using tools like [Postman](https://www.postman.com/) or [curl](https://curl.se/) by making requests to the available endpoints. For example, to create a new supply chain item, send a POST request to `http://localhost:3000/items` with a JSON payload containing the item's name, color, and price etc.

## License

This project is licensed under the MIT License.
