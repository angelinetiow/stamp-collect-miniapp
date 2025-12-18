/**
 * Static Data Service
 * 
 * This module provides static/mock data for the stamp collection app.
 * In production, this would be replaced with actual API calls.
 */

export interface Prize {
  _id: string;
  prizeType: 'voucher' | 'token';
  name: string;
  description?: string;
  image?: string;
  validityStart?: string;
  validityEnd?: string;
  selectedVoucher?: string;
  selectedTokenType?: string;
  voucherQuantity?: number;
  totalTokenQuantity?: number;
  tokenPerUser?: number;
  winningProbability: number;
  isActive: boolean;
}

export interface UserInfo {
  userId: string;
  username: string;
  email: string;
  walletAddr: string;
  company: string;
  isAdmin: boolean;
}

// Static user data for demo purposes
export const STATIC_USER: UserInfo = {
  userId: 'demo-user-001',
  username: 'Demo User',
  email: 'demo@example.com',
  walletAddr: '0x1234...5678',
  company: 'Demo Company',
  isAdmin: false,
};

// Static prizes for demo purposes
export const STATIC_PRIZES: Prize[] = [
  {
    _id: 'prize-001',
    prizeType: 'voucher',
    name: 'Free Coffee Voucher',
    description: 'Enjoy a free cup of coffee at participating merchants',
    image: '/images/coffee-voucher.png',
    validityStart: '2024-01-01',
    validityEnd: '2025-12-31',
    selectedVoucher: 'voucher-coffee-001',
    winningProbability: 50,
    isActive: true,
  },
  {
    _id: 'prize-002',
    prizeType: 'token',
    name: '10 Reward Tokens',
    description: 'Earn 10 reward tokens for your wallet',
    selectedTokenType: 'REWARD',
    totalTokenQuantity: 1000,
    tokenPerUser: 10,
    winningProbability: 50,
    isActive: true,
  },
];

// Static instructions for "How to Collect Stamps"
export const HOW_TO_COLLECT_STEPS = [
  'Visit a nearby merchant.',
  'Make any purchase at the store.',
  'Click on the stamp icon.',
  'Show the QR code to the staff to collect your stamp.',
  'When all stamps are collected, click on "Redeem" to claim a reward!',
];

/**
 * Select a prize based on winning probabilities
 * Uses weighted random selection algorithm
 */
export function selectPrizeByProbability(prizes: Prize[]): Prize | null {
  if (!prizes || prizes.length === 0) {
    return null;
  }

  const eligiblePrizes = prizes.filter(prize => prize.winningProbability > 0);
  
  if (eligiblePrizes.length === 0) {
    return null;
  }

  const totalProbability = eligiblePrizes.reduce(
    (sum, prize) => sum + prize.winningProbability,
    0
  );
  
  if (totalProbability === 0) {
    return null;
  }
  
  const random = Math.random() * totalProbability;
  let cumulativeProbability = 0;
  
  for (const prize of eligiblePrizes) {
    cumulativeProbability += prize.winningProbability;
    if (random <= cumulativeProbability) {
      return prize;
    }
  }

  return eligiblePrizes[eligiblePrizes.length - 1];
}

/**
 * Format prize display name
 */
export function formatPrizeName(prize: Prize): string {
  return prize.name || `${prize.prizeType === 'voucher' ? 'Voucher' : 'Token'} Prize`;
}

/**
 * Get prize image URL
 */
export function getPrizeImage(prize: Prize): string {
  if (prize.image) {
    return prize.image;
  }
  return '/svg/reward stamp-default.svg';
}

/**
 * Format validity period for display
 */
export function formatValidityPeriod(prize: Prize): string {
  if (prize.prizeType === 'voucher' && prize.validityEnd) {
    try {
      const endDate = new Date(prize.validityEnd);
      const day = endDate.getDate().toString().padStart(2, '0');
      const month = (endDate.getMonth() + 1).toString().padStart(2, '0');
      const year = endDate.getFullYear();
      return `Valid until ${day}/${month}/${year}`;
    } catch {
      return 'Validity information unavailable';
    }
  }
  
  if (prize.prizeType === 'token') {
    return `${prize.tokenPerUser || prize.totalTokenQuantity} tokens`;
  }
  
  return 'No validity information';
}

