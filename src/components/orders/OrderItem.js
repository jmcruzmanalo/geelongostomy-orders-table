const OrderItem = props => {
  const { product, onQuantityChange, onRemove } = props;
  return (
    <tr className="item-row">
      <td>
        <input value={product.productName} readOnly />
      </td>
      <td data-label="Price per item" className="price">
        <input type="number" value={product.price} readOnly />
      </td>
      <td data-label="Quantity" className="quantity">
        <input
          type="number"
          value={product.quantity}
          onInput={e => onQuantityChange(e.target.value)}
          min="1"
        />
      </td>
      <td data-label="Total" className="totalitem">
        <input type="number" value={product.total.toFixed(2)} readOnly />
      </td>
      <td>
        <button className="remove-order" onClick={() => onRemove(product)}>
          ×
        </button>
      </td>
    </tr>
  );
};

export default OrderItem;
