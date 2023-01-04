import React from 'react'
import { gql, useQuery } from '@apollo/client'

const GET_ALL_TODOS = gql`
  query GetAllTodos {
    todos {
      edges {
        node {
	  completed
	  id
	  text
	}
      }
    }
`;


function Apollo_2(props) {
    const { loading, error, data } = useQuery(GET_ALL_TODOS);

    if (loading) return 'Loading...';
    if (error) return `Error! ${error.message}`;
  
    return (
      <ul>

        {data}
        {/* { data.todos.edges.map((edge, i) => (
          <li key={edge.node.id}>{edge.node.text}</li>
        ))} */}
      </ul>
    )
}

export default Apollo_2