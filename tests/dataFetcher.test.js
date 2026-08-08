import { describe, it, expect } from 'vitest';
import { getSiteData, getProjects, getTechStacks, getWorkPhases, getSocialLinks } from '../src/lib/dataFetcher.js';

describe('Data Fetcher', () => {
  it('should fetch and format site data correctly', async () => {
    const data = await getSiteData();
    expect(data).toHaveProperty('identity');
    expect(data).toHaveProperty('stats');
    expect(data.identity.name).toBeDefined();
    expect(data.identity.nickname).toBeDefined();
  });

  it('should fetch and format projects correctly', async () => {
    const projects = await getProjects();
    expect(Array.isArray(projects)).toBe(true);
    if (projects.length > 0) {
      const project = projects[0];
      expect(project).toHaveProperty('id');
      expect(project).toHaveProperty('title');
      expect(project).toHaveProperty('category');
      expect(project).toHaveProperty('description');
      expect(project).toHaveProperty('techStack');
      expect(Array.isArray(project.techStack)).toBe(true);
    }
  });

  it('should fetch tech stacks', async () => {
    const tech = await getTechStacks();
    expect(Array.isArray(tech)).toBe(true);
  });

  it('should fetch work phases', async () => {
    const phases = await getWorkPhases();
    expect(Array.isArray(phases)).toBe(true);
  });

  it('should fetch social links', async () => {
    const socials = await getSocialLinks();
    expect(Array.isArray(socials)).toBe(true);
  });
});
