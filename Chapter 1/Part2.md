# How data gets generated 

## Introduction

In the previous section, we dicussed Tables.  Tables are just datasets.  Tables can have relationships between each other through the concept of Foreign keys.  In the next four sections, we discuss a concept called CRUD.  It stands for: Create, Read, Update and Delete.  CRUD is a reference to external applications that manipulate SQL Databases.  Specifically, they manipulate or read data off of the tables we mentioned in the previous section.

This section will specifically deal with the C in CRUD, which is how to create data.  Most CRUD operations insert a few rows of data into a table at a time.  An alternative method for inserting data into a table is called bulk insert or batch processing.  This is a procedure used when loading large external datasets into a table.

We will explain CRUD first.  Then bulk inserts later.  Before we understand CRUD, we need a high-level understanding of web applications.

## Table Schemas
```
         +---------------------------------------------+
         |                   Network                   |
         +---------------------------------------------+
                            |
                            |     Connect to database
                            v
                 +----------------------------------+
                 |       SQL Database               |
                 +----------------------------------+
```
Most SQL Databases behave in the above manner.  The database listens for inbound network connections (most do...).  Once it receives an inbound network connection, it authenticates it (more on this later) and then proceeds to process sent commands.  Almost all commands sent to a SQL Database are in the form of SQL.  Most SQL commands will involve creating, reading, updating or deleting values in a table.  Databases start without any tables.  So we have to create them.

In our example, we will create 3 tables for our car manufacturing example.  The table name, it's column names and data type are listed below.  This information is called table schema.  It represents data about the SQL database objects itself.  When you describe properties of a database or database objects it's called metadata: 

```
Table: Factory
| Column Name   | Data Type | Description |
|:---------------|:----------|:-------------|
| factory_id     | integer   | Primary key. Unique factory identifier. |
| factory_name   | text      | Name of the manufacturing plant. |
| location       | text      | City or region where factory is located. |

---

Table: CarModel
| Column Name   | Data Type | Description |
|:---------------|:----------|:-------------|
| model_id       | integer   | Primary key. Unique model identifier. |
| make           | text      | Manufacturer name (e.g., Toyota). |
| model          | text      | Car model name (e.g., Prius, RAV4). |
| engine_size    | text      | Engine specification (e.g., 2.5L, 1.8L Hybrid). |
| mpg            | integer   | Miles per gallon fuel efficiency. |

---

Table: Car
| Column Name    | Data Type | Description |
|:----------------|:----------|:-------------|
| car_id          | integer   | Primary key. Unique car record identifier. |
| model_id        | integer   | Foreign key referencing `CarModel(model_id)`. |
| factory_id      | integer   | Foreign key referencing `Factory(factory_id)`. |
| color           | text      | Car’s exterior color. |
| production_date | date      | Manufacturing date. |
| quantity        | integer   | Number of cars produced in this record. |
```

You will notice that we include Data Type in our table schema.  When databases create tables they assign a data type to each column.  This allows the database to allocate only enough space to store that specific data type.  Some data types require little storage.  Integers typically represented as whole numbers require little data storage.  Dates and text data types require a lot of data storage.  Computers are only allocated so much space to store the data.  So minimizing data storage is important.

One other important note, there are two relationships present between these 3 tables.  Factories produce cars.  Cars are associated with one Car Model type.  This is reflected by foreign keys in the Car table.

When we first create these tables, there is no data in them.  We can look at the attributes associated with future instances of each type.  You can see that below:

```
Table: Factory  
| factory_id | factory_name | location |
|:------------|:-------------|:----------|


Table: CarModel  
| model_id | make | model | engine_size | mpg |
|:----------|:------|:-------|:-------------|:----|


Table: Car  
| car_id | model_id | factory_id | color | production_date | quantity |
|:--------|:----------|:------------|:--------|:----------------|:----------|
```
## How data is generated?

SQL Databases require you to define how data looks like before you can create it.  That is why we designed 3 table schemas and then created it.  Once the table schema exists, we know what data has to be provided to create rows.  This next section will discuss how a user that fills out a form online submits it to a web app and that web app then inserts it into one of our 3 tables.  Let's look at a high-level diagram:

