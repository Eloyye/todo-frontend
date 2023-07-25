import React, {useEffect} from 'react';
import TodoCard from "./components/Card/TodoCard";
import TodoCardProps from "./components/Card/TodoCardProps";
function App() {
  const [cards, setCards] = React.useState<TodoCardProps[]>([]);

  function handleAdd(event: React.FormEvent<HTMLFormElement>) : void {
    event.preventDefault();
    const form: EventTarget = event.target;
    const formData : FormData = new FormData(form as HTMLFormElement);
    const formJson = Object.fromEntries(formData.entries());
    console.log(`Here is the following form data in JSON:\n${JSON.stringify(formJson)}`);
      fetch("http://localhost:8080/api/todos", {
          method: "POST",
          headers: {"Content-Type": "application/json"},
          body: JSON.stringify(formJson),
      })
          .then((response) => response.json())
          .then((data) => {
                setCards([...cards, data]);
          })
          .catch((error) => {
                console.error(error);
          });
  }

  function handleDelete(id: string) : void {
      // only update if ok response
      fetch(`http://localhost:8080/api/todos/${id}`, {
          method: "DELETE",
      }).then((response) => {
              if (response.ok) {
                  setCards(cards.filter((card) => card.id !== id));
              }
          });

  }

  useEffect(() => {
    fetch("http://localhost:8080/api/todos")
        .then((response) => response.json())
        .then((data) => {
          setCards(data);
        })
        .catch((error) => {
            console.error(error);
        });
  }, []);

  return (
    <div>
      {
        cards.map((card) => {
          return (
            <div key={card.id}>
              <TodoCard title={card.title} contents={card.contents} id={card.id} deleteCallBack={handleDelete}/>
            </div>
          );
        })
      }
      <form method="post" onSubmit={handleAdd}>
        <label>
          Title: <input type="text" name="title" />
        </label>
        <label>
            Contents: <input type="text" name="contents" />
        </label>
          <button type="submit">Add</button>
      </form>
    </div>
  );
}

export default App;
