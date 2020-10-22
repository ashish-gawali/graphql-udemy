import { GraphQLServer } from 'graphql-yoga'

// Type definations (schema)
//`-> near the tilde icon(~)
// id: ID!
//     name: String!
//     age: Int!
//     employed: Boolean!
//     gpa: Float


// inStock: Boolean!
// title: String!
// price: Float!
// releaseYear: Int
// rating: Float

//User define
const users = [
  {
    id: '1',
    name: 'Like',
    email: 'mikeemail@ghail.com',
    age: 58 
  },
  {
    id: '2',
    name: 'Not Like mike',
    email: 'nahiDenar@ghail.com'
  }
]

//defining posts
const posts=[
  {
    id: "1",
    title: "ACM ML Lecture",
    body: "The lecture was intersting covering various use cases around AI ML",
    published: false
  },
  {
    id: "2",
    title: "Learning Day",
    body: "Tried learning about graphQL and walking around almost completed 5000 Steps ",
    published: true
  },
  {
    id: "3",
    title: "Work",
    body: "Ran some tests for Kanchan and did some work asked by trupti, both of them were pretty minor",
    published: false
  }
]
const typeDefs =`
  type Query{
    users(query: String):[User!]!
    me: User!
    postIt: Post!
  }

  type User{
    id: ID!
    name: String!
    email: String!
    age: Int
  }

  type Post{
    id: ID!
    title: String!
    body: String!
    published: Boolean
  }
`

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
    }
  }
}

const server = new GraphQLServer({
  typeDefs,
  resolvers
})

server.start(()=>{
  console.log('Server is up!!!')
})