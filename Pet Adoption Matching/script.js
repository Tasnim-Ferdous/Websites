const petsData = [
  // Active
  { name: "Bella", type: "Dog", personality: "Active", image: "Images/Bella - Active Dog.jpg" },
  { name: "Simba", type: "Cat", personality: "Active", image: "Images/Simba - Active Cat.jpg" },
  { name: "Thumper", type: "Rabbit", personality: "Active", image: "Images/Thumper - Active Rabbit.jpg" },

  // Calm
  { name: "Milo", type: "Cat", personality: "Calm", image: "Images/Milo - Calm Cat.jpg" },
  { name: "Daisy", type: "Rabbit", personality: "Calm", image: "Images/Daisy - Calm Rabbit.jpeg" },
  { name: "Buddy", type: "Dog", personality: "Calm", image: "Images/Buddy - Calm Dog.jpeg" },

  // Friendly
  { name: "Coco", type: "Rabbit", personality: "Friendly", image: "Images/Coco - Friendly Rabbit.jpg" },
  { name: "Charlie", type: "Dog", personality: "Friendly", image: "Images/Charlie - Friendly Dog.jpg" },
  { name: "Oliver", type: "Cat", personality: "Friendly", image: "Images/Oliver - Friendly Cat.jpg" },

  // Protective
  { name: "Rocky", type: "Dog", personality: "Protective", image: "Images/Rocky - Protectice Dog.jpg" },
  { name: "Max", type: "Dog", personality: "Protective", image: "Images/Max - Protective Dog.jpeg" },
  { name: "Shadow", type: "Cat", personality: "Protective", image: "Images/Shadow - Protective Cat.jpg" },
  { name: "Goober", type: "Rabbit", personality: "Protective", image: "Images/Goober - Protective Rabbit.jpg" },

  // Playful
  { name: "Luna", type: "Cat", personality: "Playful", image: "Images/Luna - Playful Cat.jpg" },
  { name: "Chloe", type: "Cat", personality: "Playful", image: "Images/Chloe - Playful Cat.jpg" },
  { name: "Bunny", type: "Rabbit", personality: "Playful", image: "Images/Bunny - Playful Rabbit.jpg" },
  { name: "Frisky", type: "Dog", personality: "Playful", image: "Images/Frisky - Playful Dog.jpg" },
];

const matchButton = document.getElementById("matchButton");
matchButton.addEventListener("click", function () {
  const selectedPersonality = document.getElementById("personality").value;
  const selectedPetType = document.getElementById("petType").value;

  let matchedPets = petsData.filter(pet => pet.personality === selectedPersonality);

  if (selectedPetType !== "All") {
    matchedPets = matchedPets.filter(pet => pet.type === selectedPetType);
  }

  const petCardsContainer = document.getElementById("petCards");
  petCardsContainer.innerHTML = "";

  if (matchedPets.length > 0) {
    matchedPets.forEach(pet => {
      const card = document.createElement("div");
      card.className = "pet-card";

      card.innerHTML = `
        <img src="${pet.image}" alt="${pet.name}">
        <h3>${pet.name}</h3>
        <p>Type: ${pet.type}</p>
        <p>Personality: ${pet.personality}</p>
      `;

      petCardsContainer.appendChild(card);
    });
  } else {
    petCardsContainer.innerHTML = "<p>No matches found. Try another personality or pet type!</p>";
  }
});
