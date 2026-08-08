import { describe, it, expect, vi } from 'vitest';
import { POST as contactPOST } from '../src/pages/api/contact.js';
import { POST as scorePOST } from '../src/pages/api/score.js';

// Mock the global fetch
global.fetch = vi.fn();

// Mock Supabase
vi.mock('../src/lib/supabaseClient.js', () => {
  return {
    supabase: {
      from: () => ({
        insert: () => Promise.resolve({ error: null })
      })
    }
  };
});

describe('API Endpoints', () => {
  describe('contact.js', () => {
    it('should reject incomplete data', async () => {
      const request = new Request('http://localhost/api/contact', {
        method: 'POST',
        body: JSON.stringify({ name: 'John' }) // Missing email, message, access_key
      });
      
      const response = await contactPOST({ request });
      expect(response.status).toBe(400);
      const data = await response.json();
      expect(data.success).toBe(false);
    });

    it('should block toxic messages via Iron Dome', async () => {
      const request = new Request('http://localhost/api/contact', {
        method: 'POST',
        body: JSON.stringify({
          name: 'John',
          email: 'john@example.com',
          message: 'This is a babi message', // Toxic word
          access_key: '123'
        })
      });

      const response = await contactPOST({ request });
      expect(response.status).toBe(403);
      const data = await response.json();
      expect(data.success).toBe(false);
      expect(data.message).toContain('DIBLOKIR');
    });

    it('should allow clean messages and call Web3Forms', async () => {
      // Mock fetch success for Web3Forms
      global.fetch.mockResolvedValueOnce({
        status: 200,
        json: async () => ({ success: true, message: 'Message sent' })
      });

      const request = new Request('http://localhost/api/contact', {
        method: 'POST',
        body: JSON.stringify({
          name: 'John',
          email: 'john@example.com',
          message: 'Hello, this is a clean message.',
          access_key: '123'
        })
      });

      const response = await contactPOST({ request });
      expect(response.status).toBe(200);
      expect(global.fetch).toHaveBeenCalled();
    });
  });

  describe('score.js', () => {
    it('should reject incomplete data', async () => {
      const request = new Request('http://localhost/api/score', {
        method: 'POST',
        body: JSON.stringify({ player_name: 'John' }) // Missing game_id, score
      });
      
      const response = await scorePOST({ request });
      expect(response.status).toBe(400);
    });

    it('should block toxic player names', async () => {
      const request = new Request('http://localhost/api/score', {
        method: 'POST',
        body: JSON.stringify({
          player_name: 'babi', // Toxic name
          game_id: 'dino',
          score: 100
        })
      });

      const response = await scorePOST({ request });
      expect(response.status).toBe(403);
    });

    it('should allow valid scores', async () => {
      const request = new Request('http://localhost/api/score', {
        method: 'POST',
        body: JSON.stringify({
          player_name: 'John',
          game_id: 'dino',
          score: 100
        })
      });

      const response = await scorePOST({ request });
      expect(response.status).toBe(200);
    });
  });
});


