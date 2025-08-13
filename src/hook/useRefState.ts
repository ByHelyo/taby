import { RefObject, useRef, useState } from "react";

function useRefState<T>(initialValue: T): [RefObject<T>, (value: T) => void] {
  const [state, setState] = useState(initialValue);
  const ref = useRef(state);
  const setRefState = (value: T) => {
    ref.current = value;
    setState(value);
  };
  return [ref, setRefState];
}

export default useRefState;
