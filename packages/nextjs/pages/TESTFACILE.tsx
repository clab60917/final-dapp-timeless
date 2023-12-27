import React from "react";

const TESTFACILE: React.FC = () => {
  return (
    <div>
      <h1>Hello, world!</h1>
      <h2>Ça dit quoi l ekip ?</h2>
      <button onClick={() => console.log("Button clicked!")}>Click Me</button>
      <ShoppingList />
    </div>
  );
};
export default TESTFACILE;

export class ShoppingList extends React.Component {
  render() {
    return (
      <div className="shopping-list">
        <h1>Shopping List for TESTFACILE</h1>
        <ul>
          <li>Instagram</li>
          <li>WhatsApp</li>
          <li>Oculus</li>
        </ul>
      </div>
    );
  }
}
