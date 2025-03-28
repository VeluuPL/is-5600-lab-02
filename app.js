// Utility: populate form fields
function populateForm(userObj) {
    const { user, id } = userObj;
    document.querySelector('#userID').value = id;
    document.querySelector('#firstname').value = user.firstname;
    document.querySelector('#lastname').value = user.lastname;
    document.querySelector('#address').value = user.address;
    document.querySelector('#city').value = user.city;
    document.querySelector('#email').value = user.email;
  }
  
  // View stock details
  function viewStock(symbol, stocks) {
    const stock = stocks.find(s => s.symbol === symbol);
    if (stock) {
      document.querySelector('#stockName').textContent = stock.name;
      document.querySelector('#stockSector').textContent = stock.sector;
      document.querySelector('#stockIndustry').textContent = stock.subIndustry;
      document.querySelector('#stockAddress').textContent = stock.address;
      document.querySelector('#logo').src = `logos/${symbol}.svg`;
    }
  }
  
  // Render portfolio
  function renderPortfolio(user, stocks) {
    const container = document.querySelector('.portfolio-list');
  
    // Remove all children except the first 3 headers
    while (container.children.length > 3) {
      container.removeChild(container.lastChild);
    }
  
    user.portfolio.forEach(({ symbol, owned }) => {
      const symbolEl = document.createElement('p');
      symbolEl.textContent = symbol;
  
      const sharesEl = document.createElement('p');
      sharesEl.textContent = owned;
  
      const button = document.createElement('button');
      button.textContent = 'View';
      button.setAttribute('data-symbol', symbol);
  
      container.appendChild(symbolEl);
      container.appendChild(sharesEl);
      container.appendChild(button);
    });
  }
  
  // Handle user click
  function handleUserListClick(event, users, stocks) {
    const id = event.target.id;
    const user = users.find(u => u.id == id);
    if (user) {
      populateForm(user);
      renderPortfolio(user, stocks);
    }
  }
  
  // Generate user list
  function generateUserList(users, stocks) {
    const list = document.querySelector('.user-list');
    list.innerHTML = '';
  
    users.forEach(({ user, id }) => {
      const li = document.createElement('li');
      li.textContent = `${user.lastname}, ${user.firstname}`;
      li.id = id;
      list.appendChild(li);
    });
  
    list.onclick = (event) => {
      if (event.target.tagName === 'LI') {
        handleUserListClick(event, users, stocks);
      }
    };
  }
  
  // MAIN
  document.addEventListener('DOMContentLoaded', () => {
    const users = JSON.parse(userContent);
    const stocks = JSON.parse(stockContent);
  
    const saveBtn = document.querySelector('#btnSave');
    const deleteBtn = document.querySelector('#btnDelete');
  
    generateUserList(users, stocks);
  
    // Save button
    saveBtn.addEventListener('click', (e) => {
      e.preventDefault();
      const id = document.querySelector('#userID').value;
      const user = users.find(u => u.id == id);
      if (user) {
        user.user.firstname = document.querySelector('#firstname').value;
        user.user.lastname = document.querySelector('#lastname').value;
        user.user.address = document.querySelector('#address').value;
        user.user.city = document.querySelector('#city').value;
        user.user.email = document.querySelector('#email').value;
  
        generateUserList(users, stocks);
      }
    });
  
    // Delete button
    deleteBtn.addEventListener('click', (e) => {
      e.preventDefault();
      const id = document.querySelector('#userID').value;
      const index = users.findIndex(u => u.id == id);
      if (index !== -1) {
        users.splice(index, 1);
        generateUserList(users, stocks);
  
        // Clear everything
        document.querySelector('#userID').value = '';
        document.querySelector('#firstname').value = '';
        document.querySelector('#lastname').value = '';
        document.querySelector('#address').value = '';
        document.querySelector('#city').value = '';
        document.querySelector('#email').value = '';
        document.querySelector('#stockName').textContent = '';
        document.querySelector('#stockSector').textContent = '';
        document.querySelector('#stockIndustry').textContent = '';
        document.querySelector('#stockAddress').textContent = '';
        document.querySelector('#logo').src = '';
  
        // Clear portfolio list (keep headers)
        const container = document.querySelector('.portfolio-list');
        while (container.children.length > 3) {
          container.removeChild(container.lastChild);
        }
      }
    });
  
    // View stock handler (only added ONCE here!)
    document.querySelector('.portfolio-list').addEventListener('click', (e) => {
      if (e.target.tagName === 'BUTTON') {
        const symbol = e.target.getAttribute('data-symbol');
        viewStock(symbol, stocks);
      }
    });
  });