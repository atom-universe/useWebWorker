// import useWebWorker from "@trickle/useWebWorker";
import useWebWorker from "../../../dist/esm/main/useWebWorker";
import { useEffect, useState } from "react";
import { createRoot } from "react-dom/client";

const defaultListValue = Array(1000000)
  .fill(0)
  .map((_, index) => index);
const App = () => {
  const [list, setList] = useState(defaultListValue);

  const [run, isRunning, result] = useWebWorker<Array<number>>(({ list }) => {
    const res = list.reverse()
    return res
  });

  const handleClick = () => {
    if (!isRunning) {
      run({ list });
      console.log('result', result)
    } else {
      console.log('isRunning...')
    }
  };

  useEffect(() => {
    console.log('reverse!\n', isRunning, result)
    if (result) {
      setList([...result]);
    }
  }, [result]);

  return (
    <div style={{ height: "100%" }}>
      {isRunning ? <button>running....</button> : <button onClick={handleClick}>Reverse Order!</button>}
      <div>(Check Result in Console)</div>
    </div>
  );
};

createRoot(document.getElementById("root")!).render(<App />);
