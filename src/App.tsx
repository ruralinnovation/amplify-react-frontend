import { useEffect, useState } from "react";
import type { Schema } from "../amplify/data/resource";
import { generateClient } from "aws-amplify/data";
import {UseAuthenticator, useAuthenticator} from "@aws-amplify/ui-react";

const client = generateClient<Schema>();

function App() {
    const [todos, setTodos] = useState<Array<Schema["Todo"]["type"]>>([]);
    const authenticator: UseAuthenticator = useAuthenticator();
    const { user } = authenticator;

    useEffect(() => {

        // console.log(user);

        client.models['Todo'].observeQuery().subscribe({
            next: (data) => setTodos([...data.items]),
        });
    }, [ user ]);

    function createTodo() {
        client.models['Todo'].create({ content: (global as any).prompt("Todo content") });
    }

    return (
        <main>
            <h1>{user?.signInDetails?.loginId}'s todos</h1>
            <button onClick={createTodo}>+ new</button>
            <ul>
                {(todos as any).map((todo: any) => (
                    <li key={todo.id}>{todo.content}</li>
                ))}
            </ul>
            <div>
                🥳 App successfully hosted. Try creating a new todo.
                <br />
                <a href="https://docs.amplify.aws/react/start/quickstart/#make-frontend-updates">
                    Review next step of this tutorial.
                </a>
            </div>
        </main>
    );
}

export default App;
