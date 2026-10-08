document.addEventListener('DOMContentLoaded', () => {
  // 1. Input Event (Name)
  const searchInput = document.getElementById('search');
  const inputMsg = document.querySelector('.inputMsg');

  searchInput.addEventListener('input', (e) => {
    const name = e.target.value.trim();
    inputMsg.textContent = name ? name : '...';
  });

  // 2. Change Event (Project Type)
  const countrySelect = document.getElementById('countrySelect');
  const changeMsg = document.querySelector('.changeMsg');

  countrySelect.addEventListener('change', (e) => {
    const selectedProject = e.target.value;
    if (selectedProject !== 'None') {
      changeMsg.textContent = selectedProject;
    } else {
      changeMsg.textContent = 'your project';
    }
  });

  // 3. Keyup & createElement Event (Wishlist)
  const keyInput = document.getElementById('keyInput');
  const keyMsg = document.querySelector('.keyMsg');
  const wishlist = document.querySelector('.wishlist');

  keyInput.addEventListener('keyup', (e) => {
    keyMsg.textContent = `Typing: ${e.target.value}`;
    
    // Check if Enter key was pressed and input is not empty
    if (e.key === 'Enter' && e.target.value.trim() !== '') {
      const newItem = document.createElement('li');
      newItem.textContent = e.target.value.trim();
      
      // Add Tailwind classes to the newly created list item
      newItem.className = 'bg-slate-800 py-2 px-4 rounded border border-slate-700 text-sm cursor-pointer hover:bg-red-500/20 hover:border-red-500 transition-colors';
      newItem.title = 'Click to remove';
      
      // Allow removal of items by clicking them
      newItem.addEventListener('click', () => {
        newItem.remove();
      });

      wishlist.appendChild(newItem);
      e.target.value = ''; // Clear input
      keyMsg.textContent = 'Feature added!';
      
      // Reset message after 2 seconds
      setTimeout(() => {
        if(keyInput.value === '') keyMsg.textContent = '';
      }, 2000);
    }
  });

  // 4. Click Event (Availability)
  const clickEventBtn = document.getElementById('clickEvent');
  const clickMsg = document.querySelector('.clickMsg');

  clickEventBtn.addEventListener('click', () => {
    clickEventBtn.textContent = 'Checking...';
    clickEventBtn.classList.add('opacity-50', 'cursor-not-allowed');
    
    // Simulate an API check delay
    setTimeout(() => {
      clickMsg.textContent = 'I am currently accepting new projects! Let\'s chat.';
      clickEventBtn.textContent = 'Available';
      clickEventBtn.classList.remove('opacity-50', 'cursor-not-allowed');
      clickEventBtn.classList.replace('text-sky-400', 'text-emerald-400');
      clickEventBtn.classList.replace('border-sky-400', 'border-emerald-400');
    }, 1200);
  });

  // 5. Submit Event (Form Submission)
  const loginForm = document.getElementById('loginForm');
  const loginMsg = document.querySelector('.loginMsg');

  loginForm.addEventListener('submit', (e) => {
    e.preventDefault(); // Prevent page reload
    
    const name = searchInput.value.trim();
    const project = countrySelect.value;
    const featuresCount = wishlist.children.length;
    
    if (!name || project === 'None') {
      loginMsg.textContent = 'Please provide your name and project type.';
      loginMsg.classList.replace('text-sky-400', 'text-red-400');
      return;
    }

    loginMsg.classList.replace('text-red-400', 'text-sky-400');
    loginMsg.textContent = `Thanks ${name}! Your request for ${project} with ${featuresCount} features has been sent.`;
    
    // Optional: Reset form
    // loginForm.reset();
    // inputMsg.textContent = '...';
    // changeMsg.textContent = 'your project';
    // wishlist.innerHTML = '';
  });
});