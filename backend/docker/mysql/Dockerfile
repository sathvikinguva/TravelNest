FROM mysql:8.0

ENV MYSQL_DATABASE=travel_booking \
    MYSQL_USER=travel_user \
    MYSQL_PASSWORD=travel_pass \
    MYSQL_ROOT_PASSWORD=root_pass

COPY init/01-init.sql /docker-entrypoint-initdb.d/

EXPOSE 3306

HEALTHCHECK --interval=10s --timeout=5s --retries=10 --start-period=30s \
  CMD mysqladmin ping -h localhost -uroot -p$MYSQL_ROOT_PASSWORD || exit 1
