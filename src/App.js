import Table from "./table";
import data from "./table/mockData";

import "./App.css";

console.log({ data });
function App() {
  return (
    <div className="App">
      <Table
        dataSource={data.slice(0, 100)}
        columns={["userId", "id", "title", "body"]}
        searchColumn={'title'}
      />
    </div>
  );
}

export default App;
