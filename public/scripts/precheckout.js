const removeFromCart = async (itemType, itemName) => {
  try {
    const response = await fetch('/hotels/remove-item-from-cart', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').getAttribute('content'),
      },
      body: JSON.stringify({
        itemType,
        itemName,
      }),
    });

    const data = await response.json();
    if (response.ok) {
      const itemId = `cart-item-${itemName}`;
      const itemElement = document.getElementById(itemId);

      document.getElementById('cartmessage').textContent = data.cartTotal;
      document.getElementById('cart-item-count').textContent = data.itemCount;

      if (itemElement) {
        itemElement.remove();
      }

      showAlert('Item removed successfully', 'success');

    } else {
      console.error(data.message);
      showAlert('Failed to remove item, please try again', 'danger');
    }
  } catch (error) {
    console.error('Error removing item:', error);
    showAlert('An unexpected error occurred. Please try again.', 'danger');
  }
}

const showAlert = (message, type) => {
  const alert = document.createElement('div');
  alert.className = `alert alert-${type} alert-dismissible fade show`;
  alert.role = 'alert';
  alert.innerHTML = `
        ${message}
        <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
      `;

  const alertContainer = document.getElementById('alert-container');
  if (alertContainer) {
    alertContainer.appendChild(alert);
  }

  setTimeout(() => {
    if (alertContainer.contains(alert)) {
      alertContainer.removeChild(alert);
    }
  }, 5000);
}