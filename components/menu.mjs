// Menu state
let isMenuOpen = false;
let selectedMenuIndex = 0;

const menuItems = [{ label: "Settings", id: "settings" }];

const menuConfig = {
  x: 0,
  y: 0,
  width: 150,
  height: 30,
  itemHeight: 35,
  padding: 10,
  cornerRadius: 8,
};

// Initialize menu input handlers
function initMenuInput(doc) {
  doc.addEventListener("click", (event) => {
    handleMenuClick(event);
  });

  doc.addEventListener("mousemove", (event) => {
    handleMenuMouseMove(event);
  });
}

// Handle menu mouse move
function handleMenuMouseMove(event) {
  const canvas = document.getElementById("canvas");
  const rect = canvas.getBoundingClientRect();
  const moveX = event.clientX - rect.left;
  const moveY = event.clientY - rect.top;

  if (isMenuOpen) {
    for (let i = 0; i < menuItems.length; i++) {
      const itemY =
        menuConfig.y + menuConfig.height + i * menuConfig.itemHeight;
      if (
        moveX >= menuConfig.x &&
        moveX <= menuConfig.x + menuConfig.width &&
        moveY >= itemY &&
        moveY <= itemY + menuConfig.itemHeight
      ) {
        selectedMenuIndex = i;
        return;
      }
    }
  }
}

// Handle menu click input
function handleMenuClick(event) {
  const canvas = document.getElementById("canvas");
  const rect = canvas.getBoundingClientRect();
  const clickX = event.clientX - rect.left;
  const clickY = event.clientY - rect.top;

  // Check if menu button was clicked
  if (
    clickX >= menuConfig.x &&
    clickX <= menuConfig.x + menuConfig.width &&
    clickY >= menuConfig.y &&
    clickY <= menuConfig.y + menuConfig.height
  ) {
    toggleMenu();
  } else if (isMenuOpen) {
    // Check if menu item was clicked
    for (let i = 0; i < menuItems.length; i++) {
      const itemY =
        menuConfig.y + menuConfig.height + i * menuConfig.itemHeight;
      if (
        clickX >= menuConfig.x &&
        clickX <= menuConfig.x + menuConfig.width &&
        clickY >= itemY &&
        clickY <= itemY + menuConfig.itemHeight
      ) {
        selectedMenuIndex = i;
        selectMenuItem(menuItems[i]);
        return;
      }
    }
    closeMenu();
  }
}

// Toggle menu open/closed
function toggleMenu() {
  isMenuOpen = !isMenuOpen;
  if (isMenuOpen) {
    selectedMenuIndex = 0;
  }
}

// Open menu
function openMenu() {
  isMenuOpen = true;
  selectedMenuIndex = 0;
}

// Close menu
function closeMenu() {
  isMenuOpen = false;
  selectedMenuIndex = 0;
}

// Select a menu item
function selectMenuItem(item) {
  closeMenu();

  // Trigger custom event
  const event = new CustomEvent("menuItemSelected", {
    detail: { id: item.id },
  });
  document.dispatchEvent(event);
}

// Check if menu is open
function getMenuOpen() {
  return isMenuOpen;
}

// Get selected menu item
function getSelectedMenuItem() {
  return menuItems[selectedMenuIndex];
}

// Draw menu
function drawMenu(ctx, canvasWidth, canvasHeight) {
  menuConfig.x = canvasWidth - menuConfig.width - 15;
  menuConfig.y = 10;

  // Draw menu button
  ctx.fillStyle = isMenuOpen ? "#764ba2" : "#667eea";
  roundRect(
    ctx,
    menuConfig.x,
    menuConfig.y,
    menuConfig.width,
    menuConfig.height,
    menuConfig.cornerRadius,
  );
  ctx.fill();

  ctx.strokeStyle = "#764ba2";
  ctx.lineWidth = 2;
  roundRect(
    ctx,
    menuConfig.x,
    menuConfig.y,
    menuConfig.width,
    menuConfig.height,
    menuConfig.cornerRadius,
  );
  ctx.stroke();

  ctx.fillStyle = "white";
  ctx.font = "bold 14px 'Courier New'";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(
    "☰ MENU",
    menuConfig.x + menuConfig.width / 2,
    menuConfig.y + menuConfig.height / 2,
  );

  // Draw menu items if menu is open
  if (isMenuOpen) {
    for (let i = 0; i < menuItems.length; i++) {
      const itemY =
        menuConfig.y + menuConfig.height + i * menuConfig.itemHeight;

      // Draw item background
      ctx.fillStyle = selectedMenuIndex === i ? "#764ba2" : "#667eea";
      roundRect(
        ctx,
        menuConfig.x,
        itemY,
        menuConfig.width,
        menuConfig.itemHeight,
        menuConfig.cornerRadius,
      );
      ctx.fill();

      // Draw item border
      ctx.strokeStyle = "#764ba2";
      ctx.lineWidth = 2;
      roundRect(
        ctx,
        menuConfig.x,
        itemY,
        menuConfig.width,
        menuConfig.itemHeight,
        menuConfig.cornerRadius,
      );
      ctx.stroke();

      // Draw item text
      ctx.fillStyle = "white";
      ctx.font = "12px 'Courier New'";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(
        menuItems[i].label,
        menuConfig.x + menuConfig.width / 2,
        itemY + menuConfig.itemHeight / 2,
      );
    }
  }
}

// Helper function to draw rounded rectangles
function roundRect(ctx, x, y, width, height, radius) {
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.lineTo(x + width - radius, y);
  ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
  ctx.lineTo(x + width, y + height - radius);
  ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
  ctx.lineTo(x + radius, y + height);
  ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
  ctx.lineTo(x, y + radius);
  ctx.quadraticCurveTo(x, y, x + radius, y);
  ctx.closePath();
}

export {
  initMenuInput,
  toggleMenu,
  openMenu,
  closeMenu,
  getMenuOpen,
  getSelectedMenuItem,
  drawMenu,
};
