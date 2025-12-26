# Understanding Tables

## Introduction

The heart of a SQL Database is managing datasets.  These datasets can represent a very broad range of topics.  Some examples below:

Objects:
* Cars manufactured in a factory.  A good example being a white Honda Civic.
* Factories that produce cars.  The factory producing the above Civic.
* Users of a web application.  Your email user name and password.
* Products sold on an e-commerce webiste.  Think about Adidas selling different types of shoes.

Concepts:
* Car models.  Honda Civic represents a car design.  It doesn't represent each instance of a car.
* Product Type.  Shoes as a category represent a large group of different types of shoes.
* Role.  A user's permissions might be based on their role as a manager, developer, analyst or client etc.

Processes:
* Delivering a package: package arrives at a warehouse, is on route to destination and arrives at destination.
* Contract fulfillment: contract signed, contract partially fullfilled and contract fulfilled.
* Onboarding an employee: Get them on payroll, get them access to the office, give them a laptop. 

What do these things have in common.  One is you can assign a fixed set of traits to them.  You can enumerate them.  For example:

```
Car 1
Make: Honda
Model: Civic
Color: White
MPG: 24
Engine Size: 2.0L
```

```
Car 2:
Make: Honda
Model: Civic
Color: Grey
MPG: 24
Engine Size: 2.0L
```

Both cars have the same traits.  Each car represents one type of car.  In SQL databases, we represent a dataset with the concept of a table.  The fixed traits are represented by columns and each car is represented by a row.  Below, we have a table without data.  You can see the columns as fixed traits:

| Car ID | Make  | Model | Color | Engine Size | MPG |
|:-------|:------|:------|:------|:------------|:----|

Now, we can one-by-one insert the data for the two Honda Civics into the above table to get our completed dataset.  You see each Honda Civic is represented by a single row.

| Car ID | Make  | Model | Color | Engine Size | MPG |
|:-------|:------|:------|:------|:------------|:----|
| 1      | Honda | Civic | White | 2.0L        | 24  |
| 2      | Honda | Civic | Grey  | 2.0L        | 24  |

You'll notice the Car ID column.  This is called a primary key.  Usually, primary keys are monotonically increasing unique set of numbers where each number has a one-to-one correspondance with each row.  This allows us to uniquely distinquish between two cars that contain the exact same information.  Let's say for example, that in the above case both Honda Civics are white.  The Car ID would be the only unique attribute between the two rows.

## Other Datasets

Let's look at a few more tables representing other datasets:

Factory table:

| Factory ID | Name              | Location     | Construction Date | Capacity (units/day) |
|------------|-------------------|--------------|-------------------|----------------------|
| 1          | Apex Auto Plant   | Boston, MA   | 2018-05-15        | 500                  |
| 2          | Turbo Motors      | Austin, TX   | 2020-03-10        | 750                  |
| 3          | Steelworks Garage | Detroit, MI  | 2015-11-22        | 300                  |

Here we see Capacity as being very telling.  Boston + Detroit factories barely beat out the Austin one.

Product Category Table

| Category ID | Category Name | Description              | Parent Category |
|-------------|---------------|--------------------------|-----------------|
| 1           | Electronics   | Gadgets and devices      | Root            |
| 2           | Clothing      | Apparel and accessories  | Root            |
| 3           | Footwear      | Shoes and boots          | Clothing        |

Parent category creates a hierarchy in this dataset.  Electronics is it's own category.  Clothing has a sub-categroy Footwear.

Package Delivery Table

| ID | Status | Warehouse | Transit | Destination | Last Active |
|----|--------|-----------|---------|-------------|-------------|
| 1  | Delivered | 2025-12-25 09:00 | 2025-12-25 14:30 | 2025-12-25 18:45 | 2025-12-25 18:45 |
| 2  | Delivered | 2025-12-25 08:30 | 2025-12-25 13:15 | 2025-12-25 17:20 | 2025-12-25 17:20 |
| 3  | In Transit | 2025-12-25 10:15 | 2025-12-25 15:45 | null | 2025-12-25 15:45 |

This table shows different events for a package delivery.  Status represents the last status.  Each date represents the date when an event happened.  null represents an event that hasn't happened yet.  It means non-existent value.

## Domain Knowledge

Most SQL Databases contain many tables focused on a specific topic.  For example, car manufacturer might have tables for:

* car production schedules
* car parts
* manufacturing equipment
* factories
* cars produced
* car deliveries
* car models

Typically, SQL databases can have dozen to hundreds of tables.  Each designed to track some aspect of the business.  When many tables cluster around a topic like car manufacturing we call that topic a domain.  Domain knowledge typically involves knowledge of the data in the tables, how the tables relate and external processes that rely on that data.  An external process might a web app where people submit the daily number of cars produced or punch in values when a car is delivered to a dealer.  

When working with databases, it is often worth learning about different tables by looking at the data.  It's also worth trying to understand how different tables are related.   How that data gets used in real life.  How people interact with that data often in the form of software or web applications.  Knowledge is power.

