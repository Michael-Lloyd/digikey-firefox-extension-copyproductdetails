function createCopyButton() {
  const button = document.createElement('button');
  button.innerText = 'Copy to Clipboard';

  // Add the click event listener
  button.addEventListener('click', async () => {
    console.debug('Button clicked');

    try {
      const targetElement = document.getElementById('product-attributes');
      const properties = extractProperties(targetElement);
      console.debug('Properties extracted:', properties);

      const dataToCopy = convertToMathematicaList(properties);
      console.debug('Data converted to Mathematica list:', dataToCopy);

      await navigator.clipboard.writeText(dataToCopy);
      console.debug('Data copied to clipboard:', dataToCopy);
    } catch (error) {
      console.error('Error copying to clipboard:', error);
    }
  });

  return button;
}

function injectButtonBeforeTargetElement() {
  if (document.dir) {
    const targetElement = document.getElementById('product-attributes');
    if (targetElement) {
      const button = createCopyButton();
      targetElement.parentNode.insertBefore(button, targetElement);
      console.debug('Button injected before target element');
    } else {
      console.error('Target element not found');
    }
  } else {
    console.error('document.dir is undefined');
  }
}

// Wait for the page to load before injecting the button
window.addEventListener('DOMContentLoaded', injectButtonBeforeTargetElement);

function extractProperties(tableElement) {
  const properties = {};
  const rows = tableElement.querySelectorAll('tr');

  rows.forEach((row) => {
    const cells = row.querySelectorAll('td');
    if (cells.length === 2 || cells.length === 3) {
      const key = cells[0].textContent.trim();
      const value = cells[1].textContent.trim().replace('-', 'Nothing');
      properties[key] = value;
    }
  });

  return properties;
}

function convertToMathematicaList(jsObject) {
  const mathematicaList = [];

  for (const [key, value] of Object.entries(jsObject)) {
    const formattedValue = value === 'Nothing' ? 'None' : `"${value.replace(/"/g, '\\"')}"`;
    const formattedKey = key.replace(/"/g, '\\"');
    mathematicaList.push(`{"${formattedKey}", ${formattedValue}}`);
  }

  return `{${mathematicaList.join(', ')}}`;
}
