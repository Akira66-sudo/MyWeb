import { describe, it, expect } from 'vitest';
import { checkTTTWinLogic, minimax } from '../src/lib/gameLogic.js';

describe('Game Logic - Tic Tac Toe', () => {
  it('should detect horizontal wins', () => {
    let board = ['X', 'X', 'X', '', '', '', '', '', ''];
    expect(checkTTTWinLogic(board, 'X')).toBe(true);
    expect(checkTTTWinLogic(board, 'O')).toBe(false);

    board = ['', '', '', 'O', 'O', 'O', '', '', ''];
    expect(checkTTTWinLogic(board, 'O')).toBe(true);
    expect(checkTTTWinLogic(board, 'X')).toBe(false);

    board = ['', '', '', '', '', '', 'X', 'X', 'X'];
    expect(checkTTTWinLogic(board, 'X')).toBe(true);
  });

  it('should detect vertical wins', () => {
    let board = ['O', '', '', 'O', '', '', 'O', '', ''];
    expect(checkTTTWinLogic(board, 'O')).toBe(true);

    board = ['', 'X', '', '', 'X', '', '', 'X', ''];
    expect(checkTTTWinLogic(board, 'X')).toBe(true);
  });

  it('should detect diagonal wins', () => {
    let board = ['X', '', '', '', 'X', '', '', '', 'X'];
    expect(checkTTTWinLogic(board, 'X')).toBe(true);

    board = ['', '', 'O', '', 'O', '', 'O', '', ''];
    expect(checkTTTWinLogic(board, 'O')).toBe(true);
  });

  it('minimax should block immediate threats', () => {
    // X is about to win on index 2
    let board = ['X', 'X', '', 'O', '', '', '', '', ''];
    const bestMove = minimax([...board], 'O');
    expect(bestMove.index).toBe(2);
  });

  it('minimax should take immediate wins', () => {
    // O is about to win on index 4 (diagonal 2, 4, 6)
    let board = ['X', 'X', 'O', 'X', '', '', 'O', '', ''];
    const bestMove = minimax([...board], 'O');
    expect(bestMove.index).toBe(4); // O, O, O diagonal
  });

  it('minimax should prefer center on empty board or when optimal', () => {
    let board = ['X', '', '', '', '', '', '', '', ''];
    const bestMove = minimax([...board], 'O');
    expect(bestMove.index).toBe(4); // Center is best response to corner
  });

  it('minimax should never lose (test specific scenario)', () => {
    let board = ['X', '', '', '', 'O', '', '', '', 'X'];
    // X at 0 and 8, O at 4. O must play an edge to not lose. 
    // Corners (2, 6) lead to loss. Edges are 1, 3, 5, 7.
    const bestMove = minimax([...board], 'O');
    const validEdges = [1, 3, 5, 7];
    expect(validEdges).toContain(bestMove.index);
  });
});
