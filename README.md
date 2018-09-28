## Introduction to  Books DB🔎
Node Express App is in github.com/wesiang/booksDBsvc
Angular front end is in github.com/wesiang/bookclient


Node Express App - booksDBSvc
Completed ability to search by authorname(regardless first or last) and book title.  Returned results in alphabetical titles.
Ability to specify number of results displayed through query limit.

to test, use Advanced Restful Client

http://localhost:3000/books?title=%e%&author=%a%&limit=3

where 
"e" is provides the search condition for book title
"a" provides the condition for the author_firstname or authorlastname
3 is the limit count


For second requirement, completed returning of specific book detail 

http://localhost:3000/books/99

where 99 is the book ID and book details will be returned in json


For Front End, Angular client uses finditem and listitem components to accomplish the search and display of results

Form gives ability to specify 

3 fields - title, authorname and display limit dropdown


