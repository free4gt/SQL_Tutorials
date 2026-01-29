docker pull free4life/free-sql:latest
docker run -d --name free-sql -p 5431:5432 -e POSTGRES_PASSWORD=postgres free4life/free-sql:latest