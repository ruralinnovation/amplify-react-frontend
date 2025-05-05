import React, {
  ReactElement,
  // useContext,
  // useEffect,
  // useState
} from "react";

export function Button(props: { children?: ReactElement, onClick: () => void }) {
  return <button {...props} />
}

export function Input(props: { children?: ReactElement }) {
  return <input {...props} />
}

export function Label(props: { children?: ReactElement }) {
  return <label {...props} />
}
