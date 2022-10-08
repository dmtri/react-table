import Table from "./table";
import data from "./table/mockData";

import "./App.css";

console.log({data})
function App() {
  return (
    <div className="App">
      <Table dataSource={data} columns={["userId.test.a", "id", "title", "body"]} />
    </div>
  );
}

export default App;
