import { GraphQLServer } from 'graphql-yoga'
import {v4 as uuidv4 } from 'uuid'
import db from './db.js'

// Resolvers
const resolvers = {
  Query: {
    me(){
      return{
        id: '211212adsad',
        name: 'Like mike',
        email: 'mikeemail@ghail.com'
      }
    },
    postIt(){
      return{
        id:'458rrr',
        title:'First post took time huh...',
        body: 'Ya Man. Was busy with some stuff so... Now I am here lets do it.',
        published: false
      }
    },
    users(parent, args, {db}, info){
      if(!args.query){
        return db.users;
      }
      return db.users.filter((user)=>{
        return user.name.toLowerCase().includes(args.query.toLowerCase())
      })
    },
    posts(parent, args, { db }, info){
      if(!args.query){
        return db.posts;
      }
      return db.posts.filter((post)=>{
        return post.title.toLowerCase().includes(args.query.toLowerCase())
      })
    },
    comments(parent, args, {db}, info){
      if(!args.query){
        return db.comments;
      }
      return db.comments.filter((comment)=>{
        return comment.text.toLowerCase().includes(args.query.toLowerCase());
      })
    }
  },
  Mutation: {
    createUser(parent, args, {db}, info){
      
      const emailTaken = db.users.some((user)=> user.email === args.data.email);
      if(emailTaken){
        throw new Error('Email Taken');
      }
      //before transform object
      /*const user = {
        id: uuidv4(),
        email: args.email,
        name: args.name,
        age: args.age
      }*/

      //after transform object
      const user = {
        id: uuidv4(),
        ...args.data
      }
      console.log(user);
      db.users.push(user);

      return user;
    },
    deleteUser(parent, args, {db}, info){
      const userIndex = db.users.findIndex((user)=> user.id === args.id);
      if(userIndex === -1){
        throw new Error('User not found!');
      }

      const removedUsers = db.users.splice(userIndex, 1);
      db.posts = db.posts.filter((post)=>{
        const match = post.author === args.id;

        if(match){
          comments = comments.filter((comment)=>{
            //Keeping all comments that are not on the post
            return comment.post !== post.id;
          })
        }
        return !match;
      })
      //Keeping all the comments which does not have the author that is deleted
      db.comments = db.comments.filter((comment)=> comment.author !== args.id);
      return removedUsers[0];
    },
    createPost(parent, args, {db}, info){
      const userExist = db.users.some((user) => user.id === args.data.author)
      if(!userExist){
        throw new Error('User not found!');
      }

      /*const post = {
        id: uuidv4(),
        title: args.title,
        body: args.body,
        published: args.published,
        author: args.author
      }*/
      
      const post = {
        id: uuidv4(),
        ...args.data
      }
      db.posts.push(post);
      return post;
    },
    deletePost(parent, args, {db}, info){
      const postIndex = db.posts.findIndex((post) => post.id === args.id);
      if(postIndex === -1){
        throw new Error('Post not found!');
      } 

      const removedPosts = db.posts.splice(postIndex, 1);
      db.comments = db.comments.filter((comment) => comment.post !== args.id)
      return removedPosts[0];
    },
    createComment(parent, args, {db}, info){
      const userExist = db.users.some((user) => user.id === args.data.author);
      if(!userExist){
        throw new Error('User not found!');
      }

      const postExist = db.posts.some((post)=> post.id === args.data.post && post.published);
      if(!postExist){
        throw new Error('Post not found or post not published!');
      }

      /*const comment = {
        id: uuidv4(),
        text: args.text,
        author: args.author,
        post: args.post
      }*/
      const comment = {
        id: uuidv4(),
        ...args.data
      }
      db.comments.push(comment);
      return comment;
    },
    deleteComment(parent, args, {db}, info){
      const commentIndex = db.comments.findIndex((comment) => comment.id === args.id);
      console.log(commentIndex);
      if(commentIndex === -1){
        throw new Error('Comment not found!');
      }

      const removedComments = db.comments.splice(commentIndex, 1);
      return removedComments[0];
    }
  },
  Post: {
    author(parent, args, {db}, info){
      return db.users.find((user)=>{
        return user.id === parent.author;
      })
    },
    comments(parent, args, {db}, info){
      return db.comments.filter((comment)=>{
        return parent.id === comment.post;
      })
    }
  },
  User:{
    posts(parent, args, {db}, info){
      return db.posts.filter((post)=>{
        return post.author === parent.id;
      })
    },
    comments(parent, args, {db}, info){
      return db.comments.filter((comment)=>{
        return parent.id === comment.author
      })
    }
  },
  Comment: {
    author(parent, args, {db}, info){
      return db.users.find((user) => {
        return user.id === parent.author;
      })
    },
    post(parent, args, {db}, info){
      return db.posts.find((post)=>{
        return post.id === parent.post
      })
    }
  }
}

const server = new GraphQLServer({
  typeDefs: './src/schema.graphql',
  resolvers,
  context: {
    db: db
  }
})

server.start(()=>{
  console.log('Server is up!!!')
})