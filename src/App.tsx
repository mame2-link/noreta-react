import { useEffect, /* useState */ } from "react";
// import type { Schema } from "../amplify/data/resource";
// import { useAuthenticator } from '@aws-amplify/ui-react';
// import { generateClient } from "aws-amplify/data";

// const client = generateClient<Schema>();

function App() {

  // const [todos, setTodos] = useState<Array<Schema["Todo"]["type"]>>([]);
  // const { user, signOut } = useAuthenticator();

  useEffect(() => {
    // client.models.Todo.observeQuery().subscribe({
    //   next: (data) => setTodos([...data.items]),
    // });
  }, []);

  // function createTodo() {
  //   client.models.Todo.create({ content: window.prompt("Todo content") });
  // }


  // function deleteTodo(id: string) {
  //   client.models.Todo.delete({ id })
  // }

  return <></>;
}

export default App;
