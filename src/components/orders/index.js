import { h, Component, Fragment } from 'preact';
import Modal from 'react-modal';
import OrderItem from './OrderItem';

// Set global variable
const products = window.products || [
  {
    productName: 'Product 1',
    price: 8
  },
  {
    productName: 'Another product',
    price: 10
  }
];

const POSTAGE_ORDER = {
  productName: `POSTAGE per month's order`,
  price: 14,
  quantity: 0,
  total: 0
};

export default class App extends Component {
  state = {
    orders: [],
    totalCost: 0,
    modalIsOpen: false
  };

  componentDidUpdate() {
    console.log(this.state.orders);
    const newCost =
      this.state.orders.length > 0
        ? this.state.orders.map(o => o.total).reduce((a, c) => a + c)
        : 0;
    if (this.state.totalCost !== newCost) {
      this.setState({
        totalCost: newCost
      });
    }
    const input = document.getElementById('orders-table-value');
    if (!input) console.error('Cannot find input with id #orders-table-value');
    input.value = JSON.stringify({
      orders: this.state.orders,
      totalCost: this.state.totalCost
    });
  }

  addOrder(product) {
    const doesExist = this.state.orders.find(order => {
      return order.productName === product.productName;
    });
    if (doesExist) return;
    const newOrder = {
      ...product,
      quantity: 1,
      total: product.price
    };
    if (this.state.orders.length === 0) {
      this.setState({
        orders: [...this.state.orders, newOrder, { ...POSTAGE_ORDER }],
        modalIsOpen: false
      });
    } else {
      const updatedOrders = [...this.state.orders, newOrder];
      const idx = updatedOrders.findIndex(o => o.productName === POSTAGE_ORDER.productName);
      const postageOrder = updatedOrders.splice(idx, 1);
      updatedOrders.push(postageOrder[0]);
      this.setState({
        orders: updatedOrders,
        modalIsOpen: false
      });
    }
  }

  removeOrder(product) {
    const targetIndex = this.state.orders.findIndex(
      order => order.productName === product.productName
    );
    if (targetIndex === -1) return;
    const updatedOrders = [...this.state.orders];
    updatedOrders.splice(targetIndex, 1);
    if (updatedOrders.length === 1 && updatedOrders[0].productName === POSTAGE_ORDER.productName) {
      updatedOrders.splice(0, 1);
    }
    this.setState({
      orders: updatedOrders
    });
  }

  onOrderQuantityChange(productName, quantity) {
    const updatedOrders = [...this.state.orders];
    const targetIndex = updatedOrders.findIndex(
      o => o.productName === productName
    );
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
      <div>
        <table id="product-listing">
          <thead>
            <tr>
              <th>Items</th>
              <th>Item Price</th>
              <th>Quantity</th>
              <th>Total</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {this.state.orders.map(product => {
              if (POSTAGE_ORDER.productName === product.productName) {
                return (
                  <OrderItem
                    product={product}
                    onQuantityChange={quantity => {
                      this.onOrderQuantityChange(product.productName, quantity);
                    }}
                    min="0"
                  />
                );
              } else {
                return (
                  <OrderItem
                    product={product}
                    onQuantityChange={quantity => {
                      this.onOrderQuantityChange(product.productName, quantity);
                    }}
                    onRemove={product => this.removeOrder(product)}
                    min="1"
                  />
                );
              }
            })}
          </tbody>
          <tfoot>
            <tr>
              <td colSpan={3} style={{ textAlign: 'right' }}>
                TOTAL COST
              </td>
              <td>{this.state.totalCost.toFixed(2)}</td>
            </tr>
          </tfoot>
        </table>
        <button
          type="button"
          className="addOrder"
          onClick={() =>
            this.setState({ modalIsOpen: !this.state.modalIsOpen })
          }
        >
          + Add order
        </button>
        <Modal
          isOpen={this.state.modalIsOpen}
          shouldCloseOnOverlayClick={true}
          ariaHideApp={false}
          onRequestClose={() => this.setState({ modalIsOpen: false })}
          className="upliftModal"
          overlayClassName="upliftModalOverlay"
        >
          <ul>
            {products
              .filter(product => {
                const inState = this.state.orders.find(order => {
                  return product.productName === order.productName;
                });
                return !inState;
              })
              .map(product => {
                return (
                  <li
                    onClick={() => {
                      this.addOrder(product);
                    }}
                    style={{ cursor: 'pointer' }}
                  >
                    <span className="product-name">{product.productName}</span>{' '}
                    <span className="product-price">
                      {product.price.toFixed(2)}
                    </span>
                  </li>
                );
              })}
          </ul>
        </Modal>
      </div>
    );
  }
}
