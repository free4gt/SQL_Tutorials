# Setting up Databases

## Introduction

This course will cover Relational Database Management Systems (RDMS) and a language associated with them: SQL - Structured Query Language.  RDMS also known as SQL databases.  SQL databases store data in the form of tables.  Tables represent objects or concepts in the real world.  These are reflected as rows within the table.  All rows within a table have a set of attributes that define them.  This is represented by columns within the table.  A good example would be a table called Car that holds information about cars produced in a factory.  An example Car table below:

| Primary key | Model        | Color | Produced Date | Quantity |
|-------------|--------------|-------|---------------|----------|
| 1           | Corolla      | Blue  | 2025-01-15    | 3        |
| 2           | Camry        | Red   | 2025-02-20    | 5        |
| 3           | Prius        | Black | 2025-03-10    | 2        |
| 4           | RAV4         | White | 2025-04-05    | 4        |
| 5           | Tacoma       | Gray  | 2025-05-12    | 1        |

Each car has a unique identifier called a primary key.  It also has information about that car: Model and Color as well as a date and quantity produced.

Tables represent datasets.

## Relationships

Two tables can be related to each other.  Let's create a new table called "Car Model".  This new table contains information about different models such as Fuel Type, Engine Size and MPG (miles per gallon).  Both the Car and Car Model tables share a common field called Model.  We show the Car Model table below:

| Primary key | Model  | Fuel Type | Engine Size | MPG |
|-------------|--------|-----------|-------------|-----|
| 1           | Corolla| Gasoline  | 2.0L        | 34  |
| 2           | Camry  | Gasoline  | 2.5L        | 32  |
| 3           | Prius  | Hybrid    | 1.8L        | 58  |
| 4           | RAV4   | Hybrid    | 2.5L        | 40  |
| 5           | Tacoma | Gasoline  | 3.5L        | 20  |

We make a minor modification to our original Car table.  We replace the Car's Model column with their corresponding Car Model Primary key value.  So in the above Car Model table: Corolla maps to 1, Camry maps to 2 ... Tacoma maps to 5.  Check out our modified Car table below:

| Primary key | Model FK | Color | Produced Date | Quantity |
|-------------|----------|-------|---------------|----------|
| 1           | 1        | Blue  | 2025-01-15    | 3        |
| 2           | 2        | Red   | 2025-02-20    | 5        |
| 3           | 3        | Black | 2025-03-10    | 2        |
| 4           | 4        | White | 2025-04-05    | 4        |
| 5           | 5        | Gray  | 2025-05-12    | 1        |

This new field called a foreign key.  It links our first table: Car with our second table Car Model.  We can now pick a row in table Car, say the first row and use the Model FK to look up Model attributes in the Car Model table.  When we do this look-up, called a join, we get a result set similar to this:

| Primary key | Model   | Color | Produced Date | Fuel Type | Engine Size | MPG |
|-------------|---------|-------|---------------|-----------|-------------|-----|
| 1           | Corolla | Blue  | 2025-01-15    | Gasoline  | 2.0L        | 34  |

A perceptive student might ask why split it into two tables.  Why not keep everything in the Car table.  The answer has to do with redundancy.  Let's say the factory produces 3 blue Corrolla's in June, the extended Car table would look like this:

| Primary key | Model   | Color | Produced Date | Fuel Type | Engine Size | MPG | Quantity |
|-------------|---------|-------|---------------|-----------|-------------|-----|----------|
| 1           | Corolla | Blue  | 2025-01-15    | Gasoline  | 2.0L        | 34  | 3        |
| 2           | Camry   | Red   | 2025-02-20    | Gasoline  | 2.5L        | 32  | 5        |
| 3           | Prius   | Black | 2025-03-10    | Hybrid    | 1.8L        | 58  | 2        |
| 4           | RAV4    | White | 2025-04-05    | Hybrid    | 2.5L        | 40  | 4        |
| 5           | Tacoma  | Gray  | 2025-05-12    | Gasoline  | 3.5L        | 20  | 1        |
| 6           | Corolla | Blue  | 2025-06-01    | Gasoline  | 2.0L        | 34  | 3        |

Let's say we filter this dataset so it only shows us Corollas:

| Primary key | Model   | Color | Produced Date | Fuel Type | Engine Size | MPG | Quantity |
|-------------|---------|-------|---------------|-----------|-------------|-----|----------|
| 1           | Corolla | Blue  | 2025-01-15    | Gasoline  | 2.0L        | 34  | 3        |
| 6           | Corolla | Blue  | 2025-06-01    | Gasoline  | 2.0L        | 34  | 3        |

