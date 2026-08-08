import { describe, it, expect } from 'vitest';
import { isToxic } from '../src/lib/ironDome.js';

describe('Iron Dome - Anti-Toxic Filter', () => {
  it('should block exact bad words', () => {
    expect(isToxic('anjing')).toBe(true);
    expect(isToxic('babi')).toBe(true);
    expect(isToxic('fuck')).toBe(true);
  });

  it('should block leetspeak variations', () => {
    expect(isToxic('4nj1ng')).toBe(true);
    expect(isToxic('b@b1')).toBe(true);
    expect(isToxic('b0d0h')).toBe(false); // 'bodoh' is not in the bad words list
    expect(isToxic('f*ck')).toBe(true);
    expect(isToxic('sh!t')).toBe(true);
  });

  it('should block spaced variations', () => {
    expect(isToxic('a n j i n g')).toBe(true);
    expect(isToxic('b-a-b-i')).toBe(true);
    expect(isToxic('k_o_n_t_o_l')).toBe(true);
  });

  it('should block repeated character variations', () => {
    expect(isToxic('anjiiiiiing')).toBe(true);
    expect(isToxic('fuuuuck')).toBe(true);
  });

  it('should block bad signatures without vowels', () => {
    expect(isToxic('kntl')).toBe(true);
    expect(isToxic('bgst')).toBe(true);
    expect(isToxic('ngntd')).toBe(true);
    expect(isToxic('knttttlllll')).toBe(true);
  });

  it('should pass normal safe words', () => {
    expect(isToxic('halo')).toBe(false);
    expect(isToxic('selamat pagi')).toBe(false);
    expect(isToxic('saya suka coding')).toBe(false);
  });

  it('should pass false positive names (whitelist)', () => {
    expect(isToxic('Basuki')).toBe(false);
    expect(isToxic('Panji')).toBe(false);
    expect(isToxic('Anjasmara')).toBe(false);
    expect(isToxic('Dickson')).toBe(false); // Contains "dick" but in whitelist
    expect(isToxic('Tito')).toBe(false);    // Contains "tit" but in whitelist
  });

  it('should return false for empty or undefined input', () => {
    expect(isToxic('')).toBe(false);
    expect(isToxic(null)).toBe(false);
    expect(isToxic(undefined)).toBe(false);
  });

  it('should be case insensitive', () => {
    expect(isToxic('AnJiNg')).toBe(true);
    expect(isToxic('FUCK')).toBe(true);
  });
});
