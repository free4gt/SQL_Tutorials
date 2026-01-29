# Use official PostgreSQL 17.7 image as base (multi-platform: linux/amd64, arm64)
FROM postgres:17.7

# Copy entire database_setup folder structure to container root
COPY database_setup/ /database_setup/

# Copy init script to Postgres auto-run directory
COPY database_setup/init/ /docker-entrypoint-initdb.d/

# Switch to postgres user for safer operations
USER postgres

# Expose the PostgreSQL port
EXPOSE 5432

# Default command (overridable via docker run -e POSTGRES_PASSWORD=...)
CMD ["postgres"]