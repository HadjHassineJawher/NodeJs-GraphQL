const graphql = require('graphql');
const _ = require('loadsh');
const { GraphQLObjectType, GraphQLString, GraphQLSchema, GraphQLID, GraphQLInt, GraphQLList, GraphQLNonNull } = graphql;
const Author = require('../Models/author');
const Book = require('../Models/book');

/*
// dummy data
var books = [
    { name: "name 1", genre: "genre 1", id: '1', authorid: '1' },
    { name: "name 2", genre: "genre 2", id: '2', authorid: '2' },
    { name: "name 3", genre: "genre 3", id: '3', authorid: '3' },
    { name: "name 4", genre: "genre 4", id: '4', authorid: '2' },
    { name: "name 5", genre: "genre 5", id: '5', authorid: '1' },
    { name: "name 6", genre: "genre 6", id: '6', authorid: '3' },
    { name: "name 7", genre: "genre 7", id: '7', authorid: '1' },
];

var authors = [
    { name: "Jawher 1", age: 18, id: '1' },
    { name: "Jawher 2", age: 19, id: '2' },
    { name: "Jawher 3", age: 20, id: '3' },
];
*/

const BookType = new GraphQLObjectType({
    name: 'Book',
    fields: () => ({
        id: { type: GraphQLID },
        name: { type: GraphQLString },
        genre: { type: GraphQLString },
        author: {
            type: AuthorType,
            resolve(parent, args) {
                console.log(parent);
                //return _.find(authors, { id: parent.authorid });
                return Author.findById(parent.authorid);
            }
        }
    })
});

const AuthorType = new GraphQLObjectType({
    name: 'Author',
    fields: () => ({
        id: { type: GraphQLID },
        name: { type: GraphQLString },
        age: { type: GraphQLInt },
        books: {
            type: new GraphQLList(BookType),
            resolve(parent, args) {
                //return _.filter(books, { authorid: parent.id })
                return Book.find({ authorid: parent.id });
            }
        }
    })
});

const RootQuery = new GraphQLObjectType({
    name: 'RootQueryType',
    fields: {
        book: {
            type: BookType,
            args: { id: { type: GraphQLID } },
            resolve(parent, args) {
                //return _.find(books, { id: args.id });
                return Book.findById(args.id);
            }
        },
        author: {
            type: AuthorType,
            args: { id: { type: GraphQLID } },
            resolve(parent, args) {
                //console.log(typeof (args.id));
                //return _.find(authors, { id: args.id });
                return Author.findById(args.id);
            }
        },
        books: {
            type: new GraphQLList(BookType),
            resolve(parent, args) {
                //return books;
                return Book.find({});
            }
        },
        authors: {
            type: new GraphQLList(AuthorType),
            resolve(parent, args) {
                //return authors;
                return Author.find({});
            }
        }
    }
});

const Mutation = new GraphQLObjectType({
    name: 'Mutation',
    fields: {
        addAuthor: {
            type: AuthorType,
            args: {
                name: { type: new GraphQLNonNull(GraphQLString) },
                age: { type: new GraphQLNonNull(GraphQLInt) }
            },
            resolve(parent, args) {
                let author = new Author({
                    name: args.name,
                    age: args.age
                });
                return author.save();
            }
        },
        addBook: {
            type: BookType,
            args: {
                name: { type: new GraphQLNonNull(GraphQLString) },
                genre: { type: new GraphQLNonNull(GraphQLString) },
                authorid: { type: new GraphQLNonNull(GraphQLString) }
            },
            resolve(parent, args) {
                let book = new Book({
                    name: args.name,
                    genre: args.genre,
                    authorid: args.authorid
                });
                return book.save();
            }
        }, updateBook: {
            type: BookType,
            args: {
                id: { type: new GraphQLNonNull(GraphQLString) },
                name: { type: new GraphQLNonNull(GraphQLString) },
                genre: { type: new GraphQLNonNull(GraphQLString) },
                authorid: { type: new GraphQLNonNull(GraphQLString) },
            },
            resolve(parent, args) {
                return Book.findByIdAndUpdate(
                    { "_id": args.id },
                    { "$set": { name: args.name, genre: args.genre, authorid: args.authorid } },
                    { "new": true }
                );
            }
        },
        updateAuthor: {
            type: AuthorType,
            args: {
                id: { type: new GraphQLNonNull(GraphQLString) },
                name: { type: new GraphQLNonNull(GraphQLString) },
                age: { type: new GraphQLNonNull(GraphQLID) },
            },
            resolve(parent, args) {
                return Author.findByIdAndUpdate(
                    { "_id": args.id },
                    { "$set": { name: args.name, age: args.age } },
                    { "new": true }
                );
            }
        }
    }
});

module.exports = new GraphQLSchema({
    query: RootQuery,
    mutation: Mutation
});