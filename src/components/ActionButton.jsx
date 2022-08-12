import { useState } from "react";

function ActionButton() {
    const [count, setCount] = useState(0);

    return (
        <div className="card">
            <button onClick={() => setCount((count) => count + 1)}>
                Update count: {count}
            </button>
            <button onClick={() => setCount(0)}>
                Reset
            </button >
        </div>
    );
}

export default ActionButton;