## Relationships

Let's look at our original Car table, but add 3 new cars:

Car Table:

| Car ID | Make   | Model   | Color | Engine Size | MPG |
|:-------|:-------|:--------|:------|:------------|:----|
| 1      | Honda  | Civic   | White | 2.0L        | 24  |
| 2      | Honda  | Civic   | Grey  | 2.0L        | 24  |
| 3      | Toyota | Corolla | Blue  | 1.8L        | 32  |
| 4      | Toyota | Corolla | Red   | 1.8L        | 33  |
| 5      | Ford   | Mustang | Black | 5.0L        | 18  |

We note that their are two Civics, two Corollas and one Mustang.  

One thing we should notice is that two of the attributes: Engine Size and MPG are dependent on the Model column.  If we, for example, add two new Civics, we would end up repeating values for Engine Size => 2.0L and MPG => 24.  This creates a lot of redundant data.  We could instead produce two tables:

Car Table:

| Car ID | Model ID | Color |
|:-------|:--------|:------|
| 1      | 1       | White |
| 2      | 1       | Grey  |
| 3      | 2       | Blue  |
| 4      | 2       | Red   |
| 5      | 3       | Black |

Car Model Table

| Model ID | Make   | Model   | Engine Size | MPG |
|:--------|:-------|:--------|:------------|:----|
| 1       | Honda  | Civic   | 2.0L        | 24  |
| 2       | Toyota | Corolla | 1.8L        | 32  |
| 3       | Ford   | Mustang | 5.0L        | 18  |

The Car and Car Model table both share a new Model ID column.  In the Car Model table the Model ID is a primary key and is unique per row.  Primary key is the row's identity.  In the Car Table Model ID is a reference to the Car Model Table.  A key that references another table is called a foreign key.  This can have duplicates since two cars can have the same car model aka both are Civics.

The foreign key can be used to re-create the previous Car table.  We just choose the new Car Table, go down the Model ID column selecting each value and matching it with the corresponding Model ID in the Car Model Table.  When we have a match, we copy over all the attributes in that row.  The result can be seen below:

| Car ID | Color | Model ID | Model ID | Make   | Model   | Engine Size | MPG |
|:-------|:------|:----------|:----------|:-------|:--------|:------------|:----|
| 1      | White | 1         | 1         | Honda  | Civic   | 2.0L        | 24  |
| 2      | Grey  | 1         | 1         | Honda  | Civic   | 2.0L        | 24  |
| 3      | Blue  | 2         | 2         | Toyota | Corolla | 1.8L        | 32  |
| 4      | Red   | 2         | 2         | Toyota | Corolla | 1.8L        | 32  |
| 5      | Black | 3         | 3         | Ford   | Mustang | 5.0L        | 18  |

Note the two Model ID columns are matching and bringing in the fields from the Car Model Table on the right.  After removing our Model ID from the table, we get the original table:

| Car ID | Color | Make   | Model   | Engine Size | MPG |
|:-------|:------|:-------|:--------|:------------|:----|
| 1      | White | Honda  | Civic   | 2.0L        | 24  |
| 2      | Grey  | Honda  | Civic   | 2.0L        | 24  |
| 3      | Blue  | Toyota | Corolla | 1.8L        | 32  |
| 4      | Red   | Toyota | Corolla | 1.8L        | 32  |
| 5      | Black | Ford   | Mustang | 5.0L        | 18  |

The ability to store data separately and combine them when needed is an excellent trait of SQL Databases.  This operation is called a join.  Two matching columns are joined on.  Note, we will get deeper into joins in the joins section.

One might ask, why does this matter?  The answer is data storage.  Each Car Model has 4 attributes: Make, Model, Engine Size and MPG.  A foreign key has only 1 attribute: Model ID.  The Model ID is a number, which is much cheaper to store than text values: Make, Model and Engine Size.  This doesn't make much of a difference when you only have 5 cars.  When you have a few million cars the extra redundant data starts to add up.  You might have to upgrade your data storage space.

It's also very inefficient.  Let's say I discover my Civic actually has 26 MPG instead of 24 MPG.  If all data is in a single table, I have to find every single Civic in the table and update the MPG value from 24 to 26.  If I split the table into Car and Car Model, then I only have to update one value in the Car Model Table.  The Car Model table will only have one unique row associated with Civics.

## Next Section

In the next section, we will take on the role of a software engineer.  We will explore how the software engineer through a web app manipulates different SQL tables.  No knowledge of software engineering is required.  There won't be any code.  Instead we study their interaction with the system.  We will do so by using a methodology called: CRUD. CRUD stands for:

* C => Create
* R => Read
* U => Update
* D => Delete

CRUD itself is not a SQL Database concept. In practice, the CRUD web applications modify SQL databases and can be instructive in how data is created in an automated fashion.  During that lesson, we will also cover batch or bulk processing.  Both topics will be explained in detail.