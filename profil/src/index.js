import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import {
  ApolloClient,
  InMemoryCache,
  ApolloProvider,
  useQuery,
  gql
} from "@apollo/client";
import { render } from 'react-dom';


ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();



const client = new ApolloClient({
  uri: 'https://api.github.com/graphql',
  cache: new InMemoryCache(),
  headers:{
      Authorization: "Bearer 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"
  }
});

client
  .query({
    query: gql`
      query {
        viewer {
            login
            id
            repositories {
              totalCount
            }
            following {
              totalCount
            }
            followers {
              totalCount
            }
        }
    }
    `
  })
  .then(result => console.log(result));
