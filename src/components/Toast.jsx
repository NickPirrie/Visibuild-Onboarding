export default function Toast({ message }) {
  if (!message) return null;
  return <div className="vb-toast">{message}</div>;
}
