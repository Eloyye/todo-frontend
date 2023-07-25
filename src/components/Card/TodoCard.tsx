import TodoCardProps from "./TodoCardProps";
import React from "react";
import "./TodoCard.css";

interface TodoCardPropsCallbacks extends TodoCardProps {
    deleteCallBack: (id: string) => void;
}
function TodoCard({ id, title, contents, deleteCallBack} : TodoCardPropsCallbacks) : React.JSX.Element {
    const [_title, setTitle] = React.useState<string>(title);
    const [_contents, setContents] = React.useState<string>(contents);
    function handleUpdate(event: React.FormEvent<HTMLFormElement>, id: string) : void {
        const form: EventTarget = event.target;
        const formData : FormData = new FormData(form as HTMLFormElement);
        const formJson = Object.fromEntries(formData.entries());
        fetch(`http://localhost:8080/api/todos/${id}`,
            {
                method: "PUT",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify(formJson),
            })
            .then((response) => response.json())
            .then((data) => {
                setTitle(data.title);
                setContents(data.contents);
            }).catch((error) => {
            console.error(`Something went wrong updating:\n${error}`);
        });
    }

    return (
        <div className="card" id={id}>
            <div>{_title}</div>
            <div>{_contents}</div>
            <button onClick={
                () => {
                    deleteCallBack(id);
                }
            }>Delete</button>
            <form method="put" onSubmit={(event) => {
                handleUpdate(event, id);
            }}>
                <input type="text" name="title" />
                <input type="text" name="contents" />
                <button type="submit">Update</button>
            </form>
        </div>
    );
}

export default TodoCard;