```

                 +--------------------------+
                 |     Your Web Browser     |
                 |        User Form         |
                 +--------------------------+
                            |
                            |  Internet connection
                            v
         +---------------------------------------------+
         |                   Web App                   |
         |        Accepts user form inputs             |
         +---------------------------------------------+
                            |
                            |  Connect to database
                            v
                 +----------------------------+
                 |       SQL Database         |
                 |  Inserts data into tables  |
                 +----------------------------+
```

We covered in the last section that SQL Database listens to inbound network traffic.  Where does that inbound traffic come from.  Often it comes from a web application.  The web application will use an internal network to reach the database safely and send commands to insert data into specific tables.  Where does the web app get it's data.  It sends a user form to a web browser like chrome where a human fills it out and submits it.  The full process is as follows:

1. web app sends a user form to a human using chrome.
2. human user fills the form and submits it.
3. chrome sends the user form data back to the web app.
4. web app validates the user form data.  On success, it connects to the database.
5. web app sends the data and asks the database to insert it into a table.
6. database succeeds to insert the data into a table.  A new row appears.  It signals the web app it succeeded.
7. The web app tells chrome it succeeded.  Chrome tells the human user of the form.

The important part.  A human form submission leads to a new row in the database.  

Why is the web app even necessary?  First it creates the user form.  Second, it can automatically handle many database update requests simultaneously.  Third, it blocks direct internet access to the database.  Data is valuable and you don't want anyone to have access to it.

The practical implication is that hundreds or thousands of users might be submitting forms.  The database might be inserting hundreds or thousands of requests per minute.  Often these requests might be coming from multiple users.  It is easy to see how these single form submissions could quickly lead to a lot of data.  For example, if every day factories produce 1000 cars and there are 10 of them.  Then you have 10,000 new car rows in our Car table.  Over a year, that data would become 365,000.  1000 interactions a day would be considered a small database.  SQL databases can easily manage millions and even billions of records a year (with proper set-up).

## An example of a Car Model Submission
```
───────────────────────────────
### 🚗 Car Model Entry Form
Use this form to add a new car model record.
───────────────────────────────

| Field            | Input Example     |
|:-----------------|:------------------|
| **Make**         | [ Toyota         ] |
| **Model**        | [ Prius          ] |
| **Engine Size**  | [ 1.8L Hybrid    ] |
| **MPG**          | [ 52             ] |

**[ Submit Form ]**
```

An example user form is in markdown language above (I'll add image in future).  The user has filled out the forms with the following data: 

* Make : Toyota
* Model: Prius 
* Engine Size: 1.8L Hypbrid
* MPG: 52

The table this data targets is as follows:

```
Table: CarModel  
| model_id | make | model | engine_size | mpg |
|:----------|:------|:-------|:-------------|:----|
```

After the web app processes the form and updates the database, we have the following result:

```
Table: CarModel  
| model_id | make   | model | engine_size  | mpg |
|:----------|:-------|:------|:--------------|:----|
| 1         | Toyota | Prius | 1.8L Hybrid  | 52  |
```

One note, the user form did not provide a Model ID.  Instead, the database keeps track of the latest value, increments it by one and then automatically inserts it for us.  A database typically starts this increment counter at 0.  When the first car gets inserted, the increment counter goes from 0 to 1 and uses the value of 1.  If a second car row is created it will increment from 1 to 2 and use 2 as the new value for model_id.

## Foreign key dependences.

You'll notice that the Car table has two foreign keys.  One of the foreign keys points to the Factory table and one points to the Car Model table.  Typically, we would want to first make sure the proper Factory and Car Model exists before creating the car.  This is validated either by the web app: "you haven't selected a factory" or "you haven't selected a car model".  Alternatively, it can be validated by the database who can check for the existence of foreign keys.

One important thing to note is that a web app might process a form and update many tables at once.  For example, a user form for a Car might have a drop down for Car Model embedded in it.  Some dropdowns might allow you to create new Car Models.  In that case, a single user form might result in the web request updating both the Car and the Car Model tables.  Often in this case, it will first update the Car Model table and then the Car table due to the foreign key dependency.

## Pre-populating Tables from a file


