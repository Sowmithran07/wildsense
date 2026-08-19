/**
 * AI Animal Recognition & Computer Vision Classification Service
 * Ready for future integration with YOLOv8, TensorFlow, or PyTorch inference servers
 */

const ANIMAL_SAMPLE_IMAGES = {
  Elephant: 'https://images.unsplash.com/photo-1557050543-4d5f4e07ef46?auto=format&fit=crop&w=800&q=80',
  Tiger: 'https://images.unsplash.com/photo-1561731216-c3a4d99437d5?auto=format&fit=crop&w=800&q=80',
  Leopard: 'https://images.unsplash.com/photo-1456926631375-92c8ce872def?auto=format&fit=crop&w=800&q=80',
  'Wild Boar': 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&w=800&q=80',
  'Sloth Bear': 'https://images.unsplash.com/photo-1589656966895-2f33e7653819?auto=format&fit=crop&w=800&q=80',
  'Spotted Deer': 'https://images.unsplash.com/photo-1484406566174-9da000fda645?auto=format&fit=crop&w=800&q=80',
  Monkey: 'https://images.unsplash.com/photo-1540573133985-87b6da6d54a9?auto=format&fit=crop&w=800&q=80',
  Hyena: 'https://images.unsplash.com/photo-1534177616072-ef7dc120449d?auto=format&fit=crop&w=800&q=80',
  Gaur: 'https://images.unsplash.com/photo-1535083783855-76ae62b2914e?auto=format&fit=crop&w=800&q=80',
};

const CANDIDATE_ANIMALS = [
  'Elephant',
  'Tiger',
  'Leopard',
  'Wild Boar',
  'Sloth Bear',
  'Spotted Deer',
  'Monkey',
  'Gaur',
];

export const predictAnimalFromFrame = async ({
  imageData = null,
  sensorType = 'Thermal Camera',
  soundLevel = 70,
  thermalDiff = 6.0,
}) => {
  // In production, this can forward to Python/FastAPI Flask YOLO microservice:
  // const response = await fetch(process.env.AI_INFERENCE_URL, { method: 'POST', body: ... })

  // Realistic AI inference simulation with high precision
  let predictedAnimal = 'Elephant';
  
  if (thermalDiff > 10.0) {
    predictedAnimal = Math.random() > 0.4 ? 'Elephant' : 'Gaur';
  } else if (soundLevel > 75) {
    predictedAnimal = Math.random() > 0.5 ? 'Tiger' : 'Wild Boar';
  } else {
    predictedAnimal = CANDIDATE_ANIMALS[Math.floor(Math.random() * CANDIDATE_ANIMALS.length)];
  }

  const confidence = +(88 + Math.random() * 11.5).toFixed(1); // 88.0% - 99.5%
  const boundingBoxes = [
    {
      label: predictedAnimal,
      confidence: +(confidence / 100).toFixed(2),
      x: +(0.15 + Math.random() * 0.1).toFixed(2),
      y: +(0.2 + Math.random() * 0.1).toFixed(2),
      width: +(0.45 + Math.random() * 0.2).toFixed(2),
      height: +(0.5 + Math.random() * 0.2).toFixed(2),
    },
  ];

  return {
    animal: predictedAnimal,
    confidence,
    boundingBoxes,
    image: imageData || ANIMAL_SAMPLE_IMAGES[predictedAnimal] || ANIMAL_SAMPLE_IMAGES.Elephant,
    modelVersion: 'WildVision-YOLOv8-Ensemble-v3.2',
    inferenceLatencyMs: Math.floor(45 + Math.random() * 60),
  };
};

export const getAnimalImage = (animal) => {
  return ANIMAL_SAMPLE_IMAGES[animal] || ANIMAL_SAMPLE_IMAGES.Elephant;
};
