
export const paymentMethods = [
  {
    id: 'card',
    name: 'Carte bancaire',
    description: 'Visa, Mastercard, etc.',
    logoPath: '/images/payments/mastercard.svg'
  },
  {
    id: 'mpesa',
    name: 'M-Pesa',
    description: 'Vodacom',
    logoPath: '/images/payments/mpesa.png'
  },
  {
    id: 'orange',
    name: 'Orange Money',
    description: 'Orange',
    logoPath: '/images/payments/orange.png'
  },
  {
    id: 'airtel',
    name: 'Airtel Money',
    description: 'Airtel',
    logoPath: '/images/payments/airtel.png'
  }
];

export type paymentMethod = 'card' | 'mpesa' | 'orange'