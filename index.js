const express = require("express");
const { graphqlHTTP } = require("express-graphql");
const {
  GraphQLSchema,
  GraphQLObjectType,
  GraphQLString,
  GraphQLList,
  GraphQLInt,
  GraphQLNonNull,
} = require("graphql");
const app = express();

const PORT = process.env.PORT || 5000;

const { authors, books } = require("./data/data");

const AuthorType = new GraphQLObjectType({
  name: "Auther",
  description: "This represents authors",
  fields: () => ({
    id: { type: GraphQLNonNull(GraphQLInt) },
    name: { type: GraphQLNonNull(GraphQLString) },
    books: {
      type: new GraphQLList(BookType),
      resolve: (author) => {
        return books.filter((book) => book.authorId === author.id);
      },
    },
  }),
});

const BookType = new GraphQLObjectType({
  name: "Book",
  description: "This represents a book written by an author",
  fields: () => ({
    id: { type: GraphQLNonNull(GraphQLInt) },
    name: { type: GraphQLNonNull(GraphQLString) },
    authorId: { type: GraphQLNonNull(GraphQLInt) },
    author: {
      type: AuthorType,
      resolve: (book) => authors.find((author) => author.id === book.id),
    },
  }),
});

const RootQueryType = new GraphQLObjectType({
  name: "Query",
  description: "Root Query",
  fields: () => ({
    book: {
      type: BookType,
      description: "List single book",
      args: {
        id: {
          type: GraphQLInt,
        },
      },
      resolve: (parent, args) => books.find((book) => book.id === args.id),
    },

    books: {
      type: new GraphQLList(BookType),
      description: "List of All books",
      resolve: () => books,
    },

    author: {
      type: AuthorType,
      description: "List single author",
      args: {
        id: {
          type: GraphQLInt,
        },
      },
      resolve: (parent, args) =>
        authors.find((author) => author.id === args.id),
    },

    authors: {
      type: new GraphQLList(AuthorType),
      description: "List of All Authors",
      resolve: () => authors,
    },
  }),
});

const schema = new GraphQLSchema({
  query: RootQueryType,
});

app.use(
  "/graphql",
  graphqlHTTP({
    schema: schema,
    graphiql: true,
  })
);

app.listen(PORT, () => {
  console.log(`Server has started on port ${PORT}`);
});
