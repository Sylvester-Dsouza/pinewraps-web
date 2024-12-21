export interface TimeSlot {
  slot: string;
  cutoffTime: {
    type: 'same_day' | 'day_ahead';
    time: string; // 24-hour format, e.g., "14:00"
  };
}

export interface EmirateDelivery {
  timeSlots: TimeSlot[];
  deliveryFee: number;
}

export const deliveryConfig: Record<string, EmirateDelivery> = {
  'Dubai': {
    timeSlots: [
      { 
        slot: '11:00 AM - 1:00 PM (Dubai Time)', 
        cutoffTime: { type: 'day_ahead', time: '20:00' } // 8 PM day before
      },
      { 
        slot: '1:00 PM - 4:00 PM (Dubai Time)', 
        cutoffTime: { type: 'day_ahead', time: '20:00' } // 8 PM day before
      },
      { 
        slot: '4:00 PM - 7:00 PM (Dubai Time)', 
        cutoffTime: { type: 'same_day', time: '11:00' } // 11 AM same day
      },
      { 
        slot: '7:00 PM - 10:00 PM (Dubai Time)', 
        cutoffTime: { type: 'same_day', time: '16:00' } // 4 PM same day
      }
    ],
    deliveryFee: 30
  },
  'Sharjah': {
    timeSlots: [
      { 
        slot: '4:00 PM - 9:00 PM (Dubai Time)', 
        cutoffTime: { type: 'same_day', time: '11:00' }
      }
    ],
    deliveryFee: 50
  },
  'Ajman': {
    timeSlots: [
      { 
        slot: '5:00 PM - 9:30 PM (Dubai Time)', 
        cutoffTime: { type: 'same_day', time: '11:00' }
      }
    ],
    deliveryFee: 50
  },
  'Abu Dhabi': {
    timeSlots: [
      { 
        slot: '5:00 PM - 9:30 PM (Dubai Time)', 
        cutoffTime: { type: 'same_day', time: '11:00' }
      }
    ],
    deliveryFee: 50
  },
  'Al Ain': {
    timeSlots: [
      { 
        slot: '4:00 PM - 10:00 PM (Dubai Time)', 
        cutoffTime: { type: 'day_ahead', time: '20:00' }
      }
    ],
    deliveryFee: 50
  },
  'Ras Al Khaimah': {
    timeSlots: [
      { 
        slot: '4:00 PM - 10:00 PM (Dubai Time)', 
        cutoffTime: { type: 'day_ahead', time: '20:00' }
      }
    ],
    deliveryFee: 50
  },
  'Umm Al Quwain': {
    timeSlots: [
      { 
        slot: '4:00 PM - 10:00 PM (Dubai Time)', 
        cutoffTime: { type: 'day_ahead', time: '20:00' }
      }
    ],
    deliveryFee: 50
  },
  'Fujairah': {
    timeSlots: [
      { 
        slot: '4:00 PM - 10:00 PM (Dubai Time)', 
        cutoffTime: { type: 'day_ahead', time: '20:00' }
      }
    ],
    deliveryFee: 50
  }
};

export function isTimeSlotAvailable(emirate: string, slotIndex: number, deliveryDate: Date): boolean {
  const now = new Date();
  const dubaiTime = new Date(now.toLocaleString('en-US', { timeZone: 'Asia/Dubai' }));
  
  const slot = deliveryConfig[emirate]?.timeSlots[slotIndex];
  if (!slot) return false;

  const [cutoffHours, cutoffMinutes] = slot.cutoffTime.time.split(':').map(Number);
  const cutoffTime = new Date(dubaiTime);
  
  // If it's a day ahead cutoff, check against previous day's cutoff time
  if (slot.cutoffTime.type === 'day_ahead') {
    const deliveryDay = new Date(deliveryDate);
    const cutoffDay = new Date(deliveryDay);
    cutoffDay.setDate(cutoffDay.getDate() - 1);
    cutoffDay.setHours(cutoffHours, cutoffMinutes, 0, 0);
    return dubaiTime < cutoffDay;
  }
  
  // For same day delivery
  if (slot.cutoffTime.type === 'same_day') {
    const deliveryDay = new Date(deliveryDate);
    const cutoffDay = new Date(deliveryDay);
    cutoffDay.setHours(cutoffHours, cutoffMinutes, 0, 0);
    return dubaiTime < cutoffDay;
  }

  return false;
}

export function getAvailableTimeSlots(emirate: string, deliveryDate: Date): string[] {
  if (!deliveryConfig[emirate]) return [];
  
  return deliveryConfig[emirate].timeSlots
    .filter((_, index) => isTimeSlotAvailable(emirate, index, deliveryDate))
    .map(slot => slot.slot);
}

// Store pickup time slots from 9 AM to 9 PM
export const storePickupSlots = [
  '9:00 AM',
  '10:00 AM',
  '11:00 AM',
  '12:00 PM',
  '1:00 PM',
  '2:00 PM',
  '3:00 PM',
  '4:00 PM',
  '5:00 PM',
  '6:00 PM',
  '7:00 PM',
  '8:00 PM',
  '9:00 PM'
];

export function getStorePickupSlots(date: Date): string[] {
  // Convert to Dubai timezone
  const now = new Date();
  const dubaiTime = new Date(now.toLocaleString('en-US', { timeZone: 'Asia/Dubai' }));
  
  // Convert input date to Dubai timezone for comparison
  const dubaiDate = new Date(date.toLocaleString('en-US', { timeZone: 'Asia/Dubai' }));
  const isToday = dubaiDate.toDateString() === dubaiTime.toDateString();
  
  if (!isToday) {
    return storePickupSlots;
  }

  // If it's today, only return time slots that are at least 2 hours in the future
  const currentHour = dubaiTime.getHours();
  const currentMinute = dubaiTime.getMinutes();
  
  return storePickupSlots.filter(slot => {
    const slotHour = parseInt(slot.split(':')[0]);
    const isPM = slot.includes('PM');
    const hour24 = isPM && slotHour !== 12 ? slotHour + 12 : (slotHour === 12 ? 12 : slotHour);
    
    // Calculate the difference in hours, considering minutes
    const hourDiff = hour24 - currentHour;
    const effectiveHourDiff = hourDiff - (currentMinute > 0 ? 1 : 0);
    
    // Return true if the slot is at least 2 hours in the future
    return effectiveHourDiff >= 2;
  });
}
