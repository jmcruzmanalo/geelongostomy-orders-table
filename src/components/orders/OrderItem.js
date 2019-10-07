const OrderItem = props => {
  const { product, onQuantityChange, onRemove } = props;
  return (
    <tr className="item-row">
      <td>
        <input value={product.name} readOnly />
      </td>
      <td>
        <input type="number" value={product.price} readOnly />
      </td>
      <td>
        <input
          type="number"
          value={product.quantity}
          onInput={e => onQuantityChange(e.target.value)}
        />
      </td>
      <td>
        <input type="number" value={product.total} readOnly />
      </td>
      <td>
        <button onClick={() => onRemove(product)}>Remove</button>
      </td>
    </tr>
  );
};

export default OrderItem;
