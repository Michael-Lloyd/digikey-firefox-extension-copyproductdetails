

function getSelectedMode() {
  return this.localStorage.getItem("selectedMode")
    .then(({ selectedMode }) => selectedMode);
}

function createCopyButton() {
  const button = document.createElement('button');
  button.innerText = 'Copy to Clipboard';

  // Add the click event listener
  button.addEventListener('click', async () => {
    console.debug('Button clicked');

    try {

      const datasheetElement = findMatchingElement();



      const targetElement = document.getElementById('product-attributes');
      let properties = extractProperties(targetElement);
      console.debug('Properties extracted:', properties);
      if (matchingElement) {
        properties["Datasheet"]=datasheetElement.href;
      }
      let dataToCopy="Null";
      getSelectedMode().then(selectedMode => { 
        if(selectedMode == "Mathematica") { 
          dataToCopy = convertToMathematicaList(properties);
        } else if(selectedMode == "CSV") { 
          dataToCopy = jsonToTsv(properties);
        } 
      });
      console.debug('Data converted to Mathematica list:', dataToCopy);

      await navigator.clipboard.writeText(dataToCopy);
      console.debug('Data copied to clipboard:', dataToCopy);
    } catch (error) {
      console.error('Error copying to clipboard:', error);
    }
  });



  const matchingElement = findMatchingElement();

  if (matchingElement) {

    console.log("Matching element found:", matchingElement);

    const datasheetButton = document.createElement("button");
    datasheetButton.textContent = "Copy";
    datasheetButton.style.marginLeft = "10px";
    matchingElement.parentNode.insertBefore(datasheetButton,matchingElement);

    datasheetButton.addEventListener('click', async () => {
      console.debug('Button clicked');
      try {

        const matchingElement = findMatchingElement();

        await navigator.clipboard.writeText(matchingElement.href);
        console.debug('Data copied to clipboard:', matchingElement.href);
      } catch (error) {
        console.error('Error copying to clipboard:', error);
      }
    });


  } else {

    console.log("No matching element found");

  }


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


function jsonToTsv(json) {
  const keys = Object.keys(json[0]);
  const header = keys.join('\t');
  const rows = json.map(obj => keys.map(key => obj[key]).join('\t')).join('\n');
  return header + '\n' + rows;
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


function findMatchingElement() {
  const elements = document.querySelectorAll('[data-testid="datasheet-download"]');
  const regex = /.+Datasheet\ top.*/;

  for (const element of elements) {
    const trackData = element.getAttribute('track-data');

    if (trackData && regex.test(trackData)) {
      return element;
    }
  }

  return null; // No matching element found
}

const matchingElement = findMatchingElement();
if (matchingElement) {
  console.log('Matching element found:', matchingElement);
} else {
  console.log('No matching element found');
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



