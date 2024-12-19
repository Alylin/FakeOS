import {describe, expect, test} from '@jest/globals';
import { distanceBetweenPoints, getPointIndex } from './utility';

describe('utility', () => {
  describe('distanceBetweenPoints', () => {
    test('returns distance of points that are vertically separated', () => {
      expect(distanceBetweenPoints({ x: 10, y: 10 }, { x: 10, y: -45 })).toBe(55);
    });

    test('returns distance of points that are horizontally separated', () => {
      expect(distanceBetweenPoints({ x: 21, y: 10 }, { x: 10, y: 10 })).toBe(11);
    });

    test('returns distance of points that are both horizontally and vertically separated', () => {
      expect(distanceBetweenPoints({ x: 21, y: 10 }, { x: 0, y: 10 })).toBe(21);
    });

    test('returns a distance of zero for points that are identical', () => {
      expect(distanceBetweenPoints({ x: 10, y: 10 }, { x: 10, y: 10 })).toBe(0);
    });

    test('works with non-integer positions' , () => {
      expect(distanceBetweenPoints({ x: 10, y: 10.6 }, { x: -0.06, y: 10 })).toBeCloseTo(10.07787, 4);
    });
  });

  describe('getPointIndex', () => {
    test('throws an error when non-integer coordinates are given', () => {
      expect(() => getPointIndex({x: 0, y: 0.6}, { width: 100, height: 1000})).toThrowError(new Error('Invalid pixel position! (x:0, y:0.6)'));
    });

    test('returns null if the coordinate it outside the bounds', () => {
      expect(getPointIndex({x: 0, y: 1001}, { width: 100, height: 1000})).toBeNull();
    });

    test('returns the correct index', () => {

    });
  });
});