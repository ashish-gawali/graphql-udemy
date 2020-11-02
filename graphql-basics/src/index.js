import { GraphQLServer } from 'graphql-yoga'
import {v4 as uuidv4 } from 'uuid'
//User define
let users = [
  {
    id: '1',
    name: 'Sarah Olson',
    email: 'mikeemail@ghail.com',
    age: 58 
  },
  {
    id: '2',
    name: 'Hail Mary',
    email: 'nahiDenar@ghail.com'
  },
  {
    id: '3',
    name: 'Tom Brady',
    email: 'tomBrady@buccaneers.com'
  }
]

//defining posts
let posts=[
  {
    id: '1',
    title: "ACM ML Lecture",
    body: "The lecture was intersting covering various use cases around AI ML",
    published: false,
    author: '1',
    comments: ['104', '204']
  },
  {
    id: '2',
    title: "Learning Day",
    body: "Tried learning about graphQL and walking around almost completed 5000 Steps ",
    published: true,
    author: '2'
  },
  {
    id: '3',
    title: "Work",
    body: "Ran some tests for Kanchan and did some work asked by trupti, both of them were pretty minor",
    published: true,
    author: '1'
  }
]

//defining comment
let comments= [
  {
    id: '104',
    text: 'First Comment',
    author: '1',
    post: '1'
  },
  {
    id: '204',
    text: 'Aur batao',
    author: '2',
    post: '2'
  },
  {
    id: '2',
    text: 'Kya chal raha hai',
    author: '2',
    post: '3'
  },
  {
    id: '4',
    text: 'Fogg chal rha hai',
    author: '1',
    post: '2'
  }
]

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
    users(parent, args, ctx, info){
      if(!args.query){
        return users;
      }
      return users.filter((user)=>{
        return user.name.toLowerCase().includes(args.query.toLowerCase())
      })
    },
    posts(parent, args, ctx, info){
      if(!args.query){
        return posts;
      }
      return posts.filter((post)=>{
        return post.title.toLowerCase().includes(args.query.toLowerCase())
      })
    },
    comments(parent, args, ctx, info){
      if(!args.query){
        return comments;
      }
      return comments.filter((comment)=>{
        return comment.text.toLowerCase().includes(args.query.toLowerCase());
      })
    }
  },
  Mutation: {
    createUser(parent, args, ctx, info){
      
      const emailTaken = users.some((user)=> user.email === args.data.email);
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
      users.push(user);

      return user;
    },
    deleteUser(parent, args, ctx, info){
      const userIndex = users.findIndex((user)=> user.id === args.id);
      if(userIndex === -1){
        throw new Error('User not found!');
      }

      const removedUsers = users.splice(userIndex, 1);
      posts =posts.filter((post)=>{
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
      comments = comments.filter((comment)=> comment.author !== args.id);
      return removedUsers[0];
    },
    createPost(parent, args, ctx, info){
      const userExist = users.some((user) => user.id === args.data.author)
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
      posts.push(post);
      return post;
    },
    deletePost(parent, args, ctx, info){
      const postIndex = posts.findIndex((post) => post.id === args.id);
      if(postIndex === -1){
        throw new Error('Post not found!');
      } 

      const removedPosts = posts.splice(postIndex, 1);
      comments = comments.filter((comment) => comment.post !== args.id)
      return removedPosts[0];
    },
    createComment(parent, args, ctx, info){
      const userExist = users.some((user) => user.id === args.data.author);
      if(!userExist){
        throw new Error('User not found!');
      }

      const postExist = posts.some((post)=> post.id === args.data.post && post.published);
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
      comments.push(comment);
      return comment;
    },
    deleteComment(parent, args, ctx, info){
      const commentIndex = comments.findIndex((comment) => comment.id === args.id);
      console.log(commentIndex);
      if(commentIndex === -1){
        throw new Error('Comment not found!');
      }

      const removedComments = comments.splice(commentIndex, 1);
      return removedComments[0];
    }
  },
  Post: {
    author(parent, args, ctx, info){
      return users.find((user)=>{
        return user.id === parent.author;
      })
    },
    comments(parent, args, ctx, info){
      return comments.filter((comment)=>{
        return parent.id === comment.post;
      })
    }
  },
  User:{
    posts(parent, args, ctx, info){
      return posts.filter((post)=>{
        return post.author === parent.id;
      })
    },
    comments(parent, args, ctx, info){
      return comments.filter((comment)=>{
        return parent.id === comment.author
      })
    }
  },
  Comment: {
    author(parent, args, ctx, info){
      return users.find((user) => {
        return user.id === parent.author;
      })
    },
    post(parent, args, ctx, info){
      return posts.find((post)=>{
        return post.id === parent.post
      })
    }
  }
}

const server = new GraphQLServer({
  typeDefs: './src/schema.graphql',
  resolvers
})

server.start(()=>{
  console.log('Server is up!!!')
})