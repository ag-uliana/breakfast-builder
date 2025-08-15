import { useParams, Link } from 'react-router-dom';

export default function Confirm() {
  const { orderId } = useParams();
  return (
    <section>
      <h1>your order has been sent</h1>
      <p>order number <b>#{orderId}</b></p>
      <Link className="button" to="/">back to main page</Link>
    </section>
  );
}
