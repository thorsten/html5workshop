create table customer(
name varchar(255),
firstname varchar(255),
surname varchar(255),
street varchar(255),
place varchar(255),
country varchar(255)
);

create table orders(
customer_id int,
article_id int,
amount int
);

create table article(
name varchar(255),
price int,
description text
);
