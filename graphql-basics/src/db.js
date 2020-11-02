//User define
const users = [
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
const posts=[
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
const comments= [
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

const db = {
  users,
  posts,
  comments
}

export { db as default }