import { h, Component, Fragment } from 'preact';
import './style.css';
import Modal from 'react-modal';
import OrderItem from './OrderItem';

const products = [
  {
    name: 'Product 1',
    price: 8
  },
  {
    name: 'Another product',
    price: 10
  }
];

export default class App extends Component {
  state = {
    orders: [],
    modalIsOpen: false
  };

  componentDidUpdate() {}

  addOrder(product) {
    const doesExist = this.state.orders.find(order => {
      return order.name === product.name;
    });
    if (doesExist) return;
    const newOrder = {
      ...product,
      quantity: 1,
      total: product.price
    };
    this.setState({
      orders: [...this.state.orders, newOrder],
      modalIsOpen: false
    });
  }

  removeOrder(product) {
    const targetIndex = this.state.orders.findIndex(
      order => order.name === product.name
    );
    if (targetIndex === -1) return;
    const updatedOrders = [...this.state.orders];
    updatedOrders.splice(targetIndex, 1);
    this.setState({
      orders: updatedOrders
    });
  }

  onOrderQuantityChange(productName, quantity) {
    if (quantity <= 0) return;
    const updatedOrders = [...this.state.orders];
    const targetIndex = updatedOrders.findIndex(o => o.name === productName);
    const o = updatedOrders[targetIndex]; // target order prev
    updatedOrders[targetIndex] = {
      ...o,
      quantity,
      total: o.price * quantity
    };
    this.setState({ orders: updatedOrders });
  }

  render(props) {
    return (
      <Fragment>
        <table id="product-listing">
          <thead>
            <tr>
              <th>Items</th>
              <th>Price per item</th>
              <th>Quantity</th>
              <th>Total</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {this.state.orders.map(product => {
              return (
                <OrderItem
                  product={product}
                  onQuantityChange={quantity => {
                    this.onOrderQuantityChange(product.name, quantity);
                  }}
                  onRemove={product => this.removeOrder(product)}
                />
              );
            })}
          </tbody>
          <tfoot>
            <tr>
              <td colSpan={3} style={{ textAlign: 'right' }}>
                TOTAL COST
              </td>
              <td>
                {this.state.orders.length > 0
                  ? this.state.orders.map(o => o.total).reduce((a, c) => a + c)
                  : 0}
              </td>
            </tr>
          </tfoot>
        </table>
        <button
          type="button"
          onClick={() =>
            this.setState({ modalIsOpen: !this.state.modalIsOpen })
          }
        >
          Add order
        </button>
        <Modal
          isOpen={this.state.modalIsOpen}
          shouldCloseOnOverlayClick={true}
          ariaHideApp={false}
          onRequestClose={() => this.setState({ modalIsOpen: false })}
        >
          <ul>
            {products.map(product => {
              return (
                <li
                  onClick={() => {
                    this.addOrder(product);
                  }}
                  style={{ cursor: 'pointer' }}
                >
                  {product.name} - {product.price}
                </li>
              );
            })}
          </ul>
        </Modal>
      </Fragment>
    );
  }
}
