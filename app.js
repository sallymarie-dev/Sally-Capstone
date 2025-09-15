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
document.getElementById("search-btn").addEventListener("click", function () {
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
      
      // code i dont want to use anymore!
      // console.log(data); // optional for debugging

//       if (data.status === 1) {
//         var item = data.product;
//         // Set image (if exists)
//         if (item.image_url) {
//           setImageSrc("product-image", item.image_url);
//         } else {
//           setImageSrc("product-image", "https://via.placeholder.com/400x250");
//         }
//         // Set product name
//         setText("product-name", item.product_name || "Unknown Product");

//         // Set nutrition info
//         var nutrients = item.nutriments;
//         // Some items might not have all fields
//         var calories =
//           nutrients["energy-kcal_100g"] !== undefined
//             ? nutrients["energy-kcal_100g"] + " kcal"
//             : "N/A";
//         var protein =
//           nutrients.proteins_100g !== undefined
//             ? nutrients.proteins_100g + " g"
//             : "N/A";
//         var carbs =
//           nutrients.carbohydrates_100g !== undefined
//             ? nutrients.carbohydrates_100g + " g"
//             : "N/A";
//         var fat =
//           nutrients.fat_100g !== undefined ? nutrients.fat_100g + " g" : "N/A";

//         setText(
//           "nutrition-info",
//           `Calories: ${calories}\nProtein: ${protein}\nCarbs: ${carbs}\nFat: ${fat}`
//         );
//       } else {
//         setText("error-message", "Product not found for that barcode.");
//       }
//     })
//     .catch((error) => {
//       console.error("Fetch error:", error);
//       setText("error-message", "Error fetching data. Please try again.");
//     });
// });


// success code
if (data.status) {
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

  // nutrients info (N/A will pop up of the info isnt available for that barcode)
  var nutrients = item.nutriments || {};
  var calories = "N/A";
  var protein = "N/A";
  var carbs = "N/A";
  var fat = "N/A";

  if (nutrients["energy-kcal"]) {
    calories = nutrients["energy-kcal"] + " kcal";
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
// new line
  setText(
    "nutrition-info",
    "Calories: " + calories + "\n" +
    "Protein: " + protein + "\n" +
    "Carbs: " + carbs + "\n" +
    "Fat: " + fat
  );
// if barcode is wrong or invalid then error message will show
} else {
  setText("error-message", "Product not found for that barcode.");
}


var botReply = "";
// botReply=response.choices[0].message.content
var userPrompt = "";
document.getElementById("Ai-btn").addEventListener("click", function () {
  userPrompt = getValue("Ai-input").trim();

  async function query(data) {
    const response = await fetch(
      "https://router.huggingface.co/v1/chat/completions",
      {
        headers: {
          Authorization: `Bearer ${HF_TOKEN}`,
          "Content-Type": "application/json",
        },
        method: "POST",
        body: JSON.stringify(data),
      }
    );
    const result = await response.json();
    return result;
  };

  query({
    messages: [
      {
        role: "user",
        content: `Give me a recipe for ${userPrompt}?`,
      },
    ],
    model: "meta-llama/Llama-3.1-8B-Instruct:fireworks-ai"
  }).then((response) => {
    console.log(JSON.stringify(response));
    botReply = response.choices[0].message.content;
    // Render the reply in the output area
    setText("output", botReply);
    setProperty("output", "color", "purple");
  });
})}
