// Mock data for meal time and meal type relationships
// In a real implementation, this would come from API endpoints like:
// GET /mealtime/details/{id}/mealtypes - to get meal types for a specific meal time
// GET /mealtype/details/{id}/mealtimes - to get meal times for a specific meal type

export const mockMealTimeRelationships = {
  1: [ // Breakfast meal time ID
    { mealtype_id: 1, mealtype_name: 'Continental' },
    { mealtype_id: 2, mealtype_name: 'Pancakes' },
    { mealtype_id: 4, mealtype_name: 'Oatmeal' }
  ],
  2: [ // Lunch meal time ID
    { mealtype_id: 3, mealtype_name: 'Rice & Curry' },
    { mealtype_id: 5, mealtype_name: 'Sandwich' },
    { mealtype_id: 6, mealtype_name: 'Salad' }
  ],
  3: [ // Dinner meal time ID
    { mealtype_id: 3, mealtype_name: 'Rice & Curry' },
    { mealtype_id: 7, mealtype_name: 'Pasta' },
    { mealtype_id: 8, mealtype_name: 'Grilled Chicken' }
  ]
};

export const mockMealTypeRelationships = {
  1: [ // Continental meal type ID
    { mealtime_id: 1, mealtime_name: 'Breakfast' }
  ],
  2: [ // Pancakes meal type ID
    { mealtime_id: 1, mealtime_name: 'Breakfast' }
  ],
  3: [ // Rice & Curry meal type ID
    { mealtime_id: 2, mealtime_name: 'Lunch' },
    { mealtime_id: 3, mealtime_name: 'Dinner' }
  ],
  4: [ // Oatmeal meal type ID
    { mealtime_id: 1, mealtime_name: 'Breakfast' }
  ],
  5: [ // Sandwich meal type ID
    { mealtime_id: 2, mealtime_name: 'Lunch' }
  ],
  6: [ // Salad meal type ID
    { mealtime_id: 2, mealtime_name: 'Lunch' }
  ],
  7: [ // Pasta meal type ID
    { mealtime_id: 3, mealtime_name: 'Dinner' }
  ],
  8: [ // Grilled Chicken meal type ID
    { mealtime_id: 3, mealtime_name: 'Dinner' }
  ]
};

// Helper functions to get relationships
export const getMealTypesForMealTime = (mealtimeId) => {
  return mockMealTimeRelationships[mealtimeId] || [];
};

export const getMealTimesForMealType = (mealtypeId) => {
  return mockMealTypeRelationships[mealtypeId] || [];
};

// In a real implementation, these would be API calls:
/*
export const fetchMealTypesForMealTime = async (mealtimeId) => {
  try {
    const response = await fetch(`${BASE_URLS.mealtime}/details/${mealtimeId}/mealtypes`, {
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeader(),
      },
    });
    
    if (!response.ok) {
      throw new Error(`Failed to fetch meal types for meal time: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error fetching meal types for meal time:', error);
    return [];
  }
};

export const fetchMealTimesForMealType = async (mealtypeId) => {
  try {
    const response = await fetch(`${BASE_URLS.mealtype}/details/${mealtypeId}/mealtimes`, {
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeader(),
      },
    });
    
    if (!response.ok) {
      throw new Error(`Failed to fetch meal times for meal type: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error fetching meal times for meal type:', error);
    return [];
  }
};
*/
