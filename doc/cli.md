
# Генерация анализа БД

java -jar ~/scripts/db-tools/schemaspy-6.1.0.jar -dp ~/scripts/db-tools/postgresql-42.3.3.jar -t pgsql -host 0.0.0.0 -port 5432 -db nojest -o ~/Documents/schemaspy -u root -p root -imageformat svg
