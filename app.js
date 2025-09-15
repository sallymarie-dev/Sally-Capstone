// my functions, src tells which image to display when updated
function getValue(id) {
  return document.getElementById(id).value;
}
function setText(id, text) {
  document.getElementById(id).innerText = text;
}
function setImageSrc(id, src) {
  document.getElementById(id).src = src;
}

// Event listener, click seatch
document.getElementById("search-btn").addEventListener("click", function () {
  var barcode = getValue("barcode-input");
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
      console.log("Status:" === 1);

      if (data.status === 1) {
        var item = data.product;

        // Image
        setImageSrc(
          "product-image",
          item.image_url || "https://via.placeholder.com/400x250"
        );

        // product Name, if barcode is invalid will say
        setText("product-name", item.product_name || "Unknown Product");

        // Nutrients
        var nutrients = item.nutriments || {};
        var calories, protein, carbs, fat;

        // Calories
        if (nutrients.energy_kcal) {
          calories = nutrients.energy_kcal + " kcal";
        } else {
          calories = "N/A";
        }

        // Protein
        if (nutrients.proteins) {
          protein = nutrients.proteins + " g";
        } else {
          protein = "N/A";
        }

        // Carbs
        if (nutrients.carbohydrates) {
          carbs = nutrients.carbohydrates + " g";
        } else {
          carbs = "N/A";
        }

        // Fat
        if (nutrients.fat) {
          fat = nutrients.fat + " g";
        } else {
          fat = "N/A";
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
    .catch((error) => {
      console.error("Fetch error:", error);
      setText("error-message", "Error fetching data. Please try again.");
    });
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
