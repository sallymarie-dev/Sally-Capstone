// my functions
function getValue(id) {
  return document.getElementById(id).value;
}
function setText(id, text) {
  document.getElementById(id).innerText = text;
}
function setImageSrc(id, src) {
  document.getElementById(id).src = src;
}

// Event listener
document
  .getElementById("search-btn")
  .addEventListener("click", function () {
    var barcode = getValue("barcode-input").trim();
    if (barcode === "") {
      setText("error-message", "Please enter a barcode");
      return;
    }

    // Clear previous errors
    setText("error-message", "");

    // Build URL
    var url = `https://us.openfoodfacts.org/api/v0/product/${barcode}.json`;

    fetch(url)
      .then((response) => response.json())
      .then((data) => {
        console.log(data === 1);
      });
    if (data.status === 1) {
      var item = data.product;

      // Set image (fallback if missing)
      if (item.image_url) {
        setImageSrc("product-image", item.image_url);
      } else {
        setImageSrc("product-image", "https://via.placeholder.com/400x250");
      }

      // Set product name
      if (item.product_name) {
        setText("product-name", item.product_name);
      } else {
        setText("product-name", "Unknown Product");
      }

      // Get nutrients safely
      var nutrients = item.nutriments;
      // Some items might not have all fields
      var nutrients = item.nutriments || {};
      var calories = "N/A";
      var protein = "N/A";
      var carbs = "N/A";
      var fat = "N/A";
      /// display info
      if (nutrients) {
        calories = nutrients + " kcal";
      }
      if (nutrients.proteins) {
        protein = nutrients.proteins + " g";
      }
      if (nutrients.carbohydrates) {
        carbs = nutrients.carbohydrates + " g";
      }
      if (nutrients.fat) {
        fat = nutrients.fat + " g";
      }

      setText(
        "nutrition-info",
        "Calories: " +
          calories +
          "\n" +
          "Protein: " +
          protein +
          "\n" +
          "Carbs: " +
          carbs +
          "\n" +
          "Fat: " +
          fat
      );
    } else {
      setText("error-message", "Product not found for that barcode.");
    }
  })
  //if barcode is wrong or invalid
  .catch((error) => {
    console.error("Fetch error:", error);
    setText("error-message", "Error fetching data. Please try again.");
  });

query({
  messages: [
    {
      role: "user",
      content: `Give me a recipe for ${userPrompt}?`,
    },
  ],
  model: "meta-llama/Llama-3.1-8B-Instruct:fireworks-ai",
}).then((response) => {
  console.log(JSON.stringify(response));
  botReply = response.choices[0].message.content;
  // Render the reply in the output area
  setText("output", botReply);
  setProperty("output", "color", "purple");
});
