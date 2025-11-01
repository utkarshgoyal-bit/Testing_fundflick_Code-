# Prisma CLI Commands for PostgreSQL

Below are common Prisma CLI commands used when working with a PostgreSQL database.

## 1. Initialize Prisma

```bash
npx prisma init
```

Creates a new `prisma` folder with a sample `schema.prisma` file.

## 2. Introspect Existing Database

```bash
npx prisma db pull
```

Pulls the current database schema from PostgreSQL and updates `schema.prisma`.

## 3. Generate Prisma Client

```bash
npx prisma generate
```

Generates the Prisma Client based on your `schema.prisma`.

## 4. Migrate Database

- **Create a new migration:**

  ```bash
  npx prisma migrate dev --name <migration_name>
  ```

  Creates and applies a new migration to your PostgreSQL database.

- **Deploy migrations (for production):**

  ```bash
  npx prisma migrate deploy
  ```

  Applies all pending migrations to the database.

- **Reset database and apply migrations:**
  ```bash
  npx prisma migrate reset
  ```
  Resets the database and reapplies all migrations.

## 5. Seed Database

```bash
npx prisma db seed
```

Runs the seed script defined in your `package.json` or `prisma/seed.ts`.

## 6. Studio (GUI for Database)

```bash
npx prisma studio
```

Opens Prisma Studio, a visual editor for your database.

## 7. Check Database Connection

```bash
npx prisma db push
```

Pushes the current schema state to the database without creating a migration.

---

For more details, see the [Prisma CLI documentation](https://www.prisma.io/docs/reference/api-reference/command-reference).
