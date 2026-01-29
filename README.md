# SQL and SQL Database (RDBMS) Tutorial

## Introduction

This course will cover SQL - Structured Query Language.  SQL is a computer language that allows you to interact with databases.  Not all databases use SQL.  It's easily the most common by a wide margin.  It's probably used by at least 95% of companies (if not more).

For this tutorial, we will focus on Relational Database Management Systems (RDBMS).  I would say almost all RDBMS use SQL.  I can't think of one that doesn't.  For this reason, RDBMS are often referred to as SQL databases.  We will use this shorthand during this course (RDBMS are not the only SQL Databases, but they are easily the most common).  I might cover other databases or technologies when discussing data analysis.

## Folders 

The folders are lessons, practice and postgres_build.  Lessons is lectures I'm working on.  I might have two sets: my version and a more basic version (we will see).  practice is a folder that will have practice problems in it.  These will either be sets to practice on or case studies.  postgres_build is made for administrators.  It's a very basic set of scripts used by the content creators to create a template database you can download online.  This database comes pre-fabricated with data.  It uses docker to start.  This will be explained later on.

## Course Overview

This course is taught by going through real world processes and showing how SQL and SQL Databases fit into that process.  The content covered is listed below:

| Step             | Description                                                                     |
|------------------|---------------------------------------------------------------------------------|
| Set-up           | We install a SQL Database                                                       |
| Tables           | We discuss how data is represented in a SQL database                            |
| Data Generation  | We discuss data creation and generate a dataset                                 |
| Modifying Data   | We discuss modifying data and deleting data                                     |
| Analyzing Data   | We discuss viewing and analyzing data                                           |

## Data Cycle

This course will show how people interact with SQL Databases.  It will also show how data can flow between two SQL Databases.  We do this in a minimalistic way by exclusively providing SQL.  SQL and SQL Databases are often embedded in other processes that are not SQL or SQL database centered.  We will provide limited context on these processes, while emphasizing SQL and SQL Databases role within the greater system.  We hope the additional context will be helpful.

## Computers and Software

During the set-up chapter, I will have two sections.  The first section will explain how to install a SQL Database.  The second section will give a 40,000 foot view of what a database is.  The later section can be viewed more as a reference.  I provide it, because I find it valuable.  My philosophy is to not hide things.  If this section feels confusing or jargon heavy, feel free to skip it.  It has no baring on the rest of the course.