What you will notice is that: Model, Fuel Type, Engine Size, MPG and Quantity are redundant.  If we have two tables, we can store the same data as follows:

Table: Car

| Primary key | Model FK | Color | Produced Date | Quantity |
|-------------|----------|-------|---------------|----------|
| 1           | 1        | Blue  | 2025-01-15    | 3        |
| 2           | 2        | Red   | 2025-02-20    | 5        |
| 3           | 3        | Black | 2025-03-10    | 2        |
| 4           | 4        | White | 2025-04-05    | 4        |
| 5           | 5        | Gray  | 2025-05-12    | 1        |
| 6           | 1        | Blue  | 2025-06-01    | 3        |

Table: Car Model

| Primary key | Model  | Fuel Type | Engine Size | MPG |
|-------------|--------|-----------|-------------|-----|
| 1           | Corolla| Gasoline  | 2.0L        | 34  |
| 2           | Camry  | Gasoline  | 2.5L        | 32  |
| 3           | Prius  | Hybrid    | 1.8L        | 58  |
| 4           | RAV4   | Hybrid    | 2.5L        | 40  |
| 5           | Tacoma | Gasoline  | 3.5L        | 20  |

This new data:

| Primary key | Model FK | Color | Produced Date | Quantity |
|-------------|----------|-------|---------------|----------|
| 6           | 1        | Blue  | 2025-06-01    | 3        |

Is a lot less than this:

| Primary key | Model   | Color | Produced Date | Fuel Type | Engine Size | MPG | Quantity |
|-------------|---------|-------|---------------|-----------|-------------|-----|----------|
| 6           | Corolla | Blue  | 2025-06-01    | Gasoline  | 2.0L        | 34  | 3        |

For a dataset consisting of 6 cars with 5 models, the redundancy might seem like a small inefficiency.  You have to remember a few things.  The Car table might have millions if not billions of records.  Each redundancy has to be stored on a harddrive.  So that redundancy over millions of rows will be expensive.  Maybe gigabytes or terrabytes of harddrives.

That redundancy can also make the computer extremely slow.  Let's say an intern made a mistake and all Tacoma's were  supposed to be Hybrid instead of Gasoline.  If we store that information in a Car Model table, we only have to update 1 row.  The Tacoma row:

| Primary key | Model  | Fuel Type | Engine Size | MPG |
|-------------|--------|-----------|-------------|-----|
|...
| 5           | Tacoma | Hybrid    | 3.5L        | 20  |

If we store that in the table Car, then we have to update every single Tacoma in the table.  If we have 100,000 Tacoma rows, we have to update each and every one of them.  1 update for the non-redundant system vs 100,000 for the one storing redundant information.

Why this dicussion about tables?  The heart of a SQL database is data.  The vast majority of data in a SQL database is stored in tables.  Understanding tables and how you can act on them is kind of the point!

## SQL

Let's quickly summarize what we did in Relationships section.  We viewed data in tables, we filtered tables, we inserted data into them and we combined two tables.  All of these operations are part of the SQL - Structured Query Language.  We will explain in-depth in the following chapters how to use SQL to manipulate tables composed of rows and columns.  This is the heart of the course.  Before we get into SQL, I need to mention the big elephant in the room and explain on a higher-level what a database actually is.

## SQL Vendors

The SQL Database is a concept.  Concepts are nice on paper, but unless someone implements them they are just an idea.  Over time, many groups of people and companies have come together to produce their own SQL databases.  I list 6 common ones below and they are by no means the only ones:

Open Source aka Free Databases:

1. PostgreSQL
2. MySQL
3. SQLite

Closed Source aka you pay a license to operate (with possible freemium models)

4. Oracle
5. Microsoft SQL Server
6. IBM Db2

The above 6 groups are typically completely different groups of people.  They have their own project management team.  A group of software engineers working on them.  Some are free to download.  Some require a payment.  typically a yearly license.

Each group of people implements their database in a different way.  That means the way the database operates differently under the covers.  These databases also don't support different versions of SQL.  They all support a basic subset of operations.  We can view this as Basic SQL also called ANSI SQL.  Once you get into more advanced topics, they rapidly diverge.  That's fine.  The point of this course is to give you enough basics so that you can research vendor specific differences on your own, while still having fundamental literacy in what is common between implementations.

## SQL Database - What is it?  High-level.

