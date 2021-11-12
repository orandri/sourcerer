import logo from './logo.svg';
import './App.css';
import {
  ApolloClient,
  InMemoryCache,
  ApolloProvider,
  useQuery,
  gql
} from "@apollo/client";
import React from 'react';
import ReactDOM from 'react-dom';
import reportWebVitals from './reportWebVitals';

/*function App() {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
        
      </header>
    </div>
  );
}

export default App;*/
const client = new ApolloClient({
  uri: 'https://api.github.com/graphql',
  cache: new InMemoryCache(),
  headers:{
      Authorization: "Bearer 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"
  }
});
const Viewer = gql`
    query Viewer { 
        viewer {
            login
            id
            name
            bio
            avatarUrl
            followers {
                totalCount
            }
            following {
                totalCount
            }
            repositories(last: 10, orderBy: {field: CREATED_AT, direction: ASC}) {
              totalCount
              nodes {
                name
                updatedAt
                languages(first: 10) {
                  totalCount
                  nodes {
                    name
                  }
                }
                refs(refPrefix: "refs/", first: 15) {
                  edges {
                    node {
                      target {
                        ... on Commit {
                          id
                          history(first: 15) {
                            totalCount
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
        }
    }
`
  

function User() {
    const { loading, data } = useQuery(Viewer);

    
    
    if (loading) return <p>Loading...</p>
    console.log("1 -----")
    let commit = 0
    //console.log(data.viewer.repositories.nodes[2].refs.edges[0].node.target.history.totalCount)
    let nbRepo = data.viewer.repositories.totalCount
    let langages = []
    let nfois = []
    console.log(data.viewer.repositories.nodes[0].updatedAt)
    for (let i = 0; i<data.viewer.repositories.totalCount;i++){
      commit += data.viewer.repositories.nodes[i].refs.edges[0].node.target.history.totalCount
      for (let l = 0;l<data.viewer.repositories.nodes[i].languages.totalCount;l++){
        //console.log("Langage : " +data.viewer.repositories.nodes[i].languages.nodes[l].name)
        if (langages.indexOf(data.viewer.repositories.nodes[i].languages.nodes[l].name) == -1){
          langages.push(data.viewer.repositories.nodes[i].languages.nodes[l].name)
          nfois.push(1)
        } else {
            nfois[langages.indexOf(data.viewer.repositories.nodes[i].languages.nodes[l].name)] += 1
        }
      }
      
    }

    //console.log(langages)
    //console.log(nfois)
    console.log(commit)
    return (
      <div>
        <div className="entete">
            <div className="w3-container">
                <h1> {data.viewer.name}</h1>
                <p className="w3-center desc w3-third">{data.viewer.bio}</p> 
                <p className="w3-third title">1</p>           
            </div>

            <div>
                

                <div>
                    <p className="w3-left-align pseudo">{data.viewer.login}</p>
                    <img className="w3-circle w3-col l2" src={data.viewer.avatarUrl}/>
                </div>
                

                <div className="w3-container w3-gray w3-col l2 Info">
                  <p> Commits </p>
                  <p > {commit}</p>
                </div>
                <div className="w3-container w3-gray w3-col l2 Info">
                    <p>Repos</p>
                    <p>{data.viewer.repositories.totalCount}</p>
                </div>

                <div className="w3-container w3-green w3-col l2 Info">
                    <p>Followers</p>
                    <p>{data.viewer.repositories.followers || 0}</p>
                </div>
                
                <div className="w3-container w3-green w3-col l2 Info">
                    <p>Followings</p>
                    <p>{data.viewer.repositories.followings || 0}</p>
                </div>

            </div>
            
          </div>
           
          <div className ="w3-container">
              <h1>Overwiew</h1>
              <p>{data.viewer.repositories.totalCount} repos</p>
              <p>Last updated : {data.viewer.repositories.nodes[data.viewer.repositories.totalCount-1].updatedAt} </p>
          </div>

          <div className ="w3-container">
              <h1>Langages</h1>
              <p>{langages[0]} {langages[1]} {langages[2]} {langages[3]} {langages[4]}</p>
          </div>
        </div>
        
    )
}

function InfoUser() {
    return (
        <ApolloProvider client={client}>
            <User/>
        </ApolloProvider>
    );
}

  
  export default InfoUser;
