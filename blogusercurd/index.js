const express = require("express");
const { graphqlHTTP } = require("express-graphql");
const { GraphQLObjectType, GraphQLID, GraphQLString, GraphQLList, GraphQLSchema } = require("graphql");
const app = express();

const UserType = new GraphQLObjectType({
  name : "UserType",
  fields : () => ({
    id : {type : GraphQLID},
    name : {type : GraphQLString},
    email  : {type : GraphQLString},
  })
}) // this is just a schema of the user object 
let userList = [
  { id : "1" , name : "anwer" , email : "anver@email.com"},
  { id : "2", name : "asdfa", email : "sadfdas@gmail.com"},
  { id : "3", name : "trytery" , email : "oerpot@gmial.com"}
] 

const RootType = new GraphQLObjectType({
  name : "RootQuery", // searching objects
  fields : {
    // to get all users
     users : { 
       type : new GraphQLList(UserType),
      resolve() {
        return userList ;
      } 
     }, 
    user : {
      type : UserType , 
      args : {id : {type : GraphQLID} },
      resolve(parent,args) {
        return userList.find((user) => user.id === args.id)
      }
    }
  }
})

const mutations = new GraphQLObjectType({
  name : "mutations",
  fields : {
    addUser : {
      type : UserType, 
      args : {name  : {type : GraphQLString , email : GraphQLString}},
      resolve(parent , {name , email }){
        const newUser = {name , email , id: Date.now().toString()}
        userList.push(newUser);
        return newUser ; 
      }
    },
    updateUser : {
      type : UserType ,
      args : {
        id : {type : GraphQLID} , name : {type : GraphQLString} , email : {type : GraphQLString}
      },
      resolve(parent, {id , name , email}){
        const user = userList.find((u) => u.id === id) 
        user.name = name 
        user.email = email 
        return user
      } 
    },
    deleteUser : {
      type : UserType ,
      args : {
        id : {type : GraphQLID}
      },
      resolve(parent , {id}){
        const user = userList.find((u) => u.id === id)
        userList =  userList.filter((u) => u.id !== id) ;
        return user ;
      }
    }
  }
})

const schema = new GraphQLSchema({ query : RootType , mutation : mutations})

app.use("/graphql", graphqlHTTP( { schema , graphiql: true}));
app.listen(5000, () => {
  console.log("server is running ");
});
